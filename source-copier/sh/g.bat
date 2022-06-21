::
:: copy repo $1 to repo $2 with all branches
::
@echo off

if "%~1"=="" goto blank
if "%~2"=="" goto blank

  echo.
  echo %~1 ----^> %~2
  rm -rf xxx
  git clone --progress %~1 xxx
  cd xxx

  FOR /F "tokens=1,* delims=/" %%a IN ('git branch -r ^| grep -v "\->"') do (
    git branch --track %%b %%a/%%b
  )

  git remote add copy %~2
  git push --all copy
  cd ..
  rm -rf ./xxx

goto end
:blank
echo Usage: 
echo        g.bat ^<source-repo-uri^> ^<dest-repo-uri^>
:end

