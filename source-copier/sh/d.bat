::
::delete branch $2 from repo $1
::
@echo off

if "%~1"=="" goto blank
if "%~2"=="" goto blank

  echo ""
  rm -rf yyy 
  git clone --progress %~1 yyy
  cd yyy
  git push origin --delete %~2
  cd ..
  rm -rf ./yyy

goto end
:blank
echo Usage: 
echo        d.bat ^<repo-uri^> ^<branch-name^>
:end