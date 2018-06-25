# Working Server-Side

The starter kit includes an Express server with a bunch of helpful middleware installed, including:

- Content Security Policy
- HTTPS enforcement in production (optional)
- Basic Auth (optional)
- Gzip compression
- Service workers (optional)

To extend the default server, create a file `server/index.js` and add this:

```js
import server from 'next-starter/server';
import graphql from 'express-graphql';

server(app => {
  // app is the Express server
  app.use(graphql());
});
```

You can add new middleware or routes inside the callback. Calling `server()` is also what starts the server.

Whenever you make changes to the server, it will automatically restart.
