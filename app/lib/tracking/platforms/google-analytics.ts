import { BasePlatform } from './base-platform';
import { UnifiedEvent } from '../core/types';

export class GoogleAnalyticsPlatform extends BasePlatform {
	name = 'Google Analytics';
	enabled = true;

	private GA_MEASUREMENT_ID = 'AW-17200702425';
	private GA_API_SECRET = process.env.GOOGLE_ANALYTICS_TOKEN;

	async trackEvent(event: UnifiedEvent): Promise<boolean> {
		if (!this.validateEvent(event)) {
			this.logError('Invalid event structure');
			return false;
		}

		// For client-side, use gtag if available
		if (typeof window !== 'undefined' && window.gtag) {
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
		// Map form events to GA events
		const gaEventName = this.mapFormEventToGA(event.type);
		const formEvent: UnifiedEvent = {
			...event,
			data: {
				...event.data,
				ga_event_name: gaEventName,
			},
		};
		return this.trackEvent(formEvent);
	}

	private trackClientSide(event: UnifiedEvent): void {
		if (typeof window !== 'undefined' && window.gtag) {
			const eventName = this.getGAEventName(event);
			window.gtag('event', eventName, {
				...event.data,
				event_id: event.id,
				session_id: event.session_id,
			});
			this.log(`Client-side event tracked: ${eventName}`);
		}
	}

	private async trackServerSide(event: UnifiedEvent): Promise<boolean> {
		if (!this.GA_API_SECRET) {
			this.logError('GOOGLE_ANALYTICS_TOKEN is not configured');
			return false;
		}

		const result = await this.safeExecute(async () => {
			const payload = {
				client_id: event.client_id,
				events: [
					{
						name: this.getGAEventName(event),
						params: {
							event_id: event.id,
							session_id: event.session_id,
							engagement_time_msec: 1000,
							...event.data,
						},
					},
				],
			};

			const response = await fetch(
				`https://www.google-analytics.com/mp/collect?measurement_id=${this.GA_MEASUREMENT_ID}&api_secret=${this.GA_API_SECRET}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload),
				}
			);

			if (response.ok) {
				this.log(`Server-side event tracked: ${event.type}`);
				return true;
			} else {
				this.logError(`Server-side tracking failed: ${response.status} ${response.statusText}`);
				return false;
			}
		}, 'Server-side tracking');

		return result !== null;
	}

	private getGAEventName(event: UnifiedEvent): string {
		// Map unified event types to GA event names
		const eventMap: Record<string, string> = {
			page_view: 'page_view',
			form_start: 'begin_checkout',
			form_submit: 'purchase',
			lead: 'generate_lead',
			purchase: 'purchase',
			add_to_cart: 'add_to_cart',
		};

		return eventMap[event.type] || event.type;
	}

	private mapFormEventToGA(eventType: string): string {
		const formEventMap: Record<string, string> = {
			form_start: 'begin_checkout',
			form_submit: 'purchase',
		};

		return formEventMap[eventType] || eventType;
	}
}

// Extend global Window interface for gtag
declare global {
	interface Window {
		gtag?: (...args: unknown[]) => void;
		dataLayer?: unknown[];
	}
}
