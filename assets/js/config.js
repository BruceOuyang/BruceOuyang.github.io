window.$docsify = {
    logo: '/assets/logo.jpg',
    name: '老欧的 issueList',
    nameLink: '/',
    homepage: 'README.md',
    repo: '',
    loadSidebar: true,
    loadNavbar: true,
    hideSidebar: false,
    coverpage: false,
    subMaxLevel: 4,
    formatUpdated: '{MM}/{DD} {HH}:{mm}',
    routerMode: 'hash', // hash | history
    notFoundPage: true,
    auto2top: true,
    mergeNavbar: true,
    alias: {
      '/.*/_navbar.md': '/_navbar.md'
    },
    themeable: {
      readyTransition : true, // default
      responsiveTables: true  // default
    },
    search: {
      maxAge: 86400000,
      paths: 'auto',
      placeholder: '搜索'
    },
    pagination: {
      previousText: '上一篇',
      nextText: '下一篇',
      crossChapter: true,
      crossChapterText: true
    },
    count:{
      countable: true,
      position: 'bottom',
      margin: '0px',
      float: 'right',
      fontsize:'0.9em',
      color:'red',
      language:'chinese',
      localization: {
        words: "",
        minute: ""
      },
      isExpected: true
    },
    waline: {
      // 必填。例子：https://your-domain.vercel.app
      serverURL: "https://comment.bugmakers.club",
      // 开启浏览量统计
      pageview: true,
      // ...
      // 不支持 el 和 path 参数自定义
    },
    footer: {
      copy: '<div style="margin-bottom: 20px;">如果你喜欢老欧整理的文章，欢迎你关注我的微信公众号，老欧的issueList站点文章更新时，会同步推送到微信公众号。</div>',
      auth: '<img src="https://bruce.bugmakers.club/assets/wechat-subscribe-qr.jpg" />',
      pre: '<hr/>',
      style: 'text-align: center;',
      class: 'className',
    },
    tabs: {
      persist    : true,      // default
      sync       : true,      // default
      theme      : 'classic', // 'classic', 'material'
      tabComments: true,      // default
      tabHeadings: true       // default
    },
    plantuml: {
      skin: 'classic',
    },
    chat: {
      title: 'BuG制造者联盟',
      // set avatar url
      users: [
        { nickname: '老欧', avatar: 'assets/avatar/old-ou.jpg' },
        { nickname: '霸哥', avatar: 'assets/avatar/young-ou.png' },
        { nickname: '女神', avatar: 'assets/avatar/young-diao.png' },
        { nickname: '龙炸', avatar: 'assets/avatar/long-woo.png' },
      ]
    }
  }