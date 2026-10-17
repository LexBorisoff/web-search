<!-- markdownlint-disable MD029 -->
# `@lexjs/web`

![Build](https://img.shields.io/github/actions/workflow/status/LexBorisoff/web-search/release.yml)
![NPM Version](https://img.shields.io/npm/v/@lexjs/web)
![Static Badge](https://img.shields.io/badge/package-ESM--only-ffe536)

CLI for making browser web searches from the shell.

- [Installation](#installation)
- [Usage](#usage)
  - [Keywords](#keywords)
  - [URLs](#urls)
- [Options](#options)
  - [Value options](#value-options)
  - [Boolean options](#boolean-options)
  - [Placement](#placement)
- [Site Options](#site-options):
  - [`site`](#site)
  - [`query`](#query)
  - [`delimiter`](#delimiter)
  - [`resource`](#resource)
  - [`port`](#port)
  - [`http`](#http)
- [Browser Options](#browser-options):
  - [`browser`](#browser)
  - [`profile`](#profile)
  - [`incognito`](#incognito)
- [Other Options](#other-options):
  - [`split`](#split)
  - [`dry-run`](#dry-run)
- [Custom Flags](#custom-flags)

---

## Installation

**Step 1**. Run one of the following commands from any directory.

```bash
npx @lexjs/web
```

```bash
pnpm dlx @lexjs/web
```

```bash
yarn dlx @lexjs/web
```

```bash
bunx @lexjs/web
```

**Step 2**. Follow the prompts to set up the command.

**Step 3**. Once the installation process is complete, add the following lines to your shell configuration file.

- For POSIX-compatible shells like bash or zsh

```bash
# ~/.bashrc or ~/.zshrc

test -f ~/.lexjs/web/start.sh && . ~/.lexjs/web/start.sh
```

- For PowerShell

```powershell
# C:\Program Files\PowerShell\7\profile.ps1

if (Test-Path -Path "$env:HOMEPATH\.lexjs\web\bin") {
  $env:Path = "$env:HOMEPATH\.lexjs\web\bin;$env:Path"
}
```

> 💡 To get the path of your PowerShell configuration file, type `$PROFILE.` and tab through the available options to choose the necessary profile.

**Step 4**. Restart your shell. The command should now be available.

The command name you set up during the installation is ready for use without any additional setup (we'll use `web` throughout the docs).

<pre><code>web hello world</code></pre>

&gt; `https://google.com/search?q=hello%20world`

<pre><code>web Array.prototype.at <em>--mdn</em></code></pre>

&gt; `https://developer.mozilla.org/search?q=Array.prototype.at`

<pre><code>web typescript tutorial <em>--youtube</em></code></pre>

&gt; `https://youtube.com/results?search_query=typescript+tutorial`

To get help with command options, use the `--help` option:

<pre><code>web <em>--help</em></code></pre>

To check the installed version, use the `--version` option:

<pre><code>web <em>--version</em></code></pre>

## Usage

To perform basic web queries, provide **_space-separated values_**

<pre><code>web <em>&lt;values&gt;</em></code></pre>

The CLI will then construct 1 or more queries and open them in the browser.

There are 2 types of values:

1. Keywords
2. URLs

### Keywords

When providing keywords, only 1 web query is created using the values as a search term:

```bash
web hello world
```

&gt; `https://google.com/search?q=hello%20world`

In the absence of [_options_](#options), the CLI uses the **_default site_** to construct a web query, and opens it in the **_default browser_**:

- After installation, there is a set of initial sites you can use as search engines (default - Google).
- The operating system's default browser is used to open the web queries.

You can change these defaults and add new sites and browsers by setting up [_config_](#configuration).

#### _Initial sites_

| Site          |    Option Value     |
| ------------- | :-----------------: |
| Google        |      `google`       |
| DuckDuckGo    | `duckduckgo` `duck` |
| GitHub        |      `github`       |
| MDN           |        `mdn`        |
| YouTube       |      `youtube`      |
| NPM           |        `npm`        |

The option value can be either supplied to the [`--site`](#site) option or used as a [_custom flag_](#custom-flags).

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

If both keywords and URLs are provided, all values are treated as search term keywords:

```bash
web most starred repos on github.com
```

&gt; `https://google.com/search?q=most%20starred%20repos%20on%20github.com`

## Options

You can use options to override the CLI's defaults when constructing search queries.

<pre>
  <code>web <em>--option</em></code>
  <code>web <em>-x</em></code>
</pre>

Some options require a value (see [_value options_](#value-options)):

<pre>
  <code>web <em>--option value</em></code>
</pre>

1-letter flags can be combined together with a single dash `-` as long as their combination is valid:

<pre><code>web <em>-xyz</em></code></pre>

which is equivalent to:

<pre><code>web <em>-x</em> <em>-y</em> <em>-z</em></code></pre>

> ⚠️ Combining 1-letter aliases of multiple [_value options_](#value-options) will result in invalid queries when such combinations are followed by a value. It is recommended to combine only the [_boolean options_](#boolean-options) which can be built-in or custom. If you want to add a 1-letter value option, it must be placed at the very end of the combination. If the value option is placed in the middle, the value argument will not get assigned to it.

### Value options

The following are built-in options that require a value:

| Option                  |      Alias       | Description                                |
| ----------------------- | :--------------: | ------------------------------------------ |
| [`browser`](#browser)   | [`b`](#browser)  | _Browser app to open_                      |
| [`profile`](#profile)   | [`p`](#profile)  | _Browser profile to use_                   |
| [`site`](#site)         |  [`s`](#site)    | _Website to search_                        |
| [`query`](#query)       |  [`q`](#query)   | _Site's query string to use for searching_ |
| [`resource`](#resource) | [`r`](#resource) | _Site's resource to access_                |
| [`port`](#port)         |   [`:`](#port)   | _Port number to add to the URL_            |

All value options work without any initial configuration but most options' usage can be enhanced by setting up the config. Refer to each option for more details.

### Boolean options

The following are built-in boolean options:

| Option                    |       Alias       | Description                                           |
| ------------------------- | :---------------: | ----------------------------------------------------- |
| [`incognito`](#incognito) | [`i`](#incognito) | _Open in incognito / private mode_                    |
| [`split`](#split)         |        ❌         | _Create a separate web query for each value argument_ |
| [`http`](#http)           |        ❌         | _Use the HTTP (non-secure) protocol_                  |
| [`dry-run`](#dry-run)     | [`n`](#dry-run)   | _Display the output without opening browser tabs_     |

> ⚠️ Boolean options can be assigned values `true` and `false`. Using a boolean option in the command automatically sets its value to **_"true"_** but the option will still accept a boolean value that's placed after it. Therefore, make sure not to accidentally assign **_"true"_** or **_"false"_** to a flag if you do not intend it. Doing so will result in your web query missing the keyword **_"true"_** or **_"false"_** from the search term.

With browsers and sites configuration set up, you can also use [_custom flags_](#custom-flags) which are created from the keys and aliases of _browsers_, _browser profiles_, and _sites_ from the config file. Custom flags simplify your web queries by being a convenient substitute for value options.

### Placement

Options can be placed anywhere in the command:

<pre><code>web <em>--browser=firefox</em> this is <em>--incognito</em> an example <em>--site=duckduckgo</em> search query</code></pre>

<pre><code>web <em>-b=firefox</em> this is <em>-i</em> an example <em>-s=duckduckgo</em> search query</code></pre>

> Typically, you would place the options where they make sense visually such as at the start or the end of the command. This example just shows you that their placement does not impact the constructed queries.

The above command will do the following:

- construct a web query using
  - keywords **_"this is an example search query"_**
  - the **_DuckDuckGo_** search engine (`--site=duckduckgo`)
- open the constructed query in a new **_Firefox_** tab (`--browser=firefox`)
- in **_incognito / private mode_** (`--incognito`)

## Configuration

Creating configuration allows you to customize the CLI usage and enhance many of the built-in options.

<pre><code>web <em>--config</em></code></pre>

### Sites configuration

<pre><code>web <em>--config sites</em></code></pre>

### Browsers configuration

<pre><code>web <em>--config browsers</em></code></pre>

> The `--config` option can match the correct config by accepting partial values indicating the beginning of the option's value like `site`, `s`, `brow`, `br` and any other.

The CLI uses VS Code to open config files by default. To update the editor command that opens config files, run this:

<pre><code>web <em>--config editor</em></code></pre>

Each config file includes a reference to a schema that helps you write valid configuration, with editor autocompletion and inline validation so mistakes get flagged as you type.

## Site Options

## `site`

Specifies what website or search engine to query.

⚡ Takes a value.  
⚙️ Allows configuration.

### Options

`--site` `-s`

### Usage

<pre><code>web <em>--site=value</em></code></pre>

`value` is one of the following:

1. **_Site key or alias in the config._** For example, `google`, `npm`, `duckduckgo`, or `duck`

```yaml
google:
  url: google.com
  query: search?q=

npm:
  url: npmjs.com
  query: search?q=

duckduckgo:
  url: duckduckgo.com
  delimiter: "+"
  alias: duck
```

> 💡 Each site definition in the config must have a `url` property pointing to the site's base URL (protocol is not required)

> 💡 Setting up sites config allows using site keys and aliases as the option's value and as [custom flags](#custom-flags).

<pre><code>web @lexjs/web <em>--site npm</em></code></pre>

&gt; `https://npmjs.com/search?q=@lexjs/web`

When supplying URL values to the command, this option overrides the default behavior of opening the URLs. Instead, they are treated as search term keywords for the provided site. For example:

<pre><code>web github.com <em>--site google</em></code></pre>

&gt; `https://google.com/search?q=github.com`

2. **_An arbitrary URL string_** like `google.com/search?q=` or `example.com`

<pre><code>web @lexjs/web <em>--site npmjs.com/search?q=</em></code></pre>

&gt; `https://npmjs.com/search?q=@lexjs/web`

> ⚠️ Non-URL values are not allowed.

When using the option with an arbitrary URL, it behaves in the same way as any other site from the config, meaning that you can use other options such as `--query`, `--resource`, `--port`, `--split`, or `--http`.

Note that since a URL value is a basic string, the CLI will simply append it with whatever keywords are supplied. If the URL has no query string that ends with an equals sign (`=`), the values will be added after a forward-slash (`/`), e.g.

<pre><code>web <em>--site example.com</em> hello world</code></pre>

&gt; `https://example.com/hello%20world`

## `query`

Specifies what **_query string_** to use for searching a site. This query string is a URL segment that is appended to the site's base URL and allows to _search_ that site with the provided keywords. There could be multiple ways to search a site and this option allows to specify it.

⚡ Takes a value.  
🛠️ Requires a `--site` option.  
🛠️ Requires keywords.  
⚙️ Allows configuration.

### Options

`--query` `-q`

### Usage

This option must be used with the `--site` option and keywords.

- If the site is not specified, validation will fail and the web query will not be performed.
- If keywords are not provided, only the base URL will be opened (i.e. the query `value` is not added).

<pre><code>web <em>--query=value</em> <em>--site=site</em> &lt;keywords&gt;</code></pre>

`value` is one of the following:

1. **_URL segment string._** For example, `search?q=` or `?q=`

<pre><code>web <em>--query ?q=</em> <em>--site duckduckgo.com</em> hello world</code></pre>

&gt; `https://duckduckgo.com/?q=hello%20world`

2. **_Query key in the site's "query" config._** For example, `main`, `images`, `bar`, or `deep`

```yaml
example:
  url: example.com
  query:
    main: search?q=
    images: images?q=
    foo:
      bar: foobar?q=
      baz:
        deep: foobaz?q=
```

> ⚠️ Using keys like `foo` and `baz` that do not point to a string value is not valid.

> 💡 The `query` property itself can be a string in the config.

Most of the time when querying a site, the `--query` option will not be provided. In these cases, it defaults to either the string value or the `main` property's value, depending on how the `query` config is set up.

### Multiple options

Supplying multiple `--query` options will create a separate URL for each value.

## `delimiter`

Specifies the delimiter character used by the site to separate keywords.

⚡ Takes a value.  
🛠️ Requires a `--site` option.  
❌ No configuration.

### Options

`--delimiter` `-d`

### Usage

This option only works in conjunction with the `--site` option where the site is specified as a URL. If this option is used with a site that **_is_** defined in the config, then the option has no effect.

<pre><code>web typescript docs <em>--delimiter=+</em> <em>--site duckduckgo.com</em> <em>--query=?q=</em></code></pre>

&gt; `https://duckduckgo.com/?q=typescript+docs`

When the delimiter option is not specified and the site is not defined in the config, the delimiter defaults to a single whitespace character.

<pre><code>web typescript docs <em>--site duckduckgo.com</em> <em>--query=?q=</em></code></pre>

&gt; `https://duckduckgo.com/?q=typescript%20docs`

## `resource`

Overrides the default behavior of _searching_ a site by specifying the site's route to be accessed directly.

⚡ Takes a value.  
🛠️ Requires an `--site` option.  
⚙️ Allows configuration.

### Options

`--resource` `-r`

### Usage

This option must be used with the `--site` option.

- If the site is not specified, validation will fail and the web query will not be performed.

<pre><code>web <em>--resource=value</em> <em>--site=site</em></code></pre>

`value` is one of the following:

1. **_URL segment string._** For example

<pre><code>web <em>--resource teapot</em> <em>--site google.com</em></code></pre>

&gt; `https://google.com/teapot`

<pre><code>web <em>--resource path/to/resource</em> <em>--site example.com</em></code></pre>

&gt; `https://example.com/path/to/resource`

2. **_Resource key in the site's "resources" config._** For example, `test`, `bar`, `baz` or `example`

```yaml
example:
  url: example.com
  resources:
    test: path/to/resource
    foo:
      bar: "?foo=bar"
      baz: "?foo=baz"
    deeply:
      nested:
        example: deeply/nested/example/resource
```

> ⚠️ Using keys like `foo`, `deeply`, or `nested` that do not point to a string value is not valid.

### Command values

When supplying command values, each value is used in a separate web query as a URL path segment after the provided resource.

For example, the following creates 3 distinct web queries:

<pre><code>web typescript react @lexjs/web <em>--resource package</em> <em>--site npmjs.com</em></code></pre>

&gt; `https://npmjs.com/package/typescript`  
&gt; `https://npmjs.com/package/react`  
&gt; `https://npmjs.com/package/@lexjs/web`

### Combining resources

You can combine multiple resources together to create a single search query by using the `::` separator. Each resource can be either a key from the site's `resources` config or an arbitrary string.

Let's examine some scenarios using the following GitHub site config:

```yaml
github:
  url: github.com
  query: search?q=
  resources:
    profile: LexBorisoff
    tabs:
      repos: "?tab=repositories"
      projects: "?tab=projects"
      stars: "?tab=stars"
```

#### _Combining resource keys_

You can generate a URL that accesses a profile's repositories page:

<pre><code>web <em>--resource profile::repos</em> <em>--site github</em></code></pre>

&gt; `https://github.com/LexBorisoff?tab=repositories`

To use a string literally in situations where it has the same value as the resource key, you can escape it with a `/`:

<pre><code>web <em>--resource profile::/repos</em> <em>--site github</em></code></pre>

&gt; `https://github.com/LexBorisoff/repos`

In some shells, to escape the first resource key you also need to escape the forward slash:

<pre><code>web <em>--resource //profile::/repos</em> <em>--site github</em></code></pre>

&gt; `https://github.com/profile/repos`

#### _Combining a resource key with an arbitrary string_

You can generate a URL that accesses a profile's arbitrary repository:

<pre><code>web <em>--resource profile::web</em> <em>--site github</em></code></pre>

&gt; `https://github.com/LexBorisoff/web`

#### _Combining an arbitrary string with a resource key_

You can generate a URL that accesses a repositories page of an arbitrary profile:

<pre><code>web <em>--resource username::repos</em> <em>--site github</em></code></pre>

&gt; `https://github.com/username?tab=repositories`

#### _Combining arbitrary strings_

<pre><code>web <em>--resource LexBorisoff::web</em> <em>--site github</em></code></pre>

&gt; `https://github.com/LexBorisoff/web`

This scenario is essentially the same as providing a single resource value with `/`

<pre><code>web <em>--resource LexBorisoff/web</em> <em>--site github</em></code></pre>

&gt; `https://github.com/LexBorisoff/web`

#### _Combining more resources_

You can combine as many resources as you want and each one will be resolved to its:

- config value found by the provided resource key, or
- literal value if
  - the config does not contain the provided resource key, or
  - the resource key is escaped with a forward slash `/`.

## `port`

Adds the provided port number to the URL.

⚡ Requires a number value.  
❌ No configuration.

### Options

`--port` `-:`

### Usage

<pre><code>web <em>--port 3000</em> example.com</code></pre>

&gt; `https://example.com:3000/`

If multiple ports are supplied, each one will open a separate query:

<pre><code>web <em>-: 3000 -: 5000</em> example.com</code></pre>

&gt; `https://example.com:3000/`  
&gt; `https://example.com:5000/`

The CLI recognizes if a site or a URL already includes a port and checks if it matches the option's value when building the final list of URLs:

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

<pre><code>web <em>--browser chrome</em></code></pre>

> ⚠️ The command will not prevent you from specifying a value that refers to an invalid browser or to another non-browser application on your machine. Any value provided to the `browser` option is a possible browser app, so it will attempt to open it.

2. **_Browser key or alias in the config._** For example, `chrome`, `edge`, `e`, `firefox`, `f`, or `ff`

```yaml
chrome:

edge:
  alias: e

firefox:
  alias: [f, ff]
```

<pre><code>web <em>--browser ff</em></code></pre>

### Multiple options

You can specify multiple browsers:

<pre><code>web <em>--browser chrome</em> <em>--browser firefox</em> ...</code></pre>

### Configuration

Setting up browsers config allows using browser keys and aliases as the option's value and as [custom flags](#custom-flags).

## `profile`

Specifies what browser profile to use when opening a new browser tab.

⚡ Takes a value.  
⚙️ Allows configuration.

The option works only if the browser application supports profiles functionality. Otherwise, it has no effect on the opened search query. Some browsers (such as Chrome) have the functionality to create and use multiple browser profiles. When a browser has multiple profiles, it typically keeps the data used by each profile in a **_directory_** stored somewhere on your machine. For example, Chrome stores this information in `~/AppData/Local/Google/Chrome/User Data` on a Windows machine. Here, you can find profile directories such as "Profile 1", "Profile 2", etc. These are the names that you need to use with this option or assign to the `profiles` property in the config.

### Options

`--profile` `-p`

### Usage

This option relies on the provided `browser` option or the config:

- If the `browser` option is not provided, the CLI will use the config's **_default browser_**.
- If the `browser` option is not provided and there is no browser config, the query will not be opened.

<pre><code>web <em>--profile=value</em></code></pre>

`value` is one of the following:

1. **_Profile directory name._** For example `Profile 1`

<pre><code>web <em>--profile "Profile 1"</em></code></pre>

> For this scenario to work, make sure that you either provide the `--browser` option or define a browser in the config, for example:

```yaml
chrome:
```

> 💡 A browser definition in the config does not have any required properties.

2. **_Property key in the `profiles` object of the browser config._** For example, `dev` or `personal`

```yaml
chrome:
  profiles:
    dev: Profile 1
    personal:
      directory: Profile 2
```

<pre><code>web <em>--profile personal</em></code></pre>

3. **_Value of a profile's `alias` property._** For example, `d`, `p`, or `second`

```yaml
chrome:
  profiles:
    dev:
      directory: Profile 1
      alias: d
    personal:
      directory: Profile 2
      alias: [p, second]
```

<pre><code>web <em>--profile p</em></code></pre>

### Multiple options

You can specify multiple profiles:

<pre><code>web <em>--profile dev</em> <em>--profile personal</em> ...</code></pre>

### Configuration

Setting up browsers config allows using

- profile keys and aliases as the option's value
- profile keys and multi-letter aliases as custom flags (1-letter aliases cannot be used)

## `incognito`

Opens web queries in a private / incognito mode.

🚩 Flag option - no value is required.  
❌ No configuration.

### Options

`--incognito` `-i`

### Usage

<pre><code>web <em>--incognito</em></code></pre>

## Other Options

## `split`

Creates a separate web query for each value argument.

🚩 Flag option - no value is required.  
❌ No configuration.

### Options

`--split`

### Usage

<pre><code>web Object Symbol class <em>--site mdn</em> <em>--split</em></code></pre>

&gt; `https://developer.mozilla.org/search?q=Object`  
&gt; `https://developer.mozilla.org/search?q=Symbol`  
&gt; `https://developer.mozilla.org/search?q=class`

## `dry-run`

Prevents opening browser tabs and only displays the output.

🚩 Flag option - no value is required.  
❌ No configuration.

### Options

`--dry-run` `-n`

### Usage

<pre><code>web [values] [options] <em>--dry-run</em></code></pre>

## Custom Flags

When config is set up, certain keys and alias values automatically become _boolean options_. You can use these custom flags as substitutes for `site`, `browser`, and `profile` options.

For example, the following command with value options

<pre><code>web <em>--browser chrome --profile dev --site mdn</em></code></pre>

can be rewritten using custom flags:

<pre><code>web <em>--chrome --dev --mdn</em></code></pre>

> ⚠️ If a custom flag conflicts with a built-in [_option_](#options) or its alias, the built-in takes precedence.

### How custom flags are created

The following config items are used to create custom flags:

|         | keys | alias values | 1-letter alias values |
| ------- | :--: | :----------: | :-------------------: |
| site    |  ✅  |      ✅      |          ✅           |
| browser |  ✅  |      ✅      |          ✅           |
| profile |  ✅  |      ✅      |          ❌           |

### Custom site flags with ports

You can include a port number with custom site flags by appending it after a colon (`:`).

<pre><code>web <em>--google:3000</em></code></pre>

&gt; `https://google.com:3000`

> ⚠️ This technique does not work with short (1-letter) options

All other ports provided via `--port` (`-:`) will not be applied to that site.

<pre><code>web <em>--google:3000</em> --duck -: 4000 -: 5000</code></pre>

&gt; `https://google.com:3000`  
&gt; `https://duckduckgo.com:4000`  
&gt; `https://duckduckgo.com:5000`  
