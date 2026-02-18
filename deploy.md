# DEPLOYMENT GUIDE

## 1. GitHub Pages (Miễn phí)
```bash
# Upload code lên GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main
```
Settings → Pages → Source: Deploy from a branch

## 2. Netlify (Miễn phí)
1. Drag & drop folder vào netlify.com
2. Tự động có domain: `project-name.netlify.app`

## 3. Firebase Hosting (Miễn phí)
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

## 4. Mua tên miền riêng
- GoDaddy, Namecheap, VietnamWork
- Khoảng $10-15/năm
- Cần DNS pointing

## 5. Local Server (Phát triển)
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# Live Server (VS Code)
# Cài extension Live Server
```

## CONFIG NEEDED
- Cập nhật Firebase config nếu đổi domain
- Kiểm tra CORS nếu cần
- Test HTTPS cho production
