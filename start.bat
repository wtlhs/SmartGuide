@echo off
echo ================================
echo Vue 3 产品引导 Demo - 安装与启动
echo ================================
echo.

echo [1/2] 正在安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo 安装失败！请检查网络连接或 npm 配置。
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] 正在启动开发服务器...
call npm run dev

pause
