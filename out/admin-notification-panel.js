// ============================================================================
// ADMIN NOTIFICATION PANEL - Simple Working Version
// ============================================================================

// Admin email
const ADMIN_EMAIL = 'sandeshsb25260@gmail.com';

class AdminNotificationPanel {
  constructor() {
    this.isAdmin = false;
    this.currentUser = null;
  }

  // Check if current user is admin
  checkAdminAccess(user) {
    this.currentUser = user;
    this.isAdmin = user && user.email === ADMIN_EMAIL;
    console.log('🔐 Admin check:', { email: user?.email, isAdmin: this.isAdmin });
    return this.isAdmin;
  }

  // Get admin notification panel HTML
  getAdminPanel() {
    if (!this.isAdmin) {
      return `
        <div style="text-align: center; padding: 60px 20px; color: #dc2626;">
          <h2 style="font-size: 24px; margin-bottom: 16px;">Access Denied</h2>
          <p>You do not have permission to access the admin panel.</p>
          <button onclick="window.mobileApp.showScreen('home')" style="margin-top: 20px; padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 10px; font-size: 16px; cursor: pointer;">Go to Home</button>
        </div>
      `;
    }

    return `
      <div style="min-height: 100vh; background: #f8f9fa; padding-bottom: 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 16px 16px 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <button onclick="window.mobileApp.showScreen('home')" class="back-btn" style="background: rgba(255,255,255,0.25); border: 2px solid rgba(255,255,255,0.3); color: white; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(10px); transition: all 0.3s;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <div>
              <h2 style="font-size: 20px; font-weight: 800;">🔔 Admin Panel</h2>
              <p style="font-size: 12px; opacity: 0.9;">Send custom notifications</p>
            </div>
          </div>
        </div>
        
        <div style="padding: 16px;">
          <!-- Notification Composer -->
          <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); margin-bottom: 20px;">
            <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 16px;">Compose New Notification</h3>
            <div id="adminNotificationError" style="display: none; background: #fee; color: #c33; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px; font-weight: 500;"></div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 13px; font-weight: 700; color: #333; margin-bottom: 8px;">Notification Title *</label>
              <input type="text" id="notificationTitle" placeholder="e.g., Happy Diwali from UrbanEzii!" style="width: 100%; padding: 14px 12px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 14px; outline: none; transition: border-color 0.3s;" />
            </div>
            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 13px; font-weight: 700; color: #333; margin-bottom: 8px;">Message *</label>
              <textarea id="notificationMessage" rows="3" placeholder="e.g., Get 20% off on all bookings this festive season!" style="width: 100%; padding: 14px 12px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 14px; outline: none; resize: vertical; transition: border-color 0.3s;"></textarea>
            </div>
            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 13px; font-weight: 700; color: #333; margin-bottom: 8px;">Target Audience *</label>
              <select id="notificationAudience" style="width: 100%; padding: 14px 12px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 14px; outline: none; background: white; transition: border-color 0.3s;">
                <option value="all">All Users</option>
                <option value="customers">Customers Only</option>
                <option value="providers">Providers Only</option>
              </select>
            </div>
            <button id="sendNotificationBtn" onclick="window.adminPanel.sendCustomNotification()" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); display: flex; align-items: center; justify-content: center; gap: 8px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"></path><path d="M22 2L15 22L11 13L2 9L22 2Z"></path></svg>
              Send Notification
            </button>
          </div>

          <!-- Quick Templates -->
          <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); margin-bottom: 20px;">
            <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 16px;">Quick Templates</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;">
              <button onclick="window.adminPanel.applyTemplate('diwali')" style="padding: 12px; background: #fef3c7; border: 1px solid #f59e0b; border-radius: 10px; font-size: 13px; font-weight: 600; color: #92400e; cursor: pointer;">🎆 Happy Diwali</button>
              <button onclick="window.adminPanel.applyTemplate('newyear')" style="padding: 12px; background: #e0f2fe; border: 1px solid #3b82f6; border-radius: 10px; font-size: 13px; font-weight: 600; color: #1e40af; cursor: pointer;">🎉 New Year</button>
              <button onclick="window.adminPanel.applyTemplate('weekend')" style="padding: 12px; background: #dcfce7; border: 1px solid #22c55e; border-radius: 10px; font-size: 13px; font-weight: 600; color: #166534; cursor: pointer;">🏠 Weekend Special</button>
              <button onclick="window.adminPanel.applyTemplate('maintenance')" style="padding: 12px; background: #f3e8ff; border: 1px solid #a855f7; border-radius: 10px; font-size: 13px; font-weight: 600; color: #6b21a8; cursor: pointer;">🔧 Maintenance</button>
            </div>
          </div>

          <!-- Test Notification -->
          <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
            <h3 style="font-size: 18px; font-weight: 700; color: #333; margin-bottom: 16px;">Test Notifications</h3>
            <button onclick="window.adminPanel.testNotification()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"></path><path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path><path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path></svg>
              Send Test Notification
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Send custom notification
  async sendCustomNotification() {
    const title = document.getElementById('notificationTitle').value.trim();
    const message = document.getElementById('notificationMessage').value.trim();
    const audience = document.getElementById('notificationAudience').value;
    const errorDiv = document.getElementById('adminNotificationError');
    const sendBtn = document.getElementById('sendNotificationBtn');

    errorDiv.style.display = 'none';

    if (!title || !message) {
      errorDiv.textContent = 'Title and Message are required.';
      errorDiv.style.display = 'block';
      return;
    }

    sendBtn.textContent = 'Sending...';
    sendBtn.disabled = true;

    try {
      // Directly show the notification
      const notification = {
        title: title,
        body: message,
        data: {
          type: 'promotional',
          targetAudience: audience,
          from: 'admin'
        }
      };
      
      if (window.notificationService) {
        window.notificationService.showLocalNotification(notification);
        alert(`✅ Notification sent successfully! Check the top-right corner of your screen.`);
        document.getElementById('notificationTitle').value = '';
        document.getElementById('notificationMessage').value = '';
        document.getElementById('notificationAudience').value = 'all';
      } else {
        errorDiv.textContent = '❌ Notification service not available';
        errorDiv.style.display = 'block';
      }
    } catch (error) {
      console.error('Error sending custom notification:', error);
      errorDiv.textContent = 'An unexpected error occurred while sending notification.';
      errorDiv.style.display = 'block';
    } finally {
      sendBtn.textContent = 'Send Notification';
      sendBtn.disabled = false;
    }
  }

  // Apply template
  applyTemplate(templateType) {
    let title = '';
    let message = '';

    switch (templateType) {
      case 'diwali':
        title = '🎆 Happy Diwali from UrbanEzii!';
        message = 'Light up your home with our premium services. Get 20% off on all bookings this festive season! Book now and celebrate with us! 🪔✨';
        break;
      case 'newyear':
        title = '🎉 Happy New Year 2025!';
        message = 'Start the year right with UrbanEzii! Book any service and get a free consultation. Wishing you a prosperous year ahead! 🥂';
        break;
      case 'weekend':
        title = '🏠 Weekend Special! Get 15% Off!';
        message = 'Don\'t miss out on our exclusive weekend offer! Book any home service and get 15% off. Limited time only! ⏳';
        break;
      case 'maintenance':
        title = '🔧 Scheduled Maintenance Alert';
        message = 'Dear user, UrbanEzii services will undergo a brief scheduled maintenance on [Date] from [Time] to [Time]. We apologize for any inconvenience.';
        break;
    }

    document.getElementById('notificationTitle').value = title;
    document.getElementById('notificationMessage').value = message;
    document.getElementById('notificationAudience').value = 'all';
  }

  // Test notification
  async testNotification() {
    try {
      console.log('🧪 Testing system notification from admin panel...');
      
      // Get FCM token from localStorage
      const fcmToken = localStorage.getItem('fcmToken');
      
      if (!fcmToken) {
        alert('❌ No FCM token found. Please enable notifications first.');
        return;
      }
      
      // Send system notification
      const notification = {
        title: '🧪 Test System Notification',
        body: 'This is a system notification from UrbanEzii Admin Panel! It should appear on your lock screen.',
        data: {
          type: 'test',
          from: 'admin'
        }
      };
      
      if (window.firebaseAdminNotifications) {
        const result = await window.firebaseAdminNotifications.sendNotification(
          notification.title,
          notification.body,
          fcmToken,
          notification.data
        );
        
        if (result.success) {
          alert('✅ System notification sent! Check your lock screen and notification panel.');
        } else {
          alert('❌ Failed to send system notification: ' + result.error);
        }
      } else if (window.systemNotificationAPI) {
        const result = await window.systemNotificationAPI.sendSystemNotification(
          notification.title,
          notification.body,
          fcmToken,
          notification.data
        );
        
        if (result.success) {
          alert('✅ System notification sent! Check your lock screen and notification panel.');
        } else {
          alert('❌ Failed to send system notification: ' + result.error);
        }
      } else {
        // Fallback to local notification
        if (window.notificationService) {
          window.notificationService.showLocalNotification(notification);
          alert('✅ Test notification sent! Check the top-right corner of your screen.');
        } else {
          alert('❌ Notification service not available');
        }
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert('❌ Error sending test notification: ' + error.message);
    }
  }
}

// Create global instance
window.adminPanel = new AdminNotificationPanel();

console.log('🔔 Admin panel loaded');