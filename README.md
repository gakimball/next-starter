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

**Still a work in progress; doesn't work as a library yet.** Use `npm run dev` to run the example app.

## File Structure

This is the bare minimum you need for the boilerplate to work:

```
- pages
  - _document.js
  - index.js
package.json
```

## Shell Commands

These commands are wrappers for the Next.js shell commands, with some extra stuff sprinkled in.

- `ueno-starter dev`: run app in development mode.
  - `ueno-starter dev --remote`: run app in development mode, and allow the server to be accessed over the internet.
- `ueno-starter build`: build app for production. Run this before deploying to a server.
- `ueno-starter start`: run app in production mode.
- `ueno-starter export`: export static version of app.

## Documentation

[Read the documentation](ueno-starter/docs/)

# License

MIT &copy; [Geoff Kimball](http://geoffkimball.com)
