import { graphql } from 'gatsby';
import * as React from 'react';
import styled from '../components/theme'
import GatsbyLink from 'gatsby-link';
import moment from 'moment'
import Layout from '../components/layout';
import CenterWrap from '../components/center-wrap'
import TagList from '../components/tag-list'
import { number } from 'prop-types';

const Header = styled.header(({theme})=> ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.smallMedia]: {
    flexDirection: 'column-reverse',
    alignItems: 'flex-start',
  }
}))

const H3 = styled.h2(({theme}) => ({
  marginBottom: theme.spacing
}))

const Article = styled.article(({theme}) => ({
  marginBottom: theme.spacing
}))

const H4 = styled.h4(({theme}) => ({
  margin: 0
}))

const Link = styled(GatsbyLink)(({theme}) => ({
  textDecoration: 'none',
  color: theme.textColor,
  transition: 'color 250ms linear',
  ':hover': {
    color: theme.accentColor
  }
})) 

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

interface Post {
  title: string,
  date: number,
  tags: string[],
  name: string
}

function renderPost(post: Post) {
  return (
    <Article>
      <Header>
        <H4>
          <Link to={`/${post.name}`}>{post.title}</Link>
        </H4>
        <time dateTime={moment.unix(post.date).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)}>{moment.unix(post.date).format('MMM DD, YYYY')}</time>
      </Header>
      <footer>
        <TagList tags={post.tags}></TagList>
      </footer>
    </Article>
  )
}

const IndexPage: React.FC<IndexProps> = props => {
  // Group posts by year
  const nodes = props.data.allPost.edges
  const allPost: Record<string, Post[]>  = {}

  nodes.forEach((item) => {
    const post = item.node
    const year = moment.unix(post.date).year()
    if(!(year in allPost)){
      allPost[year] = []
    }
    allPost[year].push(post)
  })

  const years = Object.keys(allPost).sort().reverse()

  const allPostElements = years.map((year)=>{
    const posts = allPost[year].map((post, index)=>{
      return (
        <section key={index}>
          {renderPost(post)}
        </section>
      )
    })

    return (
      <section key={year}>
        <H3>{year}</H3>
        {posts}
      </section>
    )
  })

  return (
    <Layout>
      <CenterWrap>
        {allPostElements}
      </CenterWrap>
    </Layout>
  );
};

export default IndexPage;

export const pageQuery = graphql`
  query IndexPageQuery {
    allPost(
      sort:{fields: date order:DESC}
    ){
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