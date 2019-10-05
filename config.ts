export default {
    blogName: 'SorcererXW Blog',
    blogFavicon: '/static/favicon.png',
    siteManifest: '/static/manifest.json',
    blogTablePageId: 'c0187f84fea34f68b58ddd1d93af30c5',
    blogTableViewId: getTableViewId(),
    googleAnalyticsId: 'UA-125409209-1',
    disqusConfig: {
        enable: true,
        shortName: 'sorcererxwblog',
    },
    notionFolderPath: `${__dirname}/content/notion`
}

function getTableViewId() {
    const dev = process.env.NODE_ENV !== 'production'
    if (dev) {
        return '396c5a715c204c80b2b78b01eabcc218'
    }
    return '396c5a715c204c80b2b78b01eabcc218'
}