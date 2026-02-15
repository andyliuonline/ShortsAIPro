#!/bin/bash

# 切換到專案目錄
cd "$(dirname "$0")"

echo "🚀 正在啟動 ShortsRemaker Pro 全套服務..."
echo "💡 包含：PHP 伺服器、Vite 前端編譯、Queue 佇列監聽"
echo "------------------------------------------------"

# 執行 Laravel 內建的併發開發指令
composer dev
