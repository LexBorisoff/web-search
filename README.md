<!-- markdownlint-disable MD029 -->
# `search-web`

![Build](https://img.shields.io/github/actions/workflow/status/LexBorisoff/search-web/release.yml)
![NPM Version](https://img.shields.io/npm/v/search-web)
![Static Badge](https://img.shields.io/badge/package-ESM--only-ffe536)

CLI for making browser web searches from the shell.

- [Installation](#installation)
- [Usage](#usage)
  - [Keywords](#keywords)
  - [URLs](#urls)
- [Options](#options)
  - [Value options](#value-options)
  - [Flag options](#flag-options)
  - [Placement](#placement)
- [Configuration](#configuration)
  - [Creating a config project](#creating-a-config-project)
  - [Editing the config project](#editing-the-config-project)
    - [Defining config](#defining-config)
    - [Engines configuration](#engines-configuration)
    - [Browsers configuration](#browsers-configuration)
  - [Generating the config file](#generating-the-config-file)
  - [Deleting config](#deleting-config)
- [Browser Options](#browser-options):
  - [`browser`](#browser)
  - [`profile`](#profile)
  - [`incognito`](#incognito)
- [Engine Options](#engine-options):
  - [`engine`](#engine)
  - [`search`](#search)
  - [`delimiter`](#delimiter)
  - [`resource`](#resource)
  - [`port`](#port)
  - [`http`](#http)
- [Other Options](#other-options):
  - [`split`](#split)
  - [`test`](#test)
  - [`list`](#list)
- [Custom Flags](#custom-flags)

---

## Installation

Install the package globally:

<pre><code>npm i <em>-g</em> search-web</code></pre>

After installing, the `web` command is ready for use without any setup.

<pre><code>web hello world</code></pre>

&gt; `https://google.com/search?q=hello%20world`

<pre><code>web Array.prototype.at <em>--mdn</em></code></pre>

&gt; `https://developer.mozilla.org/search?q=String.prototype.at`

<pre><code>web typescript tutorial <em>--youtube</em></code></pre>

&gt; `https://youtube.com/results?search_query=typescript+tutorial`

To get help with command options, use the `--help` option:

<pre><code>web <em>--help</em></code></pre>

To check the installed version, use the `--version` option:

<pre><code>web <em>--version</em></code></pre>

---

## Usage

To perform basic web queries, provide **_space-separated values_**

<pre><code>web <em>&lt;values&gt;</em></code></pre>

The CLI will then construct 1 or more queries based on the type of values and open them in a new browser tab.

There are 2 types of values:

1. Keywords
2. URLs

### Keywords

When providing keywords, only 1 web query is created using the values as a search term:

```bash
web hello world
```

&gt; `https://google.com/search?q=hello%20world`

In the absence of [_options_](#options), the CLI uses the **_default search engine_** to construct the query and opens it in the **_default browser_**:

- After installation, there is a set of initial search engines that you can use (default - Google).
- The operating system's default browser is used to open the web queries.

You can change these defaults and add new engines and browsers by setting up and running a [_config project_](#configuration).

#### _Initial search engines_

| Search Engine |    Option Value     |
| ------------- | :-----------------: |
| Google        |      `google`       |
| DuckDuckGo    | `duckduckgo` `duck` |
| Github        |      `github`       |
| MDN           |        `mdn`        |
| YouTube       |      `youtube`      |
| NPM           |        `npm`        |

The option value can be either supplied to the [`--engine`](#engine) option or used as a [_custom flag_](#custom-flags).

### URLs

When providing a URL value, the default behavior is to open it directly:

```bash
web github.com
```

&gt; `https://github.com`

If multiple URLs are provided, each URL creates a separate web query:

```bash
web github.com npmjs.com developer.mozilla.org
```

&gt; `https://github.com`  
&gt; `https://npmjs.com`  
&gt; `https://developer.mozilla.org`

#### _Keywords and URLs together_

If both keywords and URLs are provided, then all values are treated as search term keywords:

```bash
web most starred repos on github.com
```

&gt; `https://google.com/search?q=most%20starred%20repos%20on%20github.com`

---

## Options

Options give you control over web queries by overriding the CLI's defaults.

To use an option in the command, prefix it with a double dash `--`

<pre><code>web <em>--option</em></code></pre>

1-letter options (like an option's alias, for example) are prefixed by a single dash `-`

<pre><code>web <em>-x</em></code></pre>

If an option requires a value ([_value options_](#value-options)), provide it in one of the following ways:

<pre><code>web <em>--option=value</em></code></pre>
<pre><code>web <em>--option value</em></code></pre>

> The assignment syntax (`--option=value`) is more explicit and helps avoid any confusion between what is an option's value and what is an actual keyword, especially when building larger web queries with many search term keywords.

1-letter options can be combined together with a single dash `-` as long as their combination is valid:

<pre><code>web <em>-xyz</em></code></pre>

which is equivalent to:

<pre><code>web <em>-x</em> <em>-y</em> <em>-z</em></code></pre>

> ⚠️ Combining 1-letter aliases of multiple [_value options_](#value-options) will result in invalid queries when such combinations are followed by a value. It is recommended to combine only the [_flag options_](#flag-options) which can be built-in or custom. If you want to add a 1-letter value option, it must be placed at the very end of the combination. If the value option is placed in the middle, the value argument will not get assigned to it.

### Value options

The following are built-in options that require a value:

| Option                  |      Alias       | Description                                |
| ----------------------- | :--------------: | ------------------------------------------ |
| [`browser`](#browser)   | [`b`](#browser)  | _Browser app to open_                      |
| [`profile`](#profile)   | [`p`](#profile)  | _Browser profile to use_                   |
| [`engine`](#engine)     |  [`e`](#engine)  | _Search engine (or website) to query_      |
| [`search`](#search)     |  [`s`](#search)  | _Engine's search path to use for querying_ |
| [`resource`](#resource) | [`r`](#resource) | _Engine's resource to access_              |
| [`port`](#port)         |   [`:`](#port)   | _Port number to add to the URL_            |

All value options work without any initial configuration but most options' usage can be enhanced by setting up the config. Refer to each option as well as [_engines configuration_](#engines-configuration) and [_browsers configuration_](#browsers-configuration) for more details.

### Flag options

Options that do not require a value are called **_flags_**. The following are built-in flag options:

| Option                    |       Alias       | Description                                           |
| ------------------------- | :---------------: | ----------------------------------------------------- |
| [`incognito`](#incognito) | [`i`](#incognito) | _Open in incognito / private mode_                    |
| [`split`](#split)         |        ❌         | _Create a separate web query for each value argument_ |
| [`http`](#http)           |        ❌         | _Use the HTTP (non-secure) protocol_                  |
| [`test`](#test)           |   [`t`](#test)    | _Display the output without opening browser tabs_     |

> ⚠️ Flag options can be assigned values `true` and `false`. This is because, internally, flags are `boolean`s. Using a flag option in the command automatically sets its value to **_"true"_** but the option will still accept a boolean value that's placed after it (even without the explicit `=` sign). Therefore, make sure to not accidentally assign **_"true"_** or **_"false"_** to a flag if you do not intend it. Doing so will result in your web query missing the keyword **_"true"_** or **_"false"_** from the search term.

With browsers and engines configuration set up, you can also use [_custom flags_](#custom-flags) which are created from the keys and aliases of _browsers_, _browser profiles_, and _engines_ from the generated config file. Custom flags simplify your web queries by being a convenient substitute for value options.

### Placement

Options can be placed anywhere in the command

<pre><code>web <em>--browser=firefox</em> this is <em>--incognito</em> an example <em>--engine=duckduckgo</em> search query</code></pre>

<pre><code>web <em>-b=firefox</em> this is <em>-i</em> an example <em>-e=duckduckgo</em> search query</code></pre>

> Typically, you would place the options where they make sense visually such as at the start or the end of the command. This example just shows you that their placement does not impact the constructed queries.

The above command will do the following:

- construct a web query using
  - keywords **_"this is an example search query"_**
  - the **_DuckDuckGo_** search engine (`--engine=duckduckgo`)
- open the constructed query in a new **_Firefox_** tab (`--browser=firefox`)
- in **_incognito / private mode_** (`--incognito`)

---

## Configuration

Creating configuration allows you to customize the usage of Web CLI and enhance many of the built-in options. Before learning about these options, it is beneficial to know how to create and generate your own custom config.

### Creating a config project

Web CLI allows you to create a config by scaffolding a TypeScript project and then running it with an npm script defined in `package.json`. Even if you are not familiar with TypeScript, you should be able to quickly grasp and navigate around the created application.

First, run the following command in the directory where you want to create the project.

<pre><code>web <em>--config</em></code></pre>

On its first run, you won't have an existing config so it will give you only 1 option:

- `New config` to create a new config project

Select this option in order to create a new config directory. The CLI will walk you through the process by initializing and scaffolding the config project.

### Editing the config project

After the scaffolding process is complete, you can navigate to the created directory and open it in your IDE. You can also push it to a remote git repository such as Github to keep your config in sync on different machines.

There are two initial files in the `src` folder that you can customize:

- `engines.ts`
- `browsers.ts`

Both of these files import a function called `defineConfig` from `search-web/config`.

```typescript
// src/engines.ts
import { defineConfig, clearEngines } from "search-web/config";

clearEngines();
defineConfig(({ engine }) => ({
  google: engine("google.com", {
    search: "search?q=",
  }),
  // ... other engines
}));
```

```typescript
// src/browsers.ts
import { defineConfig, clearBrowsers } from "search-web/config";

clearBrowsers();
defineConfig(({ browser }) => ({
  chrome: browser(),
}));
```

> ⚠️ Notice the `clearEngines` and `clearBrowsers` function calls before `defineConfig` in each file. They are used to clear the engines and browsers, respectively, from the config file because calling `defineConfig` _**appends**_ new engines and browsers to the config file rather than overriding the existing ones.

You can add more engines and browsers, as well as edit or remove them by extending the initial code.

Since this is a regular TypeScript project, you are free to organize it however you want, add more files, functions, use other libraries, etc. Just remember to:

- call the `defineConfig` function that defines the engines and/or browsers, and
- correctly [generate the config file](#generating-the-config-file) (described in the next section)

#### **_Defining config_**

`defineConfig` accepts a callback that

- takes an object with `engine` and `browser` functions in its parameter
- returns an object with defined engines and/or browsers

```typescript
// not exact representation
type DefineConfigCallback = ({
  engine: CreateSiteFn;
  browser: CreateBrowserFn;
}) => Record<string, Engine | Browser>;
```

#### **_Engines Configuration_**

To create an engine, use the `engine` function from the callback's parameter and assign it to a property of the callback's return object:

```typescript
defineConfig(({ engine }) => ({
  google: engine("google.com", {
    search: "search?q=",
  }),
}));
```

> ⚠️ The property's key name is important because it is used as a value for the `--engine` option and as a custom flag.

The `engine` function is of type `CreateSiteFn`:

```typescript
// not exact representation
type CreateSiteFn = (baseUrl: string, config?: Config) => Engine;
```

When defining an engine, you must provide the base URL string as the first argument and, optionally, a config object as the second argument.

The optional config parameter has the following shape:

```typescript
interface Config {
  search?: string | NestedSearchObject;
  resources?: ResourceObject;
  alias?: string | string[];
  delimiter?: string;
  isDefault?: boolean;
}

interface NestedSearchObject {
  [key: string]: string | StringObject;
  main: string;
}

interface ResourceObject {
  [key: string]: string | StringObject;
}

interface StringObject {
  [key: string]: string | StringObject;
}
```

All Config properties are optional. Let's examine each available option:

1. **_`search`_** - defines how the search engine should be queried with keywords.

The value of this option can be one of the following:

- a string such as `search?q=`, `?q=`, etc. For example:

```typescript
defineConfig(({ engine }) => ({
  example: engine("example.com", {
    search: "search?q=",
  }),
}));
```

- an object with:
  - at least 1 property called `main` of the string type
  - other optional properties with string or nested object values (the most nested values must be strings). For example:

```typescript
defineConfig(({ engine }) => ({
  example: engine("example.com", {
    search: {
      main: "search?q=",
      foo: {
        bar: "foobar?q=",
        baz: {
          deeply: {
            nested: "foobaz?q=",
          },
        },
      },
    },
  }),
}));
```

Defining the `search` config as an object allows you to provide its keys as values to the [`--search` built-in option](#search) instead of typing the actual search string. For example:

<pre><code>web <em>--search=main</em></code></pre>
<pre><code>web <em>--search=bar</em></code></pre>
<pre><code>web <em>--search=nested</em></code></pre>

> ⚠️ Using the keys `foo`, `baz`, and `deeply` is not valid because they do not point to a string value.

2. **_`resources`_** - defines what routes can be accessed on the engine.

The value of this option is an object with string or nested object values (similarly, the most nested values must be strings). For example:

```typescript
defineConfig(({ engine }) => ({
  github: engine("github.com", {
    resources: {
      profile: "username",
      tabs: {
        repos: "?tab=repositories",
        projects: "?tab=projects",
        stars: "?tab=stars",
      },
      deeply: {
        nested: {
          example: "example/path/to/some/resource",
        },
      },
    },
  }),
}));
```

Defining the `resources` config allows you to provide its keys as values to the [`--resource` built-in option](#resource). For example:

<pre><code>web <em>--resource=profile</em></code></pre>
<pre><code>web <em>--resource=example</em></code></pre>
<pre><code>web <em>--resource=profile::tabs</em></code></pre>

> ⚠️ Just like in the `search` example above, using keys like `tabs`, `deeply`, or `nested` that do not point to a string value is not valid.

Note the `profile::tabs` syntax - it allows you to construct a route based on 2 config keys. The final URL will combine together both values of the provided property keys.

3. **_`alias`_** - a string or array of strings that provides alias names for the engine.

```typescript
defineConfig(({ engine }) => ({
  youtube: engine("youtube.com", {
    alias: ["y", "yt"],
  }),
  duckduckgo: engine("duckduckgo.com", {
    alias: "duck",
  }),
}));
```

Defining engine aliases allows you to provide them to the [`--engine` built-in option](#engine) or use them as custom flags. For example:

<pre><code>web <em>--engine=duck</em></code></pre>
<pre><code>web <em>--duck</em></code></pre>
<pre><code>web <em>-y</em></code></pre>

4. **_`delimiter`_** - defines how the search keywords should be delimited in the constructed URLs.

```typescript
defineConfig(({ engine }) => ({
  duck: engine("duckduckgo.com", {
    delimiter: "+",
    search: "?q=",
  }),
}));
```

When the engine is used, the delimiter specified in its config will be applied to combine the keywords. You should only provide the delimiter value if it differs from the default single whitespace character `" "`.

5. **_`isDefault`_** - defines whether the engine should be used as the default.

```typescript
defineConfig(({ engine }) => ({
  duck: engine("duckduckgo.com", {
    search: "?q=",
    delimiter: "+",
    isDefault: true,
  }),
}));
```

When setting this option to true, Web CLI will use that engine when there is no `--engine` option or engine custom flag provided.

- You should only specify 1 engine as the default
- If multiple default engines are set, the first one will be used (although JavaScript does not guarantee it)
- If this option is not set on any engine, the first one in the config will be used (again no guarantee)

#### **_Browsers Configuration_**

To create a browser, use the `browser` function from the callback's parameter and assign it to a property of the callback's return object:

```typescript
defineConfig(({ browser }) => ({
  chrome: browser(),
}));
```

> ⚠️ The property's key name is important because it is used as a value for the `--browser` option and as a custom flag.

The `browser` function is of type `CreateBrowserFn`:

```typescript
// not exact representation
type CreateBrowserFn = (config?: Config) => Browser;
```

There are no required parameters but there is an optional config of the following form:

```typescript
// not exact representation
interface Config {
  alias?: string | string[];
  isDefault?: boolean;
  profiles?: {
    [key: string]: string | Profile;
  };
  appPath?: string;
}

interface Profile {
  directory: string;
  alias?: string | string[];
  isDefault?: boolean;
}
```

All Config properties are optional. Let's examine each available option.

1. **_`alias`_** - a string or array of strings that provides alias names for the browser.

```typescript
defineConfig(({ browser }) => ({
  chrome: browser({
    alias: "c",
  }),
  firefox: browser({
    alias: ["f", "ff"],
  }),
}));
```

Defining browser aliases allows you to provide them to the [`--browser` built-in option](#browser) or use them as custom flags. For example:

<pre><code>web <em>--browser=ff</em></code></pre>
<pre><code>web <em>--ff</em></code></pre>

2. **_`isDefault`_** - defines whether the browser should be used as a default.

Same concept and rules as described in the engines configuration.

3. **_`profiles`_** - defines browser profiles that can be used.

Some browsers (such as Chrome) have the functionality to create and use multiple browser profiles. When a browser has multiple profiles, it typically keeps the data used by each profile in a **_directory_** (folder) stored somewhere on your machine. For example, Chrome stores this information in `~/AppData/Local/Google/Chrome/User Data` on a Windows machine (you can google where this data is stored on your OS). Here, you can find profile directories such "Profile 1", "Profile 2", etc. These are the names that you need to assign to the `profiles` properties.

The value of this option can be one of the following:

- a string value specifying the name of a profile **_directory_** described above.
- an object value with:
  - at least 1 property called `directory` that points to a profile directory
  - optional `alias` and `isDefault` properties (same concept and rules as above)

```typescript
defineConfig(({ browser }) => ({
  chrome: browser({
    profiles: {
      work: "Profile 1",
      dev: {
        directory: "Profile 2",
        alias: ["code", "d"],
      },
      personal: {
        directory: "Profile 3",
        alias: "p",
        isDefault: true,
      },
    },
  }),
}));
```

Defining browser profiles allows you to use its keys as values to the [`--profile` built-in option](#profile) and as custom flags (excluding 1-letter aliases).

> ⚠️ Unlike engine and browser aliases, **_1-letter_** profile aliases (such as `d` in the above example) cannot be used as custom flags.

For example:

<pre><code>web <em>--profile=dev</em></code></pre>
<pre><code>web <em>--profile=p</em></code></pre>
<pre><code>web <em>--code</em></code></pre>

4. **_`appPath`_** - defines the browser application path in the file system.

Some browser applications can have multiple versions available for download, such as Chrome/Chrome Dev/Chrome Canary and not all of them could be found by their app name when supplying it to the Web CLI (for example, you can specify `web --browser=chrome` but not `web --browser=chrome-dev` because the program name `chrome-dev` does not exist). In such cases, you can provide this option an exact path of the browser program you want to open. For example:

```typescript
defineConfig(({ browser }) => ({
  chrome: browser(),
  "chrome-dev": browser({
    appPath: "C:\\Program Files\\Google\\Chrome Dev\\Application\\chrome.exe",
  }),
}));
```

### Generating the config file

In order to start using the engines and browsers defined in the previous step, you must generate a **_config file_**. What Web CLI uses to customize its behavior is not the config project itself but rather the config file that gets generated based on the project.

To generate the config file, run the following command from the root directory of the project:

<pre><code>npm run config</code></pre>

You can notice that this is just a simple npm script defined in `package.json` which consists of two other commands that you can run individually:

<pre><code>npm run config:engines</code></pre>
<pre><code>npm run config:browsers</code></pre>

Both commands execute their respective files (`src/engines.ts` and `src/browsers.ts`) to set the config engines and browsers.

> Again, you can customize or change this part of the project as long as you execute a file (or multiple files) that calls `defineConfig`.

Please note that only 1 config file gets generated even if you call `defineConfig` multiple times from different files. Each time the `defineConfig` function is called, new engines and browsers from its return value are _**appended**_ to the generated config file.

The location of the generated file is `~/.search-web/config.json`

### Deleting config

To delete the config engines or browsers, you can call `clearEngines` and `clearBrowsers` functions:

```typescript
// e.g. src/clear-config.ts
import { clearEngines, clearBrowsers } from "search-web/config";

clearBrowsers();
clearEngines();
```

To apply the changes you need to execute the file(s) where these functions are called. For example:

```json
{
  "scripts": {
    /* other scripts */
    "config:clear": "tsx src/clear-config.ts"
  }
}
```

<pre><code>npm run config:clear</code></pre>

---

## Browser Options

## `browser`

Specifies the browser app to open.

⚡ Takes a value.  
⚙️ Allows configuration.

### Options

`--browser` `-b`

### Usage

<pre><code>web <em>--browser=value</em></code></pre>

`value` is one of the following:

1. **_Browser app name on your machine_**, e.g. `chrome`, `firefox`, `brave`, `edge`, etc.

<pre><code>web <em>--browser=chrome</em></code></pre>

> ⚠️ The command will not prevent you from specifying a value that refers to an invalid browser or to another non-browser application on your machine. As far as the program is concerned - any value provided to the `browser` option is a possible browser app, so it will attempt to open it.

2. **_Browser key or alias in the config._** For example, `chrome`, `firefox`, `c`, `f`, or `ff`

```typescript
import { defineConfig } from "search-web/config";

defineConfig(({ browser }) => ({
  chrome: browser({
    alias: "c",
  }),
  firefox: browser({
    alias: ["f", "ff"],
  }),
}));
```

<pre><code>web <em>--browser=ff</em></code></pre>

### Multiple options

You can specify multiple browsers:

<pre><code>web <em>--browser=value</em> <em>--browser=value</em> ...</code></pre>

### Configuration

Setting up [_browsers configuration_](#browsers-configuration) allows using

- browser aliases as the option's value
- browser keys and aliases as custom flags

## `profile`

Specifies what browser profile to use when opening a new browser tab. Learn more about profiles in the [_browsers configuration_](#browsers-configuration).

⚡ Takes a value.  
⚙️ Allows configuration.

The option works only if the browser application supports profiles functionality. Otherwise, it will have no effect on the opened web query.

### Options

`--profile` `-p`

### Usage

This option relies on the provided `browser` option or generated config.

- If the `browser` option is not provided, the CLI will use the config's **_default browser_** (see how it is determined in [_browsers configuration_](#browsers-configuration)).
- If the `browser` option is not provided and there is no browser config, the query will not be opened.

<pre><code>web <em>--profile=value</em></code></pre>

`value` is one of the following:

1. **_Profile directory name._** For example `Profile 1`

<pre><code>web <em>--profile="Profile 1"</em></code></pre>

> For this scenario to work, make sure that you either provide the `--browser` option or create a config, for example:

```typescript
import { defineConfig } from "search-web/config";

defineConfig(({ browser }) => ({
  chrome: browser(),
}));
```

2. **_Property key in the `profiles` object of the browser config._** For example, `dev` or `personal`

```typescript
import { defineConfig } from "search-web/config";

defineConfig(({ browser }) => ({
  chrome: browser({
    profiles: {
      dev: "Profile 1",
      personal: {
        directory: "Profile 2",
      },
    },
  }),
}));
```

<pre><code>web <em>--profile=personal</em></code></pre>

3. **_Value of a profile's `alias` property._** For example, `d`, `p`, or `second`

```typescript
import { defineConfig } from "search-web/config";

defineConfig(({ browser }) => ({
  chrome: browser({
    profiles: {
      dev: {
        directory: "Profile 1",
        alias: "d",
      },
      personal: {
        directory: "Profile 2",
        alias: ["p", "second"],
      },
    },
  }),
}));
```

<pre><code>web <em>--profile=p</em></code></pre>

### Multiple options

You can specify multiple profiles:

<pre><code>web <em>--profile=value</em> <em>--profile=value</em> ...</code></pre>

### Configuration

Setting up [_browsers configuration_](#browsers-configuration) allows using

- profile keys and aliases as the option's value
- profile keys and multi-letter aliases as custom flags

## `incognito`

Opens web queries in a private / incognito mode.

🚩 Flag option - no value is required.  
❌ No configuration.

### Options

`--incognito` `-i`

### Usage

<pre><code>web <em>--incognito</em></code></pre>

---

## Engine Options

## `engine`

Specifies what search engine or website to query.

⚡ Takes a value.  
⚙️ Allows configuration.

### Options

`--engine` `-e`

### Usage

<pre><code>web <em>--engine=value</em></code></pre>

`value` is one of the following:

1. **_Engine key or alias in the config._** For example, `google`, `npm`, `duck`, or `duckduckgo`

```typescript
import { defineConfig } from "search-web/config";

defineConfig(({ engine }) => ({
  google: engine("google.com", {
    search: "search?q=",
  }),
  npm: engine("npmjs.com", {
    search: "search?q=",
  }),
  duck: engine("duckduckgo.com", {
    search: "?q=",
    delimiter: "+",
    alias: ["duckduckgo"],
  }),
}));
```

<pre><code>web search-web <em>--engine=npm</em></code></pre>

&gt; `https://npmjs.com/search?q=search-web`

When supplying URL values to the command, this option overrides the default behavior of opening the URLs. Instead, they are treated as search term keywords for the provided engine. For example:

<pre><code>web github.com <em>--engine=google</em></code></pre>

&gt; `https://google.com/search?q=github.com`

2. **_An arbitrary URL string_** like `google.com/search?q=` or `example.com`

<pre><code>web search-web <em>--engine=npmjs.com/search?q=</em></code></pre>

&gt; `https://npmjs.com/search?q=search-web`

> ⚠️ Non-URL values are not allowed.

When using the option with an arbitrary URL, it behaves in the same way as any other engine from the config, meaning that you can use other options such as `--search`, `--resource`, `--port`, `--split`, or `--http`.

Note that since a URL value is a basic string, the CLI will simply append it with whatever keywords are supplied. If the URL has no query string that ends with an equals sign (`=`), the values will be added after a forward-slash (`/`), e.g.

<pre><code>web <em>--engine=example.com</em> hello world</code></pre>

&gt; `https://example.com/hello%20world`

### Configuration

To define more engines and websites than the app defaults, use [_engines configuration_](#engines-configuration).

## `search`

Specifies what _search path_ to use for querying the provided engine. This search path is a URL segment that is appended to the engine's base URL and allows to **_search_** that engine with the provided keywords. There could be multiple ways to search a single engine and this option allows to specify it.

⚡ Takes a value.  
🛠️ Requires an `--engine` option.  
🛠️ Requires keywords.  
⚙️ Allows configuration.

### Options

`--search` `-s`

### Usage

This option must be used with the `--engine` option and keywords.

- If the engine is not specified, validation will fail and the web query will not be performed.
- If keywords are not provided, only the base URL will be opened (i.e. the search `value` is not added).

<pre><code>web <em>--search=value</em> <em>--engine=engine</em> &lt;keywords&gt;</code></pre>

`value` is one of the following:

1. **_URL segment string._** For example, `search?q=` or `?q=`

<pre><code>web <em>--search=?q=</em> <em>--engine=duckduckgo.com</em> hello world</code></pre>

&gt; `https://duckduckgo.com/?q=hello%20world`

2. **_Search key in the engine's "search" config._** For example, `main`, `images`, `bar`, or `deep`

```typescript
import { defineConfig } from "search-web/config";

defineConfig(({ engine }) => ({
  example: engine("example.com", {
    search: {
      main: "search?q=",
      images: "images?q=",
      foo: {
        bar: "foobar?q=",
        baz: {
          deep: "foobaz?q=",
        },
      },
    },
  }),
}));
```

> ⚠️ Using keys like `foo` and `baz` that do not point to a string value is not valid.

Most of the time when queying an engine, the `--search` option will not be provided. In these cases, it defaults to either the string value or the `main` property's value, depending on how the `search` config is set up.

### Multiple options

Supplying multiple `--search` options will create a separate URL for each value.

### Configuration

Setting up [_engines configuration_](#engines-configuration) allows using search keys as the option's value.

## `delimiter`

Specifies the delimiter character used by the search engine to separate keywords.

⚡ Takes a value.  
🛠️ Requires an `--engine` option.  
❌ No configuration.

### Options

`--delimiter` `-d`

### Usage

This option only works in conjunction with the `--engine` option where [the engine is specified as a URL](#an-arbitrary-url-string-like-googlecomsearchq-or-examplecom). If this option is used with an engine that **_is_** defined in the config, then the option has no effect.

<pre><code>web typescript docs <em>--delimiter=+</em> <em>--engine=duckduckgo.com</em> <em>--search=?q=</em></code></pre>

&gt; `https://duckduckgo.com/?q=typescript+docs`

When the delimiter option is not specified and the engine is not defined in the config, the delimiter defaults to a single whitespace character.

<pre><code>web typescript docs <em>--engine=duckduckgo.com</em> <em>--search=?q=</em></code></pre>

&gt; `https://duckduckgo.com/?q=typescript%20docs`

## `resource`

Overrides the default behavior of _querying_ an engine by specifying the engine's route to be accessed directly.

⚡ Takes a value.  
🛠️ Requires an `--engine` option.  
⚙️ Allows configuration.

### Options

`--resource` `-r`

### Usage

This option must be used with the `--engine` option.

- If the engine is not specified, validation will fail and the web query will not be performed.

<pre><code>web <em>--resource=value</em> <em>--engine=engine</em></code></pre>

`value` is one of the following:

1. **_URL segment string._** For example

<pre><code>web <em>--resource=teapot</em> <em>--engine=google.com</em></code></pre>

&gt; `https://google.com/teapot`

<pre><code>web <em>--resource=path/to/resource</em> <em>--engine=example.com</em></code></pre>

&gt; `https://example.com/path/to/resource`

2. **_Resource key in the engine's "resources" config._** For example, `test`, `bar`, `baz` or `example`

```typescript
import { defineConfig } from "search-web/config";

defineConfig(({ engine }) => ({
  example: engine("example.com", {
    resources: {
      test: "path/to/resource",
      foo: {
        bar: "?foo=bar",
        baz: "?foo=baz",
      },
      deeply: {
        nested: {
          example: "deeply/nested/example/resource",
        },
      },
    },
  }),
}));
```

> ⚠️ Using keys like `foo`, `deeply`, or `nested` that do not point to a string value is not valid.

### Command values

When supplying command values, each value is used in a separate web query as a URL path segment after the provided resource.

For example, the following creates 3 distinct web queries:

<pre><code>web typescript react @nestjs/cli <em>--resource=package</em> <em>--engine=npmjs.com</em></code></pre>

&gt; `https://npmjs.com/package/typescript`  
&gt; `https://npmjs.com/package/react`  
&gt; `https://npmjs.com/package/@nestjs/cli`

### Combining resources

You can combine multiple resources together to create a single web query by using the `::` separator. Each resource can be either a key from the engine's `resources` config or an arbitrary string.

Let's examine some scenarios by using the following Github engine config:

```typescript
defineConfig(({ engine }) => ({
  github: engine("github.com", {
    search: "search?q=",
    resources: {
      profile: "LexBorisoff",
      tabs: {
        repos: "?tab=repositories",
        projects: "?tab=projects",
        stars: "?tab=stars",
      },
    },
  }),
}));
```

#### _Combining resource keys_

You can generate a URL that accesses a profile's repositories page:

<pre><code>web <em>--resource=profile::repos</em> <em>--engine=github</em></code></pre>

&gt; `https://github.com/LexBorisoff?tab=repositories`

To use a string literally in situations where it has the same value as the resource key, you can escape it with a `/`:

<pre><code>web <em>--resource=profile::/repos</em> <em>--engine=github</em></code></pre>

&gt; `https://github.com/LexBorisoff/repos`

> ⚠️ In some shells, to escape the first resource key you also need to escape the forward slash:

<pre><code>web <em>--resource=//profile::/repos</em> <em>--engine=github</em></code></pre>

&gt; `https://github.com/profile/repos`

#### _Combining a resource key with an arbitrary string_

You can generate a URL that accesses a profile's arbitrary repository:

<pre><code>web <em>--resource=profile::web-cli</em> <em>--engine=github</em></code></pre>

&gt; `https://github.com/LexBorisoff/search-web`

#### _Combining an arbitrary string with a resource key_

You can generate a URL that accesses a repositories page of an arbitrary profile:

<pre><code>web <em>--resource=username::repos</em> <em>--engine=github</em></code></pre>

&gt; `https://github.com/username?tab=repositories`

#### _Combining arbitrary strings_

<pre><code>web <em>--resource=LexBorisoff::web-cli</em> <em>--engine=github</em></code></pre>

&gt; `https://github.com/LexBorisoff/search-web`

This scenario is essentially the same as providing a single resource value with `/`

<pre><code>web <em>--resource=LexBorisoff/search-web</em> <em>--engine=github</em></code></pre>

&gt; `https://github.com/LexBorisoff/search-web`

#### _Combining more resources_

You can combine as many resources as you want and each one will be resolved to its:

- config value found by the provided resource key, or
- literal value if
  - the config does not contain the provided resource key, or
  - the resource key is escaped with a forward slash `/`.

### Configuration

Setting up [_engines configuration_](#engines-configuration) allows using resource keys as the option's value.

## `port`

Adds the provided port number to the URL.

⚡ Requires a number value.  
❌ No configuration.

### Options

`--port` `-:`

### Usage

<pre><code>web <em>--port=3000</em> example.com</code></pre>

&gt; `https://example.com:3000/`

If multiple ports are supplied, each one will create a separate query:

<pre><code>web <em>-: 3000 -: 5000</em> example.com</code></pre>

&gt; `https://example.com:3000/`  
&gt; `https://example.com:5000/`

The program recognizes if an engine or a URL already includes a port and checks if it matches the option's value when building the final list of URLs:

<pre><code>web <em>-: 3000 -: 5000</em> example.com:3000/api/users</code></pre>

&gt; `https://example.com:3000/api/users`  
&gt; `https://example.com:5000/api/users`

## `http`

Uses the non-secure HTTP protocol when constructing web queries.

🚩 Flag option - no value is required.  
❌ No configuration.

### Options

`--http`

### Usage

<pre><code>web <em>--http</em> https://google.com</code></pre>

&gt; `http://google.com/`

---

## Other Options

## `split`

Creates a separate web query for each value argument.

🚩 Flag option - no value is required.  
❌ No configuration.

### Options

`--split`

### Usage

<pre><code>web Object Symbol class <em>--engine=mdn</em> <em>--split</em></code></pre>

&gt; `https://developer.mozilla.org/search?q=Object`  
&gt; `https://developer.mozilla.org/search?q=Symbol`  
&gt; `https://developer.mozilla.org/search?q=class`

## `test`

Prevents opening browser tabs and only displays the output.

🚩 Flag option - no value is required.  
❌ No configuration.

### Options

`--test`

### Usage

<pre><code>web [values] [options] <em>--test</em></code></pre>

## `list`

Lists engines and browsers from the config.

🚩 Flag option - no value is required.  
❌ No configuration.

### Options

`--list` `-l`

### Usage

<pre><code>web <em>--list</em></code></pre>

---

## Custom Flags

When config is set up, certain keys and alias values automatically become _flags_. You can use these custom flags as substitutes for `engine`, `browser`, and `profile` options.

For example, the following command with value options

<pre><code>web <em>--browser=chrome --profile=dev --engine=mdn</em></code></pre>

can be re-written using custom flags:

<pre><code>web <em>--chrome --dev --mdn</em></code></pre>

> ⚠️ If a custom flag conflicts with an [_option_](#options) or its alias, the option takes precedence.

### How custom flags are created

The following config items are used to create custom flags:

|         | keys | alias values | 1-letter alias values |
| ------- | :--: | :----------: | :-------------------: |
| browser |  ✅  |      ✅      |          ✅           |
| profile |  ✅  |      ✅      |          ❌           |
| engine  |  ✅  |      ✅      |          ✅           |
