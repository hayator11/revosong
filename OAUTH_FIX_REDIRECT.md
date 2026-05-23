# 🔧 OAuth Redirect URL Fix Guide

**Status:** ⚠️ **Production URL Issue - Fix Required**

## Problem
When logging in from production URL (`https://revosong-charts.vercel.app`), users are redirected to `http://localhost:3000` instead.

## Root Cause
Supabase project settings have "Site URL" configured to `http://localhost:3000` only. When Supabase processes OAuth callbacks, it uses this Site URL as the default redirect destination.

## Solution

### Step 1: Access Supabase Project Settings
1. Go to: https://app.supabase.com
2. Select your project: `kxrukjykjwifawdlypfs`
3. Click **Settings** (gear icon) in the bottom left
4. Go to **Configuration** → **Authentication**

### Step 2: Add Additional Redirect URLs
1. Find the section labeled **"Additional Redirect URLs"** or **"Redirect URLs"**
2. Add both URLs:
   ```
   http://localhost:3000
   http://localhost:3000/*
   https://revosong-charts.vercel.app
   https://revosong-charts.vercel.app/*
   ```
3. Click **Save**

### Step 3: Update Site URL
1. Still in **Authentication** settings
2. Find **"Site URL"** setting
3. **Keep it as:** `https://revosong-charts.vercel.app` (production)
   - For local development, you can temporarily change it to `http://localhost:3000`
   - OR leave it as production and ensure all redirect URLs are configured

### Step 4: Verify OAuth Provider Configuration
1. Go to **Authentication** → **Providers**
2. For each provider (X, GitHub, Discord):
   - **Click to edit**
   - Ensure **Callback URL** is: `https://kxrukjykjwifawdlypfs.supabase.co/auth/v1/callback`
   - This should NOT change
   - Make sure provider is **Enabled**
   - Click **Save**

### Step 5: Verify Provider Settings
Make sure that the OAuth providers themselves (X Dev Portal, GitHub, Discord) also have the Supabase callback URL configured:

**For each provider (X, GitHub, Discord):**
- ✅ Callback/Redirect URL: `https://kxrukjykjwifawdlypfs.supabase.co/auth/v1/callback`

## Testing After Fix

### Local Testing (localhost:3000)
```
1. Open http://localhost:3000 (with npm run dev)
2. Click "ログイン" (Login)
3. Click "𝕏 X" or "🐙 GitHub" or "💜 Discord"
4. Complete OAuth authentication
5. Should redirect to http://localhost:3000/auth/callback then to /profile
```

### Production Testing (Vercel)
```
1. Open https://revosong-charts.vercel.app
2. Click "ログイン" (Login)
3. Click "𝕏 X" or "🐙 GitHub" or "💜 Discord"
4. Complete OAuth authentication
5. Should redirect to https://revosong-charts.vercel.app/auth/callback then to /profile
```

## Expected Behavior After Fix

✅ Local login: Stays on `http://localhost:3000`  
✅ Production login: Stays on `https://revosong-charts.vercel.app`  
✅ SNS URLs auto-populate in profile

## If Still Not Working

Try these additional steps:

### Clear Browser Cache & Cookies
```bash
# In Browser DevTools:
- Press F12
- Application → Cookies → Delete all supabase cookies
- Clear localStorage
- Reload page
```

### Check Browser Console
1. Open Browser DevTools (F12)
2. Check **Console** tab for errors
3. Check **Network** tab:
   - Look for calls to `supabase.co`
   - Verify redirect URLs in requests

### Verify Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://kxrukjykjwifawdlypfs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Reference
- Supabase Auth Redirect URLs: https://supabase.com/docs/guides/auth/social-login
- Project Settings: https://app.supabase.com/project/kxrukjykjwifawdlypfs/settings/auth
