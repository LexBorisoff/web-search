<h1 align="center">Web Search</h1>

Web Search allows to create web searches with various search engines/websites and open them in browsers.

The library is a [pure ESM package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#pure-esm-package) and does not provide CommonJS exports, which means it cannot be `require`'d. Your project must be ESM or get converted to ESM if it currently uses CommonJS.

# Installation

Install the library locally in your project:

```bash
npm i @lexjs/web-search
```

# Basic Usage

## Browser

```typescript
import { Browser } from '@lexjs/web-search';

const chrome = new Browser('chrome');

chrome.open('google.com');
```

## Engine

```typescript
import { Engine } from '@lexjs/web-search';

const google = new Engine('google.com', {
  search: 'search?q=',
});

const searchUrls = google.search('hello world');
const resourceUrls = google.resource('teapot');

console.log(searchUrls);
// [ 'https://google.com/search?q=hello%20word' ]

console.log(resourceUrls);
// [ 'https://google.com/teapot' ]
```

## Browser and Engine

```typescript
import { Engine, Browser } from '@lexjs/web-search';

const google = new Engine('google.com', {
  search: 'search?q=',
});

const chrome = new Browser('chrome');

const urls = google.search('what is a pure esm package');

chrome.open(urls);
```

# Advanced Usage

## Search

```typescript
import { Engine } from '@lexjs/web-search';

const localhost = new Engine('localhost', {
  delimiter: '+',
  search: {
    main: 'search?q=',
    foo: {
      bar: 'foobar?q=',
      baz: 'foobaz?q=',
    },
  },
});

const urls = localhost.search('testing local engine', {
  query: ({ foo }) => [foo.bar, foo.baz],
  port: 3000,
  unsecureHttp: true,
});

console.log(urls);
// [
//   'http://localhost:3000/foobar?q=testing+local+engine',
//   'http://localhost:3000/foobaz?q=testing+local+engine'
// ]
```

## Resources

```typescript
import { Engine } from '@lexjs/web-search';

const github = new Engine('github.com', {
  resources: {
    profile: 'LexBorisoff',
    browserSearch: 'browser-search',
    tabs: {
      repos: '?tab=repositories',
      stars: '?tab=stars',
      projects: '?tab=projects',
    },
  },
});

const urls = github.resource(({ profile }) => profile, {
  path: ({ browserSearch, tabs }) => [browserSearch, tabs.repos, tabs.stars],
});

console.log(urls);
// [
//   'https://github.com/LexBorisoff/browser-search',
//   'https://github.com/LexBorisoff?tab=repositories',
//   'https://github.com/LexBorisoff?tab=stars'
// ]
```

## Browser

```typescript
import { Browser } from '@lexjs/web-search';

const chrome = new Browser('chrome', {
  profiles: {
    dev: 'Profile 1',
    personal: 'Profile 2',
  },
});

chrome.open('best laptops for developers', {
  // explicitly open in personal profile
  profile: ({ personal }) => personal,
  incognito: true,
});
```
