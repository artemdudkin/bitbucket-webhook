const assert = require("assert");
const sinon = require("sinon");
const Parser = require("../js/parser");
const utils = require("../js/utils");

const simpleLog = [
"\nssh://git@192.168.1.1:3333/ufsmwp/docs.git ----> http://user:123@194.67.209.1:3333/test/docs.git\n",
"Cloning into 'xxx'...\n",
"remote: Counting objects: 3, done.        \nremote: Compressing objects:  50% (1/2)           \rremote: Compressing objects: 100% (2/2)           \rremote: Compressing objects: 100% (2/2), done.        \nremote: Total 3 (delta 0), reused 0 (delta 0)        \n",
"Receiving objects:  33% (1/3)   \rReceiving objects:  66% (2/3)   \r",
"Receiving objects: 100% (3/3)   \rReceiving objects: 100% (3/3), 8.75 KiB | 0 bytes/s, done.\n",
"fatal: A branch named 'master' already exists.\n",
"Everything up-to-date\n"
];

const simpleLog2 = [
    "ssh://git@bitbucket.visitech.local:7999/ISOBR/tmc.git ----> git@gitlab.visitech.live:mirror/ISOBR/tmc.git\n",
    "Cloning into 'xxx'...\n",
    "warning: You appear to have cloned an empty repository.\n",
    "Everything up-to-date\n"
]

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


const noSourceRepoLog2 = [
    "ssh://git@bitbucket.visitech.local:7999/TCR666/test1.git ----> git@gitlab.visitech.live:mirror/TCR666/test1.git\n",
    "Cloning into 'xxx'...\n",
    "Repository not found\n",
    "The requested repository does not exist, or you do not have permission to access it.\n",
    "fatal: Could not read from remote repository.\n",
    "Please make sure you have the correct access rights\n",
    "and the repository exists.\n",
    "The system cannot find the path specified.\n",
    "error: remote copy already exists.\n",
    "remote: \n",
    "remote: ========================================================================\n",
    "remote: \n",
    "remote: The project you were looking for could not be found or you don't have permission to view it.\n",
    "remote: \n",
    "remote: ========================================================================\n",
    "remote: \n",
    "fatal: Could not read from remote repository.\n",
    "Please make sure you have the correct access rights\n",
    "and the repository exists.\n",
    "EXIT 0\n"
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

const wierdLineFeedsLog = [
    "\nssh://git@bitbucket.visitech.local:7999/ISOBR/nd.git ----> git@gitlab.visitech.live:mirror/ISOBR/nd.git\n",
    "Cloning into 'xxx'...\n",
    "remote: Counting objects: 226644, done.        \n",
    "remote: Compressing objects:   0% (1/94621)           \rremote: Compressing objects:   1% (947/94621)           \rremote: Compressing objects:   2% (1893/94621)           \rremote: Compressing objects:   3% (2839/94621)           \rremote: Compressing objects:   4% (3785/94621)           \rremote: Compressing objects:   5% (4732/94621)           \rremote: Compressing objects:   6% (5678/94621)           \rremote: Compressing objects:   7% (6624/94621)           \rremote: Compressing objects:   8% (7570/94621)           \rremote: Compressing objects:   9% (8516/94621)           \r",
    "remote: Compressing objects:  50% (47311/94621)           \r",
    "remote: Compressing objects: 100% (94621/94621)           \rremote: Compressing objects: 100% (94621/94621), done.        \n",
    "Receiving objects:   0% (1/226644)   \r",
    "Receiving objects:  50% (113322/226644), 38.08 MiB | 25.37 MiB/s   \r",
    "Receiving objects:  99% (224378/226644), 193.71 MiB | 28.85 MiB/s   \r",
    "remote: Total 226644 (delta 129924), reused 224597 (delta 128542)        \nReceiving objects: 100% (226644/226644), 193.71 MiB | 28.85 MiB/s   \rReceiving objects: 100% (226644/226644), 204.52 MiB | 27.64 MiB/s, done.\n",
    "Resolving deltas:   0% (0/129924)   \r",
    "Resolving deltas:  50% (65357/129924)   \r",
    "Resolving deltas: 100% (129924/129924)   \r",
    "Resolving deltas: 100% (129924/129924), done.\n",
    "Branch KAZZCM-2170 set up to track remote branch KAZZCM-2170 from origin.\n",
    "Branch KAZZCM-2173 set up to track remote branch KAZZCM-2173 from origin.\n",
    "Branch KAZZCM-2240 set up to track remote branch KAZZCM-2240 from origin.\n",
    "Branch KAZZCM-2258 set up to track remote branch KAZZCM-2258 from origin.\n",
    "Branch KAZZCM-2420 set up to track remote branch KAZZCM-2420 from origin.\n",
    "Branch feature/BOXEND-137 set up to track remote branch feature/BOXEND-137 from origin.\n",
    "Branch feature/BOXEND-224 set up to track remote branch feature/BOXEND-224 from origin.\n",
    "Branch feature/export-to-nlmk set up to track remote branch feature/export-to-nlmk from origin.\n",
    "Branch feature/fixed-logger-paths set up to track remote branch feature/fixed-logger-paths from origin.\n",
    "Branch feature/versioned-wf set up to track remote branch feature/versioned-wf from origin.\n",
    "Branch kriogaz set up to track remote branch kriogaz from origin.\n",
    "Branch local/develop set up to track remote branch local/develop from origin.\n",
    "fatal: A branch named 'master' already exists.\n",
    "Branch mmk set up to track remote branch mmk from origin.\n",
    "Branch test-123 set up to track remote branch test-123 from origin.\n",
    "Branch wfed set up to track remote branch wfed from origin.\n",
    "remote: \nremote: To create a merge request for NLMK, visit:        \nremote:   https://gitlab.visitech.live/isobr/nd/-/merge_requests/new?merge_request%5Bsource_branch%5D=NLMK        \nremote: \nremote: \nremote: Project 'mirror/ISOBR/nd' was moved to 'isobr/nd'.        \nremote: \nremote: Please update your Git remote:        \nremote: \nremote:   git remote set-url origin git@gitlab.visitech.live:isobr/nd.git        \nremote: \nremote: \n",
    "To gitlab.visitech.live:mirror/ISOBR/nd.git\n   b015ba955..093c191ae  NLMK -> NLMK\n",
    "Everything up-to-date\n",
    "EXIT 0"
]


describe('parser', function(){

  beforeEach(function(){
    sinon.spy(utils, "log");
  })

  afterEach(function(){
    utils.log.restore();
  })




  it('should be not ok', ()=> {
    var p = new Parser();
    p.add_new_string_and_try_aggregate('123\n');
    p.add_new_string_and_try_aggregate('abc\n');
    var cb = sinon.spy();
    const agg = p.do_aggregate(cb);

    assert.ok(cb.notCalled);

    assert.ok(utils.log.notCalled);

    assert.deepEqual( agg, {
      "ok": false,
      "changed": "x",
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

    assert.ok(utils.log.calledOnce);

    assert.deepEqual(utils.log.getCall(0).args, [
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


  it('no source repo 2', ()=> {
    var p = new Parser();
    for (var i in noSourceRepoLog2) p.add_new_string_and_try_aggregate(noSourceRepoLog2[i]);
    var cb = sinon.spy();
    const agg = p.do_aggregate(cb);

    assert.ok(cb.notCalled);

    assert.ok(utils.log.calledOnce);

    assert.deepEqual(utils.log.getCall(0).args, [
        "    x", 
        "-",
        "ssh://git@bitbucket.visitech.local:7999/TCR666/test1.git", 
        "---->", 
        "git@gitlab.visitech.live:mirror/TCR666/test1.git"]
    );

    assert.deepEqual( agg, {
      "ok": true,
      "changed": "x",
      "main_branch": "-",
      "rejected": [],
      "from": "ssh://git@bitbucket.visitech.local:7999/TCR666/test1.git",
      "to": "git@gitlab.visitech.live:mirror/TCR666/test1.git"
    });
  })  



  it('no destination repo', ()=> {
    var p = new Parser();
    for (var i in noDestinationRepoLog) p.add_new_string_and_try_aggregate(noDestinationRepoLog[i]);
    var cb = sinon.spy();
    const agg = p.do_aggregate(cb);

    assert.ok(cb.notCalled);

    assert.ok(utils.log.calledOnce);

    assert.deepEqual(utils.log.getCall(0).args, [
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

    assert.ok(utils.log.calledOnce);

    assert.deepEqual(utils.log.getCall(0).args, [
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

    assert.ok(utils.log.calledOnce);

    assert.deepEqual(utils.log.getCall(0).args, [
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

      assert.ok(utils.log.calledOnce);
      assert.deepEqual(utils.log.getCall(0).args, [
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


  it('simple case 2 (empty repo)', ()=> {
      var p = new Parser();
      for (var i in simpleLog2) p.add_new_string_and_try_aggregate(simpleLog2[i]);
      var cb = sinon.spy();
      const agg = p.do_aggregate(cb);

      assert.ok(cb.notCalled);

      assert.ok(utils.log.calledOnce);
      assert.deepEqual(utils.log.getCall(0).args, [
        "    -", 
        "-", 
        "ssh://git@bitbucket.visitech.local:7999/ISOBR/tmc.git", 
        "---->", 
        "git@gitlab.visitech.live:mirror/ISOBR/tmc.git"]
      );

      assert.deepEqual( agg, {
        "changed": "-",
        "main_branch": "-",
        "ok": true,
        "rejected": [],
        "from": "ssh://git@bitbucket.visitech.local:7999/ISOBR/tmc.git",
        "to": "git@gitlab.visitech.live:mirror/ISOBR/tmc.git"
      });
  })

  it('rejected case', ()=> {
    var p = new Parser();
    for (var i in rejectedLog) p.add_new_string_and_try_aggregate(rejectedLog[i]);
    var cb = sinon.spy();
    const agg = p.do_aggregate(cb);

    assert.ok(utils.log.calledOnce);
    assert.deepEqual(utils.log.getCall(0).args, [
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


  it('wierd line feeds', ()=> {
    var p = new Parser();
    for (var i in wierdLineFeedsLog) p.add_new_string_and_try_aggregate(wierdLineFeedsLog[i]);
    var cb = sinon.spy();
    const agg = p.do_aggregate(cb);

    assert.ok(utils.log.calledOnce);
    assert.deepEqual(utils.log.getCall(0).args, [
      "   1u", 
      "master", 
      "ssh://git@bitbucket.visitech.local:7999/ISOBR/nd.git", 
      "---->", 
      "git@gitlab.visitech.live:mirror/ISOBR/nd.git"]
    );

    const expected_agg = {
      changed: "1u",
      main_branch: "master",
      ok: true,
      rejected: [],
      from: "ssh://git@bitbucket.visitech.local:7999/ISOBR/nd.git",
      to: "git@gitlab.visitech.live:mirror/ISOBR/nd.git"
    }

    assert.equal(0, cb.callCount);
    assert.deepEqual( agg, expected_agg);
  })

})
