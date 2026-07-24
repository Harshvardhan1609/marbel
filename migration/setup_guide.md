# Step-by-Step Portal Setup & Deployment Guide

This guide details the two-step setup process to run the Arihant Marbles and Granite portal using the replication files in this folder.

---

## Phase 1: Supabase Backend Setup

### Step 1.1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com) and click **New Project**.
2. Select your organization, name your project (e.g., `Arihant Marbles`), set a database password, and click **Create**.

### Step 1.2: Initialize Database Schemas & Seeds
1. Inside your Supabase Project dashboard, click the **SQL Editor** tab (represented by a terminal icon `SQL` on the left sidebar).
2. Click **New Query** to open an empty SQL sheet.
3. Open the file [setup.sql](setup.sql) in this directory, copy its entire contents, paste it into the Supabase SQL editor, and click **Run**.
   - *This script automatically creates all 10 tables, sets up Row Level Security (RLS) policies, seeds default brand settings, creates default categories/products, and registers storage buckets.*

### Step 1.3: Configure Storage RLS Policies
Because Supabase restricts SQL commands from modifying system storage tables directly for security, you must enable file upload permissions in the dashboard interface:
1. Click the **Storage** tab on the left sidebar (represented by a folder/bucket icon).
2. Go to **Policies** in the Storage menu.
3. Under the **`slabs`** bucket:
   - Click **New Policy** -> Select **"Create a policy from scratch"**.
   - Name the policy: `Allow Public Read`.
   - Under **Allowed Operations**, check **`SELECT`** only.
   - Under **Target Roles**, select **`public`** (everyone).
   - In the text expression box, type:
     ```sql
     bucket_id = 'slabs'
     ```
   - Save the policy.
   - Click **New Policy** next to `slabs` again -> Select **"Create a policy from scratch"**.
   - Name the policy: `Allow Admin Upload & Delete`.
   - Under **Allowed Operations**, check **`INSERT`** and **`DELETE`**.
   - Under **Target Roles**, select **`authenticated`** (logged-in admin users).
   - In the text expression box, type:
     ```sql
     bucket_id = 'slabs'
     ```
   - Save the policy.
4. Repeat the exact same steps (both policies) for the **`catalogue`** bucket, replacing `'slabs'` with `'catalogue'` in the expressions.

---

## Phase 2: Next.js Frontend Deployment

### Step 2.1: Clone/Copy the Codebase
1. Copy all folders and files inside this `migration` directory (excluding `setup.sql` and `setup_guide.md` if desired) to your project target folder.

### Step 2.2: Install Dependencies
1. Open your terminal in the root of the project.
2. Run the package installer:
   ```bash
   npm install
   ```

### Step 2.3: Configure Environmental Variables
1. Create a file named `.env.local` in the root directory.
2. Copy-paste the following lines and insert your keys (found in the Supabase Dashboard under **Project Settings** -> **API**):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-api-key
   ```

### Step 2.4: Run the Server
- **For Development**:
  ```bash
  npm run dev
  ```
  - *The application will start on [http://localhost:3000](http://localhost:3000).*
- **For Production compilation**:
  ```bash
  npm run build
  npm run start
  ```

---

## Admin Authentication Credentials

The setup script automatically registers an initial administrative account:
- **Email/Username**: `admin@arihantmarbles.com`
- **Default Password**: `ArihantAdmin@2026`

To sign in, visit the admin portal at:
`http://localhost:3000/admin` (or your production URL `/admin`).

You can edit or change the login password at any time inside the **Authentication** -> **Users** panel in the Supabase Dashboard.
