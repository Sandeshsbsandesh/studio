// ============================================================================
// NOTIFICATION SERVICE - Simple Working Version
// ============================================================================

class NotificationService {
  constructor() {
    this.isInitialized = false;
    this.permissionGranted = false;
    this.isMobile = typeof Capacitor !== 'undefined';
  }

  // Initialize notifications
  async initialize() {
    if (this.isInitialized) return true;

    try {
      console.log('🔔 Initializing notification service...');
      
      if (this.isMobile) {
        // Mobile app - use Capacitor Push Notifications
        return await this.initializeMobileNotifications();
      } else {
        // Web app - use browser notifications
        return await this.initializeWebNotifications();
      }
    } catch (error) {
      console.error('❌ Failed to initialize notifications:', error);
      return false;
    }
  }

  // Initialize mobile notifications (Capacitor)
  async initializeMobileNotifications() {
    try {
      console.log('📱 Requesting system push notification permissions...');
      
      // Check if PushNotifications is available
      if (typeof PushNotifications === 'undefined') {
        console.log('📱 PushNotifications not available, using fallback');
        return await this.initializeWebNotifications();
      }

      // Request permissions for system notifications
      const permStatus = await PushNotifications.requestPermissions();
      console.log('📱 System permission status:', permStatus);
      
      if (permStatus.receive === 'granted') {
        console.log('✅ System push notification permission granted');
        
        // Register with Apple / Google to receive push via APNS/FCM
        await PushNotifications.register();
        console.log('📱 Push notifications registered with system');
        
        // Listen for registration
        PushNotifications.addListener('registration', (token) => {
          console.log('📱 System push registration success, token: ' + token.value);
          this.fcmToken = token.value;
          this.saveTokenToDatabase(token.value);
        });

        // Listen for registration errors
        PushNotifications.addListener('registrationError', (err) => {
          console.error('❌ System registration error: ' + JSON.stringify(err));
        });

        // Listen for push notifications (these will be system notifications)
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('📱 System push notification received: ', notification);
          // Don't show local notification, let system handle it
        });

        // Listen for push notification actions
        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
          console.log('📱 System push notification action performed', notification);
          this.handleNotificationAction(notification);
        });
        
        this.isInitialized = true;
        this.permissionGranted = true;
        return true;
      } else {
        console.log('❌ System push notification permission denied');
        this.isInitialized = false;
        this.permissionGranted = false;
        return false;
      }
    } catch (error) {
      console.error('❌ Error initializing mobile notifications:', error);
      // Fallback to web notifications
      return await this.initializeWebNotifications();
    }
  }

  // Initialize web notifications (Browser)
  async initializeWebNotifications() {
    try {
      console.log('🌐 Requesting web notification permissions...');
      
      // Check if notifications are supported
      if (!('Notification' in window)) {
        console.log('❌ This browser does not support notifications');
        return false;
      }

      // Request permission
      const permission = await Notification.requestPermission();
      console.log('🌐 Permission result:', permission);
      
      if (permission === 'granted') {
        console.log('✅ Web notification permission granted');
        this.isInitialized = true;
        this.permissionGranted = true;
        return true;
      } else {
        console.log('❌ Web notification permission denied');
        this.isInitialized = false;
        this.permissionGranted = false;
        return false;
      }
    } catch (error) {
      console.error('❌ Error initializing web notifications:', error);
      return false;
    }
  }

  // Show local notification
  showLocalNotification(notification) {
    try {
      console.log('🔔 Showing notification:', notification);
      
      if (this.isMobile) {
        // For mobile, show a custom in-app notification
        this.showInAppNotification(notification);
      } else {
        // For web, show a browser notification
        if (this.permissionGranted && 'Notification' in window) {
          const notif = new Notification(notification.title || 'UrbanEzii', {
            body: notification.body || 'You have a new notification',
            icon: '/logo.png',
            badge: '/logo.png'
          });
          
          notif.onclick = () => {
            console.log('Notification clicked');
            notif.close();
          };
          
          // Auto close after 5 seconds
          setTimeout(() => {
            notif.close();
          }, 5000);
        } else {
          // Fallback to in-app notification
          this.showInAppNotification(notification);
        }
      }
    } catch (error) {
      console.error('❌ Error showing notification:', error);
      // Fallback to in-app notification
      this.showInAppNotification(notification);
    }
  }

  // Show in-app notification (fallback for all platforms)
  showInAppNotification(notification) {
    try {
      // Create notification element
      const notificationEl = document.createElement('div');
      notificationEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
        z-index: 10000;
        max-width: 300px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        animation: slideInRight 0.3s ease-out;
      `;
      
      notificationEl.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 12px;">
          <div style="flex-shrink: 0; width: 24px; height: 24px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">
            🔔
          </div>
          <div style="flex: 1;">
            <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">
              ${notification.title || 'UrbanEzii'}
            </div>
            <div style="font-size: 13px; opacity: 0.9; line-height: 1.4;">
              ${notification.body || 'You have a new notification'}
            </div>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">
            ×
          </button>
        </div>
      `;
      
      // Add animation styles
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Add to page
      document.body.appendChild(notificationEl);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        if (notificationEl.parentElement) {
          notificationEl.style.animation = 'slideInRight 0.3s ease-out reverse';
          setTimeout(() => {
            if (notificationEl.parentElement) {
              notificationEl.remove();
            }
          }, 300);
        }
      }, 5000);
      
      console.log('✅ In-app notification displayed');
    } catch (error) {
      console.error('❌ Error showing in-app notification:', error);
    }
  }

  // Save FCM token to database
  async saveTokenToDatabase(token) {
    try {
      console.log('💾 Saving FCM token to database:', token);
      
      // Get current user
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.uid) {
        console.log('⚠️ No user logged in, cannot save token');
        return;
      }
      
      // Save token to localStorage for now (in real app, send to your backend)
      localStorage.setItem('fcmToken', token);
      localStorage.setItem('fcmTokenSaved', new Date().toISOString());
      
      console.log('✅ FCM token saved locally');
      
      // TODO: Send token to your backend server
      // await fetch('/api/save-fcm-token', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId: currentUser.uid, token: token })
      // });
      
    } catch (error) {
      console.error('❌ Error saving FCM token:', error);
    }
  }

  // Handle notification action
  handleNotificationAction(notification) {
    console.log('🔔 Notification action:', notification.actionId);
    // You can add navigation logic here based on notification data
  }

  // Send booking confirmation notification
  async sendBookingConfirmation(bookingData) {
    console.log('📤 Sending booking confirmation notification...');
    
    try {
      const notification = {
        title: '🎉 Booking Confirmed!',
        body: `Your ${bookingData.serviceType} appointment with ${bookingData.providerName} is confirmed for ${new Date(bookingData.date.toDate()).toLocaleDateString()} at ${bookingData.timeSlot}.`,
        data: {
          bookingId: bookingData.id,
          screen: 'customer-bookings'
        }
      };

      this.showLocalNotification(notification);
      console.log('✅ Booking confirmation notification sent');
      return true;
    } catch (error) {
      console.error('❌ Error sending booking confirmation:', error);
      return false;
    }
  }

  // Send promotional notification
  async sendPromotionalNotification(title, message, imageUrl = null, actionText = null, targetAudience = 'all') {
    console.log('📤 Sending promotional notification...');
    
    try {
      const notification = {
        title: title,
        body: message,
        data: {
          type: 'promotional',
          targetAudience: targetAudience
        }
      };

      this.showLocalNotification(notification);
      console.log('✅ Promotional notification sent');
      return { success: true, sentTo: 1 }; // Simplified for demo
    } catch (error) {
      console.error('❌ Error sending promotional notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Test notification
  async testNotification() {
    console.log('🧪 Testing notification...');
    
    try {
      const notification = {
        title: '🧪 Test Notification',
        body: 'This is a test notification from UrbanEzii!',
        data: {
          type: 'test'
        }
      };

      this.showLocalNotification(notification);
      console.log('✅ Test notification sent');
      return true;
    } catch (error) {
      console.error('❌ Error sending test notification:', error);
      return false;
    }
  }
}

// Create global instance
window.notificationService = new NotificationService();

console.log('🔔 Notification service loaded');