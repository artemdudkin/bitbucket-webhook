# bitbucket-webhook

Proof-of-concept app to that catches webhook from bitbucket and updates remote repo.

## Installation and usage

 * Copy repo to remote repo (look at readme of source-copier if you have a lot of them)
 * Download project and copy it to server.
 * `npm i`
 * `node server.js` (or you can use PM2 process manager `pm2 start server.js --name hook`)
 * Add webhook for Bitbucket (i.e. add webhook url `http://<server>:8096/hook`)

## Configuration
`SERVER_PORT`
`GIT_SOURCE`
`GIT_TARGET`

## How it looks like

| /  | /?id=XXX |
| ------------- | ------------- |
| <img src="https://raw.githubusercontent.com/artemdudkin/bitbucket-webhook/main/docs/index.png" width="300">  | <img src="https://raw.githubusercontent.com/artemdudkin/bitbucket-webhook/main/docs/event.png" width="300">  |
