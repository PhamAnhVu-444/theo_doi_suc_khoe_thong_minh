# HƯỚNG DẪN DEPLOY GITHUB PAGES

## BƯỚC 1: CHUẨN BỊ REPOSITORY

### 1.1 Tạo tài khoản GitHub
1. Vào https://github.com
2. Click "Sign up" → Đăng ký tài khoản mới
3. Xác nhận email

### 1.2 Tạo Repository mới
1. Đăng nhập GitHub
2. Click "+" góc phải → "New repository"
3. Repository name: `theodoithongminh`
4. Description: `Hệ thống giám sát sức khỏe thông minh`
5. Public ✅
6. Click "Create repository"

## BƯỚC 2: UPLOAD CODE LÊN GITHUB

### Cách A: Drag & Drop (Dễ nhất)
1. Mở folder `WED_KNTN` trong File Explorer
2. Kéo thả tất cả file vào trang GitHub
3. Commit changes: "Initial commit"
4. Click "Commit changes"

### Cách B: Git Command (Chuyên nghiệp)
```bash
# Mở Command Prompt/PowerShell
cd C:\Users\asus\Documents\WED_KNTN

# Khởi tạo git
git init
git add .
git commit -m "Initial commit"

# Push lên GitHub
git remote add origin https://github.com/username/theodoithongminh.git
git push -u origin main
```

## BƯỚC 3: KÍCH HOẠT GITHUB PAGES

### 3.1 Vào Settings
1. Trong repository, click "Settings"
2. Menu bên trái → "Pages"

### 3.2 Cấu hình Pages
1. Source: "Deploy from a branch"
2. Branch: "main"
3. Folder: "/root"
4. Click "Save"

### 3.3 Chờ deploy
- Thời gian: 1-2 phút
- Status: "✅ Your site is published"

## BƯỚC 4: TRUY CẤP WEBSITE

### URL của bạn:
```
https://username.github.io/theodoithongminh
```

### Thay `username` bằng GitHub username của bạn

## BƯỚC 5: CẬP NHẬT FIREBASE (QUAN TRỌNG)

### 5.1 Cập nhật Firebase Config
Mở file `js/firebase-config.js` và cập nhật:
```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "username.github.io",  // ← Cập nhật này
    databaseURL: "https://project-name-default-rtdb.firebaseio.com",
    projectId: "project-name",
    storageBucket: "project-name.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};
```

### 5.2 Cấu hình CORS
Trong Firebase Console → Authentication → Settings → Authorized domains:
- Thêm: `username.github.io`

## BƯỚC 6: TÙY CHỈNH TÊN MIỀN RIÊNG (NẾU CẦN)

### 6.1 Mua tên miền
- GoDaddy.com
- Namecheap.com  
- VietnamWork.vn
- Mua: `theodoithongminh.com`

### 6.2 Cấu hình CNAME
1. Trong folder `WED_KNTN`, tạo file `CNAME`
2. Nội dung file: `theodoithongminh.com`
3. Upload file này lên GitHub

### 6.3 DNS Settings
Trong domain registrar:
- Type: CNAME
- Name: @
- Value: `username.github.io`

## TROUBLESHOOTING

### Lỗi 404 Not Found
- Kiểm tra file `index.html` có tồn tại không
- Settings → Pages → Branch có đúng không

### Lỗi Firebase Authentication
- Kiểm tra authorized domains
- API key có đúng không

### Lỗi CSS/JS không load
- Kiểm tra đường dẫn file trong HTML
- File có được upload không

## KẾT QUẢ

Sau khi hoàn thành:
- ✅ Website online miễn phí
- ✅ URL: `https://username.github.io/theodoithongminh`
- ✅ Tự động cập nhật khi push code
- ✅ Hỗ trợ HTTPS
- ✅ Không giới hạn băng thông

## LƯU Ý

- GitHub Pages chỉ cho static files
- Không hỗ trợ server-side code
- Firebase vẫn hoạt động bình thường
- Có thể dùng custom domain
