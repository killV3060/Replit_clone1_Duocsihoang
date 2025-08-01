# Overview

This is a Vietnamese AI assistant application called "Dược Sĩ Hoàng" (Pharmacist Hoang). The application provides intelligent assistance and can answer questions about any topic through a chat interface. Built as a full-stack web application, it combines a React frontend with an Express.js backend, integrated with Google's Gemini AI for generating comprehensive responses in Vietnamese.

The system is designed to help users with questions across all fields including science, technology, history, education, business, health, entertainment, and daily life topics. It uses a friendly and intelligent AI personality named "Hoàng".

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom healthcare-themed color variables
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for lightweight client-side routing

## Backend Architecture
- **Framework**: Express.js with TypeScript in ESM mode
- **Database ORM**: Drizzle ORM with PostgreSQL support
- **Session Management**: In-memory storage with fallback to database (connect-pg-simple)
- **API Design**: RESTful endpoints for chat operations
- **Development Setup**: Integrated Vite development server for full-stack development

## Data Storage
- **Primary Database**: PostgreSQL via Neon serverless
- **Schema Management**: Drizzle migrations with schema-first approach
- **Tables**: Users and Messages with session-based chat history
- **Fallback Storage**: In-memory storage implementation for development

## Authentication & Session Management
- **Session Storage**: PostgreSQL-backed sessions with in-memory fallback
- **User Management**: Basic user schema with username/password fields
- **Chat Sessions**: Session-based message history tracking

## AI Integration
- **AI Provider**: Google Gemini AI (gemini-2.5-flash model)
- **AI Persona**: General-purpose intelligent assistant named "Hoàng" capable of answering questions across all domains
- **Response Handling**: Structured error handling with fallback messages
- **Temperature**: Controlled at 0.7 for balanced creativity and accuracy

## Development & Deployment
- **Build System**: Vite for frontend, esbuild for backend bundling
- **Development**: Hot reload with Vite middleware integration
- **Environment**: Replit-optimized with cartographer plugin for development
- **TypeScript**: Strict mode enabled with path mapping for clean imports

## Key Design Decisions
- **Monorepo Structure**: Single repository with client, server, and shared directories
- **Shared Schema**: Common TypeScript types and Zod schemas between frontend and backend
- **Memory-First Storage**: In-memory storage with database fallback for development flexibility
- **Vietnamese Localization**: Fully localized interface and AI responses in Vietnamese
- **Healthcare UI**: Custom color scheme and iconography for medical/pharmacy context
- **Session-Based Chat**: Simple session management without complex user authentication