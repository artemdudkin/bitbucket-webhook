const assert = require("assert");
const sinon = require("sinon");

const proxyquire = require("proxyquire");
const runScriptSpy = sinon.spy(runScriptStub);
const run = proxyquire('../js/index', {
  './rs': {
    runScript : runScriptSpy
  },
  'fs': {
    appendFileSync : function(a, b, c){
//      console.log("appendFileSync", a, b, c);
    }
  }
});

var xxx = 0;
function runScriptStub(command, opt) {
//console.log("runScript", xxx++, command, opt);
  if (command == './run' || command == 'run.bat') {
    if (opt && opt.onData) simpleLog.forEach(_=>opt.onData(_));
    return Promise.resolve({
      resultCode:0, 
      command,
      lines:simpleLog
    });
  } else if (command.startsWith('./d') || command.startsWith('d.bat')) {
    if (opt && opt.onData) deleteLog.forEach( _ => opt.onData(_));
    return Promise.resolve({
      resultCode:0, 
      command,
      lines:deleteLog
    });
  } else if (command.startsWith('./g') || command.startsWith('g.bat')) {
    if (opt && opt.onData) retryLog.forEach( _ => opt.onData(_));
    return Promise.resolve({
      resultCode:0, 
      command,
      lines:retryLog
    });
  } else {
    //what?
  }
}

const simpleLog = [
  "\nssh://git@192.168.1.1:3333/ufsmwp/aaa.git ----> http://user:123@194.67.209.1:3333/test/aaa.git\n",
  "Cloning into 'xxx'...\n",
  "remote: Counting objects: 3, done.        \nremote: Compressing objects:  50% (1/2)           \rremote: Compressing objects: 100% (2/2)           \rremote: Compressing objects: 100% (2/2), done.        \nremote: Total 3 (delta 0), reused 0 (delta 0)        \n",
  "Receiving objects:  33% (1/3)   \rReceiving objects:  66% (2/3)   \r",
  "Receiving objects: 100% (3/3)   \rReceiving objects: 100% (3/3), 8.75 KiB | 0 bytes/s, done.\n",
  "fatal: A branch named 'master' already exists.\n",
  "Everything up-to-date\n",

  "\nssh://git@192.168.1.1:3333/ufsmwp/docs.git ----> http://user:123@194.67.209.1:3333/test/docs.git\n",
  "Cloning into 'xxx'...\n",
  "remote: Counting objects: 3, done.        \nremote: Compressing objects:  50% (1/2)           \rremote: Compressing objects: 100% (2/2)           \rremote: Compressing objects: 100% (2/2), done.        \nremote: Total 3 (delta 0), reused 0 (delta 0)        \n",
  "Receiving objects:  33% (1/3)   \rReceiving objects:  66% (2/3)   \r",
  "Receiving objects: 100% (3/3)   \rReceiving objects: 100% (3/3), 8.75 KiB | 0 bytes/s, done.\n",
  "Branch 2018-I-StackTraceHashCode set up to track remote branch 2018-I-StackTraceHashCode from origin.\n",
  "fatal: A branch named 'release/2018-I' already exists.\n",
  "Branch sessionCookieCount set up to track remote branch sessionCookieCount from origin.\n",
  "Branch sessionNeedSave set up to track remote branch sessionNeedSave from origin.\n",
  "Branch simpleFlow set up to track remote branch simpleFlow from origin.\n",
  "Branch task-scheduler_unconditional-executor set up to track remote branch task-scheduler_unconditional-executor from origin.\n",
  "Branch ufsparams/rf-cache set up to track remote branch ufsparams/rf-cache from origin.\n",
  "Branch wildfly set up to track remote branch wildfly from origin.\n",
  "To http://194.67.209.146:3333/test/docs.git\n   9b33eb1c8..24c7bf05f  BSSS-771 -> BSSS-771\n   5791f2181..b423636ee  release/2018-I -> release/2018-I\n * [new branch]          UIS-464-s -> UIS-464-s\n",
  " * [new branch]          logger-and-audit-fixes -> logger-and-audit-fixes\n ! [rejected]            BSSS-773 -> BSSS-773 (fetch first)\n ! [rejected]            BSSS-799 -> BSSS-799 (fetch first)\n ! [rejected]            Feature/UFSSARBAC-598 -> Feature/UFSSARBAC-598 (fetch first)\n ! [rejected]            Feature/add-new-render-method -> Feature/add-new-render-method (fetch first)",
  "\n ! [rejected]            SquashConceptAsyncInit -> SquashConceptAsyncInit (fetch first)",
  ")\n ! [rejected]            nightlyBuildTests -> nightlyBuildTests (fetch first)\n",
  "\n ! [rejected]            bugfix/UFSMON-346 -> bugfix/UFSMON-346 (fetch first",
  "error: failed to push some refs to 'http://test-bh:1234567890@194.67.209.146:3333/test/docs.git'\nhint: Updates were rejected because the remote contains work that you do\nhint: not have locally. This is usually caused by another repository pushing\nhint: to the same ref. You may want to first integrate the remote changes\nhint: (e.g., 'git pull ...') before pushing again.\nhint: See the 'Note about fast-forwards' in 'git push --help' for details.\n",

  "\nssh://git@192.168.1.1:3333/ufsmwp/bbb.git ----> http://user:123@194.67.209.1:3333/test/bbb.git\n",
  "Cloning into 'xxx'...\n",
  "remote: Counting objects: 3, done.        \nremote: Compressing objects:  50% (1/2)           \rremote: Compressing objects: 100% (2/2)           \rremote: Compressing objects: 100% (2/2), done.        \nremote: Total 3 (delta 0), reused 0 (delta 0)        \n",
  "Receiving objects:  33% (1/3)   \rReceiving objects:  66% (2/3)   \r",
  "Receiving objects: 100% (3/3)   \rReceiving objects: 100% (3/3), 8.75 KiB | 0 bytes/s, done.\n",
  "Branch sessionCookieCount set up to track remote branch sessionCookieCount from origin.\n",
  "fatal: A branch named 'master' already exists.\n",
  "Branch sessionNeedSave set up to track remote branch sessionNeedSave from origin.\n",
  "To http://194.67.209.146:3333/test/bbb.git\n * [new branch]          nightlyBuildTests -> nightlyBuildTests\n ! [rejected]            BBB-773 -> BBB-773 (fetch first)\n ! [rejected]            BBB-799 -> BBB-799 (fetch first)\n",
  " ! [rejected]            Feature/add-some-new -> Feature/add-some-new (fetch first)\n ! [rejected]            XxxConcept -> XxxConcept (fetch first)\n ! [rejected]            bugfix/BBB-346 -> bugfix/BBB-346 (fetch first)\n",
  "error: failed to push some refs to 'http://test-bh:1234567890@194.67.209.146:3333/test/bbb.git'\nhint: Updates were rejected because the remote contains work that you do\nhint: not have locally. This is usually caused by another repository pushing\nhint: to the same ref. You may want to first integrate the remote changes\nhint: (e.g., 'git pull ...') before pushing again.\nhint: See the 'Note about fast-forwards' in 'git push --help' for details.\n",
  "EXIT 0"
];

const deleteLog = [
  "\nssh://git@192.168.1.1:3333/ufsmwp/bbb.git ----> http://user:123@194.67.209.1:3333/test/bbb.git\n",
  "Cloning into 'yyy'...\n",
  "remote: Counting objects: 3, done.        \nremote: Compressing objects:  50% (1/2)           \rremote: Compressing objects: 100% (2/2)           \rremote: Compressing objects: 100% (2/2), done.        \nremote: Total 3 (delta 0), reused 0 (delta 0)        \n",
  "Receiving objects:  33% (1/3)   \rReceiving objects:  66% (2/3)   \r",
  "Receiving objects: 100% (3/3)   \rReceiving objects: 100% (3/3), 8.75 KiB | 0 bytes/s, done.\n",
  "Branch sessionCookieCount set up to track remote branch sessionCookieCount from origin.\n",
  "fatal: A branch named 'master' already exists.\n",
  "Branch sessionNeedSave set up to track remote branch sessionNeedSave from origin.\n",
  "To http://194.67.209.146:3333/test/bbb.git\n - [deleted]             someBranch",
  "\n",
  "EXIT 0"
]

const retryLog = [
  "\nssh://git@192.168.1.1:3333/ufsmwp/docs.git ----> http://user:123@194.67.209.1:3333/test/docs.git\n",
  "Cloning into 'xxx'...\n",
  "remote: Counting objects: 3, done.        \nremote: Compressing objects:  50% (1/2)           \rremote: Compressing objects: 100% (2/2)           \rremote: Compressing objects: 100% (2/2), done.        \nremote: Total 3 (delta 0), reused 0 (delta 0)        \n",
  "Receiving objects:  33% (1/3)   \rReceiving objects:  66% (2/3)   \r",
  "Receiving objects: 100% (3/3)   \rReceiving objects: 100% (3/3), 8.75 KiB | 0 bytes/s, done.\n",
  "To http://194.67.209.146:3333/test/docs.git\n  * [new branch]            BSSS-773 -> BSSS-773 (fetch first)\n * [new branch]            BSSS-799 -> BSSS-799 (fetch first)\n * [new branch]            Feature/UFSSARBAC-598 -> Feature/UFSSARBAC-598 (fetch first)\n * [new branch]            Feature/add-new-render-method -> Feature/add-new-render-method\n",
  "\n * [new branch]            SquashConceptAsyncInit -> SquashConceptAsyncInit\n",
  "\n * [new branch]            nightlyBuildTests -> nightlyBuildTests\n",
  "\n * [new branch]            bugfix/UFSMON-346 -> bugfix/UFSMON-346\n",
  " ! [rejected]            Feature/add-new-render-method -> Feature/add-new-render-method (fetch first)",
  "\n",
  "EXIT 0"
]
  
describe('index', function(){

  beforeEach(function(){
    sinon.stub(process, "chdir");
    sinon.spy(console, "log");
  })

  afterEach(function(){
    process.chdir.restore();
    console.log.restore();
  })  

  it('simple case', ()=> {
    const SCRIPT_RUN = (process.platform=='win32' ? 'run.bat' : './run')
    const SCRIPT_D   = (process.platform=='win32' ? 'd.bat'   : './d')
    const SCRIPT_G   = (process.platform=='win32' ? 'g.bat'   : './g')

    return run().then(res => {

      assert.ok(process.chdir.calledOnce);

      assert.equal(runScriptSpy.callCount, 15);
      assert.equal( runScriptSpy.getCall(0).args[0], SCRIPT_RUN);
      assert.equal( runScriptSpy.getCall(1).args[0], SCRIPT_D+' http://user:123@194.67.209.1:3333/test/docs.git BSSS-773');
      assert.equal( runScriptSpy.getCall(2).args[0], SCRIPT_D+' http://user:123@194.67.209.1:3333/test/docs.git BSSS-799');
      assert.equal( runScriptSpy.getCall(3).args[0], SCRIPT_D+' http://user:123@194.67.209.1:3333/test/docs.git Feature/UFSSARBAC-598');
      assert.equal( runScriptSpy.getCall(4).args[0], SCRIPT_D+' http://user:123@194.67.209.1:3333/test/docs.git Feature/add-new-render-method');
      assert.equal( runScriptSpy.getCall(5).args[0], SCRIPT_D+' http://user:123@194.67.209.1:3333/test/docs.git SquashConceptAsyncInit');
      assert.equal( runScriptSpy.getCall(6).args[0], SCRIPT_D+' http://user:123@194.67.209.1:3333/test/docs.git nightlyBuildTests');
      assert.equal( runScriptSpy.getCall(7).args[0], SCRIPT_D+' http://user:123@194.67.209.1:3333/test/docs.git bugfix/UFSMON-346');
      assert.equal( runScriptSpy.getCall(8).args[0], SCRIPT_G+' ssh://git@192.168.1.1:3333/ufsmwp/docs.git http://user:123@194.67.209.1:3333/test/docs.git');
      assert.equal( runScriptSpy.getCall(9).args[0], SCRIPT_D+' http://user:123@194.67.209.1:3333/test/bbb.git BBB-773');
      assert.equal( runScriptSpy.getCall(10).args[0], SCRIPT_D+' http://user:123@194.67.209.1:3333/test/bbb.git BBB-799');
      assert.equal( runScriptSpy.getCall(11).args[0], SCRIPT_D+' http://user:123@194.67.209.1:3333/test/bbb.git Feature/add-some-new');
      assert.equal( runScriptSpy.getCall(12).args[0], SCRIPT_D+' http://user:123@194.67.209.1:3333/test/bbb.git XxxConcept');
      assert.equal( runScriptSpy.getCall(13).args[0], SCRIPT_D+' http://user:123@194.67.209.1:3333/test/bbb.git bugfix/BBB-346');
      assert.equal( runScriptSpy.getCall(14).args[0], SCRIPT_G+' ssh://git@192.168.1.1:3333/ufsmwp/bbb.git http://user:123@194.67.209.1:3333/test/bbb.git');

      //should show rejected branches after retry 
      assert.deepEqual( console.log.getCall(31).args, [ '       [rejected]', 'Feature/add-new-render-method' ]);
      assert.deepEqual( console.log.getCall(44).args, [ '       [rejected]', 'Feature/add-new-render-method' ]);
//      var cc = console.log.callCount; for (var i =0; i<cc; i++) console.log( i, console.log.getCall(i).args);
    });
  })

})
