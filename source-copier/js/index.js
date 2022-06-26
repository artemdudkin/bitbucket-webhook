const fs = require('fs');
const runScript = require('./rs').runScript;
const Parser = require('./parser')
const utils = require('./utils');

const SCRIPT_RUN = (process.platform=='win32' ? 'run.bat' : './run')
const SCRIPT_D   = (process.platform=='win32' ? 'd.bat'   : './d')
const SCRIPT_G   = (process.platform=='win32' ? 'g.bat'   : './g')

let log_file_name = '../_log';

var repos_with_rejected_branches = [];

function run(fn) {
  if (fn) log_file_name = fn;

  const p = new Parser();
  repos_with_rejected_branches.length = 0;

  process.chdir('./sh');

  let agg;
  return runScript(SCRIPT_RUN, {onData:(s) => {
      p.add_new_string_and_try_aggregate(s, log_if_branch_was_rejected_and_remember);
  }})
  .then(res => {
    agg = p.do_aggregate(log_if_branch_was_rejected_and_remember); //please do not loose info about last block
    log('\n\n\n\n\n\n\n\n\n\n+++++++\n'+(''+new Date())+' '+JSON.stringify(res, null, 2));
    return agg;
  })
  .catch(res => {
    agg = p.do_aggregate(log_if_branch_was_rejected_and_remember); //please do not loose info about last block
    return log('\n\n\n\n\n\n\n\n\n\n-------\n'+(''+new Date()) + ' '+JSON.stringify(res, null, 2));
    return agg;
  })
  .then( () =>{
    //deal with repos with rejected branches
    if (repos_with_rejected_branches.length) {
      return delete_rejected_branches_and_copy_again(repos_with_rejected_branches);
    }
  })
  .then( () =>{
    return agg;
  });
}


function log_if_branch_was_rejected_and_remember(opt){
  repos_with_rejected_branches.push(opt);
  opt.rejected.forEach(_=>utils.log('       [rejected]', _));
}


function delete_rejected_branches_and_copy_again(rejectedRepoList){
    //deal with rejected branches
    if (rejectedRepoList && rejectedRepoList.length) {
      var d = Promise.resolve();
  
      for (var j=0; j<rejectedRepoList.length; j++) {
        
        var opt = rejectedRepoList[j];
        for (var i=0; i<opt.rejected.length; i++) {
          //delete all rejected branches
          d = delete_rejected_branch(opt.rejected[i], opt.to, d);
        }
  
        //run copying again
        d = retry_copy_repo(opt.from, opt.to, d);
      }
      return d;
    }
}

function delete_rejected_branch(branch, repo, promise){
  return promise
    .then(res=>{
      utils.log('*deleting', branch, 'from', repo);
      return runScript(SCRIPT_D + ' '+repo+' '+branch);
    })
    .then(res=>{
      var ok = !!res.lines.filter(_=>{return _.indexOf('[deleted]')!=-1})[0];
      utils.log(ok?' ok':' failed');
      return log('\n'+(''+new Date()) + ' '+JSON.stringify(res, null, 2));
    })
    .catch(res=>{
      return log('\n'+(''+new Date()) + ' '+JSON.stringify(res, null, 2));
    })
}

function retry_copy_repo(original_repo, dest_repo, promise){

  return promise.then(res=>{
    utils.log("*retry");
    return runScript(SCRIPT_G + ' '+original_repo+' '+dest_repo);
  })
  .then(res=>{
    const agg = Parser.prototype.do_aggregate.call(undefined, undefined, res.lines);
    agg.rejected.forEach(_=>utils.log('       [rejected]', _));
    return log('\n'+(''+new Date()) + ' '+JSON.stringify(res, null, 2));
  })
  .catch(res=>{
    return log('\n'+(''+new Date()) + ' '+JSON.stringify(res, null, 2));
  })
}


function log(msg) {
  fs.appendFileSync(log_file_name, msg);
}



module.exports = run;