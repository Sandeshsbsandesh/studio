const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Send notification to all users
exports.sendNotificationToAll = functions.https.onCall(async (data, context) => {
  const {title, body, data: notificationData} = data;

  if (!title || !body) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Title and body are required",
    );
  }

  try {
    // Get all FCM tokens from customers
    const customersSnapshot = await admin.firestore()
        .collection("customers")
        .where("fcmToken", "!=", null)
        .get();

    // Get all FCM tokens from providers
    const providersSnapshot = await admin.firestore()
        .collection("providers")
        .where("fcmToken", "!=", null)
        .get();

    const allTokens = [];

    customersSnapshot.forEach((doc) => {
      if (doc.data().fcmToken) {
        allTokens.push(doc.data().fcmToken);
      }
    });

    providersSnapshot.forEach((doc) => {
      if (doc.data().fcmToken) {
        allTokens.push(doc.data().fcmToken);
      }
    });

    if (allTokens.length === 0) {
      return {success: false, message: "No FCM tokens found"};
    }

    const message = {
      tokens: allTokens,
      notification: {
        title: title,
        body: body,
        icon: "/logo.png",
        sound: "default",
      },
      data: notificationData || {},
      android: {
        priority: "high",
        notification: {
          icon: "ic_launcher",
          color: "#3B82F6",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
          },
        },
      },
    };

    const result = await admin.messaging().sendMulticast(message);
    return {
      success: true,
      messageId: result,
      tokensSent: allTokens.length,
      successCount: result.successCount,
      failureCount: result.failureCount,
    };
  } catch (error) {
    console.error("Error sending notification to all:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

exports.sendNotification = functions.https.onCall(async (data, context) => {
  const {title, body, token, tokens, data: notificationData} = data;

  if (!title || !body) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Title and body are required",
    );
  }

  try {
    if (token) {
      const message = {
        token: token,
        notification: {
          title: title,
          body: body,
          icon: "/logo.png",
          sound: "default",
        },
        data: notificationData || {},
        android: {
          priority: "high",
          notification: {
            icon: "ic_launcher",
            color: "#3B82F6",
          },
        },
        apns: {
          payload: {
            aps: {
              sound: "default",
              badge: 1,
            },
          },
        },
      };

      const result = await admin.messaging().send(message);
      return {success: true, messageId: result};
    }

    if (tokens && Array.isArray(tokens)) {
      const message = {
        tokens: tokens,
        notification: {
          title: title,
          body: body,
          icon: "/logo.png",
          sound: "default",
        },
        data: notificationData || {},
        android: {
          priority: "high",
          notification: {
            icon: "ic_launcher",
            color: "#3B82F6",
          },
        },
        apns: {
          payload: {
            aps: {
              sound: "default",
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().sendMulticast(message);
      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
      };
    }

    throw new functions.https.HttpsError(
        "invalid-argument",
        "Either token or tokens array is required",
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    throw new functions.https.HttpsError(
        "internal",
        "Failed to send notification: " + error.message,
    );
  }
});
