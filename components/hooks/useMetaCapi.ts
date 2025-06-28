import { useCallback } from 'react';

// Extend the Window interface to include fbq
declare global {
	interface Window {
		fbq?: (...args: unknown[]) => void;
	}
}

interface CapiEventData {
	event_name: string;
	custom_data?: Record<string, string | number | boolean>;
	user_data?: {
		em?: string; // email (hashed)
		ph?: string; // phone (hashed)
		fbc?: string; // Facebook click ID
		fbp?: string; // Facebook browser ID
	};
}

export const useMetaCapi = () => {
	const sendEvent = useCallback(async (eventData: CapiEventData) => {
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
			console.error('Error sending CAPI event:', error);
			throw error;
		}
	}, []);

	const trackPageView = useCallback(() => {
		return sendEvent({
			event_name: 'PageView',
		});
	}, [sendEvent]);

	const trackPurchase = useCallback((value: number, currency: string = 'USD', content_ids?: string[]) => {
		return sendEvent({
			event_name: 'Purchase',
			custom_data: {
				value,
				currency,
				content_ids: content_ids?.join(',') || '',
			},
		});
	}, [sendEvent]);

	const trackLead = useCallback((custom_data?: Record<string, string | number | boolean>) => {
		return sendEvent({
			event_name: 'Lead',
			custom_data,
		});
	}, [sendEvent]);

	const trackAddToCart = useCallback((value?: number, currency: string = 'USD', content_ids?: string[]) => {
		return sendEvent({
			event_name: 'AddToCart',
			custom_data: {
				value: value || 0,
				currency,
				content_ids: content_ids?.join(',') || '',
			},
		});
	}, [sendEvent]);

	return {
		sendEvent,
		trackPageView,
		trackPurchase,
		trackLead,
		trackAddToCart,
	};
};

// Utility function to hash email or phone for privacy
export const hashUserData = async (data: string): Promise<string> => {
	const encoder = new TextEncoder();
	const dataBuffer = encoder.encode(data.toLowerCase().trim());
	const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};
