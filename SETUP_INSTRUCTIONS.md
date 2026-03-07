# THE SPARK ALLIANCE FAMILY - Campaign Platform Setup Guide

This is a serverless web application built with HTML, CSS, Vanilla JavaScript, and Supabase. It allows students to submit OTP codes to authorize voting, and department admins to manage those codes.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Phase 1: Supabase Setup](#phase-1-supabase-setup)
3. [Phase 2: Configure the Application](#phase-2-configure-the-application)
4. [Phase 3: Create Admin Users](#phase-3-create-admin-users)
5. [Deploy the Application](#deploy-the-application)

---

## Prerequisites

- A [Supabase](https://supabase.com/) account (free tier works fine)
- A code editor (VS Code recommended)
- Basic knowledge of HTML, CSS, and JavaScript

---

## Phase 1: Supabase Setup

### Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com/) and sign in
2. Click "New Project"
3. Fill in the details:
   - **Name**: Spark Alliance Campaign
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select the closest region to your users
4. Click "Create new project"
5. Wait for the project to be set up (2-3 minutes)

### Step 2: Run the SQL Setup

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy the contents from [`SUPABASE_SETUP.sql`](SUPABASE_SETUP.sql) file
4. Paste into the SQL Editor
5. Click **Run** to execute the SQL

This will:
- Create the `votes` table with all required columns
- Enable Row Level Security (RLS)
- Create policies for anonymous INSERT and authenticated SELECT/UPDATE

### Step 3: Get Your Supabase Credentials

1. Go to **Project Settings** (gear icon) → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

---

## Phase 2: Configure the Application

### Update Supabase Credentials

You need to replace the placeholder credentials in all HTML files with your actual Supabase credentials.

#### In `index.html`:
Find these lines (around line 45-46):
```javascript
 = 'YOUR_SUPconst SUPABASE_URLABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```
Replace with:
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

#### In `login.html`:
Same as above (around line 42-43)

#### In `dashboard.html`:
Same as above (around line 56-57)

---

## Phase 3: Create Admin Users

### Step 1: Enable Email Authentication

1. Go to **Authentication** → **Providers** in Supabase
2. Click **Email**
3. Enable it (if not already enabled)
4. Keep the default settings

### Step 2: Create Admin Users

You need to create users and assign them a department in their metadata. There are two ways to do this:

#### Method A: Via Supabase Admin UI (Recommended)

1. Go to **Authentication** → **Users**
2. Click **Invite user**
3. Enter the admin's email address
4. Click **Invite**

After they accept the invite, you'll need to manually set their department:

1. Go to **Authentication** → **Users**
2. Find the user
3. Click the **Edit** icon (pencil)
4. Under **User Metadata**, add:
   ```json
   {
     "department": "SPAS"
   }
   ```
5. Valid departments: `SPAS`, `EDU`, `BUS`, `ENG`, `HEALTH`
6. Click **Update User**

#### Method B: Via SQL

```sql
-- First, create a user via the Authentication UI
-- Then update their metadata with this SQL:

UPDATE auth.users 
SET raw_user_meta_data = jsonb_build_object('department', 'SPAS')
WHERE email = 'admin@example.com';
```

### Test Admin Login

1. Open `login.html` in your browser
2. Enter the admin's email and password
3. You should be redirected to the dashboard
4. You should only see votes from your assigned department

---

## Deploy the Application

### Option 1: Static Hosting (Recommended)

You can host these static files anywhere:

#### Netlify (Free)
1. Create a [Netlify](https://netlify.com) account
2. Drag and drop your project folder to Netlify
3. Your site is live!

#### Vercel (Free)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project folder
3. Follow the prompts

### Option 2: Local Development

1. Install a local server extension in VS Code (Live Server)
2. Right-click `index.html` → "Open with Live Server"

---

## File Structure

```
Spark Alliance Family/
├── index.html          # Public OTP submission page
├── login.html          # Admin login page
├── dashboard.html      # Admin dashboard
├── SUPABASE_SETUP.sql  # Database setup commands
├── SETUP_INSTRUCTIONS.md
├── CSS/
│   └── style.css       # All styles
└── IMG/
    └── Spark Alliance.jpeg
```

---

## How It Works

### Public Submission (index.html)
1. Student selects their department from dropdown
2. Enters their registration number
3. Enters the OTP code
4. Clicks Submit
5. Data is saved to Supabase with status "pending"

### Admin Dashboard (dashboard.html)
1. Admin logs in with email/password
2. Dashboard fetches only votes for their department
3. Pending codes are displayed in the first table
4. Admin clicks "Mark as Voted" to update status
5. The row moves from Pending to Used table dynamically

---

## Security Notes

- The RLS policies ensure:
  - Anyone can submit OTPs (anonymous INSERT)
  - Admins can only see/update votes from their department
  - Public cannot read or modify existing data
- Keep your Supabase service role key private
- Use strong passwords for admin accounts

---

## Troubleshooting

### "Access denied" errors
- Make sure RLS is enabled on the votes table
- Check that the RLS policies were created correctly

### Admin can't see any votes
- Verify the admin's user_metadata has the correct department
- Department values are case-sensitive (use uppercase: SPAS, EDU, etc.)

### Login not working
- Check that email authentication is enabled
- Verify the user's password is correct

---

## Support

For issues or questions, please refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/installing)

---

*Built for The Spark Alliance Family Campaign*
