require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es2017',
  },
})

const PostService = require(`./src/notion/api/postService`)
const path = require(`path`)
const {
  createFilePath
} = require(`gatsby-source-filesystem`)

exports.sourceNodes = async({
  actions,
  createNodeId,
  createContentDigest
}) => {
  const {
    createNode
  } = actions

  await PostService.default.SyncPosts(
    createNode,
    createNodeId,
    createContentDigest
  )
}

exports.createPages = async ({
  graphql,
  actions
}) => {
  const {
    createPage
  } = actions

  console.log("Create post list page")
  createPage({
    path: `/`,
    component: path.resolve('./src/templates/postList.tsx'),
  })
}

exports.onCreateNode = ({
  node,
  actions,
  getNode
}) => {
  const {
    createNodeField
  } = actions
}