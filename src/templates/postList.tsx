import { graphql } from 'gatsby';
import * as React from 'react';
import styled from '../components/theme'
import GatsbyLink from 'gatsby-link';
import moment from 'moment'
import Layout from '../components/layout';

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

const H3 = styled.h4(({theme}) => ({
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

const IndexPage: React.FC<IndexProps> = props => {
  const posts = props.data.allPost.edges.map((item, index)=>{
    const post = item.node
    return (
      <section key={index}>
        <Article>
          <Header>
            <H4>
              <Link to={`/${post.name}`}>{post.title}</Link>
            </H4>
            <time dateTime={moment.unix(post.date).format('MMM DD, YYYY')}></time>
          </Header>
        </Article>
      </section>
    )
  })

  return (
    <Layout>{posts}</Layout>
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