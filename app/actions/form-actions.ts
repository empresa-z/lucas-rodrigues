import { trackServerLead } from '../lib/unified-server-tracking';

interface FormData {
	name: string;
	email: string;
	phone: string;
	area: string;
}

// Server action for form submission
export async function submitContactForm(formData: FormData, clientId?: string) {
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

		// Track with unified server-side tracking (handles all platforms)
		const trackingResult = await trackServerLead(formData, clientId);
		console.log('Server-side tracking completed:', trackingResult);

		return { success: true };
	} catch (error) {
		console.error('Form submission error:', error);
		throw error;
	}
}

// Generate WhatsApp URL
export function generateWhatsAppUrl(formData: FormData): string {
	const areaMessage = formData.area ? `\n\nÁrea de interesse: ${formData.area}` : '';
	const message = `Olá! Acabei de preencher o formulário. ${areaMessage}`;
	return `https://wa.me/5521993254504?text=${encodeURIComponent(message)}`;
}
