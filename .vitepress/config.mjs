import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'MyBooks 文档',
  description: 'MyBooks 项目文档',
  base: '/docs/',
  srcDir: './src',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/docs/logo.jpeg', type: 'image/jpeg' }]
  ],
  themeConfig: {
    nav: [
      { text: 'API', link: '/api/' },
      { text: '产品手册', link: '/manual/' }
    ],
    outline: {
      label: '本页目录'
    },
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色主题',
    darkModeSwitchTitle: '切换到深色主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    langMenuLabel: '选择语言',
    skipToContentLabel: '跳转到正文',
    editLink: {
      text: '在 GitHub 上编辑此页',
      pattern: 'https://github.com/mybookstop/docs/edit/main/:path'
    },
    lastUpdated: {
      text: '最后更新时间'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    sidebar: {
      '/api/': [
        {
          text: 'API 文档',
          items: [
            { text: 'MyBooks Web API', link: '/api/mybooks' }
          ]
        }
      ],
      '/manual/': [
        {
          text: '产品手册',
          items: [
            { text: '快速入门', link: '/manual/quickstart' },
            { text: '开发 MyBooks 工具', link: '/manual/tool-development' },
            { text: '常见问题', link: '/manual/faq' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/poxenstudio/mybooks' }
    ],
    search: {
      provider: 'local'
    },
    footer: {
      message: 'MyBooks 文档',
      copyright: 'Copyright © PoxenStudio'
    }
  }
})