# Setup

## Installation

It's not on npm yet, but you can install it from GitHub:

```
npm i gakimball/next-starter next react react-dom --save
```

## File Structure

This is the bare minimum you need for the boilerplate to work:

```
- pages
  - _document.js
  - index.js
.babelrc
package.json
```

## `index.js`

Add your first page:

```js
import React from 'react';

export default () => <h1>Hello.</h1>
```

## `_document.js`

Add the starter kit's custom server HTML. This is necessary to make some of the internals of the starter kit go, like CSS, react-helmet, analytics, and more.

```js
export { default } from '@ueno/starter/document';
```

## `.babelrc`

The starter kit's Babel config adds decorator support.

```json
{
  "presets": ["next/babel", "@ueno/starter/babel"]
}
```

## Commands

Use `ueno-starter dev` to run the development server. You can view your app at `localhost:3000`.
