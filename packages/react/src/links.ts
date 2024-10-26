type Colors =
  | 'green'
  | 'rose'
  | 'yellow'
  | 'purple'
  | 'indigo'
  | 'sky'
  | 'blue';

const getClass = (color: Colors) => {
  // NOTE: tailwindcss不支持动态写法
  const colors = {
    green: 'bg-green-300/15 text-green-500',
    rose: 'bg-rose-300/15 text-rose-500',
    yellow: 'bg-yellow-300/15 text-yellow-500',
    purple: 'bg-purple-300/15 text-purple-500',
    indigo: 'bg-indigo-300/15 text-indigo-500',
    sky: 'bg-sky-300/15 text-sky-500',
    blue: 'bg-blue-300/15 text-blue-500',
  };

  return colors[color];
};

export const links = [
  {
    title: '太微官网',
    description: 'A non-linear personal web notebook',
    link: 'https://tiddlywiki.com',
    class: getClass('green'),
  },
  {
    title: '太微 GitHub',
    description: 'The TiddlyWiki5 source code',
    link: 'https://github.com/TiddlyWiki/TiddlyWiki5',
    class: getClass('rose'),
  },
  {
    title: '太微官方论坛',
    description: 'The official TiddlyWiki5 forum',
    link: 'https://talk.tiddlywiki.org',
    class: getClass('yellow'),
  },
  {
    title: '中文太微文档',
    description: 'The TiddlyWiki5 Chinese documentation',
    link: 'https://bramchen.github.io/tw5-docs/zh-Hans',
    class: getClass('purple'),
  },
  {
    title: '中文太微教程',
    description: 'The TiddlyWiki5 Chinese tutorial',
    link: 'https://tw-cn.netlify.app',
    class: getClass('indigo'),
  },
];
