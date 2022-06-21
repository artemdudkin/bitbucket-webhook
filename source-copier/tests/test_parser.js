const assert = require("assert");
const sinon = require("sinon");
const Parser = require("../js/parser");

const simpleLog = [
"\nssh://git@192.168.1.1:3333/ufsmwp/docs.git ----> http://user:123@194.67.209.1:3333/test/docs.git\n",
"Cloning into 'xxx'...\n",
"remote: Counting objects: 3, done.        \nremote: Compressing objects:  50% (1/2)           \rremote: Compressing objects: 100% (2/2)           \rremote: Compressing objects: 100% (2/2), done.        \nremote: Total 3 (delta 0), reused 0 (delta 0)        \n",
"Receiving objects:  33% (1/3)   \rReceiving objects:  66% (2/3)   \r",
"Receiving objects: 100% (3/3)   \rReceiving objects: 100% (3/3), 8.75 KiB | 0 bytes/s, done.\n",
"fatal: A branch named 'master' already exists.\n",
"Everything up-to-date\n"
];

const rejectedLog = [
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
  "error: failed to push some refs to 'http://test-bh:1234567890@194.67.209.146:3333/test-bh/ufs-platform.git'\nhint: Updates were rejected because the remote contains work that you do\nhint: not have locally. This is usually caused by another repository pushing\nhint: to the same ref. You may want to first integrate the remote changes\nhint: (e.g., 'git pull ...') before pushing again.\nhint: See the 'Note about fast-forwards' in 'git push --help' for details.\n"
]  

const unableToAccessDestinationLog = [
    "\r\nssh://git@192.168.1.1:3333/test/xxx.git ----> http://user:123@194.67.209.1:3333/test/xxx.git\r\n",
    "Cloning into 'xxx'...\n",
    "remote: Counting objects: 128, done.        \n\rremote: Compressing objects: 100% (109/109), done.        \n",
    "remote: Total 128 (delta 51), reused 0 (delta 0)        \n",
    "Receiving objects: 100% (128/128), 33.85 KiB | 4.84 MiB/s, done.\n",
    "Resolving deltas: 100% (51/51), done.\n",
    "Branch develop set up to track remote branch develop from origin.\n",
    "fatal: A branch named 'master' already exists.\n",
    "fatal: unable to access 'http://user:123@194.67.209.1:3333/test/xxx.git/': The requested URL returned error: 503\n",
    "EXIT 0"
]

const unableToAccessDestinationLog2 = [
    "ssh://git@192.168.1.1:3333/test/xxx.git ----> http://user:123@194.67.209.1:3333/test/xxx.git\r\n",
    "Cloning into 'xxx'...\n",
    "warning: You appear to have cloned an empty repository.\n",
    "remote: invalid credentials\nfatal: Authentication failed for 'user:123@194.67.209.1:3333/test/xxx.git/'\n",
    "EXIT 0"
]

const noSourceRepoLog = [
    "\r\nssh://git@192.168.1.1:3333/test/yyy.git ----> http://user:123@194.67.209.1:3333/test/yyy.git\r\n",
    "Cloning into 'yyy'...\n",
    "fatal: repository 'ssh://git@192.168.1.1:3333/test/yyy.git/' not found\n",
    "Системе не удается найти указанный путь.\n",
    "fatal: A branch named 'master' already exists.\n",
    "fatal: remote copy already exists.\n",
    "fatal: '123' does not appear to be a git repository\n",
    "fatal: Could not read from remote repository.\n"
]

const noDestinationRepoLog = [
    "ssh://git@192.168.1.1:3333/test/zzz.git ----> http://user:123@194.67.209.1:3333/test/zzz.git\r\n",
    "Cloning into 'xxx'...\n",
    "remote: Counting objects: 84, done.",
    "remote: Total 84 (delta 38), reused 0 (delta 0)   \rReceiving objects: 100% (84/84), 176.09 KiB | 16.01 MiB/s, done.\n",
    "Resolving deltas: 100% (38/38), done.\n",
    "Branch dev set up to track remote branch dev from origin.\n",
    "Branch feature/locales set up to track remote branch feature/locales from origin.\n",
    "fatal: A branch named 'master' already exists.\n",
    "Branch proposal set up to track remote branch proposal from origin.\n",
    "Branch release/1.0 set up to track remote branch release/1.0 from origin.\n",
    "fatal: repository 'http://user:123@194.67.209.1:3333/test/zzz.git/' not found\n",
    "EXIT 0"
]


describe('parser', function(){

  beforeEach(function(){
    sinon.spy(console, "log");
  })

  afterEach(function(){
    console.log.restore();
  })




  it('should be not ok', ()=> {
    var p = new Parser();
    p.add_new_string_and_try_aggregate('123\n');
    p.add_new_string_and_try_aggregate('abc\n');
    var cb = sinon.spy();
    const agg = p.do_aggregate(cb);

    assert.ok(cb.notCalled);

    assert.ok(console.log.notCalled);

    assert.deepEqual( agg, {
      "ok": false,
      "changed": "0u",
      "main_branch": "-",
      "rejected": [],
      "from": "",      
      "to": ""
    });
  })  



  it('no source repo', ()=> {
    var p = new Parser();
    for (var i in noSourceRepoLog) p.add_new_string_and_try_aggregate(noSourceRepoLog[i]);
    var cb = sinon.spy();
    const agg = p.do_aggregate(cb);

    assert.ok(cb.notCalled);

    assert.ok(console.log.calledOnce);

    assert.deepEqual(console.log.getCall(0).args, [
        "    x", 
        "master",
        "ssh://git@192.168.1.1:3333/test/yyy.git", 
        "---->", 
        "http://user:123@194.67.209.1:3333/test/yyy.git"]
    );

    assert.deepEqual( agg, {
      "ok": true,
      "changed": "x",
      "main_branch": "master",
      "rejected": [],
      "from": "ssh://git@192.168.1.1:3333/test/yyy.git",
      "to": "http://user:123@194.67.209.1:3333/test/yyy.git"
    });
  })  



  it('no destination repo', ()=> {
    var p = new Parser();
    for (var i in noDestinationRepoLog) p.add_new_string_and_try_aggregate(noDestinationRepoLog[i]);
    var cb = sinon.spy();
    const agg = p.do_aggregate(cb);

    assert.ok(cb.notCalled);

    assert.ok(console.log.calledOnce);

    assert.deepEqual(console.log.getCall(0).args, [
        "    ?", 
        "master",
        "ssh://git@192.168.1.1:3333/test/zzz.git", 
        "---->", 
        "http://user:123@194.67.209.1:3333/test/zzz.git"]
    );

    assert.deepEqual( agg, {
      "ok": true,
      "changed": "?",
      "main_branch": "master",
      "rejected": [],
      "from": "ssh://git@192.168.1.1:3333/test/zzz.git",
      "to": "http://user:123@194.67.209.1:3333/test/zzz.git"
    });
  })  




  it('unable to access destination repo 1', ()=> {
    var p = new Parser();
    for (var i in unableToAccessDestinationLog) p.add_new_string_and_try_aggregate(unableToAccessDestinationLog[i]);
    var cb = sinon.spy();
    const agg = p.do_aggregate(cb);

    assert.ok(cb.notCalled);

    assert.ok(console.log.calledOnce);

    assert.deepEqual(console.log.getCall(0).args, [
        "    ?", 
        "master", 
        "ssh://git@192.168.1.1:3333/test/xxx.git", 
        "---->", 
        "http://user:123@194.67.209.1:3333/test/xxx.git"]
    );

    assert.deepEqual( agg, {
      "ok": true,
      "changed": "?",
      "main_branch": "master",
      "rejected": [],
      "from": "ssh://git@192.168.1.1:3333/test/xxx.git",
      "to": "http://user:123@194.67.209.1:3333/test/xxx.git"
    });
  })  




  it('unable to access destination repo 2', ()=> {
    var p = new Parser();
    for (var i in unableToAccessDestinationLog2) p.add_new_string_and_try_aggregate(unableToAccessDestinationLog2[i]);
    var cb = sinon.spy();
    const agg = p.do_aggregate(cb);

    assert.ok(cb.notCalled);

    assert.ok(console.log.calledOnce);

    assert.deepEqual(console.log.getCall(0).args, [
        "    ?", 
        "-",
        "ssh://git@192.168.1.1:3333/test/xxx.git", 
        "---->", 
        "http://user:123@194.67.209.1:3333/test/xxx.git"]
    );

    assert.deepEqual( agg, {
      "ok": true,
      "changed": "?",
      "main_branch": "-",
      "rejected": [],
      "from": "ssh://git@192.168.1.1:3333/test/xxx.git",
      "to": "http://user:123@194.67.209.1:3333/test/xxx.git"
    });
  })  




  it('simple case', ()=> {
      var p = new Parser();
      for (var i in simpleLog) p.add_new_string_and_try_aggregate(simpleLog[i]);
      var cb = sinon.spy();
      const agg = p.do_aggregate(cb);

      assert.ok(cb.notCalled);

      assert.ok(console.log.calledOnce);
      assert.deepEqual(console.log.getCall(0).args, [
        "    -", 
        "master", 
        "ssh://git@192.168.1.1:3333/ufsmwp/docs.git", 
        "---->", 
        "http://user:123@194.67.209.1:3333/test/docs.git"]
      );

      assert.deepEqual( agg, {
        "changed": "-",
        "main_branch": "master",
        "ok": true,
        "rejected": [],
        "from": "ssh://git@192.168.1.1:3333/ufsmwp/docs.git",
        "to": "http://user:123@194.67.209.1:3333/test/docs.git"        
      });
  })

  it('rejected case', ()=> {
    var p = new Parser();
    for (var i in rejectedLog) p.add_new_string_and_try_aggregate(rejectedLog[i]);
    var cb = sinon.spy();
    const agg = p.do_aggregate(cb);

    assert.ok(console.log.calledOnce);
    assert.deepEqual(console.log.getCall(0).args, [
      " 4u7r", 
      "release/2018-I", 
      "ssh://git@192.168.1.1:3333/ufsmwp/docs.git", 
      "---->", 
      "http://user:123@194.67.209.1:3333/test/docs.git"]
    );

    const expected_agg = {
      "changed": "4u7r",
      "main_branch": "release/2018-I",
      "ok": true,
      "rejected": [
        "BSSS-773",
        "BSSS-799",
        "Feature/UFSSARBAC-598",
        "Feature/add-new-render-method",
        "SquashConceptAsyncInit",
        "nightlyBuildTests",
        "bugfix/UFSMON-346"
      ],
      "from": "ssh://git@192.168.1.1:3333/ufsmwp/docs.git",
      "to": "http://user:123@194.67.209.1:3333/test/docs.git"        
    }

    assert.equal(1, cb.callCount);
    assert.deepEqual( cb.getCall(0).args[0], expected_agg);
    assert.deepEqual( agg, expected_agg);
  })

})
