import { Link as GatsbyLink } from 'gatsby'
import styled, { Theme } from "./theme"

const linkStyle = (theme: Theme) => ({
    textDecoration: 'none',
    color: theme.textColor,
    transition: 'color 250ms linear',
    ':hover': {
        color: theme.accentColor,
    },
})

export const Link = styled(GatsbyLink)(({ theme }) => (linkStyle(theme)))
export const A = styled.a(({ theme }) => (linkStyle(theme)))
