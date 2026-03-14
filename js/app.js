// Global Variables
let currentScreen = 'splash-screen';
let isTyping = false;
let currentUser = null;
let healthDataListener = null;

// AI Health Chat with Ollama
let isAIChatEnabled = false;
let aiChatHistory = [];

// Add message to chat
function addMessage(message, type) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    let icon = '';
    if (type === 'ai') {
        icon = '<img src="assets/logo_wed_1.png" alt="AI" class="message-avatar">';
    } else if (type === 'system') {
        icon = '<span class="material-icons">health_and_safety</span>';
    } else if (type === 'user') {
        icon = '<span class="material-icons">person</span>';
    }
    
    // Add speaker icon for AI messages
    let speakerIcon = '';
    if (type === 'ai') {
        speakerIcon = `<button class="speaker-btn" onclick="speakText('${escapeHtml(message)}')" title="Đọc to">
                        <span class="material-icons">volume_up</span>
                    </button>`;
    }
    
    messageDiv.innerHTML = `
        <div class="message-content">
            ${icon}
            <div class="message-text-container">
                <p>${message}</p>
                ${speakerIcon}
            </div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Text-to-Speech function for Vietnamese
function speakText(text) {
    console.log('Starting text-to-speech for:', text);
    
    // Check if speech synthesis is supported
    if (!window.speechSynthesis) {
        console.error('Speech synthesis not supported in this browser');
        alert('Trình duyệt của bạn không hỗ trợ chức năng đọc văn bản. Vui lòng sử dụng Chrome, Edge, hoặc Safari.');
        return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create new speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language to Vietnamese
    utterance.lang = 'vi-VN';
    
    // Set voice parameters for better Vietnamese pronunciation
    utterance.rate = 0.8;  // Even slower for clarity
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Full volume
    
    // Get all available voices
    let voices = window.speechSynthesis.getVoices();
    console.log('Available voices:', voices.length);
    console.log('Voice list:', voices.map(v => `${v.name} (${v.lang})`));
    
    // Try to find Vietnamese voice
    let vietnameseVoice = voices.find(voice => 
        voice.lang.includes('vi') || 
        voice.lang.includes('VN') ||
        voice.name.toLowerCase().includes('vietnamese')
    );
    
    // If no Vietnamese voice found, try to force load voices
    if (!vietnameseVoice && voices.length === 0) {
        console.log('No voices loaded, trying to force load...');
        window.speechSynthesis.getVoices();
        voices = window.speechSynthesis.getVoices();
        
        // Try again after loading
        vietnameseVoice = voices.find(voice => 
            voice.lang.includes('vi') || 
            voice.lang.includes('VN') ||
            voice.name.toLowerCase().includes('vietnamese')
        );
    }
    
    if (vietnameseVoice) {
        utterance.voice = vietnameseVoice;
        console.log('Using Vietnamese voice:', vietnameseVoice.name, vietnameseVoice.lang);
    } else {
        console.log('Vietnamese voice not found, using default voice');
        // Try to use any voice that might work
        const fallbackVoice = voices.find(voice => 
            voice.lang.includes('en') || 
            voice.lang.includes('es') || 
            voice.lang.includes('fr') ||
            voice.lang.includes('de')
        );
        if (fallbackVoice) {
            utterance.voice = fallbackVoice;
            console.log('Using fallback voice:', fallbackVoice.name, fallbackVoice.lang);
        }
        
        // Show notification to user
        showNotification('Không tìm thấy giọng đọc tiếng Việt. Sử dụng giọng mặc định.', 'warning');
    }
    
    // Add event listeners
    utterance.onstart = () => {
        console.log('Started speaking text');
        showNotification('Đang đọc văn bản...', 'info');
    };
    
    utterance.onend = () => {
        console.log('Finished speaking text');
        showNotification('Đã đọc xong', 'success');
    };
    
    utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        showNotification(`Lỗi đọc văn bản: ${event.error}`, 'error');
    };
    
    // Speak the text
    try {
        window.speechSynthesis.speak(utterance);
        console.log('Speech synthesis started successfully');
    } catch (error) {
        console.error('Error starting speech synthesis:', error);
        showNotification('Không thể bắt đầu đọc văn bản', 'error');
    }
}

// Initialize voices on page load
function initializeVoices() {
    console.log('Initializing speech synthesis voices...');
    
    // Force load voices
    window.speechSynthesis.getVoices();
    
    // Set up voice change listener
    window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Voices changed, total voices:', voices.length);
        console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
        
        // Check for Vietnamese voices
        const vietnameseVoices = voices.filter(voice => 
            voice.lang.includes('vi') || 
            voice.lang.includes('VN') ||
            voice.name.toLowerCase().includes('vietnamese')
        );
        
        if (vietnameseVoices.length > 0) {
            console.log('Found Vietnamese voices:', vietnameseVoices.map(v => v.name));
        } else {
            console.log('No Vietnamese voices found');
            showNotification('Trình duyệt không có giọng đọc tiếng Việt. Sẽ sử dụng giọng mặc định.', 'warning');
        }
    };
    
    // Try to trigger voices loaded
    setTimeout(() => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Delayed voice check, voices:', voices.length);
    }, 1000);
}

// Initialize voices when page loads
document.addEventListener('DOMContentLoaded', initializeVoices);

// Also initialize voices on window load (backup)
window.addEventListener('load', initializeVoices);

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isTyping = false;
}

// Send quick message
function sendQuickMessage(message) {
    if (isTyping) return;
    
    // Add user message
    addMessage(message, 'user');
    
    // Show typing indicator
    showTypingIndicator();
    
    // Handle with AI or fallback
    handleChatMessage(message);
}

// Show typing indicator
function showTypingIndicator() {
    isTyping = true;
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
        <div class="message-content">
            <img src="assets/logo_wed_1.png" alt="AI" class="message-avatar">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
let profileDataListener = null;

// Profile data storage
let profileData = {
    name: '',
    gender: '',
    patientId: '',
    bed: '',
    room: ''
};

// Chart data storage
let chartData = {
    heartRate: [],
    spo2: [],
    temperatureC: [],
    temperatureF: []
};

// Temperature thresholds by age group
const temperatureThresholds = {
    '0-1': { min: 36.5, max: 38.0, description: 'Nhiệt độ bình thường cho trẻ sơ sinh' },
    '1-3': { min: 36.4, max: 37.8, description: 'Nhiệt độ bình thường cho trẻ nhỏ' },
    '3-5': { min: 36.4, max: 37.7, description: 'Nhiệt độ bình thường cho trẻ mẫu giáo' },
    '6-12': { min: 36.4, max: 37.6, description: 'Nhiệt độ bình thường cho trẻ em' },
    '13-18': { min: 36.2, max: 37.4, description: 'Nhiệt độ bình thường cho thanh thiếu niên' },
    '19-65': { min: 36.1, max: 37.2, description: 'Nhiệt độ bình thường cho người lớn' },
    '65+': { min: 36.0, max: 37.4, description: 'Nhiệt độ bình thường cho người cao tuổi' }
};

// Current settings
let currentAgeGroup = '19-65';
let enableTempWarning = true;

// Check Ollama status
async function checkOllamaStatus() {
    const statusElement = document.getElementById('ai-status');
    const statusText = document.getElementById('ai-status-text');
    
    try {
        // Thử kết nối đến server trước
        const testResponse = await fetch('http://localhost:3001/api/status');
        const testData = await testResponse.json();
        
        if (testData.success) {
            // Server hoạt động, kiểm tra Ollama
            const response = await fetch('http://localhost:3001/api/status');
            const data = await response.json();
            
            if (data.success && data.models && data.models.length > 0) {
                isAIChatEnabled = true;
                console.log('🤖 Ollama AI is ready!');
                
                // Update UI
                if (statusElement) {
                    statusElement.classList.remove('disconnected');
                    statusText.textContent = 'AI Y tế đã sẵn sàng';
                }
                return true;
            } else {
                isAIChatEnabled = false;
                console.log('❌ Ollama is not running or no models found');
                
                // Update UI
                if (statusElement) {
                    statusElement.classList.add('disconnected');
                    statusText.textContent = 'AI Y tế không khả dụng';
                }
                return false;
            }
        } else {
            throw new Error('Server not responding');
        }
    } catch (error) {
        isAIChatEnabled = false;
        console.log('❌ Cannot connect to Ollama server:', error.message);
        
        // Update UI
        if (statusElement) {
            statusElement.classList.add('disconnected');
            statusText.textContent = 'Không thể kết nối AI';
        }
        return false;
    }
}

// Send message to AI Health Chat
async function sendToAIHealthChat(message) {
    if (!isAIChatEnabled) {
        return "Xin lỗi, trợ lý AI y tế hiện không khả dụng. Vui lòng đảm bảo Ollama đang chạy.";
    }

    try {
        const response = await fetch('http://localhost:3001/api/health-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        
        if (data.success) {
            return data.response;
        } else {
            return "Xin lỗi, có lỗi xảy ra khi kết nối với AI y tế.";
        }
    } catch (error) {
        console.error('AI Chat Error:', error);
        return "Xin lỗi, không thể kết nối với trợ lý AI y tế ngay bây giờ.";
    }
}

// Enhanced chat message handler
async function handleChatMessage(userMessage) {
    const chatMessages = document.getElementById('chat-messages');
    
    try {
        // Try AI Health Chat first
        if (isAIChatEnabled) {
            const aiResponse = await sendToAIHealthChat(userMessage);
            hideTypingIndicator();
            addMessage(aiResponse, 'ai');
            
            // Save to history
            aiChatHistory.push({ user: userMessage, ai: aiResponse });
        } else {
            // Fallback to predefined responses
            hideTypingIndicator();
            const response = getHealthResponse(userMessage);
            addMessage(response, 'system');
        }
    } catch (error) {
        hideTypingIndicator();
        addMessage("Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.", 'system');
    }
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get predefined health responses (fallback)
function getHealthResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('sốt') || lowerMessage.includes('nhiệt độ')) {
        return "Sốt là khi nhiệt độ cơ thể trên 37.5°C. Bạn nên nghỉ ngơi, uống nhiều nước và theo dõi nhiệt độ. Nếu sốt trên 39°C hoặc kéo dài trên 3 ngày, hãy đi khám bác sĩ.";
    } else if (lowerMessage.includes('đau đầu')) {
        return "Đau đầu có thể do nhiều nguyên nhân: stress, thiếu ngủ, hoặc các vấn đề sức khỏe. Bạn nên nghỉ ngơi trong phòng yên tĩnh. Nếu đau đầu dữ dội hoặc kèm theo các triệu chứng khác, hãy đi khám.";
    } else if (lowerMessage.includes('ho')) {
        return "Ho là phản xạ tự nhiên của cơ thể. Bạn nên uống ấm, nghỉ ngơi và tránh khói bụi. Nếu ho kéo dài trên 2 tuần hoặc có đờm màu lạ, hãy đi khám.";
    } else if (lowerMessage.includes('mệt mỏi') || lowerMessage.includes('tired')) {
        return "Cảm giác mệt mỏi có thể do thiếu ngủ, stress hoặc dinh dưỡng không đủ. Hãy đảm bảo ngủ đủ 7-8 tiếng, ăn uống cân bằng và tập thể dục nhẹ nhàng.";
    } else if (lowerMessage.includes('khẩn cấp') || lowerMessage.includes('cấp cứu')) {
        return "⚠️ TÌNH HUỐNG KHẨN CẤP - Hãy gọi ngay 115!\n\nCác dấu hiệu khẩn cấp:\n- Đau ngực dữ dội\n- Khó thở nghiêm trọng\n- Đột quỵ (mặt méo, nói khó)\n- Chảy máu không ngừng\n- Bất tỉnh";
    } else {
        return "Tôi là trợ lý y tế AI. Tôi có thể tư vấn về các triệu chứng thông thường. Tuy nhiên, tôi không thay thế được bác sĩ. Nếu bạn có triệu chứng nghiêm trọng, hãy đi khám hoặc gọi cấp cứu 115.";
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Load saved temperature settings
    loadTemperatureSettings();
    
    // Load saved avatar
    loadSavedAvatar();
    
    // Load patient information
    loadPatientInfo();
    
    // Initialize Firebase first
    initializeFirebase();
    
    // Show splash screen for 3 seconds then navigate to dashboard
    setTimeout(() => {
        showScreen('dashboard-screen');
    }, 3000);
    
    // Initialize other features
    initializeHealthCharts();
    initializeAnimations();
    setupFirebaseListeners();
    
    // Check Ollama status after 2 seconds
    setTimeout(checkOllamaStatus, 2000);
});

// Firebase Initialization
function initializeFirebase() {
    // Check if Firebase is initialized
    if (!window.firebaseApp) {
        console.error('Firebase not initialized. Check firebase-config.js');
        initializeDemoMode();
        return;
    }
    
    // Check if using real config (not demo)
    if (window.firebaseApp.firebase.app().options.apiKey.includes('DemoKey')) {
        console.log('Using demo mode - Firebase features disabled');
        initializeDemoMode();
        return;
    }
    
    console.log('Using real Firebase connection');
    
    // Listen for auth state changes
    window.firebaseApp.auth.onAuthStateChanged((user) => {
        currentUser = user;
        if (user) {
            console.log('User logged in:', user.uid);
            loadUserData();
        } else {
            console.log('User not logged in, signing in anonymously...');
            signInAnonymously();
        }
    });
}

// Demo mode initialization
function initializeDemoMode() {
    console.log('Initializing demo mode without Firebase');
    currentUser = { uid: 'demo-user', isAnonymous: true };
    
    // Load demo data
    loadDemoData();
    
    // Set up demo real-time updates
    startDemoUpdates();
}

// Load demo data - Cấu trúc giống Android
function loadDemoData() {
    // ProfileData structure từ Android
    const demoUserData = {
        name: 'Người dùng Demo',
        age: '30',
        gender: 'Nam',
        bloodType: 'A+',
        allergies: 'Không có',
        emergencyContact: '0123456789',
        medicalHistory: 'Không có',
        room: 'A101',
        bed: '01'
    };
    
    updateProfileUI(demoUserData);
    
    // SensorData structure từ Android - ĐẦY ĐỦ 8 SENSORS
    const demoSensorData = {
        DHT11: {
            Temperature: 28.5,
            Humidity: 65
        },
        DS18B20: {
            TemperatureC: 36.5,
            TemperatureF: 97.7
        },
        MAX30100: {
            HeartRate: 108,
            SpO2: 98
        },
        PIR: {
            Motion: 'detected',
            Count: 5
        }
    };
    
    updateHealthUI(demoSensorData);
}

// Start demo real-time updates - Giống cấu trúc Android
function startDemoUpdates() {
    setInterval(() => {
        // Random có thể trả về 0 để test - ĐẦY ĐỦ 8 SENSORS
        const sensorData = {
            DHT11: {
                Temperature: Math.random() > 0.1 ? 25 + Math.random() * 8 : 0,
                Humidity: Math.random() > 0.1 ? 60 + Math.floor(Math.random() * 20) : 0
            },
            DS18B20: {
                TemperatureC: Math.random() > 0.1 ? 35 + Math.random() * 3 : 0,
                TemperatureF: Math.random() > 0.1 ? 95 + Math.random() * 5 : 0
            },
            MAX30100: {
                HeartRate: Math.random() > 0.2 ? 60 + Math.floor(Math.random() * 40) : 0,
                SpO2: Math.random() > 0.1 ? 95 + Math.floor(Math.random() * 5) : 0
            },
            PIR: {
                Motion: Math.random() > 0.5 ? 'detected' : 'none',
                Count: Math.floor(Math.random() * 10)
            }
        };
        
        updateHealthUI(sensorData);
        console.log('Demo sensor data updated (ALL 8 SENSORS):', sensorData);
    }, 3000); // Update every 3 seconds for demo
}

// Anonymous sign-in for demo
function signInAnonymously() {
    window.firebaseApp.auth.signInAnonymously()
        .then((userCredential) => {
            console.log('Anonymous user signed in:', userCredential.user.uid);
            currentUser = userCredential.user;
            loadUserData();
        })
        .catch((error) => {
            console.error('Anonymous sign-in failed:', error);
        });
}

// Load user data from Firebase - Cấu trúc Android
function loadUserData() {
    if (!currentUser) return;
    
    console.log('Loading data from Firebase Realtime Database...');
    
    // Load sensor data từ root (giống Android)
    const sensorRef = window.firebaseApp.database.ref();
    
    healthDataListener = sensorRef.on('value', (snapshot) => {
        const sensorData = snapshot.val();
        console.log('Firebase sensor data received:', sensorData);
        
        if (sensorData) {
            updateHealthUI(sensorData);
        } else {
            console.log('No sensor data available, using demo data');
            // Load demo data if no Firebase data - ĐẦY ĐỦ 8 SENSORS
            const demoSensorData = {
                DHT11: { Temperature: 28.5, Humidity: 65 },
                DS18B20: { TemperatureC: 36.5, TemperatureF: 97.7 },
                MAX30100: { HeartRate: 108, SpO2: 98 },
                PIR: { Motion: 'detected', Count: 5 }
            };
            updateHealthUI(demoSensorData);
        }
    }, (error) => {
        console.error('Firebase data loading error:', error);
        // Fallback to demo mode on error
        initializeDemoMode();
    });
    
    // Load profile data từ SharedPreferences simulation
    loadProfileData();
}

// Load profile data simulation (SharedPreferences trong Android)
function loadProfileData() {
    // Trong Android dùng SharedPreferences, web sẽ dùng localStorage
    const savedProfile = localStorage.getItem('profileData');
    let profileData;
    
    if (savedProfile) {
        profileData = JSON.parse(savedProfile);
    } else {
        // Default profile data
        profileData = {
            name: 'Người dùng Demo',
            age: '30',
            gender: 'Nam',
            bloodType: 'A+',
            allergies: 'Không có',
            emergencyContact: '0123456789',
            medicalHistory: 'Không có',
            room: 'A101',
            bed: '01'
        };
        localStorage.setItem('profileData', JSON.stringify(profileData));
    }
    
    updateProfileUI(profileData);
}

// Create default user data
function createDefaultUserData() {
    if (!currentUser) return;
    
    const defaultUserData = {
        uid: currentUser.uid,
        name: 'Người dùng',
        email: 'user@example.com',
        phone: '0123456789',
        birthDate: '01/01/1990',
        bloodType: 'A+',
        medicalHistory: 'Không có',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    window.firebaseApp.db.collection('users').doc(currentUser.uid).set(defaultUserData)
        .then(() => {
            console.log('Default user data created');
        })
        .catch((error) => {
            console.error('Error creating user data:', error);
        });
}

// Update individual stat card
function updateStatCard(selector, value) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    const statCard = element.closest('.stat-card');
    
    // Cập nhật giá trị
    element.textContent = value;
    
    // Thêm/xóa class zero-value khi giá trị là 0
    if (value === 0 || value === '0' || (typeof value === 'string' && value.includes('0') && !value.includes('.'))) {
        statCard.classList.add('zero-value');
    } else {
        statCard.classList.remove('zero-value');
    }
}

// Update Profile UI with Firebase data - Cấu trúc Android
function updateProfileUI(userData) {
    // Update dashboard user info
    const userNameElements = document.querySelectorAll('.user-details h2');
    userNameElements.forEach(el => {
        if (el) el.textContent = `Xin chào, ${userData.name || 'Người dùng'}`;
    });
    
    // Update profile screen
    const profileNameElement = document.querySelector('.profile-info h2');
    if (profileNameElement) profileNameElement.textContent = userData.name || 'Người dùng';
    
    const profileEmailElement = document.querySelector('.profile-info p');
    if (profileEmailElement) profileEmailElement.textContent = `BN: ${userData.name || 'Người dùng'} - Phòng: ${userData.room || 'A101'} - Giường: ${userData.bed || '01'}`;
    
    // Update profile details với cấu trúc Android
    updateProfileDetails(userData);
}

// Update profile details - Cấu trúc Android ProfileData
function updateProfileDetails(userData) {
    const details = [
        { selector: '.info-item:nth-child(1) strong', value: userData.name || 'Người dùng' },
        { selector: '.info-item:nth-child(2) strong', value: userData.age || '30' },
        { selector: '.info-item:nth-child(3) strong', value: userData.gender || 'Nam' },
        { selector: '.section:nth-child(2) .info-item:nth-child(1) strong', value: userData.bloodType || 'A+' },
        { selector: '.section:nth-child(2) .info-item:nth-child(2) strong', value: userData.allergies || 'Không có' },
        { selector: '.section:nth-child(2) .info-item:nth-child(3) strong', value: userData.emergencyContact || '0123456789' },
        { selector: '.section:nth-child(2) .info-item:nth-child(4) strong', value: userData.medicalHistory || 'Không có' }
    ];
    
    details.forEach(detail => {
        const element = document.querySelector(detail.selector);
        if (element) element.textContent = detail.value;
    });
}

// Update Health UI with Firebase data - Cấu trúc Android
function updateHealthUI(sensorData) {
    // Lấy giá trị từ Firebase, không dùng default khi có data
    const heartRate = sensorData.MAX30100?.HeartRate;
    const spo2 = sensorData.MAX30100?.SpO2;
    const temperatureC = sensorData.DS18B20?.TemperatureC;
    const temperatureF = sensorData.DS18B20?.TemperatureF;
    const motion = sensorData.PIR?.Motion;
    const motionCount = sensorData.PIR?.Count;
    const ambientTemp = sensorData.DHT11?.Temperature;
    const humidity = sensorData.DHT11?.Humidity;
    
    // Update dashboard stats với TẤT CẢ 8 sensors
    updateStatCard('.stat-card:nth-child(1) h3', heartRate !== undefined && heartRate !== null ? heartRate : 108);
    updateStatCard('.stat-card:nth-child(2) h3', spo2 !== undefined && spo2 !== null ? `${spo2}%` : '98%');
    updateStatCard('.stat-card:nth-child(3) h3', temperatureC !== undefined && temperatureC !== null ? `${temperatureC.toFixed(1)}°C` : '36.5°C');
    updateStatCard('.stat-card:nth-child(4) h3', temperatureF !== undefined && temperatureF !== null ? `${temperatureF.toFixed(1)}°F` : '97.7°F');
    updateStatCard('.stat-card:nth-child(5) h3', motion !== undefined && motion !== null ? motion : 'none');
    updateStatCard('.stat-card:nth-child(6) h3', motionCount !== undefined && motionCount !== null ? motionCount : 0);
    updateStatCard('.stat-card:nth-child(7) h3', ambientTemp !== undefined && ambientTemp !== null ? `${ambientTemp.toFixed(1)}°C` : '28.5°C');
    updateStatCard('.stat-card:nth-child(8) h3', humidity !== undefined && humidity !== null ? `${humidity}%` : '65%');
    
    // Update medical monitor current values
    updateMedicalMonitorValues(sensorData);
    
    // Update health screen metrics
    updateHealthMetrics(sensorData);
    
    // Update ALL charts with new data
    updateAllCharts(sensorData);
    
    // Log để debug
    console.log('Updated UI with ALL sensor data:', {
        heartRate,
        spo2,
        temperatureC,
        temperatureF,
        motion,
        motionCount,
        ambientTemp,
        humidity
    });
}

// Update medical monitor current values
function updateMedicalMonitorValues(sensorData) {
    const heartRate = sensorData.MAX30100?.HeartRate;
    const spo2 = sensorData.MAX30100?.SpO2;
    const temperatureC = sensorData.DS18B20?.TemperatureC;
    const temperatureF = sensorData.DS18B20?.TemperatureF;
    const motion = sensorData.PIR?.Motion;
    const motionCount = sensorData.PIR?.Count;
    const ambientTemp = sensorData.DHT11?.Temperature;
    const humidity = sensorData.DHT11?.Humidity;
    
    // Update current value displays
    updateCurrentValue('current-heart-rate', heartRate !== undefined && heartRate !== null ? `${heartRate} bpm` : '108 bpm');
    updateCurrentValue('current-spo2', spo2 !== undefined && spo2 !== null ? `${spo2}%` : '98%');
    updateCurrentValue('current-temp-c', temperatureC !== undefined && temperatureC !== null ? `${temperatureC.toFixed(1)}°C` : '36.5°C');
    updateCurrentValue('current-temp-f', temperatureF !== undefined && temperatureF !== null ? `${temperatureF.toFixed(1)}°F` : '97.7°F');
    
    // Update additional sensors
    updateSensorValue('motion-status', motion !== undefined && motion !== null ? motion : 'none');
    updateSensorValue('motion-count', motionCount !== undefined && motionCount !== null ? motionCount : 0);
    updateSensorValue('ambient-temp', ambientTemp !== undefined && ambientTemp !== null ? `${ambientTemp.toFixed(1)}°C` : '28.5°C');
    updateSensorValue('ambient-humidity', humidity !== undefined && humidity !== null ? `${humidity}%` : '65%');
}

// Update current value warning states
function updateCurrentValueWarnings(heartRateWarning, tempWarning) {
    // Update heart rate current value
    const heartRateElement = document.getElementById('current-heart-rate');
    if (heartRateElement) {
        if (heartRateWarning) {
            heartRateElement.classList.add('warning');
        } else {
            heartRateElement.classList.remove('warning');
        }
    }
    
    // Update temperature current value
    const tempElement = document.getElementById('current-temp-c');
    if (tempElement) {
        if (tempWarning) {
            tempElement.classList.add('warning');
        } else {
            tempElement.classList.remove('warning');
        }
    }
}

// Temperature Settings Modal Functions
function showTemperatureSettings() {
    const modal = document.getElementById('temperature-settings-modal');
    modal.classList.add('show');
    updateTemperatureThresholds();
}

function closeTemperatureSettings() {
    const modal = document.getElementById('temperature-settings-modal');
    modal.classList.remove('show');
}

function updateTemperatureThresholds() {
    const ageSelect = document.getElementById('age-select');
    const selectedAge = ageSelect.value;
    const threshold = temperatureThresholds[selectedAge];
    
    // Update display
    document.getElementById('min-temp-display').textContent = `${threshold.min}°C`;
    document.getElementById('max-temp-display').textContent = `${threshold.max}°C`;
    document.getElementById('range-description').textContent = threshold.description;
    
    currentAgeGroup = selectedAge;
    console.log('Updated temperature thresholds for age group:', selectedAge, threshold);
}

function saveTemperatureSettings() {
    const enableWarningCheckbox = document.getElementById('enable-temp-warning');
    enableTempWarning = enableWarningCheckbox.checked;
    
    // Save to localStorage
    localStorage.setItem('temperatureSettings', JSON.stringify({
        ageGroup: currentAgeGroup,
        enableWarning: enableTempWarning
    }));
    
    // Redraw charts with new settings
    redrawAllCharts();
    
    closeTemperatureSettings();
    console.log('Saved temperature settings:', { ageGroup: currentAgeGroup, enableTempWarning });
}

// Load saved settings
function loadTemperatureSettings() {
    const savedSettings = localStorage.getItem('temperatureSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        currentAgeGroup = settings.ageGroup || '19-65';
        enableTempWarning = settings.enableWarning !== false; // default to true
        
        // Update UI
        document.getElementById('age-select').value = currentAgeGroup;
        document.getElementById('enable-temp-warning').checked = enableTempWarning;
        updateTemperatureThresholds();
    }
}

// Update current value in medical monitor
function updateCurrentValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// Update sensor value in medical monitor
function updateSensorValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}
// Update health metrics screen - Cấu trúc Android
function updateHealthMetrics(sensorData) {
    const heartRate = sensorData.MAX30100?.HeartRate;
    const temperature = sensorData.DS18B20?.TemperatureC;
    const humidity = sensorData.DHT11?.Humidity;
    const spo2 = sensorData.MAX30100?.SpO2;
    
    const metrics = [
        { selector: '.metric-card:nth-child(1) h4', value: heartRate !== undefined && heartRate !== null ? heartRate : 108 },
        { selector: '.metric-card:nth-child(2) h4', value: temperature !== undefined && temperature !== null ? `${temperature.toFixed(1)}°C` : '36.5°C' },
        { selector: '.metric-card:nth-child(3) h4', value: humidity !== undefined && humidity !== null ? `${humidity}%` : '65%' },
        { selector: '.metric-card:nth-child(4) h4', value: spo2 !== undefined && spo2 !== null ? `${spo2}%` : '98%' }
    ];
    
    metrics.forEach(metric => {
        const element = document.querySelector(metric.selector);
        if (element) element.textContent = metric.value;
    });
}

// Update health chart with real-time data
function updateHealthChart(heartRateHistory) {
    const canvas = document.getElementById('heart-rate-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    drawHeartRateChart(ctx, canvas.width, canvas.height, heartRateHistory);
}

// Setup Firebase listeners
function setupFirebaseListeners() {
    // Listen for real-time updates
    console.log('Firebase listeners setup completed');
}

// Save health data to Firebase
function saveHealthData(data) {
    if (!currentUser) return;
    
    const healthRef = window.firebaseApp.database.ref(`health/${currentUser.uid}`);
    
    // Add timestamp
    data.timestamp = firebase.database.ServerValue.TIMESTAMP;
    
    healthRef.update(data)
        .then(() => {
            console.log('Health data saved successfully');
        })
        .catch((error) => {
            console.error('Error saving health data:', error);
        });
}

// Save user profile to Firebase
function saveUserProfile(data) {
    if (!currentUser) {
        // If no Firebase user, just update local display
        updateMonitorPatientInfo();
        showNotification('Cập nhật hồ sơ thành công!');
        return;
    }
    
    const userRef = window.firebaseApp.db.collection('users').doc(currentUser.uid);
    
    data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    
    userRef.update(data)
        .then(() => {
            console.log('Profile updated successfully');
            // Update monitor display after saving
            updateMonitorPatientInfo();
            showNotification('Cập nhật hồ sơ thành công!');
        })
        .catch((error) => {
            console.error('Error updating profile:', error);
            showNotification('Cập nhật hồ sơ thất bại!', 'error');
        });
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type} fade-in`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#4caf50' : '#f44336',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        zIndex: '9999',
        maxWidth: '300px'
    });
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Send quick message
function sendQuickMessage(message) {
    if (isTyping) return;
    
    // Add user message
    addMessage(message, 'user');
    
    // Show typing indicator
    showTypingIndicator();
    
    // Handle with AI or fallback
    handleChatMessage(message);
}

// Simulate real-time health data updates (for demo)
function simulateHealthDataUpdates() {
    if (!currentUser) return;
    
    setInterval(() => {
        const healthData = {
            heartRate: 60 + Math.floor(Math.random() * 40),
            bloodPressure: `${110 + Math.floor(Math.random() * 20)}/${70 + Math.floor(Math.random() * 15)}`,
            temperature: (36 + Math.random() * 2).toFixed(1),
            spo2: 95 + Math.floor(Math.random() * 5)
        };
        
        // Add to history
        const historyRef = window.firebaseApp.database.ref(`health/${currentUser.uid}/heartRateHistory`);
        const newEntry = {
            value: healthData.heartRate,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        
        historyRef.push(newEntry);
        
        // Update current data
        saveHealthData(healthData);
    }, 10000); // Update every 10 seconds
}

// Clean up listeners when page unloads
window.addEventListener('beforeunload', () => {
    if (healthDataListener) healthDataListener.off();
    if (profileDataListener) profileDataListener.off();
});

// Screen Navigation
function showScreen(screenId) {
    // Hide current screen
    const currentScreenElement = document.getElementById(currentScreen);
    if (currentScreenElement) {
        currentScreenElement.classList.remove('active');
    }
    
    // Show new screen
    const newScreenElement = document.getElementById(screenId);
    if (newScreenElement) {
        newScreenElement.classList.add('active');
        currentScreen = screenId;
        
        // Add animation
        newScreenElement.classList.add('fade-in');
        setTimeout(() => {
            newScreenElement.classList.remove('fade-in');
        }, 300);
    }
    
    // Update page title
    updatePageTitle(screenId);
}

// Update Page Title
function updatePageTitle(screenId) {
    const titles = {
        'splash-screen': 'THEO DÕI THÔNG MINH - Đang tải...',
        'dashboard-screen': 'THEO DÕI THÔNG MINH - Trang chủ',
        'profile-screen': 'THEO DÕI THÔNG MINH - Hồ sơ',
        'health-screen': 'THEO DÕI THÔNG MINH - Sức khỏe',
        'environment-screen': 'THEO DÕI THÔNG MINH - Môi trường',
        'notification-screen': 'THEO DÕI THÔNG MINH - Tin tức',
        'chat-screen': 'THEO DÕI THÔNG MINH - Chat AI',
        'firstaid-screen': 'THEO DÕI THÔNG MINH - Sơ cứu'
    };
    
    document.title = titles[screenId] || 'THEO DÕI THÔNG MINH';
}

// First Aid Techniques
function toggleTechnique(card) {
    const isExpanded = card.classList.contains('expanded');
    
    // Close all other technique cards
    document.querySelectorAll('.technique-card').forEach(otherCard => {
        if (otherCard !== card) {
            otherCard.classList.remove('expanded');
        }
    });
    
    // Toggle current card
    if (isExpanded) {
        card.classList.remove('expanded');
    } else {
        card.classList.add('expanded');
        // Scroll to the expanded card
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// Chat Functionality
function initializeChat() {
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.addEventListener('keypress', handleKeyPress);
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const chatMessages = document.getElementById('chat-messages');
    
    const message = messageInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    
    // Clear input
    messageInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Handle with AI or fallback
    handleChatMessage(message);
}

// Show typing indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    const typingId = 'typing-' + Date.now();
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing';
    typingDiv.id = typingId;
    typingDiv.innerHTML = `
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return typingId;
}

// Remove typing indicator
function removeTypingIndicator(typingId) {
    const typingElement = document.getElementById(typingId);
    if (typingElement) {
        typingElement.remove();
    }
}

// Get predefined health responses (fallback)
function getHealthResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('sốt') || lowerMessage.includes('nhiệt độ')) {
        return "Sốt là khi nhiệt độ cơ thể trên 37.5°C. Bạn nên nghỉ ngơi, uống nhiều nước và theo dõi nhiệt độ. Nếu sốt trên 39°C hoặc kéo dài trên 3 ngày, hãy đi khám bác sĩ.";
    } else if (lowerMessage.includes('đau đầu')) {
        return "Đau đầu có thể do nhiều nguyên nhân: stress, thiếu ngủ, hoặc các vấn đề sức khỏe. Bạn nên nghỉ ngơi trong phòng yên tĩnh. Nếu đau đầu dữ dội hoặc kèm theo các triệu chứng khác, hãy đi khám.";
    } else if (lowerMessage.includes('ho')) {
        return "Ho là phản xạ tự nhiên của cơ thể. Bạn nên uống ấm, nghỉ ngơi và tránh khói bụi. Nếu ho kéo dài trên 2 tuần hoặc có đờm màu lạ, hãy đi khám.";
    } else if (lowerMessage.includes('mệt mỏi') || lowerMessage.includes('tired')) {
        return "Cảm giác mệt mỏi có thể do thiếu ngủ, stress hoặc dinh dưỡng không đủ. Hãy đảm bảo ngủ đủ 7-8 tiếng, ăn uống cân bằng và tập thể dục nhẹ nhàng.";
    } else if (lowerMessage.includes('khẩn cấp') || lowerMessage.includes('cấp cứu')) {
        return " TÌNH HUỐNG KHẨN CẤP - Hãy gọi ngay 115!\n\nCác dấu hiệu khẩn cấp:\n- Đau ngực dữ dội\n- Khó thở nghiêm trọng\n- Đột quỵ (mặt méo, nói khó)\n- Chảy máu không ngừng\n- Bất tỉnh";
    } else {
        return "Tôi là trợ lý y tế AI. Tôi có thể tư vấn về các triệu chứng thông thường. Tuy nhiên, tôi không thay thế được bác sĩ. Nếu bạn có triệu chứng nghiêm trọng, hãy đi khám hoặc gọi cấp cứu 115.";
    }
}

// Initialize AI Chat on page load
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Check Ollama status after 2 seconds
    setTimeout(checkOllamaStatus, 2000);
});

function showTypingIndicator() {
    isTyping = true;
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    const icon = document.createElement('span');
    icon.className = 'material-icons';
    icon.textContent = 'smart_toy';
    avatarDiv.appendChild(icon);
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    
    typingDiv.appendChild(avatarDiv);
    typingDiv.appendChild(contentDiv);
    messagesContainer.appendChild(typingDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function generateAIResponse(userMessage) {
    const responses = {
        'Tôi bị đau đầu': 'Đau đầu có thể do nhiều nguyên nhân: stress, thiếu ngủ, mất nước, hoặc các vấn đề sức khỏe nghiêm trọng hơn. Bạn nên: 1) Nghỉ ngơi trong phòng yên tĩnh, 2) Uống đủ nước, 3) Tránh ánh sáng mạnh và tiếng ồn, 4) Nếu đau đầu kéo dài hoặc nghiêm trọng, hãy đến gặp bác sĩ.',
        'Tôi bị ho': 'Ho là phản xạ tự nhiên của cơ thể để làm sạch đường thở. Bạn nên: 1) Uống nhiều nước ấm, 2) Súc miệng bằng nước muối, 3) Dùng mật ong với chanh, 4) Tránh khói thuốc và không khí khô, 5) Nếu ho kéo dài hơn 1 tuần, hãy đến gặp bác sĩ.',
        'Tôi bị sốt': 'Sốt là phản ứng của cơ thể chống lại nhiễm trùng. Bạn nên: 1) Nghỉ ngơi nhiều, 2) Uống nhiều nước, 3) Chườm mát nếu sốt cao, 4) Mặc quần áo thoáng mát, 5) Theo dõi nhiệt độ, 6) Nếu sốt trên 39°C hoặc kéo dài hơn 3 ngày, hãy đến gặp bác sĩ.',
        'Tôi bị đau bụng': 'Đau bụng có thể do nhiều nguyên nhân từ tiêu hóa đến các vấn đề nghiêm trọng hơn. Bạn nên: 1) Nghỉ ngơi, 2) Tránh ăn đồ nặng, 3) Uống nước ấm, 4) Theo dõi các triệu chứng khác, 5) Nếu đau nghiêm trọng, kéo dài hoặc có sốt, hãy đến gặp bác sĩ ngay.'
    };
    
    // Check for exact matches first
    if (responses[userMessage]) {
        return responses[userMessage];
    }
    
    // Generate contextual responses
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('đau đầu') || lowerMessage.includes('headache')) {
        return responses['Tôi bị đau đầu'];
    } else if (lowerMessage.includes('ho') || lowerMessage.includes('cough')) {
        return responses['Tôi bị ho'];
    } else if (lowerMessage.includes('sốt') || lowerMessage.includes('fever')) {
        return responses['Tôi bị sốt'];
    } else if (lowerMessage.includes('đau bụng') || lowerMessage.includes('stomach')) {
        return responses['Tôi bị đau bụng'];
    } else if (lowerMessage.includes('cảm ơn') || lowerMessage.includes('thank')) {
        return 'Rất vui vì đã giúp được bạn! Nếu có câu hỏi nào khác về sức khỏe, đừng ngần ngại hỏi nhé.';
    } else if (lowerMessage.includes('chào') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return 'Xin chào! Tôi là Bác sĩ AI. Tôi có thể giúp gì cho bạn về sức khỏe hôm nay?';
    } else {
        return 'Tôi hiểu bạn đang quan tâm đến sức khỏe. Tuy nhiên, để đưa ra tư vấn chính xác, bạn có thể mô tả chi tiết hơn về triệu chứng của mình được không? Lưu ý rằng tôi chỉ cung cấp thông tin tham khảo, không thay thế chẩn đoán từ bác sĩ chuyên khoa.';
    }
}

// News Tab Switching
function switchNewsTab(tabBtn, source) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked tab
    tabBtn.classList.add('active');
    
    // Update iframe source
    const newsFrame = document.getElementById('news-frame');
    if (newsFrame) {
        const sources = {
            'vnexpress': 'https://vnexpress.net/suc-khoe',
            'thanhnien': 'https://thanhnien.vn/suc-khoe',
            'tuoitre': 'https://tuoitre.vn/suc-khoe'
        };
        
        newsFrame.src = sources[source] || sources['vnexpress'];
    }
}

// Health Charts
function initializeHealthCharts() {
    // Initialize chart data with some default values
    chartData = {
        heartRate: [108],
        spo2: [98],
        temperatureC: [36.5],
        temperatureF: [97.7]
    };
    
    // Initialize 4 charts for different sensors
    const heartRateCanvas = document.getElementById('heart-rate-chart');
    const spo2Canvas = document.getElementById('spo2-chart');
    const temperatureCCanvas = document.getElementById('temperature-c-chart');
    const temperatureFCanvas = document.getElementById('temperature-f-chart');
    
    if (heartRateCanvas) {
        const ctx = heartRateCanvas.getContext('2d');
        drawLineChart(ctx, heartRateCanvas.width, heartRateCanvas.height, chartData.heartRate, '#1976d2', 'Nhịp tim');
    }
    
    if (spo2Canvas) {
        const ctx = spo2Canvas.getContext('2d');
        drawLineChart(ctx, spo2Canvas.width, spo2Canvas.height, chartData.spo2, '#4caf50', 'SpO2');
    }
    
    if (temperatureCCanvas) {
        const ctx = temperatureCCanvas.getContext('2d');
        drawLineChart(ctx, temperatureCCanvas.width, temperatureCCanvas.height, chartData.temperatureC, '#ff9800', 'Nhiệt độ °C');
    }
    
    if (temperatureFCanvas) {
        const ctx = temperatureFCanvas.getContext('2d');
        drawLineChart(ctx, temperatureFCanvas.width, temperatureFCanvas.height, chartData.temperatureF, '#f44336', 'Nhiệt độ °F');
    }
    
    console.log('Charts initialized with data:', chartData);
}

// Chart data storage
const MAX_DATA_POINTS = 20;

// Update all charts with new sensor data
function updateAllCharts(sensorData) {
    const heartRate = sensorData.MAX30100?.HeartRate;
    const spo2 = sensorData.MAX30100?.SpO2;
    const temperatureC = sensorData.DS18B20?.TemperatureC;
    const temperatureF = sensorData.DS18B20?.TemperatureF;
    
    // Add new data points
    if (heartRate !== undefined && heartRate !== null) {
        chartData.heartRate.push(heartRate);
        if (chartData.heartRate.length > MAX_DATA_POINTS) {
            chartData.heartRate.shift();
        }
    }
    
    if (spo2 !== undefined && spo2 !== null) {
        chartData.spo2.push(spo2);
        if (chartData.spo2.length > MAX_DATA_POINTS) {
            chartData.spo2.shift();
        }
    }
    
    if (temperatureC !== undefined && temperatureC !== null) {
        chartData.temperatureC.push(temperatureC);
        if (chartData.temperatureC.length > MAX_DATA_POINTS) {
            chartData.temperatureC.shift();
        }
    }
    
    if (temperatureF !== undefined && temperatureF !== null) {
        chartData.temperatureF.push(temperatureF);
        if (chartData.temperatureF.length > MAX_DATA_POINTS) {
            chartData.temperatureF.shift();
        }
    }
    
    // Redraw all charts
    redrawAllCharts();
}

// Redraw all charts
function redrawAllCharts() {
    const heartRateCanvas = document.getElementById('heart-rate-chart');
    const spo2Canvas = document.getElementById('spo2-chart');
    const temperatureCCanvas = document.getElementById('temperature-c-chart');
    const temperatureFCanvas = document.getElementById('temperature-f-chart');
    
    // Get current values
    const currentHeartRate = chartData.heartRate.length > 0 ? chartData.heartRate[chartData.heartRate.length - 1] : 0;
    const currentSpo2 = chartData.spo2.length > 0 ? chartData.spo2[chartData.spo2.length - 1] : 0;
    
    // Check for warnings
    const heartRateWarning = currentHeartRate > 120;
    const tempWarning = enableTempWarning && chartData.temperatureC.length > 0 && 
        (chartData.temperatureC[chartData.temperatureC.length - 1] < temperatureThresholds[currentAgeGroup].min ||
         chartData.temperatureC[chartData.temperatureC.length - 1] > temperatureThresholds[currentAgeGroup].max);
    
    // Update monitor status based on heart rate and SpO2
    updateMonitorStatus(currentHeartRate, currentSpo2);
    
    if (heartRateCanvas) {
        const ctx = heartRateCanvas.getContext('2d');
        drawLineChart(ctx, heartRateCanvas.width, heartRateCanvas.height, chartData.heartRate, '#1976d2', 'Nhịp tim', heartRateWarning);
    }
    
    if (spo2Canvas) {
        const ctx = spo2Canvas.getContext('2d');
        drawLineChart(ctx, spo2Canvas.width, spo2Canvas.height, chartData.spo2, '#4caf50', 'SpO2');
    }
    
    if (temperatureCCanvas) {
        const ctx = temperatureCCanvas.getContext('2d');
        drawLineChart(ctx, temperatureCCanvas.width, temperatureCCanvas.height, chartData.temperatureC, '#ff9800', 'Nhiệt độ °C', tempWarning);
    }
    
    if (temperatureFCanvas) {
        const ctx = temperatureFCanvas.getContext('2d');
        drawLineChart(ctx, temperatureFCanvas.width, temperatureFCanvas.height, chartData.temperatureF, '#f44336', 'Nhiệt độ °F');
    }
    
    // Update current value warning states
    updateCurrentValueWarnings(heartRateWarning, tempWarning);
}

// Generic line chart drawing function
function drawLineChart(ctx, width, height, data, color, label, isWarning = false) {
    ctx.clearRect(0, 0, width, height);
    
    if (!data || data.length === 0) {
        // Draw no data message
        ctx.fillStyle = '#999';
        ctx.font = '14px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('Chưa có dữ liệu', width / 2, height / 2);
        return;
    }
    
    const maxValue = Math.max(...data) || 100;
    const minValue = Math.min(...data) || 0;
    const range = maxValue - minValue || 1;
    const padding = 20;
    
    // Use warning color if needed
    const lineColor = isWarning ? '#f44336' : color;
    
    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 4; i++) {
        const y = padding + (height - 2 * padding) * (i / 4);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Draw data line
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = padding + (width - 2 * padding) * (index / Math.max(data.length - 1, 1));
        const y = height - padding - ((value - minValue) / range) * (height - 2 * padding);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw data points
    ctx.fillStyle = lineColor;
    data.forEach((value, index) => {
        const x = padding + (width - 2 * padding) * (index / Math.max(data.length - 1, 1));
        const y = height - padding - ((value - minValue) / range) * (height - 2 * padding);
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Draw current value
    if (data.length > 0) {
        const currentValue = data[data.length - 1];
        ctx.fillStyle = lineColor;
        ctx.font = 'bold 16px Roboto';
        ctx.textAlign = 'right';
        ctx.fillText(currentValue.toFixed(1), width - 5, 20);
    }
    
    console.log(`Drew ${label} chart with data:`, data, isWarning ? '(WARNING)' : '(NORMAL)');
}

function drawHeartRateChart(ctx, width, height, heartRateHistory = null) {
    ctx.clearRect(0, 0, width, height);
    
    // Use provided history or default data
    let data;
    if (heartRateHistory && typeof heartRateHistory === 'object') {
        // Convert Firebase object to array
        data = Object.values(heartRateHistory).map(entry => entry.value || entry);
    } else {
        // Default sample data
        data = [72, 75, 78, 82, 85, 88, 92, 108, 95, 88, 82, 78, 75, 72];
    }
    
    // Ensure we have data
    if (!data || data.length === 0) {
        data = [72, 75, 78, 82, 85, 88, 92, 108, 95, 88, 82, 78, 75, 72];
    }
    
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    
    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 4; i++) {
        const y = (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Draw data line
    ctx.strokeStyle = '#1976d2';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = (width / (data.length - 1)) * index;
        const y = height - ((value - minValue) / range) * height * 0.8 - height * 0.1;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw data points
    ctx.fillStyle = '#1976d2';
    data.forEach((value, index) => {
        const x = (width / (data.length - 1)) * index;
        const y = height - ((value - minValue) / range) * height * 0.8 - height * 0.1;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Animations
function initializeAnimations() {
    // Add intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.stat-card, .feature-card, .technique-card').forEach(el => {
        observer.observe(el);
    });
}

// Emergency Call
function makeEmergencyCall() {
    if (confirm('Bạn có muốn gọi số khẩn cấp 115 không?')) {
        // In a real app, this would initiate a phone call
        window.location.href = 'tel:115';
    }
}

// Utility Functions
function formatTime(date) {
    return date.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function formatDate(date) {
    return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    // In a production app, you might want to send this to an error tracking service
});

// Performance Monitoring
window.addEventListener('load', function() {
    if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    }
});

// Service Worker Registration (disabled for demo)
// Uncomment when you have a real sw.js file and Firebase project
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
*/

// Update Monitor Patient Information
function updateMonitorPatientInfo() {
    // Get data from profile form
    profileData.name = document.getElementById('full-name')?.value || 'Chưa cập nhật';
    profileData.gender = document.querySelector('input[name="gender"]:checked')?.value || 'Chưa cập nhật';
    profileData.patientId = document.getElementById('patient-id')?.value || 'Chưa cập nhật';
    profileData.bed = document.getElementById('bed')?.value || 'Chưa cập nhật';
    profileData.room = document.getElementById('room')?.value || 'Chưa cập nhật';
    
    // Update monitor display
    updateMonitorDisplay();
    
    // Save to localStorage for persistence
    localStorage.setItem('patientInfo', JSON.stringify(profileData));
}

// Change Avatar Function
function changeAvatar() {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Update avatar image
                const avatarImg = document.querySelector('.avatar-large img');
                if (avatarImg) {
                    avatarImg.src = e.target.result;
                    avatarImg.style.display = 'block';
                    
                    // Hide fallback icon
                    const fallbackIcon = document.querySelector('.avatar-large .material-icons');
                    if (fallbackIcon) {
                        fallbackIcon.style.display = 'none';
                    }
                    
                    // Save to localStorage
                    localStorage.setItem('userAvatar', e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    // Trigger file selection
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}

// Load saved avatar on page load
function loadSavedAvatar() {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        const avatarImg = document.querySelector('.avatar-large img');
        if (avatarImg) {
            avatarImg.src = savedAvatar;
            avatarImg.style.display = 'block';
            
            const fallbackIcon = document.querySelector('.avatar-large .material-icons');
            if (fallbackIcon) {
                fallbackIcon.style.display = 'none';
            }
        }
    }
}

// Load Patient Information from localStorage
function loadPatientInfo() {
    const saved = localStorage.getItem('patientInfo');
    if (saved) {
        profileData = JSON.parse(saved);
        updateMonitorDisplay();
    }
}

// Update Monitor Display (without reading from form)
function updateMonitorDisplay() {
    // Update monitor display with saved data
    const nameElement = document.getElementById('monitor-patient-name');
    const genderElement = document.getElementById('monitor-patient-gender');
    const idElement = document.getElementById('monitor-patient-id');
    const bedElement = document.getElementById('monitor-patient-bed');
    const roomElement = document.getElementById('monitor-patient-room');
    
    if (nameElement) nameElement.textContent = profileData.name;
    if (genderElement) genderElement.textContent = profileData.gender;
    if (idElement) idElement.textContent = profileData.patientId;
    if (bedElement) bedElement.textContent = profileData.bed;
    if (roomElement) roomElement.textContent = profileData.room;
}

// Update Monitor Status
function updateMonitorStatus(heartRate, spo2) {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.monitor-status span');
    
    if (!statusIndicator || !statusText) return;
    
    // Check if both heart rate and SpO2 are 0
    if (heartRate === 0 && spo2 === 0) {
        // Inactive status
        statusIndicator.classList.remove('active');
        statusIndicator.classList.add('inactive');
        statusText.textContent = 'Không hoạt động';
    } else {
        // Active status
        statusIndicator.classList.remove('inactive');
        statusIndicator.classList.add('active');
        statusText.textContent = 'Đang hoạt động';
    }
}

// Touch Support for Mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - could be used for navigation
            console.log('Swipe up detected');
        } else {
            // Swipe down - could be used for navigation
            console.log('Swipe down detected');
        }
    }
}

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // ESC key to go back
    if (e.key === 'Escape') {
        if (currentScreen !== 'dashboard-screen' && currentScreen !== 'splash-screen') {
            showScreen('dashboard-screen');
        }
    }
    
    // Ctrl/Cmd + K for quick search/chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        showScreen('chat-screen');
    }
});

// Classification System - 5 Level Professional Medical Triage (Khoa Luan Style)
let selectedOptions = []; // Array to store selected {questionId, level, text}

// Triage levels data from Khoa Luan
const TRIAGE_LEVELS = {
    1: {
        level: 1,
        color: '#D32F2F',
        title: 'Loại 1 – Cấp cứu tối khẩn',
        timeDesc: 'Màu đỏ – xử trí ngay lập tức',
        criteria: [
            'Ngừng tim, ngừng thở.',
            'Nguy cơ tắc nghẽn đường thở ngay lập tức (tắc, phù nề, dị vật…).',
            'Suy hô hấp cấp, nhịp thở < 10 lần/phút hoặc thở ngáp.',
            'Huyết áp < 80 mmHg (người lớn) hoặc sốc nặng ở trẻ.',
            'Rối loạn tri giác sâu (GCS < 9).',
            'Co giật liên tục/kéo dài > 5 phút.',
            'Rối loạn hành vi gây nguy hiểm nghiêm trọng.'
        ]
    },
    2: {
        level: 2,
        color: '#FF9800',
        title: 'Loại 2 – Rất khẩn',
        timeDesc: 'Màu cam – đánh giá & xử trí ≤ 10 phút',
        criteria: [
            'Nguy cơ tắc đường thở.',
            'Suy hô hấp nặng, SpO₂ < 90%.',
            'Sốc tuần hoàn: da lạnh, nổi bông, tưới máu kém; nhịp tim < 50 hoặc > 150 lần/phút; hạ huyết áp, mất máu cấp nặng.',
            'Đau ngực nghi do tim.',
            'Đau dữ dội bất kỳ nguyên nhân nào.',
            'Đường huyết < 3 mmol/L.',
            'Rối loạn tri giác (GCS < 13), liệt nửa người, mất ngôn ngữ cấp.',
            'Sốt có dấu hiệu hôn mê.',
            'Nghi nhiễm trùng huyết, viêm màng não mô cầu.',
            'Đa chấn thương nặng hoặc khu trú nặng.',
            'Ngộ độc nặng.',
            'Thuyên tắc phổi, phình bóc tách ĐMC bụng.'
        ]
    },
    3: {
        level: 3,
        color: '#FBC02D',
        title: 'Loại 3 – Khẩn',
        timeDesc: 'Màu vàng – đánh giá & xử trí ≤ 30 phút',
        criteria: [
            'Tăng huyết áp nghiêm trọng.',
            'Mất máu nghiêm trọng.',
            'Khó thở mức độ vừa, SpO₂ 90–95%.',
            'Cơn co giật đã hồi phục ý thức.',
            'Sốt ở bệnh nhân suy giảm miễn dịch.',
            'Nôn ói kéo dài, mất nước.',
            'Chấn thương đầu mất ý thức thoáng qua.',
            'Đau ngực không do tim mức độ vừa.',
            'Đau bụng có nguy cơ.',
            'Tổn thương chi mức độ vừa (biến dạng, dập nát).',
            'Hành vi nguy cơ tự làm tổn thương, loạn thần cấp.'
        ]
    },
    4: {
        level: 4,
        color: '#1976D2',
        title: 'Loại 4 – Ít khẩn',
        timeDesc: 'Màu xanh dương – đánh giá & xử trí ≤ 45 phút',
        criteria: [
            'Xuất huyết nhẹ.',
            'Dị vật đường thở nhưng không suy hô hấp.',
            'Nuốt khó nhưng không suy hô hấp.',
            'Chấn thương nhẹ không mất ý thức.',
            'Nôn, tiêu chảy nhưng chưa mất nước.',
            'Bong gân, gãy xương nghi ngờ, vết thương nhỏ cần xử trí.',
            'Đau bụng không đặc hiệu.'
        ]
    },
    5: {
        level: 5,
        color: '#388E3C',
        title: 'Loại 5 – Không khẩn',
        timeDesc: 'Màu xanh lá – đánh giá & xử trí ≤ 60 phút',
        criteria: [
            'Đau nhẹ, không dấu hiệu nguy cơ.',
            'Bệnh mạn ổn định, không triệu chứng mới.',
            'Vết thương nhỏ, trầy xước.',
            'Bệnh tâm thần ổn định, không nguy cơ ngay.'
        ]
    }
};

function toggleOption(questionId, checkbox) {
    const level = parseInt(checkbox.value);
    // Fix: Get text correctly from label structure
    const optionText = checkbox.parentElement.querySelector('.option-text').textContent;
    
    console.log('Toggle option:', { questionId, level, optionText, checked: checkbox.checked });
    
    if (checkbox.checked) {
        // Add to selected options
        selectedOptions.push({
            questionId: questionId,
            level: level,
            text: optionText
        });
    } else {
        // Remove from selected options
        selectedOptions = selectedOptions.filter(option => 
            !(option.questionId === questionId && option.level === level && option.text === optionText)
        );
    }
    
    console.log('Current selected options:', selectedOptions);
}

function showClassificationResult() {
    console.log('Show classification result called');
    console.log('Current selected options:', selectedOptions);
    
    if (selectedOptions.length === 0) {
        console.log('No options selected, showing warning');
        showNotification('Vui lòng chọn ít nhất một triệu chứng', 'warning');
        return;
    }
    
    console.log('Calculating most critical level...');
    // Find most critical level (lowest number)
    let mostCriticalLevel = 5;
    
    for (let option of selectedOptions) {
        console.log('Checking option:', option, 'Current most critical:', mostCriticalLevel);
        mostCriticalLevel = Math.min(mostCriticalLevel, option.level);
    }
    
    console.log('Final most critical level:', mostCriticalLevel);
    
    // Get triage level data
    const triageLevel = TRIAGE_LEVELS[mostCriticalLevel];
    console.log('Triage level data:', triageLevel);
    
    // Display result
    displayClassificationResult(triageLevel, selectedOptions);
}

function displayClassificationResult(triageLevel, selectedOptions) {
    const resultContainer = document.getElementById('classification-result');
    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultDescription = document.getElementById('result-description');
    const resultLevel = document.getElementById('result-level');
    const criteriaList = document.getElementById('criteria-list');
    
    // Update result content
    resultIcon.innerHTML = `<span class="material-icons" style="color: ${triageLevel.color};">assessment</span>`;
    resultTitle.textContent = triageLevel.title;
    resultDescription.textContent = triageLevel.timeDesc;
    
    // Update level indicator
    resultLevel.className = `result-level level-${triageLevel.level}`;
    resultLevel.innerHTML = `
        <span class="level-indicator"></span>
        <span class="level-text">Level ${triageLevel.level}</span>
    `;
    
    // Update criteria list
    criteriaList.innerHTML = triageLevel.criteria.map(criteria => 
        `<li>${criteria}</li>`
    ).join('');
    
    // Show selected symptoms
    const selectedSymptoms = selectedOptions.map(option => 
        `<li><strong>${option.text}</strong> (Level ${option.level})</li>`
    ).join('');
    
    // Add selected symptoms to criteria
    if (selectedSymptoms) {
        const selectedDiv = document.createElement('div');
        selectedDiv.className = 'selected-symptoms';
        selectedDiv.innerHTML = `
            <h4>Các triệu chứng đã chọn:</h4>
            <ul>${selectedSymptoms}</ul>
        `;
        criteriaList.parentNode.insertBefore(selectedDiv, criteriaList.nextSibling);
    }
    
    // Show result container
    resultContainer.style.display = 'block';
    
    // Scroll to result
    resultContainer.scrollIntoView({ behavior: 'smooth' });
    
    // Log classification result
    console.log('Classification result:', {
        level: triageLevel.level,
        title: triageLevel.title,
        selectedOptions: selectedOptions,
        timestamp: new Date().toISOString()
    });
    
    // Show notification
    showNotification(`Phân loại: ${triageLevel.title}`, 'info');
    
    // If level 1 or 2, suggest emergency call
    if (triageLevel.level <= 2) {
        setTimeout(() => {
            if (confirm(`${triageLevel.title}. Bạn có muốn gọi cấp cứu 115 không?`)) {
                window.location.href = 'tel:115';
                showNotification('Đã gọi cấp cứu 115', 'success');
            }
        }, 2000);
    }
}

function resetClassification() {
    console.log('Resetting classification...');
    
    // Clear selected options array
    selectedOptions = [];
    
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('.answer-checkbox input[type="checkbox"]');
    console.log('Found checkboxes to reset:', checkboxes.length);
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Hide result
    document.getElementById('classification-result').style.display = 'none';
    
    // Remove selected symptoms if exists
    const selectedSymptoms = document.querySelector('.selected-symptoms');
    if (selectedSymptoms) {
        selectedSymptoms.remove();
        console.log('Removed selected symptoms div');
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log('Classification reset complete');
    showNotification('Đã làm lại phân loại', 'info');
}

function showClassificationScreen() {
    // Reset when entering screen
    resetClassification();
    showScreen('classification-screen');
}

// Emergency call function
function callEmergency() {
    // In a real app, this would call 115
    // For demo, show confirmation
    if (confirm('Bạn có muốn gọi cấp cứu 115 ngay không?')) {
        // Open phone dialer with 115
        window.location.href = 'tel:115';
        
        // Show notification
        showNotification('Đã gọi cấp cứu 115', 'success');
        
        // Log the action
        console.log('Emergency call initiated at:', new Date().toISOString());
    }
}

// Theme Support (Dark/Light Mode)
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
}

// Initialize theme on load
loadTheme();

// Load patient information on load
loadPatientInfo();

// Export functions for global access
window.showScreen = showScreen;
window.toggleTechnique = toggleTechnique;
window.sendMessage = sendMessage;
window.sendQuickMessage = sendQuickMessage;
window.switchNewsTab = switchNewsTab;
window.makeEmergencyCall = makeEmergencyCall;
window.toggleTheme = toggleTheme;
window.callEmergency = callEmergency;
window.toggleOption = toggleOption;
window.showClassificationResult = showClassificationResult;
window.resetClassification = resetClassification;
window.showClassificationScreen = showClassificationScreen;

// Debug: Check if functions are properly exported
console.log('Functions exported:', {
    toggleOption: typeof window.toggleOption,
    showClassificationResult: typeof window.showClassificationResult,
    resetClassification: typeof window.resetClassification,
    showClassificationScreen: typeof window.showClassificationScreen
});

// Firebase functions
window.saveHealthData = saveHealthData;
window.saveUserProfile = saveUserProfile;
window.simulateHealthDataUpdates = simulateHealthDataUpdates;

// Chart functions
window.updateAllCharts = updateAllCharts;
window.redrawAllCharts = redrawAllCharts;

// Temperature settings functions
window.showTemperatureSettings = showTemperatureSettings;
window.hideTemperatureSettings = hideTemperatureSettings;
window.setTemperatureUnit = setTemperatureUnit;
window.toggleTemperatureUnit = toggleTemperatureUnit;

// Patient info functions
window.updateMonitorPatientInfo = updateMonitorPatientInfo;
window.exportPatientToPDF = exportPatientToPDF;
window.createFullPatientPDF = createFullPatientPDF;

// Convert Vietnamese text to non-accented
function removeVietnameseAccents(text) {
    if (!text) return text;
    
    const accentMap = {
        'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A', 'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
        'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E', 'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
        'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
        'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O', 'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O', 'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
        'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U', 'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
        'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
        'đ': 'd', 'Đ': 'D'
    };
    
    return text.replace(/[àáảãạăằắẳẵặÀÁẢÃẠĂẰẮẲẴẶèéẻẽẹêềếểễệÈÉẺẼẸìíỉĩịÌÍỈĨỊòóỏõọôồốổỗộơờớởỡợÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢùúủũụưừứửữựÙÚỦŨỤƯỪỨỬỮỰỳýỷỹỲÝỶỸỴđĐ]/g, char => accentMap[char] || char);
}

// Export patient information to PDF using pdfmake (better Unicode support)
function exportPatientToPDF() {
    console.log('Export PDF function called');
    
    try {
        // Debug: Check what's available
        console.log('Checking available libraries...');
        console.log('window.pdfMake:', typeof window.pdfMake);
        console.log('window.jspdf:', typeof window.jspdf);
        console.log('pdfMake:', typeof pdfMake);
        console.log('window object keys:', Object.keys(window).filter(key => key.includes('pdf')));
        
        // Check if pdfmake is loaded (multiple ways)
        const pdfmakeLib = window.pdfMake || pdfMake;
        if (typeof pdfmakeLib === 'undefined') {
            console.error('pdfmake library not loaded');
            console.error('Available PDF libraries:', {
                'window.pdfMake': typeof window.pdfMake,
                'pdfMake': typeof pdfMake,
                'window.jspdf': typeof window.jspdf
            });
            showNotification('Thư viện PDF chưa tải. Vui lòng refresh trang.', 'error');
            return;
        }
        
        console.log('pdfmake loaded:', typeof pdfmakeLib);
        
        // Test pdfmake with Vietnamese Unicode
        console.log('Testing pdfmake with Vietnamese Unicode...');
        
        try {
            // Test document with Vietnamese accents
            const docDefinition = {
                content: [
                    { text: 'Test PDF Generation', fontSize: 16, margin: [0, 0, 0, 10] },
                    { text: 'Hệ thống y tế', fontSize: 12, margin: [0, 5, 0, 0] },
                    { text: 'Tiếng Việt: Chào bạn', fontSize: 12, margin: [0, 5, 0, 0] },
                    { text: 'Công nghệ: Phần mềm y tế', fontSize: 12, margin: [0, 5, 0, 0] },
                    { text: 'Đặc điểm: Đa dạng chữ', fontSize: 12, margin: [0, 5, 0, 0] },
                    { text: 'Nguyễn Văn Á', fontSize: 12, margin: [0, 5, 0, 0] },
                    { text: 'Bệnh viện: Bệnh viện Đa khoa', fontSize: 12, margin: [0, 5, 0, 0] }
                ],
                defaultStyle: {
                    font: 'Roboto'
                }
            };
            
            console.log('Creating test PDF with Vietnamese accents...');
            console.log('Document definition:', docDefinition);
            
            pdfmakeLib.createPdf(docDefinition).download('test.pdf');
            console.log('Test PDF saved successfully');
            
            // Show success notification
            showNotification('Test PDF đã được tạo thành công!', 'success');
            
            // Now try the full patient PDF
            setTimeout(() => {
                createFullPatientPDF();
            }, 1000);
            
        } catch (pdfError) {
            console.error('PDF creation error:', pdfError);
            console.error('Error stack:', pdfError.stack);
            showNotification('Lỗi khi tạo PDF: ' + pdfError.message, 'error');
        }
        
    } catch (error) {
        console.error('Error exporting PDF:', error);
        console.error('Error stack:', error.stack);
        showNotification('Lỗi khi xuất PDF: ' + error.message, 'error');
    }
}

// Create full patient PDF using pdfmake (better Unicode support)
function createFullPatientPDF() {
    console.log('Creating full patient PDF with pdfmake...');
    
    try {
        // Check if pdfmake is available
        if (typeof pdfMake === 'undefined') {
            console.error('pdfmake is not available');
            showNotification('Thư viện PDF không khả dụng', 'error');
            return;
        }
        
        // Get current date
        const currentDate = new Date().toLocaleDateString('vi-VN');
        const currentTime = new Date().toLocaleTimeString('vi-VN');
        
        console.log('Current date/time:', currentDate, currentTime);
        
        // Get patient data from form
        console.log('Getting patient data from form...');
        
        // Debug: Check if elements exist
        console.log('Checking form elements:');
        console.log('patient-id element:', document.getElementById('patient-id'));
        console.log('full-name element:', document.getElementById('full-name'));
        console.log('cccd element:', document.getElementById('cccd'));
        console.log('bhyt element:', document.getElementById('bhyt'));
        
        const patientData = {
            patientId: document.getElementById('patient-id').value || 'Chưa cập nhật',
            cccd: document.getElementById('cccd').value || 'Chưa cập nhật',
            bhyt: document.getElementById('bhyt').value || 'Chưa cập nhật',
            fullName: document.getElementById('full-name').value || 'Chưa cập nhật',
            dob: document.getElementById('dob').value || 'Chưa cập nhật',
            gender: document.querySelector('input[name="gender"]:checked')?.value || 'Chưa cập nhật',
            hometown: document.getElementById('hometown').value || 'Chưa cập nhật',
            phone: document.getElementById('phone').value || 'Chưa cập nhật',
            relative: document.getElementById('relative').value || 'Chưa cập nhật',
            weight: document.getElementById('weight').value || 'Chưa cập nhật',
            height: document.getElementById('height').value || 'Chưa cập nhật',
            room: document.getElementById('room').value || 'Chưa cập nhật',
            bed: document.getElementById('bed').value || 'Chưa cập nhật',
            admissionDate: document.getElementById('admission-date').value || 'Chưa cập nhật',
            dischargeDate: document.getElementById('discharge-date').value || 'Chưa cập nhật',
            bloodType: document.getElementById('blood-type').value || 'Chưa cập nhật',
            allergies: document.getElementById('allergies').value || 'Chưa cập nhật',
            medicalHistory: document.getElementById('medical-history').value || 'Chưa cập nhật',
            generalCheckup: document.getElementById('general-checkup').value || 'Chưa cập nhật',
            doctor: document.getElementById('doctor').value || 'Chưa cập nhật',
            nurses: document.getElementById('nurses').value || 'Chưa cập nhật'
        };
        
        console.log('Patient data collected:', patientData);
        
        // Get patient profile image
        console.log('Looking for patient profile image...');
        
        // Try multiple selectors to find image
        let profileImageElement = document.querySelector('.avatar-large img');
        if (!profileImageElement) {
            profileImageElement = document.querySelector('.profile-avatar-section img');
        }
        if (!profileImageElement) {
            profileImageElement = document.querySelector('#profile-screen img');
        }
        if (!profileImageElement) {
            profileImageElement = document.querySelector('img[alt="Avatar"]');
        }
        
        let patientImage = null;
        let logoImage = null;
        
        // Process patient image
        if (profileImageElement && profileImageElement.src) {
            console.log('Found patient profile image element:', profileImageElement);
            console.log('Image src:', profileImageElement.src);
            console.log('Image naturalWidth:', profileImageElement.naturalWidth);
            console.log('Image naturalHeight:', profileImageElement.naturalHeight);
            console.log('Image complete:', profileImageElement.complete);
            console.log('Image crossOrigin:', profileImageElement.crossOrigin);
            
            // Convert relative path to absolute path for pdfmake
            const imageSrc = profileImageElement.src;
            
            // Check if it's a relative path and convert to absolute
            if (imageSrc && !imageSrc.startsWith('http') && !imageSrc.startsWith('data:')) {
                console.log('Converting relative image to data URL...');
                
                // For pdfmake, we need to use data URL or absolute URL
                try {
                    // Try to convert image to data URL
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const img = new Image();
                    
                    img.crossOrigin = 'Anonymous'; // Handle CORS
                    
                    img.onload = function() {
                        console.log('Image loaded successfully, dimensions:', img.width, 'x', img.height);
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                        
                        try {
                            patientImage = canvas.toDataURL('image/jpeg', 0.8);
                            console.log('Successfully converted image to data URL, length:', patientImage.length);
                        } catch (canvasError) {
                            console.log('Canvas toDataURL failed:', canvasError);
                            patientImage = null;
                        }
                    };
                    
                    img.onerror = function(error) {
                        console.log('Failed to load image for conversion:', error);
                        console.log('Image src that failed:', imageSrc);
                        patientImage = null;
                    };
                    
                    // Set timeout to avoid infinite loading
                    setTimeout(() => {
                        if (patientImage === null) {
                            console.log('Image conversion timeout - using null');
                            patientImage = null;
                        }
                    }, 3000);
                    
                    img.src = imageSrc;
                    
                } catch (error) {
                    console.log('Error in image conversion setup:', error);
                    patientImage = null;
                }
            } else {
                console.log('Using existing image URL directly');
                patientImage = imageSrc;
            }
        } else {
            console.log('No patient profile image found');
            console.log('Available images in DOM:', document.querySelectorAll('img'));
        }
        
        // Get and convert logo image
        console.log('Looking for logo image...');
        let logoElement = document.querySelector('.header-logo');
        if (!logoElement) {
            console.log('Header logo not found, trying logo images...');
            const logoImages = document.querySelectorAll('img[src*="logo"]');
            logoElement = logoImages[0];
            console.log('Found logo images:', logoImages.length);
        }
        
        if (!logoElement) {
            console.log('Trying all images with logo in alt or class...');
            const allImages = document.querySelectorAll('img');
            for (let img of allImages) {
                if (img.src && img.src.includes('logo')) {
                    logoElement = img;
                    break;
                }
            }
        }
        
        if (logoElement && logoElement.src) {
            console.log('Found logo element:', logoElement);
            console.log('Logo src:', logoElement.src);
            console.log('Logo naturalWidth:', logoElement.naturalWidth);
            console.log('Logo naturalHeight:', logoElement.naturalHeight);
            console.log('Logo complete:', logoElement.complete);
            
            const logoSrc = logoElement.src;
            
            if (logoSrc && !logoSrc.startsWith('http') && !logoSrc.startsWith('data:')) {
                console.log('Converting logo to data URL...');
                
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const img = new Image();
                    
                    img.crossOrigin = 'Anonymous';
                    
                    img.onload = function() {
                        console.log('Logo loaded successfully, dimensions:', img.width, 'x', img.height);
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                        
                        try {
                            logoImage = canvas.toDataURL('image/png', 0.8);
                            console.log('Successfully converted logo to data URL, length:', logoImage.length);
                        } catch (canvasError) {
                            console.log('Logo canvas toDataURL failed:', canvasError);
                            logoImage = null;
                        }
                    };
                    
                    img.onerror = function(error) {
                        console.log('Failed to load logo for conversion:', error);
                        logoImage = null;
                    };
                    
                    img.src = logoSrc;
                    
                } catch (error) {
                    console.log('Error in logo conversion setup:', error);
                    logoImage = null;
                }
            } else {
                console.log('Using existing logo URL directly');
                logoImage = logoSrc;
            }
        } else {
            console.log('No logo image found');
            console.log('All images in page:', document.querySelectorAll('img'));
        }
        
        // Create PDF document definition with full Vietnamese Unicode support
        const docDefinition = {
            content: [
                // Header
                { text: 'HỒ SƠ BỆNH NHÂN', fontSize: 20, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
                { text: 'Hệ Thống Giám Sát Sức Khỏe Thông Minh', fontSize: 12, alignment: 'center', margin: [0, 0, 0, 5] },
                { text: `Ngày xuất: ${currentDate} lúc ${currentTime}`, fontSize: 10, alignment: 'left', margin: [0, 10, 0, 0] },
                { text: 'Bệnh viện: Bệnh viện Đa khoa', fontSize: 10, alignment: 'right', margin: [0, -15, 0, 0] },
                
                // Patient Profile Section with Image and Basic Info
                ...(patientImage ? [{
                    table: {
                        widths: ['30%', '70%'],
                        body: [
                            [
                                {
                                    image: patientImage,
                                    width: 100,
                                    height: 100,
                                    alignment: 'center',
                                    margin: [10, 10, 10, 10]
                                },
                                [
                                    {
                                        text: patientData.fullName,
                                        fontSize: 16,
                                        bold: true,
                                        margin: [0, 10, 0, 5]
                                    },
                                    {
                                        text: `Mã bệnh nhân: ${patientData.patientId}`,
                                        fontSize: 12,
                                        margin: [0, 0, 0, 3]
                                    },
                                    {
                                        text: `Ngày sinh: ${patientData.dob}`,
                                        fontSize: 12,
                                        margin: [0, 0, 0, 3]
                                    },
                                    {
                                        text: `Giới tính: ${patientData.gender}`,
                                        fontSize: 12,
                                        margin: [0, 0, 0, 3]
                                    },
                                    {
                                        text: `Nhóm máu: ${patientData.bloodType}`,
                                        fontSize: 12,
                                        margin: [0, 0, 0, 3]
                                    }
                                ]
                            ]
                        ]
                    },
                    layout: {
                        hLineWidth: function(i, node) {
                            return i === 0 || i === node.table.body.length ? 1 : 0;
                        },
                        vLineWidth: function(i, node) {
                            return i === 0 || i === node.table.widths.length ? 1 : 0;
                        },
                        hLineColor: function(i, node) {
                            return '#cccccc';
                        },
                        vLineColor: function(i, node) {
                            return '#cccccc';
                        },
                        paddingLeft: function(i, node) { return 0; },
                        paddingRight: function(i, node) { return 0; },
                        paddingTop: function(i, node) { return 10; },
                        paddingBottom: function(i, node) { return 10; }
                    },
                    margin: [0, 15, 0, 20]
                }] : []),
                
                // Section 1: Basic Information
                { text: 'I. THÔNG TIN CƠ BẢN', fontSize: 14, bold: true, color: '#0066CC', margin: [0, 20, 0, 10] },
                
                // Basic info table
                {
                    table: {
                        widths: ['30%', '70%'],
                        body: [
                            ['Mã số bệnh nhân:', patientData.patientId],
                            ['Mã CCCD:', patientData.cccd],
                            ['Mã BHYT:', patientData.bhyt],
                            ['Họ và tên:', patientData.fullName],
                            ['Ngày sinh:', patientData.dob],
                            ['Giới tính:', patientData.gender],
                            ['Quê quán:', patientData.hometown],
                            ['Số điện thoại:', patientData.phone],
                            ['Người thân:', patientData.relative]
                        ]
                    },
                    layout: 'noBorders',
                    fontSize: 11,
                    margin: [0, 0, 0, 10]
                },
                
                // Section 2: Physical Information
                { text: 'II. THÔNG TIN THỂ CHẤT', fontSize: 14, bold: true, color: '#0066CC', margin: [0, 10, 0, 10] },
                
                {
                    table: {
                        widths: ['30%', '70%'],
                        body: [
                            ['Cân nặng:', patientData.weight + ' kg'],
                            ['Chiều cao:', patientData.height + ' cm'],
                            ['Nhóm máu:', patientData.bloodType]
                        ]
                    },
                    layout: 'noBorders',
                    fontSize: 11,
                    margin: [0, 0, 0, 10]
                },
                
                // Section 3: Treatment Information
                { text: 'III. THÔNG TIN ĐIỀU TRỊ', fontSize: 14, bold: true, color: '#0066CC', margin: [0, 10, 0, 10] },
                
                {
                    table: {
                        widths: ['30%', '70%'],
                        body: [
                            ['Phòng:', patientData.room],
                            ['Giường:', patientData.bed],
                            ['Ngày vào viện:', patientData.admissionDate],
                            ['Ngày ra viện:', patientData.dischargeDate],
                            ['Bác sĩ điều trị:', patientData.doctor],
                            ['Điều dưỡng:', patientData.nurses]
                        ]
                    },
                    layout: 'noBorders',
                    fontSize: 11,
                    margin: [0, 0, 0, 10]
                },
                
                // Section 4: Medical Information
                { text: 'IV. THÔNG TIN Y TẾ', fontSize: 14, bold: true, color: '#0066CC', margin: [0, 10, 0, 10] },
                
                {
                    table: {
                        widths: ['30%', '70%'],
                        body: [
                            ['Dị ứng:', patientData.allergies],
                            ['Tiền sử bệnh:', patientData.medicalHistory],
                            ['Tái khám định kỳ:', patientData.generalCheckup]
                        ]
                    },
                    layout: 'noBorders',
                    fontSize: 11,
                    margin: [0, 0, 0, 10]
                },
                
                // Signatures section
                {
                    table: {
                        widths: ['50%', '50%'],
                        body: [
                            [
                                {
                                    stack: [
                                        { text: 'Bác sĩ điều trị', fontSize: 12, bold: true, alignment: 'center', margin: [0, 30, 0, 5] },
                                        { text: '(Ký và ghi rõ họ tên)', fontSize: 10, alignment: 'center', margin: [0, 40, 0, 5] },
                                        { text: patientData.doctor || '................................................', fontSize: 12, alignment: 'center', margin: [0, 10, 0, 0] }
                                    ],
                                    border: [true, true, true, false]
                                },
                                {
                                    stack: [
                                        { text: 'Người nhà bệnh nhân', fontSize: 12, bold: true, alignment: 'center', margin: [0, 30, 0, 5] },
                                        { text: '(Ký và ghi rõ họ tên)', fontSize: 10, alignment: 'center', margin: [0, 40, 0, 5] },
                                        { text: patientData.relative || '................................................', fontSize: 12, alignment: 'center', margin: [0, 10, 0, 0] }
                                    ],
                                    border: [true, true, true, false]
                                }
                            ]
                        ]
                    },
                    layout: {
                        hLineWidth: function(i, node) {
                            return i === 0 ? 1 : 0;
                        },
                        vLineWidth: function(i, node) {
                            return i === 0 || i === node.table.widths.length ? 1 : 0;
                        },
                        hLineColor: '#cccccc',
                        vLineColor: '#cccccc'
                    },
                    margin: [0, 20, 0, 0]
                },
                
                // Footer with security notice (at the very bottom)
                {
                    stack: [
                        { text: 'Đây là tài liệu y tế bảo mật. Vui lòng bảo mật thông tin bệnh nhân.', fontSize: 10, alignment: 'center', margin: [0, 40, 0, 5] },
                        { text: 'Hệ Thống Giám Sát Sức Khỏe Thông Minh', fontSize: 10, alignment: 'center', margin: [0, 0, 0, 10] }
                    ]
                }
            ],
            defaultStyle: {
                font: 'Roboto',
                fontSize: 11
            },
            styles: {
                header: {
                    fontSize: 20,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    color: '#0066CC',
                    margin: [0, 10, 0, 10]
                }
            }
        };
        
        // Generate filename
        const fileName = `HoSoBenhNhan_${patientData.fullName.replace(/\s+/g, '_')}_${currentDate.replace(/\//g, '-')}.pdf`;
        
        console.log('Generated filename:', fileName);
        
        // Create and download PDF
        console.log('Creating PDF with full Vietnamese Unicode support...');
        pdfMake.createPdf(docDefinition).download(fileName);
        
        console.log('PDF saved successfully');
        
        // Show success notification
        showNotification('Đã xuất hồ sơ bệnh nhân thành công!', 'success');
        console.log('Patient profile exported to PDF:', fileName);
        
    } catch (error) {
        console.error('Error exporting PDF:', error);
        showNotification('Lỗi khi xuất PDF. Vui lòng thử lại.', 'error');
    }
}
