# bitbucket-webhook

Proof-of-concept app to that catches webhook from bitbucket and updates remote repo (Linux/Windows).

## Installation and usage

 * Preliminary: Copy repo to remote repo (look at readme of source-copier if you have a lot of them)
 * Preliminary: Download project and copy it to server.
 * Preliminary: `npm i`
 * `node server.js` (or you can use PM2 process manager `pm2 start server.js --name hook`)
 * Add webhook for Bitbucket (i.e. add webhook url `http://<server>:8096/hook`)

## Configuration
`SERVER_PORT`
`GIT_SOURCE`
`GIT_TARGET`

## API

### POST /hook
Url for bitbucket webhook activity

### GET /eventList
Returns list of "webhook fired" cases

### POST /event {id:XXX}
Returns output of shell script for selected "webhook fired" case

## Web interface

| /  | /?id=XXX |
| ------------- | ------------- |
| <img src="https://raw.githubusercontent.com/artemdudkin/bitbucket-webhook/main/docs/index.png" width="400">  | <img src="https://raw.githubusercontent.com/artemdudkin/bitbucket-webhook/main/docs/event.png" width="400">  |

## Troubleshooting
If you've got `"ERROR Error: spawn ./run EACCES"` at Linux, then check executability of `source-copier/sh/run` script (also as `g` and `d`) and run `chmod +x run` if neened.
