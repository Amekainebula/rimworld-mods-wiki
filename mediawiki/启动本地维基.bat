@echo off
chcp 65001 >nul
setlocal
set "WIKI_ROOT=%~dp0..\local-wiki"
set "WIKI_APP=%WIKI_ROOT%\app\mediawiki-1.46.0"
if not exist "%WIKI_ROOT%\php\php.exe" (
  echo 本地运行环境未找到，请查看本机使用说明。
  pause
  exit /b 1
)
if not exist "%WIKI_APP%\LocalSettings.php" (
  echo Wiki 尚未安装，请查看本机使用说明。
  pause
  exit /b 1
)
echo 边缘世界模组维基已准备启动。
echo 请打开 http://127.0.0.1:8766/
echo 关闭此窗口即可停止本地 Wiki。
cd /d "%WIKI_APP%"
"%WIKI_ROOT%\php\php.exe" -c "%WIKI_ROOT%\php\php.ini" -S 127.0.0.1:8766 -t "%WIKI_APP%"
