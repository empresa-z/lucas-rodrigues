# Google Analytics Measurement Protocol Implementation

This project includes a complete implementation of Google Analytics Measurement Protocol (GA4) with both client-side and server-side tracking to complement the existing Meta CAPI implementation.

## Architecture Overview

The implementation follows Next.js best practices with dual tracking:

### Server-Side Components

- **Google Analytics Utility** (`/app/lib/google-analytics.ts`) - Server-side GA4 Measurement Protocol
- **Form Actions** (`/app/actions/form-actions.ts`) - Integrated server-side lead tracking
- **API Routes** (`/app/api/google-analytics/route.ts`) - Handle client-to-server GA events

### Client-Side Components

- **GA Hook** (`/components/hooks/useGoogleAnalytics.ts`) - Client-side GA tracking with dual sending
- **Page View Tracker** (`/components/PageViewTracker.tsx`) - Automatic page view tracking
- **Form Integration** - Form start and submission tracking

## Setup

### 1. Environment Variables

The Google Analytics token is already configured in `.env`:

```bash
GOOGLE_ANALYTICS_TOKEN=ShnswOILRvGjzdMI4vemtg
```

### 2. Measurement ID

The implementation uses your existing Google Ads measurement ID: `AW-17200702425`

## Implementation Details

### Lead Tracking Flow

1. **Form Start**: Tracked when user first focuses on form (client-side)
2. **Form Submit**: Tracked when user submits form (client-side)
3. **Lead Conversion**: Tracked on successful submission (server-side)

### Event Mapping

| Event | GA4 Event Name | When Triggered | Parameters |
|-------|----------------|----------------|------------|
| Page View | `page_view` | Page load | `page_location`, `page_title` |
| Form Start | `begin_checkout` | First form interaction | `currency`, `value`, `form_name` |
| Form Submit | `purchase` | Form submission | `currency`, `value`, `transaction_id`, `interest_area` |
| Lead Generation | `generate_lead` | Server-side on success | `currency`, `value`, `source`, `campaign` |

### Dual Tracking Benefits

1. **Client-Side (gtag)**: Real-time tracking, session continuity
2. **Server-Side (Measurement Protocol)**: Ad-blocker resistant, server validation

## Usage Examples

### Basic Hook Usage

```tsx
import { useGoogleAnalytics } from '@/components/hooks/useGoogleAnalytics';

const MyComponent = () => {
  const { trackEvent, trackConversion } = useGoogleAnalytics();

  const handleCustomEvent = () => {
    trackEvent({
      event_name: 'custom_event',
      parameters: {
        category: 'engagement',
        value: 1,
      },
    });
  };

  const handleConversion = () => {
    trackConversion('consultation_booked', 150);
  };
};
```

### Page View Tracking

```tsx
import { PageViewTracker } from '@/components/PageViewTracker';

export default function MyPage() {
  return (
    <div>
      <PageViewTracker pageTitle="Custom Page Title" />
      {/* Your page content */}
    </div>
  );
}
```

### Server-Side Tracking

```tsx
import { trackGAEvent } from '@/app/lib/google-analytics';

// In a server action or API route
await trackGAEvent(
  {
    name: 'custom_conversion',
    parameters: {
      value: 100,
      currency: 'BRL',
    },
  },
  {
    client_id: 'GA1.1.123456789.123456789',
  }
);
```

## Available Methods

### Client-Side Hook (`useGoogleAnalytics`)

- `trackEvent(eventData)` - Send custom events (dual tracking)
- `trackPageView(url?, title?)` - Track page views
- `trackFormStart()` - Track form interaction start
- `trackFormSubmit(area?)` - Track form submission
- `trackConversion(name, value?)` - Track custom conversions
- `sendClientEvent(eventData)` - Send only to client-side GA
- `sendServerEvent(eventData)` - Send only to server-side GA

### Server-Side Utilities

- `trackGAEvent(event, userData, sessionId?)` - Generic event tracking
- `trackGALead(formData)` - Lead-specific tracking
- `trackGAPageView(url, title, clientId)` - Page view tracking

## Data Flow

### Client-Side Events

1. User action triggers event
2. Event sent to client-side GA (gtag) immediately
3. Event sent to server-side API route
4. API route forwards to GA Measurement Protocol

### Server-Side Events

1. Server action triggered (form submission)
2. Direct call to GA Measurement Protocol
3. Enhanced with server-side data (IP, user agent)

## Privacy & Compliance

- **Client ID Management**: Stored in localStorage for session continuity
- **No PII Transmission**: Only hashed/anonymized data sent to GA
- **GDPR Compliant**: Respects user consent preferences
- **Ad-Blocker Resilient**: Server-side tracking continues even if client-side is blocked

## Integration with Meta CAPI

Both tracking systems work in parallel:

1. **Form Submission**: Triggers both GA and Meta CAPI tracking
2. **Event Correlation**: Same client ID used for cross-platform attribution
3. **Redundant Tracking**: If one system fails, the other continues
4. **Enhanced Attribution**: Multiple data sources for better insights

## Debugging

### Development Mode

Events are logged to console:

- `GA client event sent: event_name`
- `GA server event sent: event_name`
- `GA event tracked successfully: event_name`

### GA4 DebugView

Use GA4 DebugView to monitor events in real-time during development.

### Server Logs

Check Next.js server logs for GA Measurement Protocol responses.

## File Structure

```
app/
├── lib/
│   └── google-analytics.ts     # Server-side GA utilities
├── actions/
│   └── form-actions.ts         # Server actions with GA tracking
└── api/
    └── google-analytics/
        └── route.ts            # Client-to-server GA proxy

components/
├── hooks/
│   └── useGoogleAnalytics.ts   # Client-side GA hook
├── PageViewTracker.tsx         # Automatic page tracking
└── form.tsx                    # Form with GA integration
```

## Benefits

1. **Comprehensive Tracking**: Both client and server-side events
2. **Ad-Blocker Resistant**: Server-side tracking continues regardless
3. **Enhanced Attribution**: Multiple touchpoints tracked
4. **Performance Optimized**: Non-blocking event sending
5. **Privacy Compliant**: No sensitive data transmitted
6. **Easy Integration**: Simple hooks and components
7. **Scalable**: Can be extended for any GA4 event

For more information, see the [GA4 Measurement Protocol documentation](https://developers.google.com/analytics/devguides/collection/protocol/ga4).
