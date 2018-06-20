# Sass

The starter kit uses Sass, compiled to PostCSS, compiled to CSS, converted to CSS Modules.

```scss
.button {
  // ...
}
```

```js
import React from 'react';
import s from './Button.scss';

export default ({ children, onClick }) => (
  <button className={s.button} type="button" onClick={onClick}>
    {children}
  </button>
);
```

You can also call `s` as a function to make use of the [classnames](https://npmjs.org/package/classnames) library.

```js
import React from 'react';
import s from './Button.scss';

export default ({ children, onClick, disabled }) => (
  <button className={s('button', { disabled })} type="button" onClick={onClick}>
    {children}
  </button>
);
```
