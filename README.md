## TODO

- [ ] Set up Next.js project
  - [x] VSCode `settings.json`
  - [x] tsconfig setup
  - [x] eslint setup
  - [x] prettier setup
  - [x] CI setup w/ GitHub actions
  - [x] t3-env setup
  - [ ] Drizzle ORM config

## Directory Structure

```text
/
├── app/                              # Next.js app directory
│   ├── (auth)/                       # Authentication routes (grouped)
│   │   ├── login/                    # Login page
│   │   ├── initial-setup/            # Initial setup flow for root team/admin
│   │   └── layout.tsx                # Layout for auth pages
│   │
│   ├── (dashboard)/                  # Protected dashboard routes (grouped)
│   │   ├── layout.tsx                # Dashboard layout with auth check
│   │   ├── page.tsx                  # Main dashboard page
│   │   ├── teams/                    # Team management
│   │   │   ├── [teamId]/             # Team details and settings
│   │   │   │   ├── page.tsx          # Team details page
│   │   │   │   ├── edit/             # Edit team page
│   │   │   │   ├── users/            # User management for team
│   │   │   │   │   ├── page.tsx      # List users
│   │   │   │   │   ├── new/          # Create new user
│   │   │   │   │   └── [userId]/     # User details/edit
│   │   │   │   └── permissions/      # Permission management
│   │   │   ├── new/                  # Create new team
│   │   │   └── page.tsx              # Teams overview
│   │   │
│   │   └── audit-logs/               # Audit logs viewer
│   │       └── page.tsx              # Audit logs page
│   │
│   ├── api/                          # API routes
│   │   └── ...                       # Any necessary API endpoints
│   │
│   └── layout.tsx                    # Root layout
│
├── components/                       # Reusable UI components
│   ├── ui/                           # shadcn/ui components
│   ├── auth/                         # Authentication components
│   ├── teams/                        # Team-related components
│   ├── users/                        # User management components
│   ├── permissions/                  # Permission-related components
│   └── audit/                        # Audit log components
│
├── lib/                              # Utility functions and shared code
│   ├── auth/                         # Authentication utilities
│   │   ├── password.ts               # Password hashing with bcrypt2
│   │   ├── session.ts                # Session management
│   │   └── cookies.ts                # Cookie handling
│   │
│   ├── permissions/                  # Permission system
│   │   ├── types.ts                  # Permission type definitions
│   │   ├── check.ts                  # Permission checking logic
│   │   └── cache.ts                  # Permission caching strategies
│   │
│   ├── teams/                        # Team hierarchy utilities
│   │   ├── hierarchy.ts              # Team hierarchy traversal
│   │   └── types.ts                  # Team type definitions
│   │
│   ├── audit/                        # Audit logging
│   │   ├── logger.ts                 # Audit logging functions
│   │   └── types.ts                  # Audit log type definitions
│   │
│   ├── validation/                   # Zod validation schemas
│   │   ├── auth.ts                   # Auth-related schemas
│   │   ├── teams.ts                  # Team-related schemas
│   │   └── users.ts                  # User-related schemas
│   │
│   └── utils/                        # General utilities
│       ├── id.ts                     # ID generation with nanoid
│       └── ...                       # Other utilities
│
├── server/                           # Server-side code
│   ├── actions/                      # Server actions (zsa)
│   │   ├── auth.ts                   # Authentication actions
│   │   ├── teams.ts                  # Team management actions
│   │   ├── users.ts                  # User management actions
│   │   ├── permissions.ts            # Permission management actions
│   │   └── audit.ts                  # Audit log actions
│   │
│   ├── db/                           # Database schema and queries
│   │   ├── schema/                   # Drizzle schema definitions
│   │   │   ├── users.ts              # User schema
│   │   │   ├── teams.ts              # Team schema
│   │   │   ├── permissions.ts        # Permission schema
│   │   │   ├── sessions.ts           # Session schema
│   │   │   └── audit-logs.ts         # Audit log schema
│   │   │
│   │   └── queries/                  # Optimized database queries
│   │       ├── teams.ts              # Team-related queries
│   │       ├── users.ts              # User-related queries
│   │       ├── permissions.ts        # Permission-related queries
│   │       └── audit.ts              # Audit log queries
│   │
│   └── services/                     # Business logic services
│       ├── auth-service.ts           # Authentication service
│       ├── team-service.ts           # Team management service
│       ├── user-service.ts           # User management service
│       ├── permission-service.ts     # Permission service
│       └── audit-service.ts          # Audit logging service
│
├── types/                            # TypeScript type definitions
│   ├── auth.ts                       # Authentication types
│   ├── teams.ts                      # Team types
│   ├── users.ts                      # User types
│   ├── permissions.ts                # Permission types
│   └── audit.ts                      # Audit log types
│
├── middleware.ts                     # Minimal middleware (if needed)
├── drizzle.config.ts                 # Drizzle ORM configuration
├── tailwind.config.ts                # TailwindCSS configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Project dependencies
```
