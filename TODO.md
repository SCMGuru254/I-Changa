# TODO: Missing Features & Technical Debt

## Missing Database Tables

### 1. User Streaks Table
- **Purpose**: Track daily contribution streaks for gamification
- **Columns**: user_id, group_id, current_streak, longest_streak, last_contribution_date
- **Priority**: Medium

### 2. Group Settings Table
- **Purpose**: Store group-specific configurations (contribution frequency, reminders, etc.)
- **Columns**: group_id, contribution_frequency, reminder_enabled, currency, timezone
- **Priority**: High

### 3. Payment Methods Table
- **Purpose**: Store user payment preferences (M-Pesa numbers, bank accounts)
- **Columns**: user_id, payment_type, phone_number, account_number, is_default
- **Priority**: Medium

### 4. Contribution Schedules Table
- **Purpose**: Define recurring contribution schedules
- **Columns**: group_id, frequency (daily/weekly/monthly), amount, due_day, active
- **Priority**: High

### 5. Group Invitations Table (Enhanced)
- **Purpose**: Replace pending_invitations with more robust tracking
- **Columns**: id, group_id, inviter_id, invitee_email, invitee_phone, role, token, status, expires_at
- **Priority**: High

---

## Missing Database Functions

### 1. Calculate Total Contributions
```sql
create_function_get_user_total_contributions(user_id uuid, group_id uuid) returns numeric
```
- **Priority**: High

### 2. Update Group Status
```sql
update_group_status() -- Trigger to auto-update group status based on end_date
```
- **Priority**: High

### 3. Calculate Achievement Progress
```sql
check_and_award_achievements(user_id uuid) returns void
```
- **Priority**: Medium

### 4. Get Group Statistics
```sql
get_group_statistics(group_id uuid) returns json
```
- **Priority**: Medium

### 5. Validate Invitation Token
```sql
validate_invitation_token(token text) returns boolean
```
- **Priority**: High

---

## Missing Database Triggers

### 1. Auto-update timestamps
- **Table**: groups, contributions, profiles, tasks
- **Trigger**: update_updated_at_column()
- **Priority**: High

### 2. Update group total on contribution
- **Table**: contributions
- **Trigger**: update_group_total_on_contribution()
- **Priority**: Critical

### 3. Award achievements on milestones
- **Table**: contributions, activities
- **Trigger**: check_achievements_on_activity()
- **Priority**: Medium

### 4. Expire old invitations
- **Table**: pending_invitations
- **Trigger**: cleanup_expired_invitations()
- **Priority**: Low

---

## Missing RLS Policies

### 1. Storage Policies
- **Bucket**: voice-messages - Complete policies for insert/update/delete
- **Bucket**: documents - Add policies for group document sharing
- **Bucket**: avatars - Currently public but needs size/type validation
- **Priority**: Critical (Security)

### 2. Table Policies
- **Table**: user_roles - Missing SELECT policy for users to view their own roles
- **Table**: audit_logs - Missing INSERT policy for system operations
- **Priority**: High (Security)

---

## Missing Edge Functions

### 1. process-mpesa-callback
- **Purpose**: Handle M-Pesa payment callbacks and create contributions
- **Priority**: Critical

### 2. send-reminder-notifications
- **Purpose**: Scheduled function to send contribution reminders
- **Priority**: High

### 3. calculate-group-analytics
- **Purpose**: Generate group insights and statistics
- **Priority**: Medium

### 4. verify-phone-number
- **Purpose**: Send OTP for phone verification
- **Priority**: High

### 5. process-bulk-invites
- **Purpose**: Handle bulk member invitations efficiently
- **Priority**: Low

---

## Missing Frontend Components

### 1. Payment Integration
- M-Pesa STK Push integration
- Payment confirmation flow
- Transaction history view
- **Priority**: Critical

### 2. Notification System
- Push notification setup
- In-app notification center (basic exists, needs enhancement)
- Email digest preferences
- **Priority**: High

### 3. Advanced Analytics
- Contribution trends charts
- Member engagement metrics
- Predictive analytics (will we meet target?)
- **Priority**: Medium

### 4. Group Settings Page
- Configure contribution schedules
- Set reminder preferences
- Manage group currency/timezone
- **Priority**: High

### 5. Search & Filters
- Search members, contributions, activities
- Filter by date range, member, status
- **Priority**: Medium

---

## Technical Debt

### 1. Error Handling
- Implement global error boundary
- Add error logging service (Sentry integration)
- Standardize error messages

### 2. Testing
- Add unit tests for utilities
- Add integration tests for critical flows
- Add E2E tests for user journeys

### 3. Performance
- Implement pagination for large lists
- Add caching for frequently accessed data
- Optimize database queries with indexes

### 4. Security
- Add rate limiting to edge functions
- Implement CSRF protection
- Add input sanitization for all forms
- Audit all RLS policies

### 5. Accessibility
- Add ARIA labels to all interactive elements
- Ensure keyboard navigation works
- Add screen reader support

---

## Immediate Action Items (Sprint 1)

1. ✅ Complete storage policies for all buckets
2. ✅ Add updated_at triggers to all tables
3. ✅ Create process-mpesa-callback edge function
4. ✅ Build Group Settings page
5. ✅ Implement contribution schedules table and logic
6. ⬜ Add comprehensive error logging
7. ⬜ Create payment integration flow

---

## Notes
- Priority: Critical > High > Medium > Low
- ✅ = Completed
- ⬜ = Pending
- Items marked Critical should be completed before production launch
