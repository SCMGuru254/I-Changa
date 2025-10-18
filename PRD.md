# Product Requirements Document (PRD)
## Chama Management Platform

---

## 1. Executive Summary

### 1.1 Product Vision
A comprehensive digital platform for managing Chama groups (savings and investment groups) in Kenya and East Africa, enabling seamless contribution tracking, member management, and financial transparency.

### 1.2 Target Users
- **Primary**: Chama administrators and treasurers
- **Secondary**: Chama members
- **Tertiary**: Individual savers exploring group savings

### 1.3 Success Metrics
- 1,000+ active groups in first 6 months
- 85% user retention rate
- <5 minute average onboarding time
- 95% contribution tracking accuracy
- 4.5+ star app rating

---

## 2. Product Overview

### 2.1 Core Value Proposition
"Digitize your Chama in minutes. Track contributions, manage members, and achieve financial goals together—all in one secure platform."

### 2.2 Key Differentiators
1. **M-Pesa Integration**: Direct payment tracking via SMS parsing
2. **Real-time Updates**: Instant notifications and live contribution tracking
3. **Gamification**: Achievement system to encourage consistent contributions
4. **Offline-First**: Works without constant internet connectivity
5. **Multi-Role System**: Admin, treasurer, and member roles with appropriate permissions

---

## 3. Feature Requirements

### 3.1 User Authentication & Onboarding

#### 3.1.1 Registration & Login
- **Email/Password authentication**
- **Phone number verification** (via OTP)
- **Social login** (Google, optional)
- **Password recovery** flow
- **Session management** with auto-refresh

**Acceptance Criteria**:
- Users can sign up in <2 minutes
- Email verification optional (configurable)
- Phone verification required for contribution tracking
- Secure password requirements (min 8 chars, complexity rules)

#### 3.1.2 Profile Setup
- Full name (required)
- Phone number (required, verified)
- Profile photo (optional)
- Bio/description (optional)
- Notification preferences

**Acceptance Criteria**:
- Profile is 80% complete before accessing groups
- Phone number must be unique per user
- Profile photo stored securely in Supabase storage

#### 3.1.3 Guided Onboarding
- **Step 1**: Profile completion
- **Step 2**: Security setup overview
- **Step 3**: Notification preferences
- **Step 4**: Create first group or join via invite

**Acceptance Criteria**:
- Progress indicator shows current step
- Users can skip and complete later
- Onboarding state persists across sessions

---

### 3.2 Group Management

#### 3.2.1 Create Group
**Fields**:
- Group name (required, 3-100 chars)
- Description (optional, max 500 chars)
- Target amount (required, positive number)
- End date (required, must be future date)
- Contribution frequency (daily/weekly/monthly)
- Currency (KES default, configurable)

**Acceptance Criteria**:
- Creator automatically assigned as admin
- Group gets unique shareable link/code
- Group appears in creator's dashboard immediately
- Validation prevents invalid data entry

#### 3.2.2 Join Group
**Methods**:
1. **Invitation link** (click and auto-join)
2. **Email invitation** (with personalized message)
3. **SMS invitation** (with group code)
4. **Share token** (manual entry)

**Acceptance Criteria**:
- User must be authenticated to join
- Duplicate membership prevented
- Role assigned based on invitation (default: member)
- Welcome notification sent upon joining

#### 3.2.3 Group Dashboard
**Displays**:
- Group name, description, status
- Progress bar (total contributions / target)
- Days remaining to end date
- Member count
- Recent activities feed
- Quick actions (add contribution, invite member, view insights)

**Acceptance Criteria**:
- Real-time updates via Supabase subscriptions
- Responsive design for mobile/tablet/desktop
- Accessible to all group members

#### 3.2.4 Group Settings (Admin Only)
**Configurable**:
- Edit group details (name, description, target)
- Change contribution schedule
- Enable/disable reminders
- Archive/close group
- Delete group (with confirmation)

**Acceptance Criteria**:
- Only admins can access settings
- Changes logged in audit trail
- Members notified of critical changes

---

### 3.3 Contribution Management

#### 3.3.1 Record Contribution
**Methods**:
1. **Manual entry** (treasurer/admin)
   - Member selection (dropdown)
   - Amount (required)
   - Transaction ID (optional)
   - Date (defaults to today)
   - Notes (optional)

2. **M-Pesa SMS parsing** (automatic)
   - User pastes M-Pesa confirmation SMS
   - System extracts: amount, sender, transaction ID, date
   - Auto-matches to group member by phone number

**Acceptance Criteria**:
- Only admins/treasurers can add contributions
- Duplicate transaction IDs prevented
- Contributions appear immediately in group total
- Activity logged for all contributions

#### 3.3.2 View Contributions
**Views**:
- **List view**: Sortable table (date, member, amount, status)
- **Calendar view**: Visual contribution timeline
- **Member view**: Contributions per member with totals

**Filters**:
- Date range
- Member
- Status (pending/confirmed/disputed)
- Amount range

**Acceptance Criteria**:
- Pagination for large datasets (50 per page)
- Export to PDF/CSV
- Real-time updates when new contributions added

#### 3.3.3 Contribution Validation
- Admins can mark contributions as confirmed/disputed
- Members can dispute their own contributions
- Notifications sent on status changes

---

### 3.4 Member Management

#### 3.4.1 View Members
**Displays**:
- Member list with avatars
- Role badges (Admin, Treasurer, Member)
- Total contributions per member
- Join date
- Last activity date

**Acceptance Criteria**:
- Searchable by name
- Sortable by contributions, join date
- Click member to view detailed profile

#### 3.4.2 Invite Members
**Options**:
1. **Email invitation** (enter email, send)
2. **SMS invitation** (enter phone, send)
3. **Share link** (copy to clipboard)

**Acceptance Criteria**:
- Bulk invite support (up to 10 at once)
- Invitation includes group name, inviter name
- Pending invitations tracked in database
- Expired invitations auto-removed after 7 days

#### 3.4.3 Assign Roles
**Roles**:
- **Admin**: Full access, can delete group
- **Treasurer**: Manage contributions, view reports
- **Member**: View group, record own contributions

**Permissions Matrix**:
| Action | Admin | Treasurer | Member |
|--------|-------|-----------|--------|
| View group | ✅ | ✅ | ✅ |
| Edit group settings | ✅ | ❌ | ❌ |
| Add contributions | ✅ | ✅ | ❌ |
| Invite members | ✅ | ✅ | ❌ |
| Assign roles | ✅ | ❌ | ❌ |
| Delete group | ✅ | ❌ | ❌ |
| View reports | ✅ | ✅ | ❌ |

**Acceptance Criteria**:
- Only admins can change roles
- At least one admin required per group
- Role changes logged in audit trail

#### 3.4.4 Remove Members
- Admins can remove members
- Member removed from future contributions
- Historical contributions retained
- Member notified of removal

---

### 3.5 Task Management

#### 3.5.1 Create Tasks
**Fields**:
- Title (required)
- Description (optional)
- Assignee (member dropdown)
- Due date (optional)
- Priority (low/medium/high)

**Acceptance Criteria**:
- Only admins/treasurers can create tasks
- Assignee notified immediately
- Tasks visible to all group members

#### 3.5.2 Complete Tasks
- Assignee marks task as complete
- Admin/treasurer can mark any task complete
- Completion notification sent to admins
- Activity logged

---

### 3.6 Messaging & Notifications

#### 3.6.1 Group Chat
**Features**:
- Real-time text messaging
- Voice message recording (up to 60 seconds)
- Message timestamps
- Sender name/avatar display

**Acceptance Criteria**:
- Messages delivered instantly via Supabase Realtime
- Voice messages stored in Supabase storage
- Message history persists
- Offline messages queued and sent when online

#### 3.6.2 Notification Center
**Notification Types**:
1. **Contribution added** (to all members)
2. **Task assigned** (to assignee)
3. **Task completed** (to admins)
4. **Member joined** (to admins)
5. **Reminder** (scheduled, to members)
6. **Achievement unlocked** (to user)

**Delivery Channels**:
- In-app (notification bell icon)
- Email (configurable)
- SMS (for critical actions, configurable)
- Push notifications (future)

**Acceptance Criteria**:
- Unread count displayed in header
- Mark as read functionality
- Notification preferences per user
- Click notification to view related content

---

### 3.7 Analytics & Insights

#### 3.7.1 Group Insights
**Metrics**:
- Total contributions vs target
- Average contribution per member
- Contribution frequency (daily/weekly trend)
- Top contributors (leaderboard)
- Projected completion date

**Visualizations**:
- Line chart: Contributions over time
- Bar chart: Contributions per member
- Pie chart: Progress toward target
- Calendar heatmap: Contribution frequency

**Acceptance Criteria**:
- Data refreshes in real-time
- Export charts as images
- Date range selector (last 7/30/90 days, all time)

#### 3.7.2 Member Insights
- Personal contribution total
- Contribution streak (consecutive days)
- Achievement badges earned
- Rank in group leaderboard
- Contribution history chart

---

### 3.8 Gamification

#### 3.8.1 Achievements
**Examples**:
- 🏆 **First Contribution**: Make your first contribution
- 🔥 **7-Day Streak**: Contribute 7 days in a row
- 💎 **Big Spender**: Single contribution over 10,000 KES
- 👥 **Team Player**: Invite 5 members
- 📈 **Consistent Contributor**: 90% contribution rate

**Acceptance Criteria**:
- Achievements unlock automatically based on user actions
- Notification sent when achievement unlocked
- Visible in user profile
- Points awarded (for future rewards system)

#### 3.8.2 Leaderboards
**Types**:
1. **Group leaderboard** (within group)
2. **Global leaderboard** (across platform, optional)

**Metrics**:
- Total contributions
- Contribution streak
- Achievement points

**Acceptance Criteria**:
- Updates in real-time
- Privacy controls (users can opt out of global leaderboard)

---

### 3.9 Reports & Exports

#### 3.9.1 PDF Reports
**Contents**:
- Group summary (name, target, progress)
- Member list with totals
- Contribution history (table)
- Charts and visualizations
- Generated date and signature line

**Acceptance Criteria**:
- Generate in <5 seconds
- Professional formatting
- Downloadable via browser
- Includes group logo/branding (if set)

#### 3.9.2 CSV Exports
**Data Exports**:
- Contributions (all fields)
- Members (name, phone, role, total)
- Activities (full activity log)

**Acceptance Criteria**:
- UTF-8 encoding for international characters
- Includes headers
- Downloadable immediately

---

### 3.10 Security & Compliance

#### 3.10.1 Data Privacy
- User data encrypted at rest and in transit
- GDPR-compliant data handling
- Users can export their data
- Users can delete their account (with confirmation)

#### 3.10.2 Row-Level Security (RLS)
- Users can only view groups they're members of
- Only admins/treasurers can add contributions
- Audit logs immutable and admin-only
- Storage buckets have proper access policies

#### 3.10.3 Audit Trail
**Logged Events**:
- Group created/edited/deleted
- Member added/removed
- Role changed
- Contribution added/edited
- Settings changed

**Acceptance Criteria**:
- All logs include timestamp, user_id, IP address
- Logs viewable by admins only
- Logs cannot be edited or deleted

---

## 4. Technical Specifications

### 4.1 Technology Stack
- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **State Management**: TanStack Query (React Query)
- **Realtime**: Supabase Realtime (WebSockets)
- **Charts**: Recharts
- **PDF Generation**: jsPDF, html2canvas

### 4.2 Database Schema
See `TODO.md` for detailed table requirements.

**Key Tables**:
- profiles (user data)
- groups (group metadata)
- group_members (many-to-many with roles)
- contributions (transaction records)
- tasks (task management)
- messages (group chat)
- notifications (user notifications)
- activities (audit/activity log)
- achievements (gamification)
- user_achievements (unlocked achievements)

### 4.3 API Architecture
- **Edge Functions**: For email/SMS, payment processing, scheduled jobs
- **RLS Policies**: For all data access control
- **Database Functions**: For complex queries and business logic

### 4.4 Performance Requirements
- **Page Load**: <3 seconds on 3G
- **Real-time Latency**: <500ms for messages/notifications
- **API Response**: <1 second for queries
- **Concurrent Users**: Support 10,000+ simultaneous users
- **Database**: Optimized indexes on foreign keys, frequently queried columns

### 4.5 Offline Support
- Cache group data locally (IndexedDB)
- Queue contributions when offline
- Sync when connection restored
- Display offline indicator in UI

---

## 5. User Journeys

### 5.1 Admin Creates Group & Invites Members
1. Admin signs up and completes onboarding
2. Clicks "Create Group" on dashboard
3. Fills in group details (name, target, end date)
4. Group created, admin redirected to group page
5. Clicks "Invite Members"
6. Enters emails/phone numbers for 5 members
7. Invitations sent via email/SMS
8. Members receive invite, click link, join group
9. Admin views updated member list

### 5.2 Treasurer Records Contribution
1. Treasurer navigates to group page
2. Clicks "Add Contribution" button
3. Selects member from dropdown
4. Enters amount (e.g., 5,000 KES)
5. Pastes M-Pesa confirmation SMS (optional)
6. System auto-fills transaction ID
7. Clicks "Save Contribution"
8. Contribution added, group total updates
9. Member receives notification

### 5.3 Member Views Progress & Unlocks Achievement
1. Member logs in, sees dashboard
2. Clicks on active group
3. Views progress bar (75% toward target)
4. Scrolls to personal stats
5. Sees 7-day contribution streak
6. Achievement notification: "🔥 7-Day Streak Unlocked!"
7. Clicks notification, views achievement details
8. Shares achievement on social media (future feature)

---

## 6. Success Metrics (Detailed)

### 6.1 Acquisition Metrics
- Website visitors: 10,000/month
- Sign-ups: 1,000/month (10% conversion)
- Activation rate: 70% (complete onboarding)

### 6.2 Engagement Metrics
- DAU (Daily Active Users): 3,000
- MAU (Monthly Active Users): 15,000
- DAU/MAU ratio: 20%
- Average session duration: 8 minutes
- Contributions per active user: 4/month

### 6.3 Retention Metrics
- Day 1: 80%
- Day 7: 60%
- Day 30: 50%
- Month 3: 40%

### 6.4 Business Metrics
- Groups created: 200/month
- Average group size: 15 members
- Average contribution per group: 200,000 KES/month
- Platform GMV (Gross Merchandise Value): 40M KES/month

---

## 7. Roadmap

### Phase 1: MVP (Months 1-2) ✅
- User authentication & profiles
- Group creation & management
- Manual contribution tracking
- Basic member management
- Simple notifications

### Phase 2: Core Features (Months 3-4) 🚧
- M-Pesa integration
- Automated SMS parsing
- Role-based permissions
- Task management
- Group chat
- Enhanced notifications

### Phase 3: Analytics & Gamification (Months 5-6)
- Insights dashboard
- Achievement system
- Leaderboards
- PDF/CSV exports
- Contribution schedules

### Phase 4: Advanced Features (Months 7-9)
- Payment gateway integration (STK Push)
- Bulk operations
- Advanced search & filters
- Email digests
- Mobile app (React Native/Capacitor)

### Phase 5: Scale & Optimize (Months 10-12)
- Performance optimization
- Advanced analytics (predictive)
- Multi-currency support
- API for third-party integrations
- Whitelabel solution for enterprises

---

## 8. Risk Assessment

### 8.1 Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase downtime | High | Implement caching, queue offline actions |
| M-Pesa API changes | Medium | Abstract API layer, monitor for changes |
| Scalability issues | Medium | Load testing, database optimization |
| Security breach | High | Regular audits, penetration testing |

### 8.2 Product Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Low user adoption | High | User research, iterative improvements |
| Competition | Medium | Differentiate via UX, local features |
| Regulatory changes | Low | Monitor financial regulations |

---

## 9. Open Questions

1. **Payment Processing**: Should we handle actual money transfers, or just track contributions?
2. **Pricing Model**: Freemium (free basic, paid premium) or transaction fee?
3. **Compliance**: Do we need financial licenses in Kenya?
4. **Multi-tenancy**: Support for multiple Chamas per user?
5. **Internationalization**: Expand beyond Kenya? Which countries?

---

## 10. Appendix

### 10.1 Glossary
- **Chama**: Swahili word for savings group
- **M-Pesa**: Mobile money platform in Kenya
- **STK Push**: Sim Toolkit Push, automated M-Pesa payment prompt
- **RLS**: Row-Level Security in PostgreSQL/Supabase

### 10.2 References
- [Supabase Documentation](https://supabase.com/docs)
- [M-Pesa API Docs](https://developer.safaricom.co.ke/)
- [React Best Practices](https://react.dev/)

---

**Document Version**: 1.0  
**Last Updated**: 2025-10-18  
**Author**: Product Team  
**Status**: Draft → Approved → In Progress
