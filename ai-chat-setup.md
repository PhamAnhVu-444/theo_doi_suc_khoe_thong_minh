# HƯỚNG DẪN CÀI ĐẶT AI CHAT Y TẾ

## BƯỚC 1: CÀI ĐẶT OLLAMA

### 1.1 Tải Ollama
- Vào https://ollama.com
- Download Ollama for Windows
- Chạy file .exe và cài đặt
- Restart máy tính

### 1.2 Tải mô hình Medichat-Llama3
Mở Command Prompt và gõ:
```bash
ollama pull medichat-llama3
```

### 1.3 Kiểm tra mô hình
```bash
ollama list
```
Bạn sẽ thấy `medichat-llama3` trong danh sách

## BƯỚC 2: CÀI ĐẶT SERVER

### 2.1 Cài Node.js dependencies
Mở Command Prompt trong folder dự án:
```bash
cd C:\Users\asus\Documents\WED_KNTN
npm install
```

### 2.2 Khởi động server
```bash
npm start
```
Server sẽ chạy tại http://localhost:3001

## BƯỚC 3: KIỂM TRA HOẠT ĐỘNG

### 3.1 Kiểm tra Ollama
Mở trình duyệt: http://localhost:11434
Nếu thấy "Ollama is running" → OK

### 3.2 Kiểm tra server
Mở trình duyệt: http://localhost:3001/api/status
Nếu thấy {"success": true, "ollamaRunning": true} → OK

### 3.3 Mở ứng dụng
Mở file index.html trong trình duyệt
Chat AI sẽ tự động kết nối với Ollama

## BƯỚC 4: SỬ DỤNG CHAT AI

### 4.1 Chat với AI y tế
- Mở màn hình Chat AI
- Gõ câu hỏi về sức khỏe
- AI sẽ trả lời dựa trên kiến thức y tế

### 4.2 Ví dụ câu hỏi
- "Triệu chứng của đau dạ dày là gì?"
- "Khi nào nên đi khám bác sĩ?"
- "Cách chăm sóc người bị sốt?"
- "Dấu hiệu khẩn cấp là gì?"

### 4.3 Lưu ý quan trọng
- AI chỉ để tham khảo, không thay thế bác sĩ
- Trường hợp khẩn cấp → Gọi 115 ngay
- AI có thể trả lời sai, luôn xác minh với chuyên gia

## TROUBLESHOOTING

### Lỗi "Ollama is not running"
- Mở Command Prompt và gõ: `ollama run medichat-llama3`
- Để window đó mở

### Lỗi "Cannot connect to Ollama server"
- Kiểm tra Ollama đã chạy chưa
- Kiểm tra port 11434 có bị chặn không

### Lỗi "Cannot connect to AI"
- Kiểm tra server Node.js đang chạy
- Kiểm tra port 3001 có trống không

### AI trả lời chậm
- Mô hình cần thời gian xử lý
- Máy tính yếu sẽ chạy chậm hơn

## CÁC LỆNH HỮU ÍCH

### Khởi động lại Ollama
```bash
ollama serve
```

### Cập nhật mô hình
```bash
ollama pull medichat-llama3:latest
```

### Xóa mô hình
```bash
ollama rm medichat-llama3
```

## HIỆU SUẤT

- Tốc độ phản hồi: 2-10 giây
- Chất lượng: Tốt cho câu hỏi y tế cơ bản
- Ngôn ngữ: Tiếng Việt và tiếng Anh
- Offline: Hoàn toàn offline sau khi tải mô hình
