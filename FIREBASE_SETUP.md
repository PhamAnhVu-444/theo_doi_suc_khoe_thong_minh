# Hướng dẫn cấu hình Firebase cho Bác Sĩ AI Web

## 🔥 Bước 1: Tạo Firebase Project

1. **Truy cập Firebase Console**: https://console.firebase.google.com/
2. **Đăng nhập** bằng tài khoản Google
3. **Click "Add project"** hoặc "Tạo dự án"
4. **Nhập tên dự án**: `bacsiai-web` (hoặc tên bạn muốn)
5. **Click "Tiếp tục"**
6. **Chọn hoặc tạo tài khoản Google Analytics** (không bắt buộc)
7. **Click "Tạo dự án"**

## 📱 Bước 2: Cấu hình Authentication

1. Trong Firebase Console, chọn **Authentication** từ menu bên trái
2. **Click "Get started"** hoặc "Bắt đầu"
3. **Chọn "Sign-in method"** tab
4. **Bật "Anonymous"**:
   - Click "Anonymous"
   - Bật "Enable"
   - Click "Save"
5. **(Tùy chọn) Bật "Email/Password"** nếu muốn đăng ký tài khoản

## 🗄️ Bước 3: Cấu hình Firestore Database

1. Chọn **Firestore Database** từ menu bên trái
2. **Click "Create database"**
3. **Chọn "Start in test mode"** (cho demo)
4. **Chọn location** (chọn Asia Southeast 1)
5. **Click "Enable"**

## 📊 Bước 4: Cấu hình Realtime Database

1. Chọn **Realtime Database** từ menu bên trái
2. **Click "Create database"**
3. **Chọn "Start in test mode"**
4. **Chọn location** (giống Firestore)
5. **Click "Enable"**

## 📁 Bước 5: Lấy cấu hình Firebase

1. Trong Firebase Console, click **⚙️ Settings icon** (góc trên bên phải)
2. **Chọn "Project settings"**
3. **Trong tab "General"**, kéo xuống "Your apps" section
4. **Click "Web"** icon (`</>`)
5. **Nhập app nickname**: `Bác Sĩ AI Web`
6. **Click "Register app"**
7. **Copy Firebase configuration** (dạng JavaScript object)

## 🔧 Bước 6: Cập nhật cấu hình trong project

1. **Mở file**: `js/firebase-config.js`
2. **Thay thế** `firebaseConfig` object với cấu hình của bạn:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project-id.firebaseapp.com",
    databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456789012345678"
};
```

## 📋 Bước 7: Cấu hình Security Rules

### Firestore Rules:
Trong Firestore → Rules, thay thế bằng:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Realtime Database Rules:
Trong Realtime Database → Rules, thay thế bằng:
```javascript
{
  "rules": {
    "health": {
      "$userId": {
        ".read": "auth != null && auth.uid == $userId",
        ".write": "auth != null && auth.uid == $userId"
      }
    }
  }
}
```

## 🚀 Bước 8: Kiểm tra kết nối

1. **Mở ứng dụng web** trong trình duyệt
2. **Mở Developer Console** (F12)
3. **Kiểm tra messages**:
   - "Firebase not initialized" → Kiểm tra file firebase-config.js
   - "User logged in: xxx" → Kết nối thành công
   - "Default user data created" → Dữ liệu đã được tạo

## 📊 Bước 9: Test Real-time Updates

1. **Mở ứng dụng** ở 2 tab khác nhau
2. **Thay đổi dữ liệu** ở tab 1 (ví dụ: trong console chạy `saveHealthData({heartRate: 120})`)
3. **Kiểm tra tab 2** → Dữ liệu nên tự động cập nhật

## 🔍 Debugging Tips

### Kiểm tra Console Errors:
```javascript
// Trong browser console, kiểm tra:
console.log(window.firebaseApp);
console.log(window.firebaseApp.auth.currentUser);
```

### Kiểm tra Firebase Connection:
```javascript
// Kiểm tra kết nối Realtime Database
window.firebaseApp.database().ref('.info/connected').on('value', (snap) => {
  console.log('Connected:', snap.val());
});
```

### Test Manual Data Update:
```javascript
// Test cập nhật health data
window.saveHealthData({
  heartRate: 95,
  bloodPressure: "130/85",
  temperature: 37.2,
  spo2: 97
});
```

## ⚠️ Lưu ý quan trọng

1. **Test Mode**: Security rules ở trên chỉ cho testing. Production cần rules chặt chẽ hơn
2. **API Key**: Không commit API key thật vào public repository
3. **Billing**: Firebase có gói miễn phí, nhưng cần monitor usage
4. **CORS**: Nếu deploy lên domain khác, cần thêm domain vào Firebase Authentication settings

## 🌐 Deployment

Khi deploy lên production:
1. **Thêm authorized domains** trong Firebase Authentication → Settings
2. **Cập nhật Security Rules** cho production
3. **Enable App Check** (tùy chọn nhưng khuyến khị)
4. **Monitor usage** trong Firebase Console

## 🆘 Hỗ trợ

Nếu gặp vấn đề:
1. **Kiểm tra browser console** (F12)
2. **Kiểm tra Firebase Console** → Usage tab
3. **Xem Firebase documentation**: https://firebase.google.com/docs
4. **Search error messages** trên Google/Stack Overflow

---

**Chúc bạn cấu hình Firebase thành công!** 🎉
