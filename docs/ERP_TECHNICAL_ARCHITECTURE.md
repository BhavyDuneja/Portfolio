# ERP/CRM/EHR & School Management Platform
## Technical Architecture & Implementation Guide

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
├─────────────────────────────────────────────────────────────┤
│  Web App (Next.js)  │  Mobile Apps  │  Admin Dashboard      │
│  - React 18         │  - React Native│  - Admin Panel        │
│  - TypeScript       │  - iOS/Android │  - Analytics          │
│  - Tailwind CSS     │               │  - User Management    │
└──────────────────┬──────────────────┴───────────────────────┘
                   │
                   │ HTTPS/WSS
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                     API Gateway                              │
├─────────────────────────────────────────────────────────────┤
│  - Rate Limiting     - Authentication    - Request Routing  │
│  - API Versioning    - Load Balancing    - CORS Handling    │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┬──────────────┐
        │                     │               │
┌───────▼──────────┐  ┌──────▼──────┐  ┌────▼─────────┐
│  Auth Service    │  │  Core API    │  │  File Service│
│  - NextAuth.js   │  │  - NestJS    │  │  - Upload    │
│  - JWT/Session   │  │  - GraphQL   │  │  - CDN       │
│  - OAuth         │  │  - REST      │  │  - Optimize  │
└───────┬──────────┘  └──────┬──────┘  └────┬─────────┘
        │                    │               │
        │         ┌──────────┴──────┬────────┴──────┐
        │         │                 │               │
┌───────▼─────────▼────────┐  ┌────▼──────┐  ┌─────▼────────┐
│   Business Logic Layer   │  │  Cache    │  │  Queue       │
├──────────────────────────┤  │  (Redis)  │  │  (Bull/MQ)   │
│  ERP │ CRM │ EHR │ School│  └───────────┘  └──────────────┘
└───────┬──────────────────┘
        │
┌───────▼──────────────────────────────────────────────────────┐
│                     Data Layer                                │
├───────────────────────────────────────────────────────────────┤
│  PostgreSQL (Primary)  │  File Storage (R2)  │  Search (ES)  │
│  - Multi-tenant        │  - Images/Docs      │  - Full-text  │
│  - JSONB support       │  - CDN cached       │  - Analytics  │
│  - Row-level security  │                     │               │
└───────────────────────────────────────────────────────────────┘
```

---

## 🔧 Technology Stack Details

### Frontend Stack

#### Next.js 14 Application
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

#### Key Dependencies
```json
{
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "typescript": "5.3.0",
    "tailwindcss": "3.4.0",
    "@tanstack/react-query": "5.0.0",
    "zustand": "4.4.0",
    "zod": "3.22.0",
    "react-hook-form": "7.48.0",
    "recharts": "2.10.0",
    "date-fns": "3.0.0",
    "lucide-react": "0.294.0"
  }
}
```

### Backend Stack

#### NestJS Application Structure
```
src/
├── app.module.ts
├── main.ts
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── erp/
│   │   ├── inventory/
│   │   ├── purchase/
│   │   ├── sales/
│   │   └── finance/
│   ├── crm/
│   │   ├── contacts/
│   │   ├── leads/
│   │   ├── pipeline/
│   │   └── tickets/
│   ├── ehr/
│   │   ├── patients/
│   │   ├── appointments/
│   │   ├── records/
│   │   └── prescriptions/
│   └── school/
│       ├── students/
│       ├── attendance/
│       ├── grades/
│       └── fees/
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── entities/
└── config/
    ├── database.config.ts
    ├── redis.config.ts
    └── storage.config.ts
```

---

## 🗄️ Database Schema Design

### Multi-Tenant Strategy

#### Approach: Shared Database with Row-Level Security

```sql
-- Enable Row Level Security
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Organizations (Tenants)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(100) UNIQUE NOT NULL,
  plan VARCHAR(50) NOT NULL DEFAULT 'starter',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) NOT NULL,
  permissions JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see users in their organization
CREATE POLICY users_isolation_policy ON users
  USING (organization_id = current_setting('app.current_organization_id')::UUID);
```

### Core Modules Schema

#### ERP - Inventory Management
```sql
-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  sku VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  unit_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  reorder_level INTEGER DEFAULT 0,
  attributes JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, sku)
);

-- Stock Movements
CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  product_id UUID REFERENCES products(id),
  movement_type VARCHAR(50) NOT NULL, -- 'IN', 'OUT', 'ADJUSTMENT'
  quantity INTEGER NOT NULL,
  reference_type VARCHAR(50), -- 'PURCHASE', 'SALE', 'RETURN'
  reference_id UUID,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY products_isolation_policy ON products
  USING (organization_id = current_setting('app.current_organization_id')::UUID);
```

#### CRM - Contact Management
```sql
-- Contacts
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  type VARCHAR(20) NOT NULL, -- 'LEAD', 'CUSTOMER', 'VENDOR'
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  status VARCHAR(50),
  source VARCHAR(100),
  assigned_to UUID REFERENCES users(id),
  tags TEXT[],
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activities
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  contact_id UUID REFERENCES contacts(id),
  type VARCHAR(50) NOT NULL, -- 'CALL', 'EMAIL', 'MEETING', 'TASK'
  subject VARCHAR(255),
  description TEXT,
  status VARCHAR(50),
  due_date TIMESTAMP,
  completed_at TIMESTAMP,
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
```

#### EHR - Patient Management
```sql
-- Patients
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  patient_number VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20),
  blood_group VARCHAR(10),
  email VARCHAR(255),
  phone VARCHAR(50),
  address JSONB,
  emergency_contact JSONB,
  insurance_info JSONB,
  allergies TEXT[],
  medical_conditions TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Medical Records
CREATE TABLE medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  patient_id UUID REFERENCES patients(id),
  visit_date TIMESTAMP NOT NULL,
  doctor_id UUID REFERENCES users(id),
  chief_complaint TEXT,
  diagnosis TEXT,
  vital_signs JSONB,
  prescriptions JSONB,
  lab_results JSONB,
  notes TEXT,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS with HIPAA considerations
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- Additional audit logging for HIPAA
CREATE TABLE access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID,
  user_id UUID,
  resource_type VARCHAR(50),
  resource_id UUID,
  action VARCHAR(50),
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### School Management
```sql
-- Students
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  admission_number VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20),
  class_id UUID REFERENCES classes(id),
  section VARCHAR(10),
  roll_number VARCHAR(20),
  admission_date DATE,
  parent_info JSONB,
  address JSONB,
  documents JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Attendance
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  student_id UUID REFERENCES students(id),
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'PRESENT', 'ABSENT', 'LATE', 'EXCUSED'
  remarks TEXT,
  marked_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, student_id, date)
);

-- Grades
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  student_id UUID REFERENCES students(id),
  subject_id UUID REFERENCES subjects(id),
  exam_id UUID REFERENCES exams(id),
  marks_obtained DECIMAL(5,2),
  marks_total DECIMAL(5,2),
  grade VARCHAR(5),
  remarks TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
```

---

## 🔐 Authentication & Authorization

### JWT-based Authentication

```typescript
// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      organizationId: user.organizationId,
      role: user.role,
      permissions: user.permissions
    };
    
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`
      }
    };
  }

  async setTenantContext(organizationId: string) {
    // Set context for Row Level Security
    await this.db.query(
      `SET LOCAL app.current_organization_id = '${organizationId}'`
    );
  }
}
```

### Role-Based Access Control

```typescript
// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return requiredRoles.some(role => user.role === role);
  }
}

// Usage in controllers
@Controller('erp/inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  @Get()
  @Roles('ADMIN', 'MANAGER', 'INVENTORY_MANAGER')
  async getInventory() {
    return this.inventoryService.findAll();
  }

  @Post()
  @Roles('ADMIN', 'INVENTORY_MANAGER')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.inventoryService.create(createProductDto);
  }
}
```

---

## 📊 API Design

### REST API Endpoints

```
Authentication
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/refresh
POST   /api/auth/logout
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

Organizations
GET    /api/organizations
POST   /api/organizations
GET    /api/organizations/:id
PATCH  /api/organizations/:id
DELETE /api/organizations/:id

Users
GET    /api/users
POST   /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id

ERP - Inventory
GET    /api/erp/products
POST   /api/erp/products
GET    /api/erp/products/:id
PATCH  /api/erp/products/:id
DELETE /api/erp/products/:id
GET    /api/erp/stock-movements
POST   /api/erp/stock-movements

CRM - Contacts
GET    /api/crm/contacts
POST   /api/crm/contacts
GET    /api/crm/contacts/:id
PATCH  /api/crm/contacts/:id
DELETE /api/crm/contacts/:id
GET    /api/crm/activities
POST   /api/crm/activities

EHR - Patients
GET    /api/ehr/patients
POST   /api/ehr/patients
GET    /api/ehr/patients/:id
PATCH  /api/ehr/patients/:id
GET    /api/ehr/patients/:id/records
POST   /api/ehr/patients/:id/records
GET    /api/ehr/appointments
POST   /api/ehr/appointments

School - Students
GET    /api/school/students
POST   /api/school/students
GET    /api/school/students/:id
PATCH  /api/school/students/:id
GET    /api/school/attendance
POST   /api/school/attendance
GET    /api/school/grades
POST   /api/school/grades
```

### GraphQL Schema (Optional)

```graphql
type Organization {
  id: ID!
  name: String!
  subdomain: String!
  plan: String!
  users: [User!]!
  createdAt: DateTime!
}

type User {
  id: ID!
  email: String!
  firstName: String
  lastName: String
  role: String!
  organization: Organization!
}

type Product {
  id: ID!
  sku: String!
  name: String!
  description: String
  unitPrice: Float!
  stockQuantity: Int!
  category: String
}

type Query {
  me: User!
  products(search: String, category: String): [Product!]!
  product(id: ID!): Product
  contacts(type: ContactType, status: String): [Contact!]!
  students(classId: ID, section: String): [Student!]!
}

type Mutation {
  login(email: String!, password: String!): AuthPayload!
  createProduct(input: CreateProductInput!): Product!
  updateStock(productId: ID!, quantity: Int!, type: StockMovementType!): StockMovement!
  createContact(input: CreateContactInput!): Contact!
  markAttendance(studentId: ID!, date: Date!, status: AttendanceStatus!): Attendance!
}
```

---

## 🚀 Deployment Architecture

### Production Environment (AWS/Digital Ocean)

```
┌──────────────────────────────────────────────────────┐
│                    Route 53 / DNS                     │
│                   app.anantasutras.com                │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│              CloudFlare (CDN + DDoS)                  │
│              - SSL/TLS Termination                    │
│              - WAF (Web Application Firewall)         │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│              Load Balancer (Nginx)                    │
│              - SSL Pass-through                       │
│              - Health Checks                          │
│              - Round Robin / Least Conn               │
└───────────┬──────────────────┬───────────────────────┘
            │                  │
    ┌───────▼───────┐  ┌──────▼────────┐
    │  Web Server 1 │  │  Web Server 2 │
    │  (Next.js)    │  │  (Next.js)    │
    │  - Port 3000  │  │  - Port 3000  │
    └───────┬───────┘  └──────┬────────┘
            │                  │
            └──────────┬───────┘
                       │
    ┌──────────────────▼──────────────────┐
    │         API Server (NestJS)         │
    │         - Port 4000                 │
    │         - PM2 / Docker              │
    └──────────────────┬──────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼────┐  ┌──────▼─────┐  ┌────▼─────┐
│ PostgreSQL │  │   Redis    │  │  R2/S3   │
│ (Primary)  │  │  (Cache)   │  │ (Files)  │
└────────────┘  └────────────┘  └──────────┘
```

### Docker Compose Setup

```yaml
version: '3.8'

services:
  # Frontend (Next.js)
  web:
    build: ./apps/web
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - API_URL=http://api:4000
      - NEXT_PUBLIC_API_URL=https://api.anantasutras.com
    depends_on:
      - api
    restart: unless-stopped

  # Backend API (NestJS)
  api:
    build: ./apps/api
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
      - AWS_ACCESS_KEY=${AWS_ACCESS_KEY}
      - AWS_SECRET_KEY=${AWS_SECRET_KEY}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=anantasutras_erp
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web
      - api
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

---

## 🎯 Performance Optimization

### Caching Strategy

```typescript
// cache.service.ts
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

// Usage in service
@Injectable()
export class ProductsService {
  constructor(private cacheService: CacheService) {}

  async findAll(organizationId: string) {
    const cacheKey = `products:${organizationId}`;
    
    // Try cache first
    let products = await this.cacheService.get(cacheKey);
    
    if (!products) {
      // Fetch from database
      products = await this.productsRepository.find({
        where: { organizationId }
      });
      
      // Cache for 1 hour
      await this.cacheService.set(cacheKey, products, 3600);
    }
    
    return products;
  }

  async update(id: string, organizationId: string, data: any) {
    const product = await this.productsRepository.update(id, data);
    
    // Invalidate cache
    await this.cacheService.invalidate(`products:${organizationId}*`);
    
    return product;
  }
}
```

### Database Query Optimization

```sql
-- Indexes for common queries
CREATE INDEX idx_products_organization ON products(organization_id);
CREATE INDEX idx_products_sku ON products(organization_id, sku);
CREATE INDEX idx_products_category ON products(organization_id, category);
CREATE INDEX idx_contacts_email ON contacts(organization_id, email);
CREATE INDEX idx_students_admission ON students(organization_id, admission_number);
CREATE INDEX idx_attendance_date ON attendance(organization_id, date);

-- Full-text search index
CREATE INDEX idx_products_search ON products 
  USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Partial index for active records
CREATE INDEX idx_products_active ON products(organization_id, name) 
  WHERE is_active = true;
```

---

## 📱 Mobile App Architecture (Optional)

### React Native Setup

```typescript
// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Products" component={ProductsScreen} />
            <Stack.Screen name="Contacts" component={ContactsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

---

## 🔍 Monitoring & Logging

### Application Monitoring

```typescript
// monitoring.service.ts
import * as Sentry from '@sentry/node';

export class MonitoringService {
  constructor() {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
    });
  }

  captureError(error: Error, context?: any) {
    Sentry.captureException(error, { extra: context });
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error') {
    Sentry.captureMessage(message, level);
  }

  startTransaction(name: string) {
    return Sentry.startTransaction({ name });
  }
}
```

### Logging Strategy

```typescript
// logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class CustomLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.json(),
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: winston.format.simple(),
      }));
    }
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }
}
```

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// product.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should create a product', async () => {
    const product = await service.create({
      name: 'Test Product',
      sku: 'TEST-001',
      unitPrice: 100,
    });

    expect(product).toBeDefined();
    expect(product.name).toBe('Test Product');
  });
});
```

### Integration Tests
```typescript
// products.e2e.spec.ts
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('Products (e2e)', () => {
  let app;
  let authToken;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    // Login to get auth token
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    
    authToken = response.body.accessToken;
  });

  it('/api/erp/products (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/erp/products')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
      });
  });
});
```

---

## 📚 Documentation

### API Documentation (Swagger)
```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Anantasutras ERP API')
    .setDescription('Complete ERP/CRM/EHR/School Management API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(4000);
}
bootstrap();
```

---

This technical architecture document provides the foundation for building a scalable, secure, and cost-optimized platform. All technologies selected prioritize open-source solutions and efficient cloud infrastructure to minimize operational costs while maintaining high performance and reliability.

