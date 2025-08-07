# EmailJS Setup Guide

## Problem
Your EmailJS configuration is returning "Account not found" (404 error), which means the service ID, template IDs, or public key are incorrect or don't exist.

## Solution Steps

### 1. Sign up / Log in to EmailJS
1. Go to [https://emailjs.com](https://emailjs.com)
2. Sign up for a free account or log in if you already have one
3. Free tier allows 200 emails per month

### 2. Create an Email Service
1. Go to **Email Services** in your EmailJS dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions to connect your email account
5. **Copy the Service ID** (something like `service_xxxxxxx`)

### 3. Create Email Templates

#### Admin Notification Template
1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Name it "Admin Order Notification"
4. Use this template content:

**Subject:** New Order Received - {{order_id}}

**Content:**
```
Hello {{to_name}},

A new order has been received:

Order ID: {{order_id}}
Customer: {{customer_name}} ({{customer_email}})
Phone: {{customer_phone}}
Address: {{customer_address}}

Order Items:
{{order_items}}

Total: {{order_total}}

Delivery Details:
Date: {{delivery_date}}
Time: {{delivery_time}}

Notes: {{notes}}

Best regards,
Aab e Tahura System
```

5. **Copy the Template ID** (something like `template_xxxxxxx`)

#### Customer Confirmation Template
1. Create another template named "Customer Order Confirmation"
2. Use this template content:

**Subject:** Order Confirmation - {{order_id}}

**Content:**
```
Dear {{to_name}},

Thank you for your order! Here are the details:

Order ID: {{order_id}}

Items Ordered:
{{order_items}}

Total: {{order_total}}

Delivery Details:
Address: {{delivery_address}}
Date: {{delivery_date}}
Time: {{delivery_time}}

Notes: {{notes}}

We'll deliver your order at the specified time. If you have any questions, please contact us.

Best regards,
Aab e Tahura Team
```

3. **Copy the Template ID** (something like `template_xxxxxxx`)

### 4. Get Your Public Key
1. Go to **Account** > **General** in your EmailJS dashboard
2. **Copy your Public Key** (something like `xxxxxxxxxxxxxxx`)

### 5. Update Your Environment Variables
Replace the placeholder values in your `.env` file with your actual EmailJS credentials:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID="service_your_actual_service_id"
VITE_EMAILJS_ADMIN_TEMPLATE_ID="template_your_admin_template_id"
VITE_EMAILJS_CUSTOMER_TEMPLATE_ID="template_your_customer_template_id"
VITE_EMAILJS_PUBLIC_KEY="your_actual_public_key"
```

### 6. Test the Configuration
1. Restart your development server: `npm run dev`
2. Check the browser console for: `✅ EmailJS configured successfully`
3. If you see configuration errors, double-check your environment variables
4. Try placing a test order to verify emails are sent

## Common Issues & Solutions

### Issue: "Account not found" (404)
- **Cause:** Wrong service ID, template ID, or public key
- **Solution:** Double-check all IDs in your EmailJS dashboard

### Issue: "Template not found"
- **Cause:** Template ID is incorrect or template is not published
- **Solution:** Verify template IDs and ensure templates are saved

### Issue: "Unauthorized" (401)
- **Cause:** Wrong public key or account issues
- **Solution:** Check your public key in EmailJS Account settings

### Issue: Rate limit exceeded
- **Cause:** Too many emails sent (free tier: 200/month)
- **Solution:** Upgrade your EmailJS plan or wait for the limit to reset

## Template Variables Reference

These variables are sent from your app to the email templates:

### Admin Template Variables:
- `{{to_name}}` - "Aab e Tahura Admin"
- `{{to_email}}` - "admin@aabetahura.com"  
- `{{order_id}}` - Order ID
- `{{customer_name}}` - Customer's full name
- `{{customer_email}}` - Customer's email
- `{{customer_phone}}` - Customer's phone
- `{{customer_address}}` - Full address
- `{{order_items}}` - List of items with quantities and prices
- `{{order_total}}` - Total amount
- `{{delivery_date}}` - Delivery date
- `{{delivery_time}}` - Delivery time
- `{{notes}}` - Special instructions

### Customer Template Variables:
- `{{to_name}}` - Customer's name
- `{{to_email}}` - Customer's email
- `{{order_id}}` - Order ID
- `{{customer_name}}` - Customer's name
- `{{order_items}}` - List of items
- `{{order_total}}` - Total amount
- `{{delivery_date}}` - Delivery date
- `{{delivery_time}}` - Delivery time
- `{{delivery_address}}` - Delivery address
- `{{notes}}` - Special instructions

## Testing
After setup, you should see these logs in the console when placing an order:
- `✅ EmailJS configured successfully`
- `📧 Sending admin notification email...`
- `📧 Sending customer confirmation email...`
- `✅ Admin notification sent successfully`
- `✅ Customer confirmation sent successfully`

If you see configuration errors, the emails will be skipped with a warning message.
