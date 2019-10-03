import fs from 'fs'

import { Article, ArticleMeta } from './types'
import notionService from './notionService'
import config from '../../../config'
import console = require('console');

// import nodeSchedule from 'node-schedule'

// let blogList: ArticleMeta[] = []
//
// getPosts().then(it => blogList = it).catch(e => console.log(e))
// nodeSchedule.scheduleJob('* * * * *', async () => {
//     console.log('update blog')
//     blogList = await getPosts()
// })

const pageId = config.blogTablePageId
const viewId = config.blogTableViewId

const postListPath = `${config.notionFolderPath}/PostList.json`
const postFolderPath = `${config.notionFolderPath}/Posts`

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

function readFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            resolve("[]")
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

async function getPostList(): Promise<Record<string, ArticleMeta>> {
    const articleMetaList = await notionService.getArticleMetaList(pageId, viewId)

    let result: Record<string, ArticleMeta> = {}
    articleMetaList.forEach(meta => {
        result[meta.id] = meta
    });

    return result
}

async function getPost(id: string): Promise<Article> {
    return notionService.getArticle(id)
}

async function updatePostList() {
    const postList = await getPostList()
    await writeFile(postListPath, JSON.stringify(postList))
}

async function updatePosts(postList: ArticleMeta[]) {
    const latestPostList = await getPostList()
    const currentPostList = loadPostList()

    postList.forEach(async (meta) => {
        const post = await getPost(meta.id)

    })
}

async function loadPostList(): Promise<ArticleMeta[]> {
    const data: string = await readFile(postListPath)
    const postList: ArticleMeta[] = JSON.parse(data)
    return postList
}

async function loadPosts() {

}

async function loadPost() {

}

export default {
    getPostList,
    getPost,
}

/*
updatePostList()
    .then(() => {
        console.log("Done !")
    })
    .catch(err => {
        console.log(err)
    })
*/
loadPostList()
