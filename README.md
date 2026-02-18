# Bác Sĩ AI - Web Version

![Bác Sĩ AI Logo](assets/logo.png)

## Giới thiệu

Bác Sĩ AI Web là phiên bản web của ứng dụng di động "Khoa_luan_tot_nghiep", cung cấp các tính năng y tế thông minh trực tiếp trên trình duyệt web. Ứng dụng được thiết kế với giao diện Material Design hiện đại và đầy đủ chức năng như phiên bản mobile.

## 🚀 Tính năng chính

### 📱 Màn hình chính (Dashboard)
- **Chào mừng người dùng** với thông tin cá nhân
- **Thống kê sức khỏe nhanh**: Nhịp tim, huyết áp, nhiệt độ, SpO2
- **Truy cập nhanh** đến các tính năng chính
- **Nút gọi khẩn cấp** 115

### 👤 Hồ sơ cá nhân
- Quản lý thông tin cá nhân
- Lịch sử sức khỏe
- Thông tin bệnh nền
- Nhóm máu và các chỉ số quan trọng

### 🏥 Sơ cứu
- **5 kỹ thuật sơ cứu quan trọng**:
  1. Hồi sức tim phổi (CPR)
  2. Sơ cứu hóc dị vật (Thủ thuật Heimlich)
  3. Xử lý vết thương chảy máu
  4. Sơ cứu bỏng
  5. Xử lý bong gân (Quy tắc R.I.C.E)
- **Hình ảnh minh họa chi tiết**
- **Hướng dẫn từng bước** dễ hiểu
- **Giao diện mở rộng/thu gọn** tiện lợi

### 🤖 Chat AI
- **Tư vấn y tế thông minh** 24/7
- **Phản hồi nhanh** với các câu hỏi phổ biến
- **Nút nhanh** cho các triệu chứng thường gặp
- **Giao diện thân thiện** như chat thật

### 💓 Sức khỏe
- **Theo dõi chỉ số sức khỏe** theo thời gian thực
- **Biểu đồ nhịp tim** trực quan
- **Lưu trữ lịch sử** các chỉ số quan trọng
- **Cảnh báo sức khỏe** thông minh

### 🌱 Môi trường
- **Chất lượng không khí** (AQI)
- **Các chỉ số ô nhiễm**: PM2.5, PM10, O₃, NO₂
- **Thông tin thời tiết**: nhiệt độ, độ ẩm
- **Cảnh báo môi trường**

### 📰 Tin tức y tế
- **Tin tức từ các nguồn uy tín**: VnExpress, Thanh Niên, Tuổi Trẻ
- **Cập nhật liên tục** về y tế và sức khỏe
- **Giao diện tích hợp** trực tiếp trong app

## 🛠️ Cài đặt và chạy ứng dụng

### Yêu cầu hệ thống
- **Trình duyệt web hiện đại**: Chrome, Firefox, Safari, Edge
- **Kết nối Internet** cho các tính năng online
- **Độ phân giải màn hình tối thiểu**: 320px (mobile)

### Cài đặt local
1. **Clone hoặc download** dự án:
   ```bash
   git clone <repository-url>
   cd WED_KNTN
   ```

2. **Mở file `index.html`** trong trình duyệt:
   - Double-click vào file `index.html`
   - Hoặc kéo thả file vào trình duyệt
   - Hoặc sử dụng Live Server trong VS Code

3. **Sử dụng Local Server** (khuyến khích):
   ```bash
   # Với Python
   python -m http.server 8000
   
   # Với Node.js
   npx serve .
   
   # Với PHP
   php -S localhost:8000
   ```

4. **Truy cập ứng dụng**:
   ```
   http://localhost:8000
   ```

## 📁 Cấu trúc dự án

```
WED_KNTN/
├── index.html          # File HTML chính
├── css/
│   └── style.css       # Stylesheet với Material Design
├── js/
│   └── app.js          # JavaScript functionality
├── images/             # Hình ảnh ứng dụng
│   ├── logo_app_11.png # CPR
│   ├── logo_app_12.png # Hóc dị vật
│   ├── logo_app_13.png # Xử lý vết thương
│   ├── logo_app_14.png # Sơ cứu bỏng
│   └── logo_app_15.png # Bong gân
├── assets/             # Resources khác
└── README.md           # File hướng dẫn này
```

## 🎨 Giao diện và Design

### Material Design
- **Color Palette**: Material Design 3.0
- **Typography**: Roboto font family
- **Icons**: Material Icons
- **Animations**: Smooth transitions và micro-interactions

### Responsive Design
- **Mobile-first approach**
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### Dark Mode Support
- Toggle theme trong settings
- Lưu preference trong localStorage
- Smooth transition giữa themes

## 🔧 Tính năng kỹ thuật

### Performance
- **Lazy loading** cho images
- **Debounced events** cho better performance
- **Optimized animations** với CSS transforms
- **Service Worker** support cho PWA

### Accessibility
- **Semantic HTML5** structure
- **ARIA labels** cho screen readers
- **Keyboard navigation** support
- **High contrast** mode support

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## 📱 Sử dụng trên Mobile

### PWA Features
- **Add to Home Screen**
- **Offline support** (basic features)
- **Push notifications** (future)
- **App-like experience**

### Touch Gestures
- **Swipe** cho navigation
- **Tap** cho interactions
- **Long press** cho context menus
- **Pinch to zoom** cho images

## 🔒 Security và Privacy

### Data Protection
- **No personal data storage** trên server
- **Local storage** cho preferences only
- **HTTPS required** cho production
- **CORS policies** properly configured

### Medical Disclaimer
> ⚠️ **Lưu ý quan trọng**: Ứng dụng chỉ cung cấp thông tin tham khảo, không thay thế chẩn đoán từ bác sĩ chuyên khoa. Trong trường hợp khẩn cấp, hãy gọi 115 hoặc đến cơ sở y tế gần nhất.

## 🚀 Deployment

### Static Hosting
1. **GitHub Pages**:
   ```bash
   git push origin main
   # Enable GitHub Pages in repository settings
   ```

2. **Netlify**:
   ```bash
   # Drag and drop folder to Netlify
   # Or connect Git repository
   ```

3. **Vercel**:
   ```bash
   # Connect Git repository
   # Auto-deploy on push
   ```

### Custom Domain
- Configure DNS settings
- SSL certificate auto-renewal
- CDN optimization

## 🐛 Troubleshooting

### Common Issues
1. **Images not loading**:
   - Check file paths in `index.html`
   - Ensure images exist in `images/` folder

2. **JavaScript errors**:
   - Check browser console (F12)
   - Ensure all files are loaded correctly

3. **Responsive issues**:
   - Test on different screen sizes
   - Check viewport meta tag

4. **Performance issues**:
   - Optimize image sizes
   - Enable compression on server

### Debug Mode
Enable debug mode in browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## 🤝 Contributing

### Development Setup
1. Fork repository
2. Create feature branch:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to branch:
   ```bash
   git push origin feature/new-feature
   ```
5. Create Pull Request

### Code Standards
- **ESLint** for JavaScript
- **Prettier** for code formatting
- **Semantic HTML5**
- **BEM** CSS methodology

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Liên hệ

- **Email**: support@bacsiai.vn
- **Website**: https://bacsiai.vn
- **GitHub Issues**: [Report bugs here](https://github.com/username/WED_KNTN/issues)

## 🙏 Acknowledgments

- **Material Design Team** for design guidelines
- **Medical Professionals** for content review
- **Open Source Community** for tools and libraries
- **Users** for feedback and suggestions

---

## 📋 Version History

### v1.0.0 (2026-02-17)
- ✅ Initial release
- ✅ All core features implemented
- ✅ Responsive design
- ✅ Material Design UI
- ✅ PWA support

### Upcoming Features
- 🔄 Real-time health monitoring
- 🔄 Video call with doctors
- 🔄 Medicine reminders
- 🔄 Health reports export
- 🔄 Multi-language support

---

**Made with ❤️ for better healthcare**
