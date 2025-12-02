#!/bin/bash

# Ask Me Anything - 一键启动脚本 (Mac/Linux)

echo "🎭 Ask Me Anything - 启动脚本"
echo "================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null
then
    echo "❌ 未检测到 Node.js"
    echo ""
    echo "请先安装 Node.js："
    echo "访问 https://nodejs.org 下载安装"
    echo ""
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"
echo ""

# 检查 node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    echo "这可能需要 2-5 分钟，请耐心等待..."
    echo ""
    npm install
    echo ""
fi

echo "🚀 启动开发服务器..."
echo ""
echo "================================================"
echo "应用启动后，请在浏览器中访问："
echo "👉 http://localhost:5173"
echo "================================================"
echo ""
echo "💡 提示："
echo "  - 保持此窗口打开"
echo "  - 按 Ctrl+C 停止服务器"
echo ""

npm run dev
