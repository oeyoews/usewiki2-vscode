import { type TFunction } from 'i18next';

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

export function getLinks(t: TFunction<'links', undefined>) {
  return [
    {
      title: t('tw_official_site'),
      description: t('tw_official_site_description'),
      link: 'https://tiddlywiki.com',
      class: getClass('green'),
    },
    {
      title: t('github'),
      description: t('github_description'),
      link: 'https://github.com/TiddlyWiki/TiddlyWiki5',
      class: getClass('rose'),
    },
    {
      title: t('forum'),
      description: t('forum_description'),
      link: 'https://talk.tiddlywiki.org',
      class: getClass('yellow'),
    },
    {
      title: t('docs_cn'),
      description: t('docs_cn_description'),
      link: 'https://bramchen.github.io/tw5-docs/zh-Hans',
      class: getClass('purple'),
    },
    {
      title: t('tutorial_cn'),
      description: t('tutorial_cn_description'),
      link: 'https://tw-cn.netlify.app',
      class: getClass('indigo'),
    },
  ];
}
