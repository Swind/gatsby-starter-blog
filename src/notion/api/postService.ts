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

const postListPath = `${config.notionFolderPath}/PostListPath.json`

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

function readFile(filePath: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

async function getPostList(): Promise<ArticleMeta[]> {
    return notionService.getArticleMetaList(pageId, viewId)
}

async function getPost(id: string): Promise<Article> {
    return notionService.getArticle(id)
}

async function updatePostList() {
    const postList = await getPostList()
    await writeFile(postListPath, JSON.stringify(postList))
}

async function loadPostList(folderPath: string) {

}

async function loadPosts() {

}

async function loadPost() {

}

export default {
    getPostList,
    getPost,
}

updatePostList()
    .then(() => {
        console.log("Done !")
    })
    .catch(err => {
        console.log(err)
    })

/*
getPostList()
    .then(text => {
        console.log(text);
    })
    .catch(err => {
        // Deal with the fact the chain failed
    });

getPost("a6223314-431f-406a-8752-308f0e271e61")
    .then(post => {
        console.log(JSON.stringify(post))
    }).catch(err => { })
*/