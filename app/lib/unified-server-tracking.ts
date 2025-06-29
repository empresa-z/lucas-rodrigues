// Server-side unified tracking for form submissions and other server actions

import { trackGALead } from './google-analytics';
import { trackMetaCapiLead } from './meta-capi';
import { generateEventId } from './tracking/core/event-manager';

interface FormData {
	name: string;
	email: string;
	phone: string;
	area: string;
}

// Unified server-side tracking function
export async function trackServerEvent(
	eventType: string,
	formData: FormData,
	clientId?: string
): Promise<{ eventId: string; results: Record<string, boolean> }> {
	const eventId = generateEventId();
	const results: Record<string, boolean> = {};

	console.log(`[Unified Tracking] Starting server-side tracking for ${eventType} with event ID: ${eventId}`);

	// Track with all platforms in parallel
	const trackingPromises = [];

	// Google Analytics tracking
	trackingPromises.push(
		trackGALead(formData, clientId)
			.then(() => {
				results['Google Analytics'] = true;
				console.log(`[Unified Tracking] Google Analytics: ${eventType} tracked successfully`);
				return true;
			})
			.catch((error: unknown) => {
				console.error(`[Unified Tracking] Google Analytics: Failed to track ${eventType}:`, error);
				results['Google Analytics'] = false;
				return false;
			})
	);

	// Meta CAPI tracking
	trackingPromises.push(
		trackMetaCapiLead(formData, clientId)
			.then(() => {
				results['Meta CAPI'] = true;
				console.log(`[Unified Tracking] Meta CAPI: ${eventType} tracked successfully`);
				return true;
			})
			.catch((error: unknown) => {
				console.error(`[Unified Tracking] Meta CAPI: Failed to track ${eventType}:`, error);
				results['Meta CAPI'] = false;
				return false;
			})
	);

	// Wait for all tracking to complete
	await Promise.allSettled(trackingPromises);

	console.log(`[Unified Tracking] Server-side tracking completed for event ${eventId}:`, results);

	return { eventId, results };
}

// Specific lead tracking function
export async function trackServerLead(
	formData: FormData,
	clientId?: string
): Promise<{ eventId: string; results: Record<string, boolean> }> {
	return trackServerEvent('lead', formData, clientId);
}
