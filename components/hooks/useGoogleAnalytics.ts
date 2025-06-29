import { useCallback, useEffect, useState } from 'react';

// Extend the Window interface to include gtag
declare global {
	interface Window {
		gtag?: (...args: unknown[]) => void;
		dataLayer?: unknown[];
	}
}

interface GAClientEvent {
	event_name: string;
	parameters?: Record<string, string | number | boolean>;
}

export const useGoogleAnalytics = () => {
	const [clientId, setClientId] = useState<string>('');

	// Generate and store client ID
	useEffect(() => {
		const storedClientId = localStorage.getItem('ga_client_id');
		if (storedClientId) {
			setClientId(storedClientId);
		} else {
			const newClientId = 'GA1.1.' + Math.random().toString(36).substring(2, 15) + '.' + Date.now();
			localStorage.setItem('ga_client_id', newClientId);
			setClientId(newClientId);
		}
	}, []);

	// Send event to client-side GA (via gtag)
	const sendClientEvent = useCallback((eventData: GAClientEvent) => {
		if (typeof window !== 'undefined' && window.gtag) {
			window.gtag('event', eventData.event_name, eventData.parameters);
			console.log('GA client event sent:', eventData.event_name);
		}
	}, []);

	// Send event to server-side GA (via Measurement Protocol)
	const sendServerEvent = useCallback(async (eventData: GAClientEvent) => {
		try {
			const response = await fetch('/api/google-analytics', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...eventData,
					client_id: clientId,
				}),
			});

			if (!response.ok) {
				throw new Error(`GA server request failed: ${response.statusText}`);
			}

			console.log('GA server event sent:', eventData.event_name);
		} catch (error) {
			console.error('Error sending GA server event:', error);
		}
	}, [clientId]);

	// Send both client and server events
	const trackEvent = useCallback((eventData: GAClientEvent) => {
		// Send to client-side GA
		sendClientEvent(eventData);

		// Send to server-side GA
		if (clientId) {
			sendServerEvent(eventData);
		}
	}, [sendClientEvent, sendServerEvent, clientId]);

	// Track page view
	const trackPageView = useCallback((pageUrl?: string, pageTitle?: string) => {
		const url = pageUrl || window.location.href;
		const title = pageTitle || document.title;

		trackEvent({
			event_name: 'page_view',
			parameters: {
				page_location: url,
				page_title: title,
			},
		});
	}, [trackEvent]);

	// Track form start
	const trackFormStart = useCallback(() => {
		trackEvent({
			event_name: 'begin_checkout', // Using e-commerce event for lead funnel
			parameters: {
				currency: 'BRL',
				value: 1,
				form_name: 'contact_form',
			},
		});
	}, [trackEvent]);

	// Track form submission (client-side)
	const trackFormSubmit = useCallback((area?: string) => {
		trackEvent({
			event_name: 'purchase', // Using purchase for completed lead
			parameters: {
				currency: 'BRL',
				value: 1,
				transaction_id: `lead_${Date.now()}`,
				form_name: 'contact_form',
				interest_area: area || 'general',
			},
		});
	}, [trackEvent]);

	// Track custom conversion events
	const trackConversion = useCallback((conversionName: string, value?: number) => {
		trackEvent({
			event_name: conversionName,
			parameters: {
				currency: 'BRL',
				value: value || 1,
			},
		});
	}, [trackEvent]);

	return {
		clientId,
		trackEvent,
		trackPageView,
		trackFormStart,
		trackFormSubmit,
		trackConversion,
		sendClientEvent,
		sendServerEvent,
	};
};
