# Meta Conversions API (CAPI) Implementation - Refactored Architecture

This project includes a complete implementation of Facebook's Conversions API with proper separation of concerns between client-side and server-side code.

## Architecture Overview

The implementation follows Next.js best practices by separating client and server responsibilities:

### Server-Side Components

- **Server Actions** (`/app/actions/form-actions.ts`) - Handle form submission and server-side CAPI tracking
- **API Routes** (`/app/api/meta-capi/route.ts`) - Handle general CAPI requests from client-side

### Client-Side Components

- **Form Hook** (`/components/hooks/useContactForm.ts`) - Manages form state and submission flow
- **Meta CAPI Hook** (`/components/hooks/useMetaCapiClient.ts`) - Handles client-side tracking events
- **WhatsApp Redirect** (`/components/WhatsAppRedirect.tsx`) - Manages post-submission redirect logic
- **Contact Form** (`/components/form.tsx`) - Main form component with clean separation

## Setup

### 1. Environment Variables

Add your Facebook CAPI access token to the `.env` file:

```bash
META_CAPI_ACCESS_TOKEN=your_facebook_capi_access_token_here
NEXT_PUBLIC_N8N_WEBHOOK_URL=your_webhook_url_here
```

### 2. Getting Your CAPI Access Token

1. Go to [Facebook Business Manager](https://business.facebook.com/)
2. Navigate to Events Manager
3. Select your pixel (ID: 1501515817485128)
4. Go to Settings > Conversions API
5. Generate a new access token or use an existing one

## Implementation Details

### Form Submission Flow

1. **Client-side**: User fills and submits form
2. **Server Action**: `submitContactForm` handles:
   - Webhook submission to n8n
   - Server-side CAPI lead tracking with hashed email
   - Returns success/error status
3. **Client-side**: On success, triggers WhatsApp redirect

### Server Action Benefits

- **Privacy Compliant**: Email hashing happens server-side
- **Reliable Tracking**: Server-side CAPI calls are not blocked by ad blockers
- **Better Performance**: No client-side API calls for lead tracking
- **Proper Error Handling**: Server errors don't affect user experience

### Client-Side Hook Usage

For additional client-side tracking (page views, add to cart, etc.):

```tsx
import { useMetaCapi } from '@/components/hooks/useMetaCapiClient';

const MyComponent = () => {
  const { trackPageView, trackAddToCart } = useMetaCapi();

  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  const handleAddToCart = async () => {
    await trackAddToCart(99.99, 'USD', ['product-123']);
  };
};
```

### Server Action Usage

The form automatically uses the server action, but you can use it directly:

```tsx
import { submitContactForm } from '@/app/actions/form-actions';

const formData = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  area: 'Ansiedade'
};

try {
  await submitContactForm(formData);
  console.log('Form submitted successfully');
} catch (error) {
  console.error('Form submission failed:', error);
}
```

## Features

### Server-Side Features

- **Automatic CAPI Lead Tracking**: Integrated with form submission
- **Privacy Compliant**: Server-side email hashing
- **Webhook Integration**: Seamless n8n integration
- **Error Resilience**: CAPI failures don't block form submission

### Client-Side Features

- **Form State Management**: React Transitions for optimal UX
- **WhatsApp Integration**: Automatic redirect with form data
- **Additional Tracking**: Page views and custom events
- **Facebook Pixel Integration**: Automatic fbp/fbc cookie inclusion

## File Structure

```
app/
├── actions/
│   └── form-actions.ts          # Server actions for form & CAPI
└── api/
    └── meta-capi/
        └── route.ts             # API route for client-side CAPI

components/
├── hooks/
│   ├── useContactForm.ts        # Client-side form state management
│   └── useMetaCapiClient.ts     # Client-side CAPI tracking
├── form.tsx                     # Main contact form component
└── WhatsAppRedirect.tsx         # WhatsApp redirect logic
```

## Benefits of This Architecture

1. **Separation of Concerns**: Clear distinction between client and server logic
2. **Better Performance**: Server actions reduce client-side complexity
3. **Improved Privacy**: Sensitive operations happen server-side
4. **Enhanced Reliability**: Server-side tracking is more reliable
5. **Next.js Best Practices**: Uses React Server Components and Server Actions
6. **Type Safety**: Full TypeScript support throughout

## Testing

In development mode, server-side CAPI events include test event codes. Monitor these in Facebook Events Manager under "Test Events".

## Troubleshooting

1. **Form not submitting**: Check server action errors in Next.js console
2. **CAPI events not appearing**: Verify access token and pixel ID
3. **WhatsApp redirect not working**: Check browser console for JavaScript errors
4. **Webhook failures**: Verify n8n webhook URL in environment variables

For more information, see the [Facebook Conversions API documentation](https://developers.facebook.com/docs/marketing-api/conversions-api/).
