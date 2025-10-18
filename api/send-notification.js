// ============================================================================
// VERCEL API ENDPOINT - Firebase Admin SDK Notifications
// ============================================================================

// This file should be in your project root: api/send-notification.js
// Deploy to Vercel: vercel --prod

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK (do this once)
if (!admin.apps.length) {
  // Replace with your actual service account JSON
  const serviceAccount = {
    "type": "service_account",
    "project_id": "studio-9158883051-f75ec",
    "private_key_id": "YOUR_PRIVATE_KEY_ID",
    "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-xxxxx@studio-9158883051-f75ec.iam.gserviceaccount.com",
    "client_id": "YOUR_CLIENT_ID",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40studio-9158883051-f75ec.iam.gserviceaccount.com"
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'studio-9158883051-f75ec'
  });
}

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse request body
    const { title, body, token, tokens, data } = req.body;

    if (!title || !body) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title and body are required' 
      });
    }

    let result;

    // Send to single token
    if (token) {
      const message = {
        token: token,
        notification: {
          title: title,
          body: body,
          icon: '/logo.png',
          sound: 'default'
        },
        data: data || {},
        android: {
          priority: 'high',
          notification: {
            icon: 'ic_launcher',
            color: '#3B82F6'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1
            }
          }
        }
      };

      result = await admin.messaging().send(message);
      
      return res.status(200).json({
        success: true,
        messageId: result,
        method: 'single'
      });
    }

    // Send to multiple tokens
    if (tokens && Array.isArray(tokens)) {
      const message = {
        tokens: tokens,
        notification: {
          title: title,
          body: body,
          icon: '/logo.png',
          sound: 'default'
        },
        data: data || {},
        android: {
          priority: 'high',
          notification: {
            icon: 'ic_launcher',
            color: '#3B82F6'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1
            }
          }
        }
      };

      const response = await admin.messaging().sendMulticast(message);
      
      return res.status(200).json({
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
        method: 'multicast'
      });
    }

    return res.status(400).json({
      success: false,
      error: 'Either token or tokens array is required'
    });

  } catch (error) {
    console.error('Error sending notification:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
