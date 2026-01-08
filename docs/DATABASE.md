# Database Documentation

## Overview

Sturdy uses **PostgreSQL** via **Supabase** for all data persistence. The database schema includes four main tables with Row Level Security (RLS) policies to ensure data privacy and security.

---

## Tables

### 1. **profiles**

**Purpose:** Extends Supabase Auth to store user profile information and subscription tier.

**Schema:**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'family')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns:**
- `id`: UUID primary key, references Supabase auth.users(id)
- `email`: User's email (unique, required)
- `full_name`: Optional display name
- `avatar_url`: Optional profile picture URL
- `subscription_tier`: One of 'free', 'pro', 'family' (default: 'free')
- `created_at`: Timestamp when profile was created
- `updated_at`: Timestamp when profile was last updated (auto-updated)

**Relationships:**
- Parent to `children`, `scripts`, `what_if_scripts`
- Cascading delete: When auth.users record is deleted, profile is automatically deleted

---

### 2. **children**

**Purpose:** Stores information about each child profile for personalized script generation.

**Schema:**
```sql
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE,
  neurotype TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns:**
- `id`: UUID primary key (auto-generated)
- `parent_id`: Foreign key to profiles.id (required)
- `name`: Child's name (required)
- `birth_date`: Child's date of birth (optional)
- `neurotype`: Child's neurotype (e.g., 'ADHD', 'Autistic', 'Neurotypical', optional)
- `created_at`: Timestamp when child profile was created
- `updated_at`: Timestamp when child profile was last updated (auto-updated)

**Relationships:**
- Child of `profiles`
- Parent to `scripts`, `what_if_scripts`
- Cascading delete: When parent profile is deleted, all children are deleted

**Common Neurotypes:**
- `Neurotypical`
- `ADHD`
- `Autistic`
- `PDA` (Pathological Demand Avoidance)
- `Anxious`
- `Highly Sensitive`
- `Gifted`

---

### 3. **scripts**

**Purpose:** Stores SOS scripts generated for immediate crisis situations.

**Schema:**
```sql
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  situation TEXT NOT NULL,
  script_text TEXT NOT NULL,
  tone TEXT,
  helpful_rating BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns:**
- `id`: UUID primary key (auto-generated)
- `parent_id`: Foreign key to profiles.id (required)
- `child_id`: Foreign key to children.id (required)
- `situation`: The crisis situation described by parent (required)
- `script_text`: The generated AI script (required)
- `tone`: Tone selected by parent (e.g., 'gentle', 'firm', 'playful')
- `helpful_rating`: Boolean feedback - was the script helpful? (optional)
- `created_at`: Timestamp when script was generated

**Relationships:**
- Child of `profiles` and `children`
- Cascading delete: Deleted when parent or child is deleted

**Immutability:** Scripts are immutable once created (no UPDATE policy)

---

### 4. **what_if_scripts**

**Purpose:** Stores What If scripts for proactive planning of anticipated struggles.

**Schema:**
```sql
CREATE TABLE what_if_scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  struggle TEXT NOT NULL,
  context TEXT,
  frequency TEXT,
  tone TEXT,
  script TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns:**
- `id`: UUID primary key (auto-generated)
- `parent_id`: Foreign key to profiles.id (required)
- `child_id`: Foreign key to children.id (required)
- `struggle`: The anticipated struggle (required)
- `context`: Additional context about the struggle (optional)
- `frequency`: How often the struggle occurs (optional)
- `tone`: Tone selected by parent (optional)
- `script`: The generated AI planning script (required)
- `created_at`: Timestamp when script was generated

**Relationships:**
- Child of `profiles` and `children`
- Cascading delete: Deleted when parent or child is deleted

**Immutability:** What If scripts are immutable once created

---

## Row Level Security (RLS) Policies

All tables have RLS enabled to ensure data privacy. Users can only access their own data.

### **profiles** Policies

| Policy Name | Operation | Rule |
|-------------|-----------|------|
| Users can view own profile | SELECT | auth.uid() = id |
| Users can update own profile | UPDATE | auth.uid() = id |

**Note:** No INSERT policy (handled by Supabase auth trigger), no DELETE policy (handled by auth system)

---

### **children** Policies

| Policy Name | Operation | Rule |
|-------------|-----------|------|
| Parents can view own children | SELECT | auth.uid() = parent_id |
| Parents can insert own children | INSERT | auth.uid() = parent_id |
| Parents can update own children | UPDATE | auth.uid() = parent_id |
| Parents can delete own children | DELETE | auth.uid() = parent_id |

**Behavior:** Parents have full CRUD access to their children's profiles, but cannot access other parents' children.

---

### **scripts** Policies

| Policy Name | Operation | Rule |
|-------------|-----------|------|
| Parents can view own scripts | SELECT | auth.uid() = parent_id |
| Parents can insert own scripts | INSERT | auth.uid() = parent_id |
| Parents can delete own scripts | DELETE | auth.uid() = parent_id |

**Note:** No UPDATE policy (scripts are immutable)

---

### **what_if_scripts** Policies

| Policy Name | Operation | Rule |
|-------------|-----------|------|
| Parents can view own what_if_scripts | SELECT | auth.uid() = parent_id |
| Parents can insert own what_if_scripts | INSERT | auth.uid() = parent_id |

**Note:** No UPDATE or DELETE policies (scripts are immutable)

---

## Indexes

Performance indexes are created on frequently queried columns:

```sql
-- Children
CREATE INDEX idx_children_parent_id ON children(parent_id);

-- Scripts
CREATE INDEX idx_scripts_parent_id ON scripts(parent_id);
CREATE INDEX idx_scripts_child_id ON scripts(child_id);
CREATE INDEX idx_scripts_created_at ON scripts(created_at DESC);

-- What If Scripts
CREATE INDEX idx_what_if_scripts_parent_id ON what_if_scripts(parent_id);
CREATE INDEX idx_what_if_scripts_child_id ON what_if_scripts(child_id);
CREATE INDEX idx_what_if_scripts_created_at ON what_if_scripts(created_at DESC);
```

**Purpose:** Speed up queries filtering by parent_id, child_id, and sorting by creation date.

---

## Triggers

### Auto-update Timestamps

The `updated_at` column is automatically updated on `profiles` and `children` tables using a PostgreSQL trigger:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

Applied to:
- `profiles.updated_at`
- `children.updated_at`

---

## Local Setup

### Prerequisites
- Supabase account (free tier available)
- PostgreSQL knowledge (basic)

### Setup Steps

1. **Create Supabase Project**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Choose a name, database password, and region
   - Wait for project to finish setting up (~2 minutes)

2. **Run Schema Migration**
   - Open your Supabase project dashboard
   - Navigate to: SQL Editor (left sidebar)
   - Click "New Query"
   - Copy the entire contents of `/docs/schema.sql`
   - Paste into the SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)

3. **Verify Tables Created**
   - Navigate to: Table Editor (left sidebar)
   - You should see 4 tables: `profiles`, `children`, `scripts`, `what_if_scripts`
   - Click on each table to verify structure

4. **Verify RLS Enabled**
   - Click on a table in Table Editor
   - Look for "Row Level Security" badge (should show "Enabled")
   - Click on "Policies" tab
   - Verify policies are listed

5. **Get API Credentials**
   - Navigate to: Settings → API (left sidebar)
   - Copy these values to your `.env.local`:
     - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

6. **Test the Setup**
   - Sign up a test user via your app's auth flow
   - Check that a profile is automatically created
   - Try creating a child profile
   - Verify RLS prevents unauthorized access

---

## Testing RLS Policies

### Test User Isolation

1. Create two test users (User A and User B)
2. As User A: Create a child profile
3. As User B: Try to query User A's child
4. Expected: User B should see zero results (RLS blocks access)

### Test Service Role Bypass

Service role key bypasses RLS (admin access):
```typescript
// Uses service_role key - bypasses RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ Server-side only!
)

// Can access all data
const { data } = await supabase.from('children').select('*')
```

**Security:** Never expose service_role key to client-side code!

---

## Backup and Recovery

### Export Schema

Use the provided `schema.sql` file to recreate the database structure at any time.

### Export Data

Via Supabase Dashboard:
1. Navigate to: Table Editor
2. Click on a table
3. Click "..." (three dots) → "Download as CSV"
4. Repeat for all tables

Via Supabase CLI:
```bash
supabase db dump -f backup.sql
```

### Restore from Backup

```bash
# Run SQL file in Supabase dashboard SQL Editor
# Or use Supabase CLI:
supabase db reset
supabase db push
```

---

## Common Queries

### Get all children for a parent
```sql
SELECT * FROM children 
WHERE parent_id = '...' 
ORDER BY created_at DESC;
```

### Get all scripts for a child
```sql
SELECT * FROM scripts 
WHERE child_id = '...' 
ORDER BY created_at DESC;
```

### Get subscription tier for a user
```sql
SELECT subscription_tier FROM profiles 
WHERE id = '...';
```

### Count scripts by parent
```sql
SELECT COUNT(*) FROM scripts 
WHERE parent_id = '...';
```

---

## Security Best Practices

1. **Never bypass RLS on client-side:** Always use anon key for client queries
2. **Service role = admin access:** Only use service_role key on secure server-side code
3. **Validate user input:** Always validate data before inserting into database
4. **Use prepared statements:** Supabase client handles this automatically
5. **Monitor usage:** Check Supabase dashboard for unusual query patterns
6. **Regular backups:** Export data weekly during active development

---

## Troubleshooting

### "new row violates row-level security policy"
- **Cause:** Trying to insert/update data that doesn't match RLS policy
- **Solution:** Ensure `parent_id` or `child_id` matches authenticated user's ID

### "relation does not exist"
- **Cause:** Schema not created or wrong database selected
- **Solution:** Run `/docs/schema.sql` in SQL Editor

### "permission denied for table"
- **Cause:** Using anon key for admin operations
- **Solution:** Use service_role key for server-side admin queries

### Slow queries
- **Cause:** Missing indexes or inefficient query
- **Solution:** Check query plan, ensure indexes exist, add pagination

---

## Migration Path

If updating from an older schema:

1. Export existing data
2. Create backup of production database
3. Run new schema in test environment
4. Test thoroughly
5. Schedule maintenance window
6. Run migration in production
7. Verify data integrity
8. Monitor for errors

---

## Contact

For database-related questions or issues:
- Check Supabase documentation: https://supabase.com/docs
- Review this file: `/docs/DATABASE.md`
- Review schema: `/docs/schema.sql`

---

**Last Updated:** January 2026  
**Schema Version:** 1.0.0  
**Supabase Version:** PostgreSQL 15.x
