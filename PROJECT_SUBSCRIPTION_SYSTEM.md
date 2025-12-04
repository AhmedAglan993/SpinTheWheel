# Project-Based Subscription System - Implementation Summary

## Overview
We've successfully migrated from a recurring monthly subscription model to a **project/event-based pricing model** for the Spin the Wheel application.

## Business Model

### Old Model (Recurring Subscription)
- Tenants pay monthly regardless of usage
- High churn as clients cancel after single events
- Not aligned with actual value delivery

### New Model (Agency/Project-Based)
1. **Client Sign-Up** → Tenant creates account (status: "Pending")
2. **Contact & Consultation** → You gather requirements
3. **Quote Generation** → You provide pricing based on scope
4. **Payment** → Client pays for the specific project/event
5. **Activation** → Project status changes to "Active"
6. **Event Execution** → Spin the wheel runs with constraints

## Database Schema Changes

### New `Project` Model
```prisma
model Project {
  id           String    @id @default(uuid())
  tenantId     String
  name         String    // e.g. "Summer Trade Show 2025"
  slug         String?
  
  // Workflow
  status       String    // Draft, Quoted, PendingPayment, Active, Completed, Archived
  isPaid       Boolean
  price        Float?
  
  // Constraints
  startDate    DateTime?
  endDate      DateTime?
  spinLimit    Int?
  currentSpins Int
  
  // Relations
  spinConfig   SpinConfiguration?
  prizes       Prize[]
  spinHistory  SpinHistory[]
}
```

### Updated Models
- **Tenant**: Added `onboardingStatus` and `projects[]` relation
- **Prize**: Added optional `projectId` to assign prizes to specific projects
- **SpinConfiguration**: Removed `@unique` from `tenantId`, added optional `projectId`
- **SpinHistory**: Added optional `project Id` to track which project a spin belongs to

## API Changes

### New Endpoints

#### `/api/projects`
- **GET** `/api/projects` - List all projects for tenant
- **POST** `/api/projects` - Create new project
- **GET** `/api/projects/:id` - Get project details
- **PUT** `/api/projects/:id` - Update project (status, pricing, dates, limits)
- **DELETE** `/api/projects/:id` - Delete project

### Updated Endpoints

#### `/api/spin/config/:id`
Now supports both `tenantId` and `projectId`:
1. **Project Mode**: If ID is a project, validates:
   - Project status is "Active"
   - Date range (startDate ≤ now ≤ endDate)
   - Spin limit (currentSpins < spinLimit)
   - Returns project-specific config and prizes
2. **Tenant Mode**: Fallback for legacy/default wheels

#### `/api/spin/record`
- Accepts `projectId` in request body
- Increments `project.currentSpins` if projectId provided
- Links spin history to project

#### `/api/spin/config` (PUT)
- Accepts `projectId` to update project-specific config
- Falls back to tenant default config if no projectId

#### `/api/prizes`
- **GET**: Accepts `?projectId=xxx` query param to filter by project
- **POST**: Accepts `projectId` in body to assign prize to project
- Default behavior: Shows/creates prizes NOT assigned to any project

## Typical Workflow

### Admin/Agency Side
1. Client signs up → Tenant created with `onboardingStatus: "Pending"`
2. You contact client → Update `onboardingStatus: "Contacted"`
3. Create Project → POST `/api/projects` with:
   - `name`: "Client's Summer Event"
   - `startDate`, `endDate`: Event timeframe
   - `spinLimit`: Max allowed spins
   - `price`: Your quote
4. Client approves → Update project:
   - `status: "Active"`
   - `isPaid: true"`
5. Configure event:
   - PUT `/api/spin/config` with `projectId`
   - POST `/api/prizes` with `projectId`

### Client/Public Side
1. Access spin wheel via `https://yourapp.com/spin/{projectId}`
2. Frontend calls `GET /api/spin/config/{projectId}`
3. Backend validates dates, status, and limits
4. Wheel loads with project-specific config and prizes
5. On spin → POST `/api/spin/record` with `projectId`
6. Backend increments `currentSpins`

## Deployment Steps

### 1. Database Migration (via Railway)
```bash
# In Railway dashboard or CLI
npx prisma migrate dev --name add_project_model
```

Or use `prisma db push` for development:
```bash
npx prisma db push
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Deploy Backend
Push the updated code to your Railway deployment.

## Benefits

✅ **Aligned Pricing**: Charge per event, not per month  
✅ **Flexible Constraints**: Control dates and spin limits per project  
✅ **Better Analytics**: Track performance per event/campaign  
✅ **Higher Retention**: Clients return for multiple events without managing subscriptions  
✅ **Scalable**: Support unlimited concurrent projects per tenant  
✅ **Backwards Compatible**: Legacy tenant-based wheels still work

## Next Steps

1. **Deploy database migrations** via Railway
2. **Update frontend** to support project creation and management
3. **Build admin dashboard** for managing projects and quotes
4. **Create public spin URLs** using projectId (e.g., `/spin/{projectId}`)
5. **Add analytics** showing per-project metrics

---

## Notes
- TypeScript lint errors about missing modules are IDE-only (dependencies exist in package.json)
- The system supports both project-based AND tenant-based modes for backwards compatibility
- Default behavior filters prizes/config by `projectId: null` to separate default from project-specific data
