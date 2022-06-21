const fs = require('fs');
const http = require('http');
const path = require('path');
const express = require('express');
const serveStatic = require('serve-static');
const compression = require('compression');
const _get = require('lodash.get');
const CronJob = require('cron').CronJob;
const storage = require('./data.storage.file');
const eventList = storage.load('eventList');
//console.log('eventList', eventList);
const run = require('./source-copier/js/index');
const utils = require('./source-copier/js/utils');


const SERVER_PORT = 8096;
const GIT_SOURCE = 'ssh://git@bitbucket.xxx.com:7999/';
const GIT_TARGET = 'git@gitlab.yyy.com:mirror/';

console.log('cwd dir == ' + process.cwd());
console.log("config dir == ", __dirname);
console.log('port == ' + SERVER_PORT);
console.log('git source == ' + GIT_SOURCE);
console.log('git target == ' + GIT_TARGET);


(new CronJob('*/5 * * * * *', startEvent)).start();


var app = express();

app.use(compression());

//static files
app.use(serveStatic('./html'));

// log request details
app.use(function(req, res, next) {
  console.log('<<', req.protocol + '://' + req.get('host') + req.originalUrl);
  next();
})

// get request body
app.use (function(req, res, next) {
    var data='';
    req.setEncoding('utf8');
    req.on('data', chunk => data += chunk);
    req.on('end', function() {
      //convert req.body to json
      if (data) {
        try { 
          req.body = JSON.parse(data);
          console.log('<< body', JSON.stringify(req.body, null, 4));
        } catch(e) {
          req.body = data
          console.log('<< cannot parse body', req.body);
        }
      } else {
        req.body = {}
      }

      next();
    });              
});


app.all('/hook', function(req, res, next) {
  console.log('>>ok');
  res.end();

  let name = _get(req.body, "actor.name");
  let date = _get(req.body, "date");
  let repo_name = _get(req.body, "repository.name");
  let repo_project = _get(req.body, "repository.project.key");
  let changes_count = _get(req.body, "changes", []).length ;
  let change_ref = _get(req.body, "changes[0].ref.id");
  let change_from = _get(req.body, "changes[0].fromHash");
  let change_to = _get(req.body, "changes[0].toHash");

  console.log({name, date, repo_name, repo_project, changes_count, change_ref, change_from, change_to });

  eventList.data.push({id:eventList.length, ts: Date.now(), status:"pending", name, date, repo_name, repo_project, changes_count, change_ref, change_from, change_to });
  storage.forceSave('eventList');
});


var started;
function startEvent() {
  const stime = Date.now();

  if (started) {
    console.log("waiting, cannot start");
    return;
  }

  started = true;
  try {
    let id;
    for (let i=0; i<eventList.data.length && typeof id === "undefined"; i++) {
      if (eventList.data[i].status === "pending") id=i;
    }
    if (typeof id !== "undefined") {
      const repo_project = eventList.data[id].repo_project;
      const repo_name = eventList.data[id].repo_name;

      const summaryFn = path.join(__dirname, 'data', id+'.summary.json');
      fs.writeFileSync(summaryFn, '');
      utils.setLoggerFunc(function() {
        console.log.apply(this, [...arguments]);
        fs.appendFileSync(summaryFn, [...arguments].join(" "));
      })

      fs.writeFileSync(path.join(__dirname, 'source-copier', 'sh', '_cfg'), `${GIT_SOURCE}${repo_project}/${repo_name}.git ${GIT_TARGET}${repo_project}/${repo_name}.git\n`);
      process.chdir(path.join(__dirname, 'source-copier'));
      run( path.join(__dirname, 'data', id+'.log.json') )
      .then( () => {
        eventList.data[id].status = "ok";
	eventList.data[id].duration = Date.now() - stime;
//        return new Promise((resolve, reject) => setTimeout(()=>resolve(), 7000))
      })
      .catch( err => {
        console.log('ERROR', err);
        eventList.data[id].status = "error";
      })
      .then( () => {
        process.chdir(path.join(__dirname));
        console.log('--', "done ["+ (Date.now()-stime) +" ms]");
        storage.forceSave('eventList');
        started = false;
      })
    } else {
//      console.log('no data');
      started = false;
    }
  } catch (e) {
    console.log("RUN ERROR", e);
  }
}


app.all('/eventList', function(req, res, next) {
//console.log(eventList.data);
  res.end(JSON.stringify(eventList.data));
})

app.all('/event', function(req, res, next) {
  const id = req.body.id;
  if (id) {
    let summary = "";
    let details = "";
    try {
      summary = fs.readFileSync(path.join(__dirname, 'data', id+'.summary.json'));
    } catch (e) {
      console.log("ERROR", e);
    }
    try {
      details = fs.readFileSync(path.join(__dirname, 'data', id+'.log.json') );
    } catch (e) {
      console.log("ERROR", e);
    }
    res.end('SUMMARY\n\n' + summary + '\n\n\nDETAILS\n\n' + details.toString().replace(/^(?:[\t ]*(?:\r?\n|\r))+/));
  } else {
    res.status(404).end();
  }
})



http.createServer(app).listen(SERVER_PORT);
