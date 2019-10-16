import { graphql } from 'gatsby';
import * as React from 'react';
import { css } from '@emotion/core';
import Helmet from 'react-helmet';

import { Article } from '../notion/api/types';


export interface IndexProps {
  data: {
    allPost: {
      edges: Array<{
        node: {
          title: string,
          date: number,
          tags: Array<string>,
          name: string
        };
      }>;
    };
  };
}

const IndexPage: React.FC<IndexProps> = props => {
  const posts = props.data.allPost.edges.map((item, index)=>{
    const post = item.node
    return <div><a href={`/${post.name}`} key={index}>{post.title}</a></div>
  })

  return (
    <div>{posts}</div>
  );
};

export default IndexPage;

export const pageQuery = graphql`
  query IndexPageQuery {
    allPost{
      edges {
        node {
            title
            date
            tags
            name
        }
      }
    }
  }
`;