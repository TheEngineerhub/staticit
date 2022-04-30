<p align="center">
  <img src="https://storage.googleapis.com/engineerhub-static/staticit-transparent.png" alt="Static-it" height="250" width="auto" />
</p>
<p align="center">
  <a href="https://ci.engineerhub.app/TheEngineerhub/staticit" target="_blank">
    <img src="https://ci.engineerhub.app/api/badges/TheEngineerhub/staticit/status.svg" />
  </a>
  <a href="https://github.com/TheEngineerhub/staticit/issues" target="_blank">
    <img src="https://img.shields.io/github/issues/TheEngineerhub/staticit" />
  </a>
  <a href="https://github.com/TheEngineerhub/staticit/blob/main/LICENSE.md" target="_blank">
    <img src="https://img.shields.io/github/license/TheEngineerhub/staticit" />
  </a>
</p>

#

### Staticit - Introduction

Whether you want to increase performance or improve SEO of your web application. You have generally 2 options, use **SSR** (Server Side Rendering) or **SSG** (Static Site Generation). SSR can be cumbersome and you will need an actual server with lots of configurations depending of your application.

SSG is relatively simple and a good alternative. Some frameworks has this feature out of the box some are not, some are bloat and you will want a simpler solution. **Here comes the Staticit!**.

Staticit is a improved version of a small library called [react-spa-prerender](https://github.com/sPavl0v/react-spa-prenderer). Under the hood it uses [sifrr](https://sifrr.github.io/sifrr/#/) and [puppeteer](https://github.com/puppeteer/puppeteer) to generate static files.

It will work with any build tool since it's independent and with any frontend framework that supports routing.

> How it works?

- Serves the web application from build directory with **sifrr**.
- Renders desired routes with **puppeteer**.
- Reformats all generated HTML files with **prettier** so they'll be pretty 🥰.

#

### Install

- With npm:

```sh
$ npm install -D staticit
```

- With yarn:

```sh
$ yarn add --dev staticit
```

- With pnpm:

```sh
$ pnpm install -D staticit
```

#

### Usage

Create a file called [`.staticit.json`](.staticit.json) in your projects root directory. For minimal configuration add the following lines.

```json
{
  "routes": ["/", "/about"],
  "outDir": "./dist",
  "port": 8080,
  "puppeteer": {
    "launchOpts": {
      "args": ["--no-sandbox"]
    }
  }
}
```

> <img src="https://storage.googleapis.com/engineerhub-static/exclamation-yellow.png" height="15" width="auto" /> - If you are going to build your application in an automated environment, for example with a CI tool. You should pass the `--no-sandbox` flag to `puppeteer: launchOpts.` or you might get errors since most of them are running inside of a container with root user.

--

The options are self explanatory.

| Option                 | Default  | Description                                                                 |
| ---------------------- | -------- | --------------------------------------------------------------------------- |
| routes                 | `[]`     | Array of routes that you want to pre-render & generate static files.        |
| outDir                 | `./dist` | Relative path to the build directory of your application.                   |
| port                   | `8080`   | Port where static server will listen and generate the static files.         |
| puppeteer: launchOpts  | `{}`     | Generic launch options that can be passed when launching puppeteer browser. |
| puppeteer: waitForOpts | `{}`     | Timeout options for puppeteer browser                                       |

#

### Examples

- [React Example](https://github.com/TheEngineerhub/staticit/tree/main/examples/react)
- Vue Example <kbd>Coming soon.</kbd>

#

### License

This repository is licensed under the [MIT](LICENSE.md) License.
