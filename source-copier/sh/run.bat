@echo off

for /F "tokens=*" %%a in (_cfg) do (
 cmd /C "g %%a"
)
