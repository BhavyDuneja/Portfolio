# Technical Architecture Specifications
## ERP/CRM/EHR & School Management System

## System Architecture Overview

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │  Mobile App     │    │  Admin Panel    │
│   (Next.js)     │    │ (React Native)  │    │   (Next.js)     │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │     API Gateway           │
                    │   (Next.js API Routes)    │
                    └─────────────┬─────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
┌─────────┴───────┐    ┌─────────┴───────┐    ┌─────────┴───────┐
│   ERP Service   │    │   CRM Service   │    │   EHR Service   │
│                 │    │                 │    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │     Database Layer        │
                    │   PostgreSQL + Redis      │
                    └───────────────────────────┘
```

## Technology Stack Details

### Frontend Technologies

#### Web Application (Next.js 14)
```typescript
// Tech Stack Configuration
const frontendStack = {
  framework: "Next.js 14",
  language: "TypeScript",
  styling: "Tailwind CSS",
  uiComponents: "Shadcn/ui + Custom Components",
  stateManagement: "Zustand + React Query",
  forms: "React Hook Form + Zod",
  charts: "Recharts + Chart.js",
  animations: "Framer Motion",
  testing: "Jest + React Testing Library"
}
```

#### Mobile Application (React Native)
```typescript
const mobileStack = {
  framework: "React Native 0.73+",
  navigation: "React Navigation 6",
  stateManagement: "Zustand + React Query",
  uiLibrary: "NativeBase + Custom Components",
  offline: "React Query + AsyncStorage",
  pushNotifications: "Expo Notifications",
  deployment: "Expo Application Services"
}
```

### Backend Architecture

#### API Layer
```typescript
// Backend Configuration
const backendStack = {
  runtime: "Node.js 18+",
  framework: "Express.js",
  apiStyle: "RESTful + GraphQL",
  authentication: "JWT + NextAuth.js",
  validation: "Zod",
  orm: "Prisma",
  fileUpload: "Multer + AWS S3",
  emailService: "Resend/SendGrid",
  scheduling: "Node-cron"
}
```

#### Database Schema Design

```sql
-- Core Tables Structure

-- Users and Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role user_role NOT NULL,
  organization_id UUID REFERENCES organizations(id),
  profile JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Organizations (Multi-tenant)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE,
  subscription_plan VARCHAR(50),
  settings JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ERP Module Tables
CREATE TABLE financial_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  account_name VARCHAR(255) NOT NULL,
  account_type account_type_enum,
  balance DECIMAL(15,2) DEFAULT 0,
  parent_account_id UUID REFERENCES financial_accounts(id)
);

CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INTEGER DEFAULT 0,
  unit_price DECIMAL(10,2),
  reorder_level INTEGER DEFAULT 0,
  category_id UUID REFERENCES item_categories(id)
);

-- CRM Module Tables
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  company VARCHAR(255),
  contact_type contact_type_enum,
  lead_status lead_status_enum,
  assigned_to UUID REFERENCES users(id)
);

CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  contact_id UUID REFERENCES contacts(id),
  title VARCHAR(255) NOT NULL,
  value DECIMAL(12,2),
  stage opportunity_stage_enum,
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  assigned_to UUID REFERENCES users(id)
);

-- EHR Module Tables
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  patient_id VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  gender gender_enum,
  contact_info JSONB,
  emergency_contact JSONB,
  insurance_info JSONB,
  medical_history JSONB
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  patient_id UUID REFERENCES patients(id),
  provider_id UUID REFERENCES users(id),
  appointment_date TIMESTAMP NOT NULL,
  duration INTEGER DEFAULT 30,
  appointment_type VARCHAR(100),
  status appointment_status_enum,
  notes TEXT
);

-- School Management Tables
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  student_id VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  grade_level VARCHAR(20),
  class_id UUID REFERENCES classes(id),
  parent_info JSONB,
  enrollment_date DATE
);

CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  class_name VARCHAR(100) NOT NULL,
  grade_level VARCHAR(20),
  teacher_id UUID REFERENCES users(id),
  academic_year VARCHAR(20),
  max_students INTEGER DEFAULT 30
);
```

## Security Architecture

### Authentication & Authorization
```typescript
// JWT Token Structure
interface JWTPayload {
  userId: string;
  organizationId: string;
  role: UserRole;
  permissions: Permission[];
  exp: number;
  iat: number;
}

// Role-Based Access Control
enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ORG_ADMIN = 'org_admin',
  MANAGER = 'manager',
  USER = 'user',
  VIEWER = 'viewer'
}

// Permission System
interface Permission {
  module: 'ERP' | 'CRM' | 'EHR' | 'SCHOOL';
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  resource: string;
}
```

### Data Encryption
- **At Rest**: AES-256 encryption for sensitive data
- **In Transit**: TLS 1.3 for all communications
- **Database**: PostgreSQL built-in encryption
- **File Storage**: AWS S3 server-side encryption

### Security Measures
```typescript
// Security Configuration
const securityConfig = {
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90 // days
  },
  sessionManagement: {
    tokenExpiry: 24 * 60 * 60, // 24 hours
    refreshTokenExpiry: 7 * 24 * 60 * 60, // 7 days
    maxConcurrentSessions: 3
  },
  auditLogging: {
    logAllActions: true,
    retentionPeriod: 365, // days
    includeIPAddress: true,
    includeUserAgent: true
  }
}
```

## API Design

### RESTful API Structure
```typescript
// API Endpoints Structure
const apiEndpoints = {
  // Authentication
  auth: {
    login: 'POST /api/auth/login',
    logout: 'POST /api/auth/logout',
    refresh: 'POST /api/auth/refresh',
    register: 'POST /api/auth/register'
  },
  
  // ERP Module
  erp: {
    accounts: 'GET|POST|PUT|DELETE /api/erp/accounts/:id?',
    transactions: 'GET|POST|PUT|DELETE /api/erp/transactions/:id?',
    inventory: 'GET|POST|PUT|DELETE /api/erp/inventory/:id?',
    reports: 'GET /api/erp/reports/:type'
  },
  
  // CRM Module
  crm: {
    contacts: 'GET|POST|PUT|DELETE /api/crm/contacts/:id?',
    opportunities: 'GET|POST|PUT|DELETE /api/crm/opportunities/:id?',
    activities: 'GET|POST|PUT|DELETE /api/crm/activities/:id?',
    pipeline: 'GET /api/crm/pipeline'
  },
  
  // EHR Module
  ehr: {
    patients: 'GET|POST|PUT|DELETE /api/ehr/patients/:id?',
    appointments: 'GET|POST|PUT|DELETE /api/ehr/appointments/:id?',
    records: 'GET|POST|PUT|DELETE /api/ehr/records/:id?',
    prescriptions: 'GET|POST|PUT|DELETE /api/ehr/prescriptions/:id?'
  },
  
  // School Management
  school: {
    students: 'GET|POST|PUT|DELETE /api/school/students/:id?',
    classes: 'GET|POST|PUT|DELETE /api/school/classes/:id?',
    attendance: 'GET|POST|PUT /api/school/attendance',
    grades: 'GET|POST|PUT /api/school/grades/:id?'
  }
}
```

### GraphQL Schema (Optional Advanced Queries)
```graphql
type Query {
  # ERP Queries
  getFinancialSummary(period: DateRange!): FinancialSummary
  getInventoryReport(filters: InventoryFilters): [InventoryItem]
  
  # CRM Queries
  getSalesMetrics(period: DateRange!): SalesMetrics
  getContactsBySegment(segment: String!): [Contact]
  
  # EHR Queries
  getPatientHistory(patientId: ID!): PatientHistory
  getAppointmentSchedule(date: Date!): [Appointment]
  
  # School Queries
  getStudentPerformance(studentId: ID!): StudentPerformance
  getClassAttendance(classId: ID!, date: Date!): AttendanceReport
}

type Mutation {
  # Universal mutations for all modules
  createRecord(input: CreateRecordInput!): Record
  updateRecord(id: ID!, input: UpdateRecordInput!): Record
  deleteRecord(id: ID!): Boolean
}
```

## Performance Optimization

### Caching Strategy
```typescript
// Redis Caching Configuration
const cacheConfig = {
  // Session cache
  sessions: {
    ttl: 24 * 60 * 60, // 24 hours
    keyPattern: 'session:${userId}'
  },
  
  // Query result cache
  queries: {
    ttl: 5 * 60, // 5 minutes
    keyPattern: 'query:${hash}'
  },
  
  // Static data cache
  staticData: {
    ttl: 60 * 60, // 1 hour
    keyPattern: 'static:${type}:${id}'
  }
}
```

### Database Optimization
```sql
-- Essential Indexes for Performance
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_contacts_organization_id ON contacts(organization_id);
CREATE INDEX idx_contacts_assigned_to ON contacts(assigned_to);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_students_organization_id ON students(organization_id);
CREATE INDEX idx_financial_accounts_org ON financial_accounts(organization_id);

-- Composite Indexes
CREATE INDEX idx_contacts_org_status ON contacts(organization_id, lead_status);
CREATE INDEX idx_appointments_provider_date ON appointments(provider_id, appointment_date);
```

## Deployment Architecture

### Production Environment
```yaml
# Docker Compose Configuration
version: '3.8'
services:
  web:
    image: anantasutra/erp-frontend:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - API_URL=https://api.anantasutra.com
    
  api:
    image: anantasutra/erp-backend:latest
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    
  database:
    image: postgres:15
    environment:
      - POSTGRES_DB=erp_system
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### CI/CD Pipeline
```yaml
# GitHub Actions Workflow
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Tests
        run: |
          npm install
          npm run test
          npm run lint
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Monitoring & Analytics

### Application Monitoring
```typescript
// Monitoring Configuration
const monitoringConfig = {
  errorTracking: {
    service: 'Sentry',
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1
  },
  
  performance: {
    service: 'New Relic / DataDog',
    metrics: [
      'response_time',
      'throughput',
      'error_rate',
      'database_queries'
    ]
  },
  
  businessMetrics: {
    service: 'Custom Analytics',
    events: [
      'user_login',
      'record_created',
      'report_generated',
      'payment_processed'
    ]
  }
}
```

### Health Check Endpoints
```typescript
// Health Check Implementation
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      storage: await checkStorage()
    }
  }
  
  const isHealthy = Object.values(health.services).every(s => s.status === 'healthy')
  res.status(isHealthy ? 200 : 503).json(health)
})
```

## Scalability Considerations

### Horizontal Scaling
- **Load Balancing**: NGINX or cloud load balancer
- **Database Sharding**: By organization_id for multi-tenancy
- **Microservices**: Separate services for each module if needed
- **CDN**: Static asset distribution via Cloudflare

### Vertical Scaling
- **Database**: Connection pooling and query optimization
- **Application**: PM2 cluster mode for Node.js
- **Caching**: Multi-level caching strategy
- **File Storage**: AWS S3 with CloudFront CDN

## Data Migration Strategy

### Migration Framework
```typescript
// Migration Script Structure
interface MigrationScript {
  version: string;
  description: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

// Example Migration
const migration_001: MigrationScript = {
  version: '001',
  description: 'Create initial tables',
  up: async () => {
    await db.query(`
      CREATE TABLE organizations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
  },
  down: async () => {
    await db.query('DROP TABLE organizations')
  }
}
```

## Testing Strategy

### Test Coverage Requirements
- **Unit Tests**: 90%+ coverage for business logic
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Critical user workflows
- **Performance Tests**: Load testing for concurrent users
- **Security Tests**: Penetration testing and vulnerability scans

### Test Implementation
```typescript
// Example Test Structure
describe('ERP Financial Module', () => {
  describe('Account Management', () => {
    it('should create a new financial account', async () => {
      const account = await createAccount({
        name: 'Test Account',
        type: 'ASSET',
        organizationId: 'test-org-id'
      })
      
      expect(account.id).toBeDefined()
      expect(account.name).toBe('Test Account')
      expect(account.balance).toBe(0)
    })
    
    it('should prevent duplicate account names', async () => {
      await expect(createAccount({
        name: 'Existing Account',
        type: 'ASSET',
        organizationId: 'test-org-id'
      })).rejects.toThrow('Account name already exists')
    })
  })
})
```

This technical architecture provides a solid foundation for building a scalable, secure, and maintainable ERP/CRM/EHR and School Management system while keeping costs optimized through smart technology choices and efficient infrastructure design.