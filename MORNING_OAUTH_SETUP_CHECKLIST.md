# ☀️ Morning OAuth Setup Checklist

**Date:** May 24, 2026  
**Status:** ✅ Code Complete | ⏳ Supabase Configuration Needed  

---

## 🎯 Quick Summary

Your OAuth implementation is **100% complete and deployed**. Now you just need to configure Supabase's redirect URLs so that login works from both localhost and production.

**The Problem:**
- ❌ Logging in from `revosong-charts.vercel.app` redirects to `localhost:3000`

**The Solution:**
- ✅ Update Supabase "Redirect URLs" to include both environments

---

## 📋 Step-by-Step Fix (15 minutes)

### Phase 1: Access Supabase Console (2 min)

1. **Open Supabase:**
   ```
   https://app.supabase.com
   ```

2. **Select your project:**
   - Find project `kxrukjykjwifawdlypfs` in the list
   - Click to open it

3. **Go to Settings:**
   - Click ⚙️ **Settings** (bottom left)
   - Click **Authentication** (left sidebar)

---

### Phase 2: Configure Redirect URLs (5 min)

**IMPORTANT:** You'll find two places to configure URLs. Do BOTH:

#### Option A: Site URL (Primary)
1. In **Authentication** settings, find **"Site URL"**
2. Set it to:
   ```
   https://revosong-charts.vercel.app
   ```
   - This is your production URL
   - For local development testing, you may need to temporarily change it to `http://localhost:3000`

#### Option B: Additional Redirect URLs (Must Do This!)
1. In **Authentication** settings, find **"Additional Redirect URLs"** (sometimes called "Redirect URLs")
2. Clear the existing content and enter ALL of these:
   ```
   http://localhost:3000
   http://localhost:3000/*
   https://revosong-charts.vercel.app
   https://revosong-charts.vercel.app/*
   ```
3. **IMPORTANT:** Each URL must be on a NEW LINE
4. Click **Save** (usually at the bottom)

---

### Phase 3: Verify OAuth Provider Settings (5 min)

Go to **Authentication** → **Providers** and verify:

#### ✅ X (Twitter)
1. Click to open X provider settings
2. Verify **Callback URL:**
   ```
   https://kxrukjykjwifawdlypfs.supabase.co/auth/v1/callback
   ```
3. Ensure **Enabled** is toggled ON ✅
4. Click **Save**

#### ✅ GitHub
1. Click to open GitHub provider settings
2. Verify **Callback URL:**
   ```
   https://kxrukjykjwifawdlypfs.supabase.co/auth/v1/callback
   ```
3. Ensure **Enabled** is toggled ON ✅
4. Click **Save**

#### ✅ Discord
1. Click to open Discord provider settings
2. Verify **Callback URL:**
   ```
   https://kxrukjykjwifawdlypfs.supabase.co/auth/v1/callback
   ```
3. Ensure **Enabled** is toggled ON ✅
4. Click **Save**

---

### Phase 4: Clear Cache & Test (3 min)

#### Local Testing (localhost:3000)
```bash
# In your terminal:
npm run dev
```

Then:
1. Open http://localhost:3000 in browser
2. Click **ログイン** (Login)
3. Click **𝕏 X** or **🐙 GitHub**
4. Complete OAuth login
5. ✅ Should stay on localhost:3000 and show profile page

#### Production Testing (revosong-charts.vercel.app)
1. Open https://revosong-charts.vercel.app in browser
2. Click **ログイン** (Login)
3. Click **𝕏 X** or **🐙 GitHub**
4. Complete OAuth login
5. ✅ Should stay on revosong-charts.vercel.app and show profile page
6. ✅ SNS URL should be auto-filled

---

## 🔍 Troubleshooting

### Issue: Still redirects to localhost from production

**Solution:**
1. Clear browser cache and cookies
   - Open DevTools (F12)
   - Application → Cookies → Delete all supabase cookies
   - Clear localStorage
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

2. Wait 2-3 minutes for Supabase to propagate changes

3. Try in a private/incognito browser window

### Issue: OAuth button doesn't work

**Check browser console (F12 → Console):**
- Look for red error messages
- Common error: "Invalid redirect URI"
  - This means the Redirect URLs aren't configured correctly
  - Go back to Phase 2 and re-check

### Issue: SNS URL not auto-filled

**Check browser console (F12 → Console):**
- Look for errors about profiles table
- If you see profile errors, the database schema might not have the OAuth columns

**Fix the database:**
```sql
-- Run this in Supabase SQL Editor:
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS discord_url TEXT;
```

---

## ✅ Verification Checklist

After completing all phases:

- [ ] Supabase "Site URL" is set to `https://revosong-charts.vercel.app`
- [ ] "Additional Redirect URLs" includes both localhost:3000 and revosong-charts.vercel.app
- [ ] X provider is Enabled with correct callback URL
- [ ] GitHub provider is Enabled with correct callback URL
- [ ] Discord provider is Enabled with correct callback URL
- [ ] Local testing works (stays on localhost:3000)
- [ ] Production testing works (stays on revosong-charts.vercel.app)
- [ ] SNS URL auto-populates on profile page

---

## 🎉 Success Indicators

✅ **OAuth is working correctly when:**
1. Login from localhost → stays on localhost
2. Login from production → stays on production
3. OAuth popup appears and closes after authentication
4. Redirected to /profile page with SNS URL auto-filled
5. Can manually edit SNS URLs on profile page
6. Can comment after logging in

---

## 📞 Important Notes

- The code is **already deployed** on Vercel
- Changes to Supabase settings should take effect **immediately** or within a few minutes
- You don't need to redeploy the application
- You may need to restart your local dev server after Supabase config changes

---

## 🚀 Next Steps After OAuth is Working

1. Test all three OAuth providers (X, GitHub, Discord)
2. Test commenting with different SNS logins
3. Verify profile pictures load correctly
4. Test manual SNS URL editing
5. Optional: Add more OAuth providers (Google, Microsoft, etc.)

---

**Made: 2026-05-24 morning**  
**Estimated time to complete: 15 minutes**
