GitHub game repository：書房原圖 + 新桌面 icon 更新

呢個係少量更新檔，唔係全站。

更新方法：
1. GitHub Desktop 揀 cingaryee-bible/game，先 Fetch origin；有 Pull origin 就按一次。
2. Repository > Show in Finder，開返你本機 game 資料夾。
3. 解壓更新 ZIP，將內容按原有路徑複製入 game 資料夾；同名檔案選取取代。
   例如 book.html 要放喺 game/book.html，唔係另一層子資料夾。
   assets/cat-today-cingaryee.png 要放喺 game/assets/。
   days/index.html、sleep/index.html 要放喺相應子資料夾。
   保留你現有 CNAME 同其他檔案，唔好刪除原有資料夾。
4. GitHub Desktop 填更新說明，按 Commit to main，再 Push origin。
5. 等 GitHub Pages 完成部署，重新載入網站。
6. 已加入 iPhone 主畫面嘅舊 icon 如果未更新，移除舊捷徑後，
   用 Safari 開遊戲首頁，重新加至主畫面。唔需要清除網站資料。

已修正：
- 書房恢復原本戴眼鏡睇書、靠住枕頭、有枱燈嘅貓圖。
- 原圖下載自 https://bible.cingaryee.com/cat-today-cingaryee.png，
  網站改用 assets/cat-today-cingaryee.png 本地副本。
- 桌面 icon 換成日本可愛插畫風嘅小貓抱遊戲手掣。
- 首頁、书房、貓貓小日子、疊疊眠都連結新 icon 同 manifest。
- icon 使用 v3 新檔名，避免沿用 v2 快取。
- 遊戲 JavaScript、存檔名稱及存檔格式完全冇改。
- 冇改 GitHub CNAME 或 DNS。

新圖檔：
assets/icons/cat-game-room-icon-v3.png（生成原稿）
apple-touch-icon-v3.png（180 × 180）
icon-192-v3.png
icon-512-v3.png

圖像生成：內置圖片生成，唔係 CLI。
生成提示：
Use case: stylized-concept. Asset type: square iPhone home-screen icon for a cozy browser cat game room. Primary request: Japanese kawaii illustrated cat plus video-game element. Subject: one very cute round cream cat with simple dark charcoal patches on its ears, tiny dot eyes, soft peach cheeks, a happy small mouth, hugging one small muted blue game controller with an obvious dark cross-shaped D-pad and two peach buttons. Style/medium: charming Japanese picture-book illustration, hand-drawn soft dark outlines and light gouache texture, simple graphic shapes, not realistic and not 3D. Composition: single centered bold silhouette, large cat face and controller, entire subject inside central 70 percent, very readable at 60px. Scene/backdrop: flat warm cream full-bleed square background. Palette: warm cream, soft blue, charcoal, peach, matching a cozy cat website. Constraints: ONE icon artwork only, no text, no letters, no branding, no border, no rounded-corner frame, no shadows outside the cat, no collage, no mockup, no realistic fur, no tiny clutter. Output a square image.
