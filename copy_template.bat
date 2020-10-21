echo off

rem execute run.bat [model file Id]

md .\html\%1
xcopy .\template\preview.html .\html\%1 /y
xcopy .\template\preview_.js .\js\preview\ /y

ren .\js\preview\preview_.js preview_%1.js
echo 'success!'