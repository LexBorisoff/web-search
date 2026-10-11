import type { SitesData } from '@app-types/config.types.js';

export const initialSites: NonNullable<SitesData> = {
  google: {
    url: 'google.com',
    query: 'search?q=',
  },
  duckduckgo: {
    url: 'duckduckgo.com',
    query: '?q=',
    delimiter: '+',
    alias: ['duck'],
  },
  github: {
    url: 'github.com',
    query: 'search?q=',
    resources: {
      tabs: {
        stars: '?tab=stars',
        repos: '?tab=repositories',
        projects: '?tab=projects',
      },
    },
  },
  mdn: {
    url: 'developer.mozilla.org',
    query: 'search?q=',
  },
  npm: {
    url: 'npmjs.com',
    query: 'search?q=',
  },
  youtube: {
    url: 'youtube.com',
    query: 'results?search_query=',
    delimiter: '+',
  },
};
