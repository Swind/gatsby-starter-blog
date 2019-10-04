import fs from 'fs'

import { Article, ArticleMeta } from './types'
import notionService from './notionService'
import config from '../../../config'
import console = require('console');
import { string } from 'prop-types';
import path from 'path'

import log from "loglevel"

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

async function updatePosts() {
    const currentPostList = await loadPostList()
    const latestPostList = await getPostList()

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

async function loadPosts() {

}

async function loadPost() {

}

export default {
    getPostList,
    getPost,
}

updatePosts()
    .then(() => {
        console.log("Done !")
    })
    .catch(err => {
        console.log(err)
    })
