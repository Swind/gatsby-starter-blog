import { Article, ArticleMeta } from './types'
import notionService from './notionService'
import config from '../../config'

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

async function getPostList(): Promise<ArticleMeta[]> {
    return notionService.getArticleMetaList(pageId, viewId)
}

async function getPost(id: string): Promise<Article> {
    return notionService.getArticle(id)
}

export default {
    getPostList,
    getPost,
}

/*
getPostList()
    .then(text => {
        console.log(text);
    })
    .catch(err => {
        // Deal with the fact the chain failed
    });
    */

getPost("a6223314-431f-406a-8752-308f0e271e61")
    .then(post => {
        console.log(JSON.stringify(post))
    }).catch(err => { })