# connect-four-localhost

## Summary

A simple 2-player multiplayer connect 4 game using websockets

## Technology Stack

1. Node.js
1. Express
1. ReactJS
1. SocketIO

## How to setup

1. start the server:

```
cd server
npm start
```

2. start the client:

```
cd server
npm start
```

3. open **two** browsers to:

```
http://localhost:3000/
```

4. one player creates a new game, the other joins using the same game ID

5. play game!

## Enhancements

-   Altering the use of game IDs to the use of socket.io rooms
-   Upload game to Heroku.
    -   Unfortunately using TypeScript and the way the repository was organized lead to difficulties in successfully posting to Heroku.
