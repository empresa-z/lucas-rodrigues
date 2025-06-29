# Architecture Consistency Review: Google Analytics vs Meta CAPI

## Summary

Both Google Analytics and Meta CAPI implementations now follow consistent patterns and practices across server-side and client-side tracking.

## Architecture Comparison

### ✅ **Server-Side Libraries**

Both implementations have dedicated server-side libraries with consistent patterns:

**Google Analytics**: `app/lib/google-analytics.ts`

- `trackGAEvent()` - Generic event tracking
- `trackGALead()` - Lead conversion tracking  
- `trackGAPageView()` - Page view tracking

**Meta CAPI**: `app/lib/meta-capi.ts`

- `trackMetaCapiEvent()` - Generic event tracking
- `trackMetaCapiLead()` - Lead conversion tracking
- `trackMetaCapiPageView()` - Page view tracking

### ✅ **Client-Side Hooks**

Both hooks provide identical interfaces and patterns:

**Google Analytics**: `components/hooks/useGoogleAnalytics.ts`

- `trackEvent()` - Send events to both client and server
- `trackPageView()` - Track page views
- `trackFormStart()` - Track form funnel start
- `trackFormSubmit()` - Track form completion
- `sendClientEvent()` - Client-side only
- `sendServerEvent()` - Server-side only

**Meta CAPI**: `components/hooks/useMetaCapi.ts`

- `trackEvent()` - Send events to both client and server
- `trackPageView()` - Track page views  
- `trackFormStart()` - Track form funnel start
- `trackFormSubmit()` - Track form completion
- `sendClientEvent()` - Client-side only
- `sendServerEvent()` - Server-side only

### ✅ **API Routes**

Both API routes follow the same pattern for proxying client-side events:

**Google Analytics**: `app/api/google-analytics/route.ts`

- Receives client-side events
- Uses `trackGAEvent()` from server library
- Returns consistent success/error responses

**Meta CAPI**: `app/api/meta-capi/route.ts`  

- Receives client-side events
- Uses `trackMetaCapiEvent()` from server library
- Returns consistent success/error responses

### ✅ **Server Actions**

Form submission uses both tracking systems with client ID correlation:

**Form Actions**: `app/actions/form-actions.ts`

- `trackGALead(formData, clientId)` - GA server-side tracking
- `trackMetaCapiLead(formData, clientId)` - Meta server-side tracking
- Both receive the same form data and client ID for correlation

### ✅ **Client ID Management**

Both implementations use the same client ID generation and storage:

- Same client ID format: `'GA1.1.' + random + timestamp`
- Stored in localStorage as `'ga_client_id'`
- Used for correlation between client/server events
- Shared between both tracking systems

### ✅ **Error Handling**

Consistent error handling patterns across both systems:

- Server functions return boolean success indicators
- Client hooks handle errors gracefully without throwing
- API routes return standardized error responses
- Form submission is never blocked by tracking failures

### ✅ **Privacy Compliance**

Both systems implement privacy best practices:

**Google Analytics**:

- Uses proper client ID correlation
- No PII in event parameters

**Meta CAPI**:

- Email hashing with SHA-256
- Client ID correlation via custom data
- No plain text PII sent to Meta

### ✅ **Event Structure**

Both systems use similar event parameter structures:

**Common Parameters**:

- `currency: 'BRL'`
- `value: 1`
- `source: 'website'`
- `form_name: 'contact_form'`
- Content/category information

### ✅ **Form Integration**

Both tracking systems are integrated consistently in the form component:

**Form Start Tracking**:

- `trackFormStart()` - GA
- `trackMetaFormStart()` - Meta

**Form Submit Tracking**:

- `trackFormSubmit(area)` - GA  
- `trackMetaFormSubmit(area)` - Meta

**Server-Side Tracking**:

- Both triggered from server action with client ID correlation

### ✅ **Page View Tracking**

Page view tracking is consistent across both systems:

**PageViewTracker Component**:

- Uses both `trackGAPageView()` and `trackMetaPageView()`
- Same parameters passed to both
- Triggers simultaneously on component mount

## Key Improvements Made

1. **Created dedicated Meta CAPI server library** to match GA structure
2. **Unified hook interfaces** with identical method names and patterns
3. **Added form funnel tracking** to Meta hook (trackFormStart, trackFormSubmit)
4. **Implemented client ID correlation** for both systems
5. **Standardized error handling** across all implementations
6. **Unified API route patterns** for both tracking systems
7. **Consistent privacy practices** with appropriate data handling
8. **Synchronized event structures** for better correlation

## Architecture Benefits

✅ **Maintainability**: Both systems follow identical patterns
✅ **Scalability**: Easy to add new tracking systems using same patterns  
✅ **Reliability**: Consistent error handling prevents tracking failures from affecting UX
✅ **Privacy**: Both systems implement appropriate privacy protections
✅ **Correlation**: Client IDs enable cross-platform attribution analysis
✅ **Testing**: Identical interfaces make testing and validation easier

Both implementations now provide a unified, robust, and privacy-compliant dual tracking architecture that follows industry best practices.
