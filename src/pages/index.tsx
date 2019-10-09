import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

interface Props {
  data: {
    allPost: any
    site: {
      siteMetadata: {
        title: string
      }
    }
  }
}

const BlogIndex = ({ data }: Props) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allPost.edges

  return (
    <Layout location={window.location} title={siteTitle}>
      <SEO title="All posts" />
      <Bio />
      {posts.map(({ node }) => {
        const title = node.title || node.name
        return (
          <div key={node.name}>
            <h3
              style={{
                marginBottom: rhythm(1 / 4),
              }}
            >
              <Link style={{ boxShadow: `none` }} to={node.name}>
                {title}
              </Link>
            </h3>
            <small>{node.date}</small>
            <p
              dangerouslySetInnerHTML={{
                __html: node.title,
              }}
            />
          </div>
        )
      })}
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allPost {
      edges {
        node {
          id
          name
          date
          title
        }
      }
    }
  }
`