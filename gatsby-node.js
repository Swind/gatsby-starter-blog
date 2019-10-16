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

  // Create index page
  console.log("Create post index page")
  createPage({
    path: `/`,
    component: path.resolve('./src/templates/postList.tsx'),
  })

  // Create post pages
  console.log("Create post page")
  return graphql(`
    query PostNameQuery {
      allPost{
        edges {
          node {
              name
          }
        }
      }
    }
  `).then(result => {
    console.log(result)
    result.data.allPost.edges.forEach((post)=>{
      console.log(post.node.name)
      if(post.node.name){
        createPage({
          path: post.node.name,
          component: path.resolve('./src/templates/post.tsx'),
        })
      }
    }) 
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