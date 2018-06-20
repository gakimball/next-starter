# Next.js Starter

Proof-of-concept that layers the feature's of Ueno's [starter kit](https://github.com/ueno-llc/starter-kit-universally) on top of [Next.js](https://github.com/zeit/next.js).

Includes all the things you get from Next out of the box, including:

- Server-side rendering
- Universal Webpack
- Babel
- Hot reloading
- Code splitting
- Static site export
- Isomorphic project config

Also includes more helpful things on top:

- Express with good security defaults
- Sass and CSS Modules
- MobX
- react-helmet
- Service workers
- Password protection
- Google, Facebook, and Twitter analytics
- Remote development

Critically, all the moving parts are contained inside a small handful of modules and scripts. This means the complexity of the build system is hidden away, and a project is more easily upgradeable, because the guts of the framework aren't in the main codebase, where they'd be checked into version control.

## Installation

It's not on npm yet, but you can install it from GitHub:

```
npm i gakimball/next-starter next react react-dom --save
```

## Documentation

[Read the documentation](https://gakimball.github.io/next-starter)

# License

MIT &copy; [Geoff Kimball](http://geoffkimball.com)
