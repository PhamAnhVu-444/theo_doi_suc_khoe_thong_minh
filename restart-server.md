# HƯỚNG DẪN KHỞI ĐỘNG LẠI SERVER

## BƯỚC 1: TẤT SERVER CŨ

Trong Command Prompt đang chạy server:
- **Nhấn Ctrl + C**
- **Chờ hiện lại command prompt**

## BƯỚC 2: KHỞI ĐỘNG LẠI

Gõ lệnh sau:
```bash
cd C:\Users\asus\Documents\WED_KNTN
npm start
```

## BƯỚC 3: KIỂM TRA KẾT QUẢ

Phải thấy:
```
🏥 Health Chat Server running at http://localhost:3001
🤖 Make sure Ollama is running on http://localhost:11434
🌐 Server accessible from: http://0.0.0.0:3001
```

## BƯỚC 4: TEST SERVER

Mở trình duyệt và truy cập:
- http://localhost:3001/api/test
- Phải thấy: {"success": true, "message": "Server is working!"}

## BƯỚC 5: MỞ ỨNG DỤNG

- Double-click file index.html
- Click "Chat AI"
- Status phải hiện: "AI Y tế đã sẵn sàng"

## NẾU KHI THẤT BẠI

Nếu vẫn lỗi:
1. Kiểm tra port 3001: `netstat -ano | findstr :3001`
2. Tắt firewall tạm thời
3. Restart máy tính

## LƯU Ý

- Giữ nguyên Command Prompt Ollama
- Mở Command Prompt mới cho server
- Không tắt cả 2 terminal
