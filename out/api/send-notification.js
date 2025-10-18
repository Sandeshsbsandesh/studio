// ============================================================================
// NOTIFICATION API - Send Push Notifications
// ============================================================================

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

// Firebase config
const firebaseConfig = {
  "projectId": "studio-9158883051-f75ec",
  "appId": "1:857576-f75ec.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "857576805556"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// This would typically be a server-side function
// For now, we'll create a client-side version for testing
export async function sendNotification(notificationData) {
  try {
    console.log('📤 Sending notification:', notificationData);
    
    // Get all users with FCM tokens
    const customersRef = collection(db, 'customers');
    const providersRef = collection(db, 'providers');
    
    const [customersSnapshot, providersSnapshot] = await Promise.all([
      getDocs(query(customersRef, where('fcmToken', '!=', null))),
      getDocs(query(providersRef, where('fcmToken', '!=', null)))
    ]);
    
    const allTokens = [];
    
    // Collect customer tokens
    customersSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.fcmToken) {
        allTokens.push(data.fcmToken);
      }
    });
    
    // Collect provider tokens
    providersSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.fcmToken) {
        allTokens.push(data.fcmToken);
      }
    });
    
    console.log(`📱 Found ${allTokens.length} FCM tokens`);
    
    // Send notification to all tokens
    if (allTokens.length > 0) {
      // In a real implementation, you would use Firebase Admin SDK
      // For now, we'll simulate the notification
      console.log('🔔 Notification would be sent to:', allTokens.length, 'devices');
      
      // Show local notification for testing
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notificationData.title, {
          body: notificationData.body,
          icon: '/logo.png',
          tag: notificationData.type || 'general'
        });
      }
    }
    
    return { success: true, sentTo: allTokens.length };
    
  } catch (error) {
    console.error('❌ Failed to send notification:', error);
    return { success: false, error: error.message };
  }
}

// Promotional notification examples
export const promotionalNotifications = {
  diwali: {
    title: '🎆 Happy Diwali from UrbanEzii!',
    body: 'Light up your home with our premium services. Get 20% off on all bookings this festive season!',
    type: 'promotional',
    data: {
      type: 'promotional',
      action: 'view_offers',
      discount: '20%'
    }
  },
  
  newYear: {
    title: '🎉 Happy New Year 2025!',
    body: 'Start the year right with UrbanEzii. Book any service and get a free consultation!',
    type: 'promotional',
    data: {
      type: 'promotional',
      action: 'view_offers',
      offer: 'free_consultation'
    }
  },
  
  weekendSpecial: {
    title: '🏠 Weekend Special!',
    body: 'Book any home service this weekend and get 15% off. Limited time offer!',
    type: 'promotional',
    data: {
      type: 'promotional',
      action: 'view_offers',
      discount: '15%'
    }
  }
};

// Send promotional notification
export async function sendPromotionalNotification(type) {
  const notification = promotionalNotifications[type];
  if (notification) {
    return await sendNotification(notification);
  }
  return { success: false, error: 'Invalid notification type' };
}

// Make functions available globally
window.sendNotification = sendNotification;
window.sendPromotionalNotification = sendPromotionalNotification;
window.promotionalNotifications = promotionalNotifications;
