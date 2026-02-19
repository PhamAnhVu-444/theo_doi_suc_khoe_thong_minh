# HƯỚNG DẪN CÀI ĐẶT OLLAMA - CHI TIẾT

## BƯỚC 1: TẢI OLLAMA

### 1.1 Vào trang Ollama
- Mở trình duyệt
- Truy cập: https://ollama.com
- Click "Download for Windows"

### 1.2 Tải file
- Click "Download Ollama for Windows"
- Chờ tải xong (khoảng 200MB)

### 1.3 Cài đặt
- Mở folder Downloads
- Tìm file `OllamaSetup.exe`
- Double-click để chạy
- Click "Install" → "Next" → "Install"
- Click "Finish"

### 1.4 Restart máy
- Restart máy tính để hoàn tất cài đặt

## BƯỚC 2: KIỂM TRA CÀI ĐẶT

### 2.1 Mở Command Prompt
- Nhấn Windows + R
- Gõ `cmd` và Enter
- Hoặc tìm "Command Prompt" trong Start Menu

### 2.2 Kiểm tra Ollama
- Gõ lệnh sau:
```bash
ollama --version
```
- Nếu hiện phiên bản → cài đặt thành công

## BƯỚC 3: TẢI MÔ HÌNH Y TẾ

### 3.1 Tải Medichat-Llama3
- Trong Command Prompt, gõ:
```bash
ollama pull medichat-llama3
```
- Chờ tải xong (khoảng 4-8GB)

### 3.2 Kiểm tra mô hình
- Gõ:
```bash
ollama list
```
- Phải thấy `medichat-llama3` trong danh sách

## BƯỚC 4: TEST OLLAMA

### 4.1 Test trong Terminal
- Gõ:
```bash
ollama run medichat-llama3
```
- Gõ câu hỏi: "Xin chào"
- Nếu AI trả lời → thành công

### 4.2 Test API
- Mở trình duyệt
- Truy cập: http://localhost:11434
- Nếu thấy "Ollama is running" → OK

## BƯỚC 5: KHỞI ĐỘNG SERVER

### 5.1 Mở terminal mới
- Nhấn Windows + R
- Gõ `cmd` và Enter

### 5.2 Đi đến thư mục dự án
```bash
cd C:\Users\asus\Documents\WED_KNTN
```

### 5.3 Cài Node.js dependencies
```bash
npm install
```

### 5.4 Khởi động server
```bash
npm start
```
- Nếu thấy "Server running at http://localhost:3001" → OK

## BƯỚC 6: MỞ ỨNG DỤNG

### 6.1 Mở ứng dụng
- Double-click file `index.html`
- Hoặc kéo thả vào trình duyệt

### 6.2 Kiểm tra AI Chat
- Click vào "Chat AI"
- Nhìn status indicator
- Phải hiển thị "AI Y tế đã sẵn sàng"

### 6.3 Test chat
- Gõ: "Triệu chứng đau đầu là gì?"
- AI phải trả lời bằng tiếng Việt

## TROUBLESHOOTING

### Lỗi "ollama is not recognized"
- Chưa cài Ollama → làm lại Bước 1
- Chưa restart máy → restart và thử lại

### Lỗi "Failed to pull"
- Kiểm tra internet
- Thử lại lệnh pull

### Lỗi "port already in use"
- Tắt các chương trình khác
- Restart máy

### Lỗi "Cannot connect to Ollama"
- Ollama chưa chạy → chạy `ollama serve`
- Kiểm tra port 11434

## KẾT QUẢ

✅ Ollama đã cài và chạy
✅ Mô hình medichat-llama3 đã tải
✅ Server Node.js đang chạy
✅ Ứng dụng kết nối được AI

## LƯU Ý QUAN TRỌNG

- Ollama cần khoảng 8GB RAM cho mô hình 8B
- Máy yếu sẽ chạy chậm hơn
- Có thể dùng mô hình nhỏ hơn nếu cần
- Luôn giữ Ollama chạy khi dùng AI

## CÁC LỆNH HỮU ÍCH

### Kiểm tra Ollama status
```bash
ollama ps
```

### Dừng Ollama
```bash
Ctrl + C
```

### Khởi động lại Ollama
```bash
ollama serve
```

### Xóa mô hình
```bash
ollama rm medichat-llama3
```

### Cập nhật mô hình
```bash
ollama pull medichat-llama3:latest
```
