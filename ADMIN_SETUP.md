# Admin Panel Setup Guide

This guide will help you set up and use the Admin Panel for TechSolutions Webao Help 3.0.

## Overview

The Admin Panel provides a comprehensive user management system where administrators can:
- View all users in the system
- Add new users with specific roles
- Edit existing user information
- Delete users when necessary
- Filter users by role or status
- Search users by name, LDAP, or email

## Prerequisites

1. A Supabase account with a project created
2. Database migration applied (automatically done when you first run the application)
3. Supabase credentials configured

## Setup Steps

### 1. Configure Supabase Credentials

Edit the file `js/supabase-config.js` and replace the placeholder values with your actual Supabase credentials:

```javascript
export const SUPABASE_URL = 'https://your-project.supabase.co';
export const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

You can find these values in your Supabase project dashboard:
- Go to Settings > API
- Copy the Project URL (SUPABASE_URL)
- Copy the anon/public key (SUPABASE_ANON_KEY)

### 2. Database Setup

The database table for users is automatically created with the following structure:

```sql
users (
  id uuid PRIMARY KEY,
  ldap text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL,
  status text NOT NULL,
  email text,
  created_at timestamptz,
  updated_at timestamptz
)
```

Sample users are pre-populated for testing purposes.

### 3. Access the Admin Panel

1. Open your web browser
2. Navigate to `admin.html`
3. You'll see the admin dashboard with:
   - System Overview (total users, active users, inactive users)
   - Add New User form
   - User Management table

## Features

### System Overview

Displays real-time statistics:
- Total Users: Count of all users in the system
- Active Users: Count of users with active status
- Inactive Users: Count of users with inactive status

### Add New User

To add a new user:

1. Fill in the required fields:
   - **LDAP**: User's LDAP identifier (e.g., cferrari)
   - **Full Name**: User's complete name
   - **Email Address**: User's email
   - **Role**: Select from Agent, SME, QA, TL, or WFM
   - **Status**: Active or Inactive

2. Click "Add User"
3. The user will be added to the database and appear in the table

### User Management Table

The table displays all users with the following information:
- **User**: Avatar, full name, and email
- **LDAP**: User's LDAP identifier
- **Role**: User's assigned role (color-coded badge)
- **Status**: Active or Inactive status (color-coded badge)
- **Actions**: Edit and Delete buttons

#### Role Badges

- SME: Blue badge
- Agent: Light blue badge
- QA: Yellow badge
- TL: Purple badge
- WFM: Pink badge

#### Filter Users

Use the filter buttons to view:
- All users
- Active users only
- Inactive users only
- Users by specific role (SME, QA, TL, Agent)

#### Search Users

Use the search bar at the top to search by:
- Full name
- LDAP
- Email address

### Edit User

To edit a user:

1. Click the edit icon (pencil) in the Actions column
2. A modal will appear with the user's current information
3. Modify the fields as needed
4. Click "Save Changes" to update
5. Click "Cancel" or the X to close without saving

### Delete User

To delete a user:

1. Click the delete icon (trash) in the Actions column
2. Confirm the deletion in the prompt
3. The user will be permanently removed from the database

## User Roles

### Agent
Front-line support team members who handle customer requests.

### SME (Subject Matter Expert)
Technical experts who provide specialized knowledge and support.

### QA (Quality Assurance)
Team members who review and ensure quality of support interactions.

### TL (Team Lead)
Team leaders who manage and oversee support operations.

### WFM (Workforce Management)
Staff responsible for scheduling, forecasting, and resource planning.

## Security

The admin panel uses Supabase Row Level Security (RLS) to protect user data:
- Only authenticated users can view and manage users
- All operations are performed through secure Supabase client
- Database policies ensure data integrity

## Troubleshooting

### Users Not Loading

If users don't appear in the table:
1. Check browser console for errors
2. Verify Supabase credentials in `js/supabase-config.js`
3. Ensure database migration was applied successfully
4. Check network tab for failed requests

### Cannot Add Users

If you can't add users:
1. Ensure all required fields are filled
2. Check that LDAP is unique (not already in use)
3. Verify Supabase connection
4. Check browser console for error messages

### Edit Modal Not Opening

If the edit modal doesn't open:
1. Check browser console for JavaScript errors
2. Verify the user ID is being passed correctly
3. Ensure Supabase connection is active

## Best Practices

1. Always verify user information before adding
2. Use consistent naming conventions for LDAP identifiers
3. Regularly review and update inactive users
4. Keep email addresses up to date
5. Assign appropriate roles based on user responsibilities
6. Use the search and filter features to find users quickly

## Support

For issues or questions, contact the TechSol SAO team at ts-sme-all@google.com
