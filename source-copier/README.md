# source-copier

Clone git repo with all branches then push it to another repo.


## How it works

1. ./sh/_cfg should have pairs of "original-repo-url" "destination-repo-url". It can be ssh or http repo urls. Blanck strings will be ommited.

2. ./sh/g starts process of copy repo to destinations repo. It have two mandatory params: original repo and destination repo

3. ./sh/run reads **_cfg** and run **g** in cycle with parameters that was read from **cfg**

4. We can stop here but if there are chaotic delevelopers which like to delete commits then we can get error as branch at destination repo have commits that was deleted from original repo. The following solution is used: delete such branch at destination repo and copy it again.

5. Thats why we have ./sh/d script which takes two params: destination repo url and name of the branch - **d** deletes branch from repo.

6. Also we have some js code to rule them all (look at ./js and index.js)

## Usage 

```js
node ./index.js
```

## Output

Will produce ./_log file with original output of bash scripts and some console logs:

```sh
    - master ssh://git@192.168.1.1:3333/ufsmwp/admin.git ----> http://user:123@194.67.209.146:3333/test/admin.git
   2u development ssh://git@192.168.1.1:3333/ufsfw/ufs-dictionary.git ----> http://user:123@194.67.209.146:3333/test-bh/ufs-dictionary.git
    - master ssh://git@192.168.1.1:3333/ufsfw/ufs-mobile-tools.git ----> http://user:123@194.67.209.146:3333/test-bh/ufs-mobile-tools.git
 1u1r develop ssh://git@192.168.1.1:3333/ufsfw/ufs-monitoring.git ----> http://user:123@194.67.209.146:3333/test-bh/ufs-monitoring.git
       [rejected] UFSMON-136
    - master ssh://git@192.168.1.1:3333/ufsfw/ufs-param-pl-js.git ----> http://user:123@194.67.209.146:3333/test-bh/ufs-param-pl-js.git
    x master ssh://git@192.168.1.1:3333/ufsfw/ufs-protocol.git ----> http://user:123@194.67.209.146:3333/test-bh/ufs-protocol.git
    ? master ssh://git@192.168.1.1:3333/ufsfw/ufs-protocol-platform.git ----> http://user:123@194.67.209.146:3333/test-bh/ufs-protocol-platform.git
    - master ssh://git@192.168.1.1:3333/ufsfw/ufs-protocol-pl-js.git ----> http://user:123@194.67.209.146:3333/test-bh/ufs-protocol-pl-js.git
*deleting branch UFSMON-136 from http://user:123@194.67.209.146:3333/test-bh/ufs-platform.git
 ok
*retry
   1u develop ssh://git@192.168.1.1:3333/ufsfw/ufs-monitoring.git ----> http://user:123@194.67.209.146:3333/test-bh/ufs-monitoring.git
```

1st line: dash means "no changes", "master" means that default branch is master, then "url-og-original-repo ----> url-of-destination-repo".

2nd line: "2u" instead of "-" means "two branches was updated".

4th line: "1u1r" which means "one branch was updated while one branch was rejected", probably becase of number 4 of "How it works".

6th and 7th lines: "x" means problems with source repo, "?" means problems with destination repo (look at logs at project folder)

After copying all repos, it tries to fix rejected branches - it deletes them (look at "*deleting") and then retry to copy repo (look at *retry).
