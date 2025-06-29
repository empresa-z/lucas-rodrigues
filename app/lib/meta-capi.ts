interface MetaCapiEvent {
	event_name: string;
	custom_data?: Record<string, string | number | boolean>;
	user_data?: {
		em?: string; // email (hashed)
		ph?: string; // phone (hashed)
		fbc?: string; // Facebook click ID
		fbp?: string; // Facebook browser ID
		client_ip_address?: string;
		client_user_agent?: string;
	};
}

// Hash function for server-side use
async function hashUserData(data: string): Promise<string> {
	const encoder = new TextEncoder();
	const dataBuffer = encoder.encode(data.toLowerCase().trim());
	const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Server-side Meta CAPI tracking
export async function trackMetaCapiEvent(
	event: MetaCapiEvent
): Promise<boolean> {
	const PIXEL_ID = '1501515817485128';
	const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

	if (!ACCESS_TOKEN) {
		console.error('META_CAPI_ACCESS_TOKEN is not configured');
		return false;
	}

	try {
		const eventData = {
			event_name: event.event_name,
			event_time: Math.floor(Date.now() / 1000),
			action_source: 'website',
			user_data: event.user_data || {},
			custom_data: event.custom_data || {},
		};

		// Send to Facebook Conversions API
		const capiResponse = await fetch(
			`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					data: [eventData],
					test_event_code: process.env.NODE_ENV === 'development' ? 'TEST12345' : undefined,
				}),
			}
		);

		if (capiResponse.ok) {
			console.log('Meta CAPI event tracked successfully:', event.event_name);
			return true;
		} else {
			const errorResult = await capiResponse.json();
			console.error('Meta CAPI tracking failed:', capiResponse.status, errorResult);
			return false;
		}
	} catch (error) {
		console.error('Meta CAPI tracking error:', error);
		return false;
	}
}

// Server-side lead tracking for Meta CAPI
export async function trackMetaCapiLead(formData: {
	name: string;
	email: string;
	phone: string;
	area: string;
}, clientId?: string): Promise<void> {
	try {
		// Hash email for privacy compliance
		const hashedEmail = await hashUserData(formData.email);

		await trackMetaCapiEvent({
			event_name: 'Lead',
			custom_data: {
				content_name: 'Contact Form Lead',
				source: 'website',
				content_category: formData.area || 'General',
				value: 1,
				currency: 'BRL',
				// Add client ID for correlation (as custom data since Meta doesn't have built-in client ID)
				...(clientId && { correlation_id: clientId }),
			},
			user_data: {
				em: hashedEmail,
			},
		});
	} catch (error) {
		console.error('Failed to track Meta CAPI lead:', error);
		// Don't throw error to avoid blocking form submission
	}
}

// Server-side page view tracking
export async function trackMetaCapiPageView(
	pageUrl: string,
	pageTitle: string,
	clientId?: string
): Promise<void> {
	try {
		await trackMetaCapiEvent({
			event_name: 'PageView',
			custom_data: {
				page_location: pageUrl,
				page_title: pageTitle,
				...(clientId && { correlation_id: clientId }),
			},
		});
	} catch (error) {
		console.error('Failed to track Meta CAPI page view:', error);
	}
}
