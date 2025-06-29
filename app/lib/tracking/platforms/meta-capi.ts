import { BasePlatform } from './base-platform';
import { UnifiedEvent } from '../core/types';

export class MetaCapiPlatform extends BasePlatform {
	name = 'Meta CAPI';
	enabled = true;

	private PIXEL_ID = '1501515817485128';
	private ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

	async trackEvent(event: UnifiedEvent): Promise<boolean> {
		if (!this.validateEvent(event)) {
			this.logError('Invalid event structure');
			return false;
		}

		// For client-side, use Meta Pixel if available
		if (typeof window !== 'undefined' && window.fbq) {
			this.trackClientSide(event);
		}

		// For server-side or API proxy
		return this.trackServerSide(event);
	}

	async trackPageView(event: UnifiedEvent): Promise<boolean> {
		const pageViewEvent: UnifiedEvent = {
			...event,
			type: 'page_view',
		};
		return this.trackEvent(pageViewEvent);
	}

	async trackFormEvent(event: UnifiedEvent): Promise<boolean> {
		// Map form events to Meta events
		const metaEventName = this.mapFormEventToMeta(event.type);
		const formEvent: UnifiedEvent = {
			...event,
			data: {
				...event.data,
				meta_event_name: metaEventName,
			},
		};
		return this.trackEvent(formEvent);
	}

	private trackClientSide(event: UnifiedEvent): void {
		if (typeof window !== 'undefined' && window.fbq) {
			const eventName = this.getMetaEventName(event);
			const eventData = {
				event_id: event.id,
				...event.data,
			};

			window.fbq('track', eventName, eventData);
			this.log(`Client-side event tracked: ${eventName}`);
		}
	}

	private async trackServerSide(event: UnifiedEvent): Promise<boolean> {
		if (!this.ACCESS_TOKEN) {
			this.logError('META_CAPI_ACCESS_TOKEN is not configured');
			return false;
		}

		const result = await this.safeExecute(async () => {
			// Hash email if present for privacy
			const userData = await this.prepareUserData(event);

			const eventData = {
				event_name: this.getMetaEventName(event),
				event_time: event.timestamp,
				event_id: event.id,
				action_source: 'website',
				user_data: userData,
				custom_data: {
					...event.data,
					correlation_id: event.client_id, // For cross-platform correlation
				},
			};

			const response = await fetch(
				`https://graph.facebook.com/v19.0/${this.PIXEL_ID}/events?access_token=${this.ACCESS_TOKEN}`,
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

			if (response.ok) {
				this.log(`Server-side event tracked: ${event.type}`);
				return true;
			} else {
				const errorResult = await response.json();
				this.logError(`Server-side tracking failed: ${response.status}`, errorResult);
				return false;
			}
		}, 'Server-side tracking');

		return result !== null;
	}

	private async prepareUserData(event: UnifiedEvent): Promise<Record<string, string>> {
		const userData: Record<string, string> = {};

		// Hash email if present
		if (event.data.email && typeof event.data.email === 'string') {
			userData.em = await this.hashUserData(event.data.email);
		}

		// Hash phone if present
		if (event.data.phone && typeof event.data.phone === 'string') {
			userData.ph = await this.hashUserData(event.data.phone);
		}

		return userData;
	}

	private async hashUserData(data: string): Promise<string> {
		const encoder = new TextEncoder();
		const dataBuffer = encoder.encode(data.toLowerCase().trim());
		const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
	}

	private getMetaEventName(event: UnifiedEvent): string {
		// Map unified event types to Meta event names
		const eventMap: Record<string, string> = {
			page_view: 'PageView',
			form_start: 'InitiateCheckout',
			form_submit: 'Lead',
			lead: 'Lead',
			purchase: 'Purchase',
			add_to_cart: 'AddToCart',
		};

		return eventMap[event.type] || 'CustomEvent';
	}

	private mapFormEventToMeta(eventType: string): string {
		const formEventMap: Record<string, string> = {
			form_start: 'InitiateCheckout',
			form_submit: 'Lead',
		};

		return formEventMap[eventType] || eventType;
	}
}

// Extend global Window interface for Meta Pixel
declare global {
	interface Window {
		fbq?: (...args: unknown[]) => void;
		_fbq?: unknown;
	}
}
