# Migration Guide: Individual Hooks → Unified Tracking

## Overview

This guide covers migrating from individual tracking hooks (`useGoogleAnalytics`, `useMetaCapi`) to the new unified tracking system (`useTracking`).

## Quick Migration

### Before (Individual Hooks)

```typescript
import { useGoogleAnalytics } from './hooks/useGoogleAnalytics';
import { useMetaCapi } from './hooks/useMetaCapi';

const { trackFormStart: gaStart, trackFormSubmit: gaSubmit, clientId } = useGoogleAnalytics();
const { trackFormStart: metaStart, trackFormSubmit: metaSubmit } = useMetaCapi();

// Had to call both platforms manually
const handleFormStart = () => {
  gaStart();
  metaStart();
};

const handleFormSubmit = (area: string) => {
  gaSubmit(area);
  metaSubmit(area);
};
```

### After (Unified Hook)

```typescript
import { useTracking } from './hooks/useTracking';

const { trackFormStart, trackFormSubmit, clientId } = useTracking();

// Single call handles all platforms automatically
const handleFormStart = () => {
  trackFormStart(); // Tracks to GA + Meta + any future platforms
};

const handleFormSubmit = (area: string) => {
  trackFormSubmit(area); // Tracks to GA + Meta + any future platforms
};
```

## Benefits of Migration

### ✅ **Simpler Code**

- Single import instead of multiple
- Single function call instead of multiple
- Consistent interface across all platforms

### ✅ **Automatic Event IDs**

- Every event gets a unique ID
- Same ID used across all platforms
- Perfect for cross-platform correlation

### ✅ **Unified Error Handling**

- All platforms handled consistently
- Failures don't affect each other
- Comprehensive error logging

### ✅ **Future-Proof**

- Easy to add new tracking platforms
- No code changes needed in components
- Centralized platform management

## Method Mapping

| Old Method | New Method | Platforms |
|------------|------------|-----------|
| `gaHook.trackFormStart()` + `metaHook.trackFormStart()` | `trackFormStart()` | GA + Meta |
| `gaHook.trackFormSubmit()` + `metaHook.trackFormSubmit()` | `trackFormSubmit()` | GA + Meta |
| `gaHook.trackPageView()` + `metaHook.trackPageView()` | `trackPageView()` | GA + Meta |
| `gaHook.sendClientEvent()` + `metaHook.sendClientEvent()` | `trackEvent()` | GA + Meta |

## Server-Side Changes

### Before

```typescript
import { trackGALead } from '../lib/google-analytics';
import { trackMetaCapiLead } from '../lib/meta-capi';

// Had to call each platform separately
await trackGALead(formData, clientId);
await trackMetaCapiLead(formData, clientId);
```

### After

```typescript
import { trackServerLead } from '../lib/unified-server-tracking';

// Single call handles all platforms
const { eventId, results } = await trackServerLead(formData, clientId);
// Results: { "Google Analytics": true, "Meta CAPI": true }
```

## Event Correlation

### New Event Structure

Every event now includes:

```typescript
{
  id: "evt_1703123456789_abc123",     // Unique event ID
  type: "form_submit",                // Event type
  timestamp: 1703123456,              // Unix timestamp  
  session_id: "session_123_xyz",      // Session ID
  client_id: "GA1.1.abc123.456789",   // Client ID
  data: { /* event-specific data */ } // Event data
}
```

### Cross-Platform Benefits

- **Same Event ID**: Correlate events across GA and Meta
- **Session Tracking**: Track user sessions across platforms
- **Attribution**: Understand cross-platform user journeys

## Testing Migration

### 1. Component Level

```typescript
// Test that unified hook works
const { trackFormStart, trackFormSubmit, isInitialized } = useTracking();

console.log('Tracking initialized:', isInitialized);
console.log('Enabled platforms:', enabledPlatforms);

// Test tracking
trackFormStart(); // Should log events for all platforms
```

### 2. Server Level

```typescript
// Test server-side tracking
const result = await trackServerLead(testFormData, testClientId);
console.log('Tracking results:', result);
// Should show: { eventId: "evt_...", results: { "Google Analytics": true, "Meta CAPI": true } }
```

### 3. Event Verification

- Check browser console for tracking logs
- Verify events appear in GA Real-Time reports
- Verify events appear in Meta Events Manager
- Confirm same event IDs appear in both platforms

## Cleanup

After successful migration, you can remove:

### ✅ **Old Hook Files**

- `components/hooks/useGoogleAnalytics.ts`
- `components/hooks/useMetaCapi.ts`

### ✅ **Old Server Libraries** (logic moved to platform adapters)

- Individual GA/Meta server functions if no longer needed

### ✅ **Old API Routes** (if using new unified platform adapters)

- Platform-specific API routes can be simplified

## Rollback Plan

If needed, you can rollback by:

1. Reverting component imports to old hooks
2. Restoring individual platform calls
3. Keeping new unified system alongside old for testing

## Support

The new unified system is fully backward compatible and provides the same functionality as the individual hooks, plus:

- Better event correlation
- Simplified maintenance
- Future platform scalability
- Enhanced error handling
