// ============================================================================
// SYSTEM NOTIFICATION API - For sending system-level notifications
// ============================================================================

// This is a placeholder for a real backend API endpoint
// In a real app, this would be a serverless function or API route

class SystemNotificationAPI {
  constructor() {
    this.baseUrl = 'https://fcm.googleapis.com/fcm/send';
    this.serverKey = 'YOUR_FIREBASE_SERVER_KEY'; // Legacy - will use modern Firebase Admin SDK instead
  }

  // Send system notification via FCM
  async sendSystemNotification(title, body, token, data = {}) {
    try {
      console.log('📤 Sending system notification via FCM...');
      
      const payload = {
        to: token,
        notification: {
          title: title,
          body: body,
          icon: '/logo.png',
          sound: 'default',
          badge: '1'
        },
        data: {
          ...data,
          click_action: 'FLUTTER_NOTIFICATION_CLICK'
        },
        priority: 'high'
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `key=${this.serverKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (result.success === 1) {
        console.log('✅ System notification sent successfully');
        return { success: true, messageId: result.results[0].message_id };
      } else {
        console.error('❌ Failed to send system notification:', result);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Error sending system notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Send notification to multiple tokens
  async sendToMultipleTokens(title, body, tokens, data = {}) {
    try {
      console.log('📤 Sending system notification to multiple devices...');
      
      const payload = {
        registration_ids: tokens,
        notification: {
          title: title,
          body: body,
          icon: '/logo.png',
          sound: 'default',
          badge: '1'
        },
        data: {
          ...data,
          click_action: 'FLUTTER_NOTIFICATION_CLICK'
        },
        priority: 'high'
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `key=${this.serverKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (result.success > 0) {
        console.log(`✅ System notification sent to ${result.success} devices`);
        return { success: true, sentCount: result.success, failureCount: result.failure };
      } else {
        console.error('❌ Failed to send system notification to any device:', result);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Error sending system notification to multiple devices:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create global instance
window.systemNotificationAPI = new SystemNotificationAPI();

console.log('🔔 System notification API loaded');
