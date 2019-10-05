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

    const postList: ArticleMeta[] = JSON.parse(data)
    return _convertPostListToDict(postList)
}


async function getPostList(): Promise<Record<string, ArticleMeta>> {
    const postList = await notionService.getArticleMetaList(pageId, viewId)
    return _convertPostListToDict(postList)
}

async function getPost(id: string): Promise<Article> {
    return notionService.getArticle(id)
}

async function savePost(post: Article) {
    const postFilePath = path.join(postFolderPath, post.meta.id + ".json")

    log.info(`Save post ${post.meta.name} to ${postFilePath}`)
    await writeFile(postFilePath, JSON.stringify(post))
}

async function _updatePosts(
    currentPostList:Record<string, ArticleMeta>, 
    latestPostList:Record<string, ArticleMeta>) {

    for (var postId in latestPostList) {
        if (postId in currentPostList) {
            const currentPostMeta = currentPostList[postId]
            const latestPostMeta = latestPostList[postId]

            if (currentPostMeta.lastModifiedDate == latestPostMeta.lastModifiedDate) {
                continue
            }
        }

        log.info(`Getting post ${postId}`)
        const newPost = await getPost(postId)
        log.info(`Updating post ${newPost.meta.name} - ${postId}`)
        await savePost(newPost)
    }
}

type CreateNode = Actions['createNode']
type CreateNodeId = NodePluginArgs['createNodeId'] 
type CreateContentDigest = NodePluginArgs['createContentDigest']

async function updatePosts(
    createNode:CreateNode, 
    createNodeId:CreateNodeId, 
    createContentDigest: CreateContentDigest){

    log.info(`Loading current PostList`)
    const currentPostList = await loadPostList()

    log.info(`Getting latest PostList`)
    const latestPostList = await getPostList()

    log.info(`Updating posts ...`)
    _updatePosts(currentPostList, latestPostList)

    log.info(`Saving latest post list ...`)
}

export default {
    updatePosts
}

updatePosts()
    .then(() => {
        console.log("Done !")
    })
    .catch(err => {
        console.log(err)
    })
