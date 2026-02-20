// AI Auto-Repair JavaScript
class AIHealthMonitor {
    constructor() {
        this.checkInterval = 10000; // 10 seconds
        this.maxRetries = 3;
        this.retryCount = 0;
        this.isMonitoring = false;
    }

    async checkAIStatus() {
        try {
            const response = await fetch('http://localhost:3001/api/status');
            const data = await response.json();
            
            if (data.success && data.models && data.models.length > 0) {
                console.log('✅ AI System is healthy');
                this.updateUI('AI Y tế đã sẵn sàng', 'connected');
                this.retryCount = 0;
                return true;
            } else {
                throw new Error('AI models not available');
            }
        } catch (error) {
            console.error('❌ AI System check failed:', error.message);
            this.updateUI('Đang sửa kết nối AI...', 'disconnected');
            
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                console.log(`🔄 Retry attempt ${this.retryCount}/${this.maxRetries}`);
                setTimeout(() => this.attemptRepair(), 2000);
                return false;
            } else {
                this.updateUI('AI cần khởi động lại thủ công', 'disconnected');
                this.showManualHelp();
                return false;
            }
        }
    }

    async attemptRepair() {
        try {
            console.log('🔧 Attempting auto-repair...');
            
            // Try to refresh the connection
            const response = await fetch('http://localhost:3001/api/status', {
                method: 'GET',
                cache: 'no-cache'
            });
            
            if (response.ok) {
                console.log('✅ Auto-repair successful');
                this.updateUI('AI Y tế đã sẵn sàng', 'connected');
                this.retryCount = 0;
            }
        } catch (error) {
            console.error('❌ Auto-repair failed:', error.message);
        }
    }

    updateUI(message, status) {
        const statusElement = document.getElementById('ai-status');
        const statusText = document.getElementById('ai-status-text');
        
        if (statusElement) {
            statusElement.className = `ai-status ${status}`;
        }
        
        if (statusText) {
            statusText.textContent = message;
        }
    }

    showManualHelp() {
        const helpModal = document.createElement('div');
        helpModal.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: white; padding: 2rem; border-radius: 10px; 
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 10000;">
                <h3>🔧 AI Cần Khởi Động Lại</h3>
                <p>Vui lòng chạy file sau:</p>
                <code style="background: #f0f0f0; padding: 0.5rem; border-radius: 5px;">
                    C:\\Users\\asus\\Documents\\WED_KNTN\\auto-repair-ai.bat
                </code>
                <br><br>
                <button onclick="this.parentElement.remove()" 
                        style="background: #007bff; color: white; border: none; 
                               padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">
                    Đóng
                </button>
            </div>
        `;
        document.body.appendChild(helpModal);
    }

    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        console.log('🔍 Starting AI Health Monitor...');
        
        // Check immediately
        this.checkAIStatus();
        
        // Then check every 10 seconds
        this.monitorInterval = setInterval(() => {
            this.checkAIStatus();
        }, this.checkInterval);
    }

    stopMonitoring() {
        this.isMonitoring = false;
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
        }
        console.log('⏹️ AI Health Monitor stopped');
    }
}

// Initialize monitor when page loads
let aiMonitor;

// Auto-start monitoring
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for page to fully load
    setTimeout(() => {
        aiMonitor = new AIHealthMonitor();
        aiMonitor.startMonitoring();
        console.log('🤖 AI Auto-Repair System activated');
    }, 2000);
});

// Export for manual control
window.aiMonitor = aiMonitor;
window.startAIMonitor = () => aiMonitor?.startMonitoring();
window.stopAIMonitor = () => aiMonitor?.stopMonitoring();
