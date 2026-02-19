# HƯỚNG DẪN CÀI ĐẶT OLLAMA

## 1. Cài đặt Ollama
### Windows:
1. Vào https://ollama.com
2. Download Ollama for Windows
3. Chạy file .exe và cài đặt
4. Restart máy

## 2. Tải mô hình Medichat-Llama3
Mở Command Prompt và gõ:
```bash
ollama pull medichat-llama3
```

## 3. Kiểm tra mô hình
```bash
ollama list
```
Bạn sẽ thấy medichat-llama3 trong danh sách

## 4. Test chat trong terminal
```bash
ollama run medichat-llama3
```

## 5. Kiểm tra API
Mở trình duyệt và truy cập:
http://localhost:11434
Nếu thấy "Ollama is running" → thành công!
