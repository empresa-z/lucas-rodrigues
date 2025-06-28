interface FormData {
	name: string;
	email: string;
	phone: string;
	area: string;
}

// Hash function for server-side use
async function hashUserData(data: string): Promise<string> {
	const encoder = new TextEncoder();
	const dataBuffer = encoder.encode(data.toLowerCase().trim());
	const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Server action for form submission
export async function submitContactForm(formData: FormData) {
	'use server';

	const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

	if (!webhookUrl) {
		throw new Error('Webhook URL não configurada.');
	}

	try {
		// Submit to webhook
		const webhookResponse = await fetch(webhookUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		});

		if (!webhookResponse.ok) {
			throw new Error('Falha no envio do formulário.');
		}

		// Track with Meta CAPI server-side
		await trackLeadConversion(formData);

		return { success: true };
	} catch (error) {
		console.error('Form submission error:', error);
		throw error;
	}
}

// Server-side CAPI tracking
async function trackLeadConversion(formData: FormData) {
	const PIXEL_ID = '1501515817485128';
	const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

	if (!ACCESS_TOKEN) {
		console.error('META_CAPI_ACCESS_TOKEN is not configured');
		return;
	}

	try {
		// Hash email for privacy compliance
		const hashedEmail = await hashUserData(formData.email);

		const eventData = {
			event_name: 'Lead',
			event_time: Math.floor(Date.now() / 1000),
			action_source: 'website',
			user_data: {
				em: hashedEmail,
			},
			custom_data: {
				content_name: 'Contact Form Lead',
				source: 'website',
				content_category: formData.area || 'General',
				value: 1,
				currency: 'BRL',
			},
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

		const capiResult = await capiResponse.json();

		if (!capiResponse.ok) {
			console.error('CAPI Error:', capiResult);
		} else {
			console.log('Lead tracked successfully with Meta CAPI');
		}
	} catch (error) {
		console.error('Failed to track lead with CAPI:', error);
		// Don't throw error to avoid blocking form submission
	}
}

// Generate WhatsApp URL
export function generateWhatsAppUrl(formData: FormData): string {
	const areaMessage = formData.area ? `\n\nÁrea de interesse: ${formData.area}` : '';
	const message = `Olá! Acabei de preencher o formulário. ${areaMessage}`;
	return `https://wa.me/5521993254504?text=${encodeURIComponent(message)}`;
}
