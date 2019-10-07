import fs from 'fs'

import { Article, ArticleMeta } from './types'
import notionService from './notionService'
import config from '../../../config'
import console = require('console');
import { string } from 'prop-types';
import path from 'path'

import log from "loglevel"
import { Actions, NodePluginArgs } from 'gatsby';


const pageId = config.blogTablePageId
const viewId = config.blogTableViewId

const postListPath = `${config.notionFolderPath}/PostList.json`
const postFolderPath = `${config.notionFolderPath}/Posts`

log.setLevel("debug")

function writeFile(filePath: string, data: any) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

function readFile(filePath: string): Promise<string> | undefined {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            log.info(`${filePath} is not existing`)
            resolve(undefined)
        } else {
            fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        }
    })
}

async function savePostList(postList: Record<string, ArticleMeta>) {
    await writeFile(postListPath, JSON.stringify(postList))
}

function _convertPostListToDict(articleMetaList: ArticleMeta[]): Record<string, ArticleMeta> {
    let result: Record<string, ArticleMeta> = {}
    articleMetaList.forEach(meta => {
        result[meta.id] = meta
    });

    return result

}

async function loadPostList(): Promise<Record<string, ArticleMeta>> {
    const data: string | undefined = await readFile(postListPath)
    if (data === undefined) {
        return {}
    }

    const postList: Record<string, ArticleMeta> = JSON.parse(data)
    return postList
}


async function getPostList(): Promise<Record<string, ArticleMeta>> {
    const postList = await notionService.getArticleMetaList(pageId, viewId)
    return _convertPostListToDict(postList)
}

function getPostFilePath(postId: string): string {
    return path.join(postFolderPath, postId + ".json")
}

async function getPost(id: string): Promise<Article> {
    return notionService.getArticle(id)
}

async function savePost(post: Article) {
    const postFilePath = getPostFilePath(post.meta.id)

    log.info(`Save post ${post.meta.name} to ${postFilePath}`)
    await writeFile(postFilePath, JSON.stringify(post))
}

async function loadPost(postId: string): Promise<Article | undefined> {
    const postFilePath = getPostFilePath(postId)
    const data = await readFile(postFilePath)

    if (data != undefined) {
        return JSON.parse(data)
    } else {
        return undefined
    }
}

type PostHandler = (article: Article, modified: boolean) => void

async function _updatePosts(
    currentPostList: Record<string, ArticleMeta>,
    latestPostList: Record<string, ArticleMeta>,
    postHandler: PostHandler) {

    for (var postId in latestPostList) {
        if (postId in currentPostList) {
            const currentPostMeta = currentPostList[postId]
            const latestPostMeta = latestPostList[postId]

            log.info(`${currentPostMeta.lastModifiedDate} : ${latestPostMeta.lastModifiedDate}`)
            if (currentPostMeta.lastModifiedDate == latestPostMeta.lastModifiedDate) {
                const post = await loadPost(postId)
                // If the post is not modified and the cache file is existing,
                // load the post from file.
                if (post != undefined) {
                    postHandler(post, false)
                    continue
                } else {
                    log.error(`Can't load post ${postId}, try to get the post from notion`)
                }
            }
        }

        log.info(`Getting post ${postId}`)
        const newPost = await getPost(postId)

        log.info(`Updating post ${newPost.meta.name} - ${postId}`)
        postHandler(newPost, true)
    }
}

type CreateNode = Actions['createNode']
type CreateNodeId = NodePluginArgs['createNodeId']
type CreateContentDigest = NodePluginArgs['createContentDigest']

async function UpdateAndLoadPostFiles(): Promise<Article[]> {
    log.info(`Loading current PostList`)
    const currentPostList = await loadPostList()

    log.info(`Getting latest PostList`)
    const latestPostList = await getPostList()

    const result: Article[] = []

    const savePostFileHandler = (post: Article, modified: boolean) => {
        if (modified) {
            savePost(post)
        }

        result.push(post)
    }

    log.info(`Updating posts`)
    await _updatePosts(currentPostList, latestPostList, savePostFileHandler)

    await savePostList(latestPostList)

    return result
}

function UpdatePostFiles() {
    UpdateAndLoadPostFiles()
        .then(() => {
            log.info("Done !")
        })
        .catch((e) => {
            log.error(e)
        })
}


async function SyncPosts(
    createNode: CreateNode,
    createNodeId: CreateNodeId,
    createContentDigest: CreateContentDigest) {

    console.log(createNode)
    console.log(createNodeId)
    console.log(createContentDigest)

    log.info(`Saving latest post list ...`)
    const posts = await UpdateAndLoadPostFiles()

    log.info(`Convert post to sourceNode`)
    posts.forEach((post: Article, index: number) => {
        const postNode = {
            id: createNodeId(post.meta.id),
            parent: `__SOURCE__`,
            children: [],
            internal: {
                type: `Post`,
                mediaType: `text/html`,
                content: JSON.stringify(post),
                contentDigest: createContentDigest(post),
            },
        }
        const data = Object.assign({}, post, postNode)
        createNode(data) 
    })
}

export default {
    "SyncPosts": SyncPosts
}

//UpdatePostFiles()