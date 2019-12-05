import React from 'react'
import styled from './theme'
import { Link } from 'gatsby'

const Small = styled.small({
    textTransform: 'uppercase'
})

const A = styled(Link)(({ theme }) => ({
    textDecoration: 'none',
    color: theme.textColor,
    transition: 'color 250ms linear',
    ':hover': {
        textDecoration: 'underline',
        color: theme.accentColor,
    },
}))

const Tag = styled.span({
    background: "#eee",
    "borderRadius": "3px 0 0 3px",
    "color": "#999",
    "display": "inline-block",
    "height": "26px",
    "lineHeight": "26px",
    "padding": "0 20px 0 23px",
    "position": "relative",
    "margin": "0 10px 10px 0",
    "textDecoration": "none",
    "WebkitTransition": "color 0.2s",
    ':hover': {
        "backgroundColor": "DeepSkyBlue",
        "color": "white"
    },
})


interface TagsProps {
    tags: string[]
}

const CommaSeparatedTags: React.FC<TagsProps> = ({tags}) => (
    <Small>
        {tags.map((tag, index, array)=>(
            <Tag key={index}>
                <A to={`/tag/${tag}`}>{tag}</A>
            </Tag>
        ))}
    </Small>
)

export default CommaSeparatedTags

