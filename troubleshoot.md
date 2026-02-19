# TROUBLESHOOTING - AI CHAT Y TẾ

## KIỂM TRA LỖI PHỔ BIẾN

### 1. MỞ TRÌNH DUYỆT → F12 → CONSOLE
- Nhấn F12 để mở Developer Tools
- Chọn tab Console
- Tìm lỗi màu đỏ
- Chụp ảnh và gửi cho tôi

### 2. KIỂM TRA CÁC LỖI THƯỜNG GẶP

#### Lỗi "addMessage is not defined"
✅ ĐÃ FIX - Function đã được thêm

#### Lỗi "sendQuickMessage is not defined"
✅ ĐÃ FIX - Function đã được thêm

#### Lỗi "Cannot read property 'textContent' of null"
Nguyên nhân: Element không tồn tại
Cách fix: Kiểm tra HTML có đúng ID không

#### Lỗi "Failed to fetch"
Nguyên nhân: Server không chạy
Cách fix: Khởi động server Node.js

### 3. KIỂM TRA HOẠT ĐỘNG

#### Bước 1: Kiểm tra Ollama
Mở Command Prompt và gõ:
```bash
ollama list
```
Nếu thấy `medichat-llama3` → OK

#### Bước 2: Kiểm tra Server Node.js
Mở Command Prompt và gõ:
```bash
cd C:\Users\asus\Documents\WED_KNTN
npm start
```
Nếu thấy "Server running at http://localhost:3001" → OK

#### Bước 3: Kiểm tra kết nối
Mở trình duyệt và truy cập:
- http://localhost:11434 (Ollama)
- http://localhost:3001/api/status (Server)

### 4. CÁC LỆNH KÍCH HOẠT

#### Khởi động lại tất cả
```bash
# 1. Khởi động Ollama
ollama serve

# 2. Mở terminal mới
cd C:\Users\asus\Documents\WED_KNTN
npm install
npm start

# 3. Mở trình duyệt
# Truy cập file index.html
```

#### Reset hoàn toàn
```bash
# Tắt tất cả
# Xóa node_modules
rmdir /s node_modules

# Cài lại
npm install
npm start
```

### 5. KIỂM TRA PORT

#### Kiểm tra port có bị chiếm không
```bash
# Kiểm tra port 11434
netstat -ano | findstr :11434

# Kiểm tra port 3001
netstat -ano | findstr :3001
```

#### Nếu port bị chiếm
```bash
# Tắt process
taskkill /PID [SỐ_PID] /F
```

### 6. TEST TỪNG BƯỚC

#### Test 1: Ollama chỉ
```bash
ollama run medichat-llama3
```
Gõ: "Xin chào"

#### Test 2: Server chỉ
```bash
node ollama-server.js
```
Mở trình duyệt: http://localhost:3001/api/status

#### Test 3: Frontend chỉ
- Mở file index.html
- Nhấn F12 → Console
- Tìm lỗi

### 7. LOG ERROR THƯỜNG GẶP

#### Console errors:
- "ReferenceError: X is not defined" → Thiếu function
- "TypeError: Cannot read property" → Element null
- "NetworkError: Failed to fetch" → Server lỗi

#### Server errors:
- "EADDRINUSE: port already in use" → Port bị chiếm
- "ENOTFOUND" → Không kết nối Ollama
- "ECONNREFUSED" → Ollama không chạy

### 8. CÁC GIẢI PHÁP NHANH

#### Solution 1: Restart all
1. Tất cả terminal
2. Mở lại Ollama
3. Mở lại server
4. Refresh trình duyệt

#### Solution 2: Check file
- Kiểm tra file có tồn tại không
- Kiểm tra đường dẫn đúng không
- Kiểm tra permission

#### Solution 3: Use fallback
- Tắt Ollama
- Dùng responses có sẵn
- Vẫn hoạt động nhưng không AI

### 9. LIÊN HỆ HỖ TRỢ

Nếu vẫn không được:
1. Chụp ảnh Console error
2. Chụp ảnh Server terminal
3. Gửi kèm mô tả lỗi
4. Tôi sẽ fix trực tiếp

### 10. CHECKLIST TRƯỚC KHI CHẠY

- [ ] Ollama đang chạy?
- [ ] Server Node.js đang chạy?
- [ ] Port 11434 trống?
- [ ] Port 3001 trống?
- [ ] File index.html tồn tại?
- [ ] Không có lỗi Console?
- [ ] AI status hiển thị đúng?
