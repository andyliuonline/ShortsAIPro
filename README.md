# ShortsAIPro - AI 爆紅影片重製平台

ShortsAIPro 是一個結合 AI 深度分析與全自動影片生成的工具，專為 YouTube 創作者設計。透過分析熱門短影音的「爆紅基因」，利用 Sora/KieAI 技術生成全新的高品質內容。

## 🚀 核心功能

### 1. AI 影片分析與重製
*   **爆紅分析**：串接 YouTube API 獲取熱門影片，由 Gemini AI 深度分析標題、Hook 與視覺腳本。
*   **高清生成**：利用 Sora 級別的 AI 模型，根據 AI 腳本生成全新的 9:16 短影音。
*   **一鍵發布**：支援 Google OAuth 授權，生成的影片可一鍵上傳至您的 YouTube 頻道。

### 2. 獲利推薦系統 (Referral System)
*   **分潤機制**：分享您的專屬連結，每筆好友訂閱您都可獲得 **20% 的現金獎金**。
*   **雙向激勵**：新用戶透過連結註冊可額外獲得 **50 片生成額度**。
*   **提領管理**：內建銀行收款資訊管理與一鍵提領申請流程（門檻 NT$ 1,000）。

### 3. 遊戲化成長體系 (Gamification)
*   **創作者等級**：透過產片、發布與推薦獲得 XP 經驗值，升級可獲得免費點數獎勵。
*   **連續創作火苗**：鼓勵每日創作，達成 7 天連勝可獲得大額點數獎勵。
*   **創作者名人堂**：全球 Top 10 排行榜，競爭 XP 贏得最高榮譽。
*   **成就勳章**：收集里程碑勳章，解鎖專屬頭銜與點數紅利。

### 4. 專業支付與金流
*   **藍新金流 (NewebPay)**：支援信用卡與多種支付管道。
*   **雲端發票 (Giveme)**：支付成功後自動開立雲端發票至電子信箱。

## 🛠 技術棧

*   **Backend**: Laravel 11, PHP 8.3
*   **Frontend**: React, Inertia.js, Tailwind CSS v4, Lucide Icons
*   **Database**: MySQL
*   **Integrations**: 
    *   Google/YouTube OAuth & Data API
    *   Google Gemini AI API
    *   KieAI (Sora Video Generation)
    *   NewebPay (藍新金流)
    *   Giveme Invoice (電子發票)

## 📦 版本說明

*   **v0.5.0** (Current): 加入推薦獎勵系統與遊戲化體系，優化創作者後台介面。
*   **v0.4.0**: 實作 YouTube 一鍵發布與藍新金流整合。
*   **v0.3.0**: 串接 KieAI 影片生成與 Gemini 分析引擎。

---
Developed with ❤️ by Andy Liu & Zen Meow AI.
