# Steeplejack Express

[![Gitter][gitter-image]][gitter-url]
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Dependencies][dependencies-image]][dependencies-url]
[![Dev Depedencies][dev-dependencies-image]][dev-dependencies-url]

[Express](http://expressjs.com) strategy for [Steeplejack](http://steeplejack.info)

# Usage

In your main [Steeplejack](http://steeplejack.info) `run` method, you will need to configure your Express strategy like
this...

```
import {Express} from "steeplejack-express";
import {Server} from "steeplejack/lib/server";

app.run($config => {
    const server = new Server($config.server, new Express());
    
    return server;
});
```

You can also import `expressLib` from the package, which is the result of `require("express");`.

This is the minimal config. The `Express` constructor accepts an optional object that defines the `ssl`. This is to be
used if you want to configure your server to publish over HTTPS.  This object is the options that can be set on the
[HTTPS options](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener).

# License

MIT License

[npm-image]: https://img.shields.io/npm/v/steeplejack-express.svg?style=flat
[downloads-image]: https://img.shields.io/npm/dm/steeplejack-express.svg?style=flat
[node-version-image]: https://img.shields.io/badge/node.js-%3E%3D_0.10-brightgreen.svg?style=flat
[travis-image]: https://img.shields.io/travis/riggerthegeek/steeplejack-express.svg?style=flat
[dependencies-image]: https://img.shields.io/david/riggerthegeek/steeplejack-express.svg?style=flat
[dev-dependencies-image]: https://img.shields.io/david/dev/riggerthegeek/steeplejack-express.svg?style=flat
[gitter-image]: https://img.shields.io/badge/GITTER-JOIN%20CHAT%20%E2%86%92-1DCE73.svg?style=flat

[npm-url]: https://npmjs.org/package/steeplejack-express
[node-version-url]: http://nodejs.org/download/
[travis-url]: https://travis-ci.org/riggerthegeek/steeplejack-express
[downloads-url]: https://npmjs.org/package/steeplejack-express
[dependencies-url]: https://david-dm.org/riggerthegeek/steeplejack-express
[dev-dependencies-url]: https://david-dm.org/riggerthegeek/steeplejack-express#info=devDependencies&view=table
[gitter-url]: https://gitter.im/riggerthegeek/steeplejack?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge
