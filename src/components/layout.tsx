import React from 'react'
import { ThemeProvider } from 'emotion-theming'
import Header from './header'
import { theme as themeConfig } from './theme'
import { Global } from '@emotion/core'

interface LayoutProps {
    children: React.ReactChild | React.ReactChild[]
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <ThemeProvider theme={themeConfig}>
            <Global styles={{
                'html, body': {
                    width: '100vw',
                    height: '100vh',
                    margin: 0,
                    padding: 0,
                    fontFamily: 'Lato',
                },
                'h1,h2,h3,h4': {
                    textTransform: 'uppercase',
                    marginBottom: 0,
                },
                a: {
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    color: themeConfig.textColor,
                    transition: 'color 250ms linear',
                    ':hover': {
                        color: themeConfig.accentColor,
                    },
                },
                blockquote: {
                    background: '#F9F9F9',
                    padding: `${themeConfig.spacingPx * 2}px`,
                    margin: 0,
                },
            }}></Global>
            <Header></Header>
            {children}
        </ThemeProvider >
    )
}

export default Layout