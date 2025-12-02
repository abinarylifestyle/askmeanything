@echo off
chcp 65001 >nul
echo.
echo 🎭 Ask Me Anything - 启动脚本 (Windows)
echo ================================
echo.

REM 检查 Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 未检测到 Node.js
    echo.
    echo 请先安装 Node.js：
    echo 访问 https://nodejs.org 下载安装
    echo.
    pause
    exit /b 1
)

echo ✅ 检测到 Node.js
node --version
npm --version
echo.

REM 检查 node_modules
if not exist "node_modules" (
    echo 📦 首次运行，正在安装依赖...
    echo 这可能需要 2-5 分钟，请耐心等待...
    echo.
    call npm install
    echo.
)

echo 🚀 启动开发服务器...
echo.
echo ================================================
echo 应用启动后，请在浏览器中访问：
echo 👉 http://localhost:5173
echo ================================================
echo.
echo 💡 提示：
echo   - 保持此窗口打开
echo   - 按 Ctrl+C 停止服务器
echo.

npm run dev
