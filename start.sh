#!/bin/bash

echo "================================"
echo "Vue 3 产品引导 Demo - 安装与启动"
echo "================================"
echo ""

echo "[1/2] 正在安装依赖..."
npm install
if [ $? -ne 0 ]; then
    echo "安装失败！请检查网络连接或 npm 配置。"
    exit 1
fi

echo ""
echo "[2/2] 正在启动开发服务器..."
npm run dev
