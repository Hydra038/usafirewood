# Supabase Email Templates Configuration Guide

## Overview
This guide shows you how to configure all email templates in Supabase for the FireUSA application.

---

## Access Email Templates

1. **Go to**: https://supabase.com/dashboard
2. **Select your project**: `pnqgzqzznesgamlwwcez`
3. **Navigate to**: **Authentication** → **Email Templates**

---

## 1. Confirm Signup Email Template

### Purpose
Sent when a user registers a new account.

### Template Name
**"Confirm signup"** or **"Confirm your signup"**

### Required Configuration

**Subject:**
```
Confirm your FireUSA account
```

**Body:**
```html
<h2>Welcome to FireUSA!</h2>

<p>Thank you for signing up! Please confirm your email address by clicking the button below:</p>

<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 6px;">Confirm Email Address</a></p>

<p>Or copy and paste this URL into your browser:</p>
<p>{{ .ConfirmationURL }}</p>

<p>This link will expire in 24 hours.</p>

<p>If you didn't create an account, you can safely ignore this email.</p>

<p>Best regards,<br>The FireUSA Team</p>
```

### Important Variables
- `{{ .ConfirmationURL }}` - Auto-generated URL with verification code
- This URL automatically redirects to: `{Your Site URL}/auth/callback?code=xxxxx`

---

## 2. Reset Password Email Template

### Purpose
Sent when a user requests to reset their password.

### Template Name
**"Reset Password"** or **"Magic Link"**

### Required Configuration

**Subject:**
```
Reset your FireUSA password
```

**Body:**
```html
<h2>Reset Your Password</h2>

<p>Someone requested a password reset for your FireUSA account.</p>

<p>Click the button below to reset your password:</p>

<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 6px;">Reset Password</a></p>

<p>Or copy and paste this URL into your browser:</p>
<p>{{ .ConfirmationURL }}</p>

<p>This link will expire in 1 hour.</p>

<p>If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>

<p>Best regards,<br>The FireUSA Team</p>
```

### Important Variables
- `{{ .ConfirmationURL }}` - Auto-generated URL with reset token
- This URL automatically redirects to: `{Your Site URL}/auth/reset-password`

---

## 3. Email Change Confirmation

### Purpose
Sent when a user changes their email address.

### Template Name
**"Change Email Address"** or **"Confirm Email Change"**

### Required Configuration

**Subject:**
```
Confirm your new email address
```

**Body:**
```html
<h2>Confirm Your New Email Address</h2>

<p>You recently requested to change your email address for your FireUSA account.</p>

<p>Click the button below to confirm your new email address:</p>

<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 6px;">Confirm New Email</a></p>

<p>Or copy and paste this URL into your browser:</p>
<p>{{ .ConfirmationURL }}</p>

<p>If you didn't request this change, please contact support immediately.</p>

<p>Best regards,<br>The FireUSA Team</p>
```

---

## 4. Invite User Email (Optional)

### Purpose
Sent when an admin invites a new user.

### Template Name
**"Invite User"**

**Subject:**
```
You've been invited to FireUSA
```

**Body:**
```html
<h2>You've Been Invited to FireUSA</h2>

<p>You've been invited to join FireUSA!</p>

<p>Click the button below to accept the invitation and set up your account:</p>

<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 6px;">Accept Invitation</a></p>

<p>Or copy and paste this URL into your browser:</p>
<p>{{ .ConfirmationURL }}</p>

<p>Best regards,<br>The FireUSA Team</p>
```

---

## URL Configuration (CRITICAL!)

### Required Settings

Go to: **Authentication** → **URL Configuration**

### 1. Site URL
Set your primary production domain:
```
https://usafirewood.com
```

Or for initial Vercel deployment:
```
https://your-app-name.vercel.app
```

### 2. Redirect URLs
Add ALL of these URLs (one per line):

```
http://localhost:3000/auth/callback
http://localhost:3000/auth/reset-password
https://your-app-name.vercel.app/auth/callback
https://your-app-name.vercel.app/auth/reset-password
https://usafirewood.com/auth/callback
https://usafirewood.com/auth/reset-password
```

**Important:** 
- Include both `/auth/callback` and `/auth/reset-password` for each domain
- Include `http://localhost:3000` for local development
- Include your Vercel URL for staging
- Include your production domain

---

## Available Template Variables

You can use these variables in your email templates:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{ .ConfirmationURL }}` | Auto-generated confirmation link | Full URL with token |
| `{{ .SiteURL }}` | Your configured Site URL | https://usafirewood.com |
| `{{ .TokenHash }}` | The verification token | Used in custom URLs |
| `{{ .Email }}` | User's email address | user@example.com |
| `{{ .Token }}` | Raw token (deprecated) | Use TokenHash instead |

---

## Custom Redirect URLs

If you want more control over the redirect URLs, you can customize them:

### For Email Verification:
```html
<a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup">Confirm Email</a>
```

### For Password Reset:
```html
<a href="{{ .SiteURL }}/auth/reset-password?token_hash={{ .TokenHash }}&type=recovery">Reset Password</a>
```

**Note:** Using `{{ .ConfirmationURL }}` is recommended as Supabase handles the token format automatically.

---

## Testing Email Templates

### 1. Test Email Signup
1. Register a new account at `/auth/register`
2. Check your inbox for "Confirm Signup" email
3. Verify the link format is correct
4. Click the link - should redirect to your app

### 2. Test Password Reset
1. Go to `/auth/forgot-password`
2. Enter your email
3. Check inbox for "Reset Password" email
4. Verify the link format is correct
5. Click the link - should go to `/auth/reset-password`

### 3. Check Email Logs
Go to: **Authentication** → **Logs** → Filter by "email"

---

## Troubleshooting

### Issue: Emails not being sent

**Solutions:**
- Check Supabase email logs for errors
- Verify email service is enabled in Supabase
- Check spam/junk folder
- For production, configure custom SMTP (optional)

### Issue: Links redirect to wrong URL

**Solutions:**
- Verify Site URL is set correctly
- Check Redirect URLs include all your domains
- Ensure protocol (http/https) matches
- Wait 1-2 minutes after saving changes

### Issue: "Invalid token" or "Token expired"

**Solutions:**
- Tokens expire after 24 hours (signup) or 1 hour (reset)
- Request a new verification/reset email
- Check system time is correct
- Verify token format in URL is complete

### Issue: Email template changes not applying

**Solutions:**
- Click "Save" after editing template
- Wait 1-2 minutes for changes to propagate
- Test with new registration/reset request
- Clear browser cache

---

## Production Best Practices

### 1. Custom SMTP (Recommended for Production)

For better email deliverability in production:

1. Go to: **Project Settings** → **Auth**
2. Scroll to: **SMTP Settings**
3. Configure your email service (SendGrid, AWS SES, etc.)

**Benefits:**
- Better deliverability
- Custom sender email (noreply@usafirewood.com)
- Higher sending limits
- Detailed analytics

### 2. Brand Your Emails

Customize templates with:
- Your logo
- Brand colors (use `#f97316` for primary orange)
- Company information
- Social media links
- Support contact information

### 3. Email Rate Limits

Supabase default email limits:
- **Development:** 3 emails per hour per email address
- **Production (free tier):** 30 emails per hour
- **Production (with custom SMTP):** Based on your provider

---

## Quick Reference: Where to Edit Each Email Type

| Email Type | Supabase Location | Redirect To |
|------------|-------------------|-------------|
| **Signup Confirmation** | Auth → Email Templates → Confirm Signup | `/auth/callback` |
| **Password Reset** | Auth → Email Templates → Reset Password | `/auth/reset-password` |
| **Email Change** | Auth → Email Templates → Change Email | `/auth/callback` |
| **Magic Link** | Auth → Email Templates → Magic Link | `/auth/callback` |

---

## Summary Checklist

- [ ] Set Site URL in URL Configuration
- [ ] Add all Redirect URLs (localhost, Vercel, production)
- [ ] Customize "Confirm Signup" email template
- [ ] Customize "Reset Password" email template
- [ ] Save all changes
- [ ] Test signup email flow
- [ ] Test password reset flow
- [ ] Verify links redirect correctly
- [ ] Check spam folder if emails not received
- [ ] Consider custom SMTP for production

---

## Need Help?

1. Check Supabase documentation: https://supabase.com/docs/guides/auth/auth-email-templates
2. Review authentication logs in Supabase Dashboard
3. Test with different email providers (Gmail, Outlook, etc.)
4. Use browser console to check for errors (F12)

---

**Last Updated:** December 2, 2025
**Project:** FireUSA E-commerce Platform
