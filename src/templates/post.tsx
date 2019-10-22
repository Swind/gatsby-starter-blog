import * as React from 'react';
import { graphql } from 'gatsby'
import { ArticleMeta, Article } from '../notion/api/types';
import NotionBlockList from '../notion/component/base/notionBlockList';

interface Props {
  pageContext: {
    postName: string
  },
  data: {
    post: ArticleMeta & {
      internal: {
        type: string
        content: string
      }
    } 
  }
}

const PostPage = (props: Props) => {
  const { data } = props 
  console.log(data.post.internal)

  const post: Article = JSON.parse(data.post.internal.content)
  return (
    <div>
      <NotionBlockList blocks={post.blocks}></NotionBlockList>
    </div>
  );
};

export default PostPage;

export const query = graphql`
  query($postName: String!) {
    post(name: {eq: $postName}) {
      date
      tags
      title
      lastModifiedDate
      name
      createdDate
      id
      internal {
        type
        content
      }
      cover {
        page_cover
        page_cover_position
        page_full_width
        page_icon
        page_small_text
      }
    }
  }
`