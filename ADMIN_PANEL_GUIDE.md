# 🔐 UrbanEzii Admin Panel - Complete Guide

## Overview

The UrbanEzii Admin Panel is a comprehensive management dashboard that gives you full control over your platform. With this admin panel, you can:

✅ View all customers, providers, and bookings  
✅ Add, edit, and delete providers  
✅ Edit service pricing  
✅ Review service requests  
✅ Monitor all platform activity  
✅ Receive real-time notifications  
✅ Manage platform settings  

---

## 🚀 Getting Started

### 1. Admin Login

**URL:** `http://localhost:3001/admin/login` (or `/admin/login` in production)

**Admin Credentials:**
- **Email:** `sandeshsb0219@gmail.com`
- **Password:** Your Firebase account password

**Important:** Only the email `sandeshsb0219@gmail.com` has admin access. This is configured in `src/lib/admin-auth.ts`.

### 2. First Time Setup

1. Make sure you have a Firebase account with the admin email
2. If you don't have a password yet, create one via Firebase Authentication
3. Navigate to `/admin/login`
4. Enter your credentials
5. You'll be redirected to the admin dashboard

---

## 📊 Dashboard Features

### 1. **Main Dashboard** (`/admin`)

**What you'll see:**
- Total Providers count (with active/inactive breakdown)
- Total Customers count
- Total Bookings (with completed count)
- Pending Service Requests
- Today's Bookings
- Total Revenue (from completed bookings)
- Recent Activity feed
- Platform Health metrics

**Quick Actions:**
- Add New Provider
- View All Bookings
- Review Service Requests

---

### 2. **Providers Management** (`/admin/providers`)

**Features:**
- View all registered service providers
- Search by name, email, phone, or category
- See provider details:
  - Contact information
  - Address & location
  - Rating and completed jobs
  - Active/Inactive status

**Actions You Can Take:**
- ✅ **Add New Provider** - Create new provider profiles
- ✅ **Edit Provider** - Update provider information
- ✅ **Delete Provider** - Remove providers from platform
- ✅ **Toggle Status** - Activate/Deactivate providers
- ✅ **View Details** - See full provider profile

**How to Add a Provider:**
1. Click "Add Provider" button
2. Fill in required fields:
   - Provider Name*
   - Category* (Electrician, Plumber, etc.)
   - Phone Number*
   - Email (optional)
   - Address (optional)
   - Latitude/Longitude (optional, for distance calculations)
   - Initial Rating (default: 4.5)
   - Completed Jobs (default: 0)
   - Status (Active/Inactive)
3. Click "Add Provider"
4. Provider will appear in the list immediately

---

### 3. **Customers Management** (`/admin/customers`)

**Features:**
- View all registered customers
- See customer details:
  - Name and contact information
  - Address
  - Total bookings made
  - Total amount spent
  - Registration date

**Stats Displayed:**
- Total Customers
- Active Customers (those who have made bookings)
- Total Revenue from all customers

**Actions:**
- Search customers by name, email, or phone
- View customer booking history
- Export customer data (coming soon)

---

### 4. **Bookings Management** (`/admin/bookings`)

**Features:**
- View all service bookings
- Filter by status:
  - Pending
  - Confirmed
  - Completed
  - Cancelled

**Booking Details Shown:**
- Customer information (name, phone, address)
- Service type
- Provider assigned
- Scheduled date & time
- Booking amount
- Current status
- Created timestamp

**Actions You Can Take:**
- ✅ **Change Booking Status** - Update from pending → confirmed → completed
- ✅ **Search Bookings** - Find specific bookings
- ✅ **Filter by Status** - View only certain types of bookings
- ✅ **View Full Details** - See complete booking information

**How to Update a Booking:**
1. Find the booking in the list
2. Click on the status dropdown
3. Select new status (Pending/Confirmed/Completed/Cancelled)
4. Status updates automatically

---

### 5. **Service Requests** (`/admin/service-requests`)

**What are Service Requests?**
These are submitted by users when they can't find a specific service on the platform.

**Features:**
- View all service requests
- Filter by status (Pending, Reviewed, Completed, Rejected)
- See request details:
  - Service requested
  - Location
  - Customer details
  - Additional information
  - Submission date

**Actions You Can Take:**
- ✅ **Change Status** - Mark as Reviewed/Completed/Rejected
- ✅ **Contact Customer** - Email and phone links provided
- ✅ **Complete Request** - Mark as fulfilled
- ✅ **Delete Request** - Remove from system

**Workflow:**
1. User submits request via main website
2. Request appears in admin panel
3. Admin reviews and contacts customer
4. Admin marks as "Reviewed"
5. After fulfilling, mark as "Completed"

---

### 6. **Pricing Editor** (`/admin/pricing`)

**Features:**
- View all provider services and prices
- Edit prices in real-time
- Search providers
- See services grouped by category

**How to Edit Prices:**
1. Find the provider
2. Locate the service you want to edit
3. Click the Edit icon (pencil)
4. Enter new price (₹ symbol added automatically)
5. Click Save (checkmark) or Cancel (X)
6. Price updates immediately in database

**Important:**
- Prices are stored without currency symbols
- The ₹ symbol is added automatically when displayed
- All prices should be numeric values only

---

### 7. **Notifications** (`/admin/notifications`)

**Features:**
- Real-time notification feed
- Notifications for:
  - New bookings
  - New service requests
  - New provider registrations
  - System events

**Filter Options:**
- All Notifications
- Unread Only

**Stats:**
- Total notifications
- Unread count
- High priority count
- Today's notifications

**Priority Levels:**
- 🔴 High (new bookings)
- 🟠 Medium (service requests)
- 🟢 Low (new providers)

---

### 8. **Activity Log** (`/admin/activity`)

**Features:**
- Complete audit trail of platform activity
- Filter by type:
  - All activities
  - Bookings only
  - Providers only
  - Service Requests only

**What's Logged:**
- All new bookings
- Provider registrations
- Service request submissions
- Timestamps and actors (who did what)

**Use Cases:**
- Track platform usage
- Monitor growth
- Debug issues
- Generate reports

---

### 9. **Settings** (`/admin/settings`)

**Configuration Options:**

**General Settings:**
- Admin Email (where notifications are sent)

**Notification Settings:**
- Toggle in-panel notifications
- Toggle email notifications

**Platform Settings:**
- Auto-approve new providers (coming soon)
- Maintenance mode (disable platform temporarily)

**How to Save Settings:**
1. Update any settings
2. Click "Save Settings" button
3. Changes apply immediately

---

## 🔒 Security Features

### Authentication
- Firebase Authentication powered
- Only authorized admin email can access
- Secure password reset via Firebase
- Auto-logout on session expiry

### Access Control
- Admin-only routes protected
- All actions logged
- User actions tracked with timestamps

### Data Protection
- All admin actions logged
- Sensitive data encrypted
- Secure Firebase connection

---

## 📱 Mobile Responsive

The admin panel is fully responsive and works on:
- Desktop (best experience)
- Tablets
- Mobile phones

---

## 🎨 User Interface

### Sidebar Navigation
- Dashboard
- Providers
- Customers
- Bookings
- Service Requests
- Pricing
- Notifications
- Activity Log
- Settings
- Sign Out

### Color-Coded Status
- 🟢 Green: Active, Completed, Success
- 🔵 Blue: Confirmed, In Progress
- 🟡 Yellow: Pending, Warning
- 🔴 Red: Cancelled, Error, High Priority

---

## 📊 Data Sources

All data comes from Firebase Firestore collections:

| Collection | Purpose |
|-----------|---------|
| `providers` | Service provider profiles |
| `users` | Customer accounts |
| `bookings` | Service bookings |
| `serviceRequests` | User service requests |

---

## 🔧 Common Tasks

### How to Add a New Provider
1. Go to `/admin/providers`
2. Click "Add Provider"
3. Fill in required details
4. Save

### How to Handle a Service Request
1. Go to `/admin/service-requests`
2. Find the request
3. Contact customer via phone/email
4. Mark as "Reviewed"
5. After fulfilling, mark "Completed"

### How to Update Booking Status
1. Go to `/admin/bookings`
2. Find the booking
3. Change status dropdown
4. Done!

### How to Change a Service Price
1. Go to `/admin/pricing`
2. Find provider and service
3. Click edit icon
4. Enter new price
5. Save

### How to Monitor Platform Activity
1. Go to `/admin` (dashboard)
2. Check stats cards
3. View recent activity
4. Or go to `/admin/activity` for full log

---

## 💡 Tips & Best Practices

### 1. **Daily Routine**
- Check dashboard for overview
- Review pending service requests
- Update booking statuses
- Respond to high-priority notifications

### 2. **Provider Management**
- Keep provider information updated
- Verify provider details before activation
- Monitor provider ratings
- Deactivate inactive providers

### 3. **Pricing**
- Review prices regularly
- Keep prices competitive
- Update based on market rates
- Ensure prices are clear of currency symbols in database

### 4. **Customer Service**
- Respond to service requests quickly
- Keep customers informed of booking status
- Use email/phone links for direct contact

### 5. **Monitoring**
- Check activity log weekly
- Monitor booking trends
- Track revenue growth
- Review customer feedback

---

## 🚨 Troubleshooting

### Can't Login?
- Verify you're using `sandeshsb0219@gmail.com`
- Check Firebase Authentication is enabled
- Reset password via Firebase Console

### Providers Not Showing?
- Check Firebase connection
- Verify `providers` collection exists
- Check browser console for errors

### Bookings Not Loading?
- Verify `bookings` collection exists
- Check Firebase security rules
- Refresh the page

### Prices Not Updating?
- Check internet connection
- Verify Firebase permissions
- Refresh and try again

---

## 🔄 Future Enhancements

Planned features:
- [ ] Bulk provider import
- [ ] Export data as CSV/Excel
- [ ] Advanced analytics dashboard
- [ ] Email templates customization
- [ ] SMS notifications
- [ ] Provider performance reports
- [ ] Customer lifetime value tracking
- [ ] Revenue forecasting
- [ ] Automated provider approval
- [ ] Real-time chat with customers/providers

---

## 📞 Support

For technical issues or questions:
- Email: sandeshsb0219@gmail.com
- Check Firebase Console for backend issues
- Review browser console for frontend errors

---

## 🎉 Summary

The UrbanEzii Admin Panel gives you complete control over your service platform:

✅ Manage providers, customers, and bookings  
✅ Edit pricing in real-time  
✅ Monitor platform activity  
✅ Respond to service requests  
✅ Track revenue and growth  
✅ Configure platform settings  

**Access URL:** `/admin/login`  
**Admin Email:** `sandeshsb0219@gmail.com`  

**You now have a fully functional admin panel! 🚀**

