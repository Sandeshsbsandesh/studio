// ============================================================================
// BACKEND API ENDPOINT - For Firebase Admin SDK
// ============================================================================

// This is a serverless function (Vercel/Netlify/Firebase Functions)
// Deploy this to your backend and update the API endpoint in the client

// For Vercel: Save as api/send-notification.js
// For Netlify: Save as netlify/functions/send-notification.js
// For Firebase Functions: Save as functions/src/send-notification.js

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK (do this once)
if (!admin.apps.length) {
  // Use environment variables for security
  const serviceAccount = {
    "type": "service_account",
    "project_id": process.env.FIREBASE_PROJECT_ID || "studio-9158883051-f75ec",
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@studio-9158883051-f75ec.iam.gserviceaccount.com')}`,
    "universe_domain": "googleapis.com"
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'studio-9158883051-f75ec'
  });
}

// Main function
exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const { title, body, token, tokens, data, notification } = JSON.parse(event.body);

    if (!title || !body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Title and body are required' 
        })
      };
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
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          messageId: result,
          method: 'single'
        })
      };
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
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          successCount: response.successCount,
          failureCount: response.failureCount,
          method: 'multicast'
        })
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Either token or tokens array is required'
      })
    };

  } catch (error) {
    console.error('Error sending notification:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};

// For Firebase Functions, use this instead:
/*
exports.sendNotification = functions.https.onCall(async (data, context) => {
  // Authentication check
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const { title, body, token, tokens, data: notificationData } = data;

  if (!title || !body) {
    throw new functions.https.HttpsError('invalid-argument', 'Title and body are required');
  }

  try {
    if (token) {
      const message = {
        token: token,
        notification: { title, body },
        data: notificationData || {}
      };
      
      const result = await admin.messaging().send(message);
      return { success: true, messageId: result };
    }

    if (tokens && Array.isArray(tokens)) {
      const message = {
        tokens: tokens,
        notification: { title, body },
        data: notificationData || {}
      };
      
      const response = await admin.messaging().sendMulticast(message);
      return { 
        success: true, 
        successCount: response.successCount, 
        failureCount: response.failureCount 
      };
    }

    throw new functions.https.HttpsError('invalid-argument', 'Either token or tokens array is required');

  } catch (error) {
    console.error('Error sending notification:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send notification');
  }
});
*/
