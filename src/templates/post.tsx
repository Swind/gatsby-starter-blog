import * as React from 'react';
import { graphql } from 'gatsby'
import { ArticleMeta, Article } from '../notion/api/types';
import NotionBlockList from '../notion/component/base/notionBlockList';
import styled from '../components/theme'

const Main = styled.main(({theme}) => ({
  color: theme.textColor
}))

const Header = styled.header(({ theme }) => ({
  ...theme.centerPadding,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  [theme.smallMedia]: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
  },
}));

const HeaderTitle = styled.h1(({ theme }) => ({
  width: '85%',
  marginBottom: theme.spacing,
  [theme.smallMedia]: {
    width: '100%',
    textAlign: 'center',
    marginBottom: 0,
  },
}));

const HeaderDate = styled.time(({ theme }) => ({
  width: '15%',
  textAlign: 'right',
  [theme.smallMedia]: {
    width: '100%',
    textAlign: 'center',
  },
}));

const Footer = styled.footer(({ theme }) => ({
  ...theme.centerPadding,
}));

const PostWrap = styled.section(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '> *': {
    width: '100vw',
    wordWrap: 'break-word',
    ':not(.gatsby-highlight)': {
      ...theme.centerPadding,
    },
  },
  '> .gatsby-highlight > pre': {
    ...theme.centerPadding,
    paddingTop: theme.spacing,
    paddingBottom: theme.spacing,
  },
  '>ul,>ol': {
    marginLeft: `${theme.spacingPx * 4}px`,
    width: `calc(100% - ${theme.spacingPx * 4}px)`,
  },
}));

const PostNavWrap = styled.div(({ theme }) => ({
  ...theme.centerPadding,
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row',
  marginTop: theme.spacing,
}));


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