# 🚀 Admin Panel Setup Instructions

## Quick Start Guide

Follow these steps to set up and access your admin panel for the first time.

---

## Step 1: Create Admin Account in Firebase

If you haven't already created an admin account in Firebase Authentication:

### Option A: Using Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your UrbanEzii project
3. Click **Authentication** in the left sidebar
4. Click **Users** tab
5. Click **Add User** button
6. Enter:
   - **Email:** `sandeshsb0219@gmail.com`
   - **Password:** `Admin@2025`
7. Click **Add User**

### Option B: Using the Admin Panel Login (Auto-Create)

1. Navigate to: `http://localhost:3001/admin/login`
2. Try to sign in with `sandeshsb0219@gmail.com`
3. If account doesn't exist, create it via Firebase Console (Option A)

---

## Step 2: Test Admin Login

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to admin login:**
   ```
   http://localhost:3001/admin/login
   ```

3. **Enter credentials:**
   - Email: `sandeshsb0219@gmail.com`
   - Password: `Admin@2025`

4. **Click "Sign In"**

5. **You should be redirected to:** `/admin` (Dashboard)

---

## Step 3: Verify Admin Access

After logging in, you should see:

✅ **Sidebar** with navigation menu:
- Dashboard
- Providers
- Customers
- Bookings
- Service Requests
- Pricing
- Notifications
- Activity Log
- Settings

✅ **Dashboard** with statistics:
- Total Providers
- Total Customers
- Total Bookings
- Pending Requests
- Today's Bookings
- Total Revenue

✅ **Recent Activity** feed

---

## Step 4: Configure Settings (Optional)

1. Click **Settings** in the sidebar
2. Verify admin email: `sandeshsb0219@gmail.com`
3. Enable/disable notifications
4. Configure platform settings
5. Click **Save Settings**

---

## Step 5: Add Your First Provider (Test)

1. Click **Providers** in sidebar
2. Click **Add Provider** button
3. Fill in the form:
   ```
   Provider Name: Test Electrician
   Category: Electrician
   Phone: 9876543210
   Email: test@example.com
   Address: Bangalore, Karnataka
   Latitude: 12.9716
   Longitude: 77.5946
   Initial Rating: 4.5
   Status: Active
   ```
4. Click **Add Provider**
5. You should see the provider in the list!

---

## Troubleshooting

### ❌ Can't Login - "Unauthorized: Not an admin account"

**Problem:** The email you're using is not `sandeshsb0219@gmail.com`

**Solution:** 
- Only `sandeshsb0219@gmail.com` has admin access
- To change the admin email, edit `src/lib/admin-auth.ts`:
  ```typescript
  const ADMIN_EMAIL = 'your-email@example.com';
  ```

### ❌ Can't Login - "Invalid email or password"

**Problem:** Wrong password or account doesn't exist

**Solution:**
1. Check if account exists in Firebase Console → Authentication
2. If not, create it (see Step 1)
3. If password is wrong, reset it in Firebase Console

### ❌ Can't Login - "Failed to sign in"

**Problem:** Firebase connection issue

**Solution:**
1. Check `.env.local` has Firebase config
2. Verify Firebase project is active
3. Check browser console for errors
4. Ensure Firebase Authentication is enabled in Firebase Console

### ❌ Dashboard is empty / No data showing

**Problem:** No data in Firebase collections

**Solution:**
1. Add test data via the admin panel
2. Or check if Firebase collections exist:
   - `providers`
   - `users`
   - `bookings`
   - `serviceRequests`

### ❌ "Firebase: Error (auth/...)"

**Common Firebase Auth Errors:**

- `auth/user-not-found` → Create account in Firebase Console
- `auth/wrong-password` → Check password or reset it
- `auth/invalid-email` → Check email format
- `auth/network-request-failed` → Check internet connection
- `auth/too-many-requests` → Wait a few minutes and try again

---

## Change Admin Email (Optional)

To use a different admin email:

1. **Edit** `src/lib/admin-auth.ts`
2. **Find** this line:
   ```typescript
   const ADMIN_EMAIL = 'sandeshsb0219@gmail.com';
   ```
3. **Change** to your email:
   ```typescript
   const ADMIN_EMAIL = 'your-email@example.com';
   ```
4. **Save** the file
5. **Restart** dev server
6. **Create account** in Firebase with your email
7. **Login** with your email

---

## Add Multiple Admins (Advanced)

To allow multiple admin emails:

1. **Edit** `src/lib/admin-auth.ts`
2. **Replace** the `isAdmin` function:
   ```typescript
   const ADMIN_EMAILS = [
     'sandeshsb0219@gmail.com',
     'admin2@example.com',
     'admin3@example.com',
   ];

   export function isAdmin(email: string | null): boolean {
     if (!email) return false;
     return ADMIN_EMAILS.includes(email);
   }
   ```
3. **Update** `signInAsAdmin` function:
   ```typescript
   export async function signInAsAdmin(email: string, password: string): Promise<AdminUser> {
     if (!ADMIN_EMAILS.includes(email)) {
       throw new Error('Unauthorized: Not an admin account');
     }
     // ... rest of the code
   }
   ```
4. **Save** and restart server
5. **Create accounts** for all admin emails in Firebase

---

## Security Best Practices

### 🔒 Password Security
- Use a strong password (12+ characters)
- Include uppercase, lowercase, numbers, symbols
- Don't share admin password
- Change password regularly

### 🔐 Account Security
- Enable 2FA in Firebase (optional)
- Don't use admin account on public WiFi
- Log out when not using
- Monitor activity log regularly

### 🛡️ Firebase Security
- Keep Firebase API keys secure
- Don't commit `.env.local` to Git
- Use Firebase Security Rules
- Monitor Firebase usage

---

## Production Deployment

When deploying to production:

1. **Ensure admin account exists in production Firebase**
2. **Update admin email if different**
3. **Test login on production URL**
4. **Configure Firebase Security Rules**
5. **Set up Firebase App Check (optional)**

---

## Email Notifications Setup (Optional)

To enable email notifications for admin:

1. Go to Settings in admin panel
2. Enable "Email Notifications"
3. Set up email service (Resend, SendGrid, or Gmail SMTP)
4. Follow `SERVICE_REQUEST_SETUP.md` for email integration

---

## Quick Reference

| What | Value |
|------|-------|
| **Admin Login URL** | `/admin/login` |
| **Admin Email** | `sandeshsb0219@gmail.com` |
| **Change Admin Email** | Edit `src/lib/admin-auth.ts` |
| **Reset Password** | Firebase Console → Authentication |
| **Add New Admin** | Update `ADMIN_EMAILS` array |

---

## Next Steps

After successful login:

1. ✅ **Explore Dashboard** - View platform overview
2. ✅ **Add Test Data** - Add a test provider
3. ✅ **Check All Pages** - Navigate through all sections
4. ✅ **Test Features** - Try adding, editing, deleting
5. ✅ **Review Documentation** - Read `ADMIN_PANEL_GUIDE.md`

---

## Support

Need help? 

- **Email:** sandeshsb0219@gmail.com
- **Documentation:** `ADMIN_PANEL_GUIDE.md`
- **Firebase Docs:** [firebase.google.com/docs/auth](https://firebase.google.com/docs/auth)

---

## ✅ Setup Complete!

Once you can login successfully, your admin panel is ready to use! 🎉

**Login URL:** `http://localhost:3001/admin/login`  
**Admin Email:** `sandeshsb0219@gmail.com`  
**Password:** `Admin@2025`

**Happy Managing! 🚀**

