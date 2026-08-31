import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'MyBooks 文档',
  description: 'MyBooks 项目文档',
  base: '/docs/',
  srcDir: './src',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: 'API', link: '/api/' }
    ],
    sidebar: {
      '/api/': [
        {
          text: 'API 文档',
          items: [
            { text: 'MyBooks Web API', link: '/api/mybooks' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/mybookstop/docs' }
    ],
    search: {
      provider: 'local'
    },
    footer: {
      message: 'MyBooks 文档',
      copyright: 'Copyright © MyBooks'
    }
  }
})