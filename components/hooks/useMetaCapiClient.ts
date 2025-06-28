import { useCallback } from 'react';

// Extend the Window interface to include fbq
declare global {
	interface Window {
		fbq?: (...args: unknown[]) => void;
	}
}

interface ClientCapiEventData {
	event_name: string;
	custom_data?: Record<string, string | number | boolean>;
	user_data?: {
		fbc?: string; // Facebook click ID
		fbp?: string; // Facebook browser ID
	};
}

export const useMetaCapi = () => {
	const sendClientEvent = useCallback(async (eventData: ClientCapiEventData) => {
		try {
			// Get Facebook pixel data if available
			const fbp = typeof window !== 'undefined' && window.fbq ?
				document.cookie.split('; ').find(row => row.startsWith('_fbp='))?.split('=')[1] : undefined;

			const fbc = typeof window !== 'undefined' && window.fbq ?
				document.cookie.split('; ').find(row => row.startsWith('_fbc='))?.split('=')[1] : undefined;

			const response = await fetch('/api/meta-capi', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...eventData,
					user_data: {
						...eventData.user_data,
						fbp: fbp,
						fbc: fbc,
					}
				}),
			});

			if (!response.ok) {
				throw new Error(`CAPI request failed: ${response.statusText}`);
			}

			const result = await response.json();
			return result;
		} catch (error) {
			console.error('Error sending client CAPI event:', error);
			throw error;
		}
	}, []);

	const trackPageView = useCallback(() => {
		return sendClientEvent({
			event_name: 'PageView',
		});
	}, [sendClientEvent]);

	const trackAddToCart = useCallback((value?: number, currency: string = 'USD', content_ids?: string[]) => {
		return sendClientEvent({
			event_name: 'AddToCart',
			custom_data: {
				value: value || 0,
				currency,
				content_ids: content_ids?.join(',') || '',
			},
		});
	}, [sendClientEvent]);

	return {
		sendClientEvent,
		trackPageView,
		trackAddToCart,
	};
};
