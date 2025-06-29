interface GAEvent {
	name: string;
	parameters?: Record<string, string | number | boolean>;
}

interface GAUserData {
	client_id: string;
	user_properties?: Record<string, { value: string | number | boolean }>;
}

// Generate a client ID (should be stored in session/localStorage in real app)
export function generateClientId(): string {
	return 'GA1.1.' + Math.random().toString(36).substring(2, 15) + '.' + Date.now();
}

// Server-side Google Analytics Measurement Protocol
export async function trackGAEvent(
	event: GAEvent,
	userData: GAUserData,
	sessionId?: string
): Promise<boolean> {
	const GA_MEASUREMENT_ID = 'AW-17200702425'; // From your Google Ads tag
	const GA_API_SECRET = process.env.GOOGLE_ANALYTICS_TOKEN;

	if (!GA_API_SECRET) {
		console.error('GOOGLE_ANALYTICS_TOKEN is not configured');
		return false;
	}

	try {
		const payload = {
			client_id: userData.client_id,
			user_properties: userData.user_properties,
			events: [
				{
					name: event.name,
					params: {
						session_id: sessionId || `session_${Date.now()}`,
						engagement_time_msec: 1000,
						...event.parameters,
					},
				},
			],
		};

		const response = await fetch(
			`https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			}
		);

		if (response.ok) {
			console.log('GA event tracked successfully:', event.name);
			return true;
		} else {
			console.error('GA tracking failed:', response.status, response.statusText);
			return false;
		}
	} catch (error) {
		console.error('GA tracking error:', error);
		return false;
	}
}

// Server-side lead tracking for GA
export async function trackGALead(formData: {
	name: string;
	email: string;
	phone: string;
	area: string;
}, clientId?: string): Promise<void> {
	try {
		// Use provided client ID or generate a new one
		const useClientId = clientId || generateClientId();

		await trackGAEvent(
			{
				name: 'generate_lead',
				parameters: {
					currency: 'BRL',
					value: 1,
					source: 'website',
					medium: 'form',
					campaign: 'contact_form',
					content: formData.area || 'general',
					form_name: 'contact_form',
					lead_type: 'psychology_consultation',
				},
			},
			{
				client_id: useClientId,
				user_properties: {
					interest_area: { value: formData.area || 'general' },
					form_completed: { value: true },
				},
			}
		);
	} catch (error) {
		console.error('Failed to track GA lead:', error);
		// Don't throw error to avoid blocking form submission
	}
}

// Server-side page view tracking
export async function trackGAPageView(
	pageUrl: string,
	pageTitle: string,
	clientId: string
): Promise<void> {
	try {
		await trackGAEvent(
			{
				name: 'page_view',
				parameters: {
					page_location: pageUrl,
					page_title: pageTitle,
				},
			},
			{
				client_id: clientId,
			}
		);
	} catch (error) {
		console.error('Failed to track GA page view:', error);
	}
}
