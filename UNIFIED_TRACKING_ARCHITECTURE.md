# Unified Tracking Architecture

## Overview

A centralized tracking system that coordinates multiple tracking platforms (Google Analytics, Meta CAPI, etc.) with unified event management, consistent event IDs, and separated concerns.

## Architecture Principles

### 1. **Separation of Concerns**

- **Event Generation**: Central event ID generation and structure
- **Platform Abstraction**: Each tracking platform has its own adapter
- **Coordination**: Single orchestrator that calls all platforms
- **Client/Server Separation**: Clear distinction between client and server tracking

### 2. **Unified Interface**

- Single tracking function for all platforms
- Consistent event structure across platforms
- Shared event IDs for cross-platform correlation
- Standardized error handling

## File Structure

```txt
app/lib/tracking/
├── core/
│   ├── event-manager.ts          # Event ID generation & structure
│   ├── tracking-coordinator.ts   # Main orchestrator
│   └── types.ts                  # Shared types
├── platforms/
│   ├── google-analytics.ts       # GA platform adapter
│   ├── meta-capi.ts              # Meta CAPI platform adapter
│   └── base-platform.ts          # Base platform interface
└── index.ts                      # Public API exports
```

## Core Components

### 1. **Event Manager** (`core/event-manager.ts`)

- Generates unique event IDs
- Creates standardized event structures
- Manages event metadata (timestamps, sessions, etc.)

### 2. **Tracking Coordinator** (`core/tracking-coordinator.ts`)

- Single entry point for all tracking
- Calls all enabled platforms
- Handles errors **gracefully**
- Manages client/server routing

### 3. **Platform Adapters** (`platforms/*.ts`)

- Individual platform implementations
- Consistent interface for all platforms
- Platform-specific data formatting
- Error handling per platform

### 4. **Hooks & Components**

- Single hook: `useTracking()`
- Unified methods: `trackEvent()`, `trackPageView()`, `trackFormStart()`, etc.
- Automatic platform coordination

## Event Flow

```text
Component/Page
    ↓
useTracking() hook
    ↓
trackEvent(eventType, data)
    ↓
Tracking Coordinator
    ↓ (parallel)
┌─────────────────┬─────────────────┐
│   GA Platform   │  Meta Platform  │
│    Adapter      │     Adapter     │
└─────────────────┴─────────────────┘
    ↓ (parallel)
┌─────────────────┬─────────────────┐
│   GA Server     │   Meta Server   │
│   + GA Client   │   + Meta Client │
└─────────────────┴─────────────────┘
```

## API Design

### Single Hook Interface

```typescript
const { 
  trackEvent, 
  trackPageView, 
  trackFormStart, 
  trackFormSubmit,
  eventId // Current session event ID
} = useTracking();
```

### Event Structure

```typescript
interface UnifiedEvent {
  id: string;           // Unique event ID
  type: string;         // Event type (page_view, form_start, etc.)
  timestamp: number;    // Unix timestamp
  session_id: string;   // Session identifier
  client_id: string;    // Client identifier
  data: Record<string, any>; // Event-specific data
}
```

### Platform Interface

```typescript
interface TrackingPlatform {
  name: string;
  trackEvent(event: UnifiedEvent): Promise<boolean>;
  trackPageView(event: UnifiedEvent): Promise<boolean>;
  trackFormEvent(event: UnifiedEvent): Promise<boolean>;
}
```

## Implementation Benefits

### ✅ **Unified Management**

- Single function call tracks to all platforms
- Consistent event IDs across platforms
- Centralized error handling

### ✅ **Scalability**

- Easy to add new tracking platforms
- Platform-specific optimizations
- Independent platform failures

### ✅ **Maintainability**

- Clear separation of concerns
- Consistent interfaces
- Single source of truth for events

### ✅ **Developer Experience**

- Simple API: `trackEvent(type, data)`
- Automatic coordination
- Type safety across platforms

### ✅ **Analytics Benefits**

- Cross-platform event correlation
- Unified reporting possible
- Consistent data structure

## Migration Strategy

1. **Create Core Infrastructure**
   - Event manager with ID generation
   - Tracking coordinator
   - Base platform interface

2. **Create Platform Adapters**
   - Migrate existing GA logic to adapter
   - Migrate existing Meta logic to adapter
   - Ensure consistent interfaces

3. **Update Hooks & Components**
   - Replace individual hooks with unified hook
   - Update form and page components
   - Maintain backward compatibility during transition

4. **Test & Validate**
   - Ensure all platforms receive events
   - Verify event ID correlation
   - Check error handling

This architecture provides a clean, scalable foundation for multi-platform tracking while maintaining the privacy and reliability requirements of the current implementation.
