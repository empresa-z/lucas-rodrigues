import { useCallback, useEffect, useState } from 'react';

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
	const [clientId, setClientId] = useState<string>('');

	// Generate and store client ID (correlate with GA)
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

	// Send event to client-side Meta Pixel (via fbq)
	const sendClientEvent = useCallback((eventData: CapiEventData) => {
		if (typeof window !== 'undefined' && window.fbq) {
			window.fbq('track', eventData.event_name, eventData.custom_data);
			console.log('Meta client event sent:', eventData.event_name);
		}
	}, []);

	// Send event to server-side Meta CAPI
	const sendServerEvent = useCallback(async (eventData: CapiEventData) => {
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

			console.log('Meta server event sent:', eventData.event_name);
		} catch (error) {
			console.error('Error sending Meta server event:', error);
		}
	}, []);

	// Send both client and server events (matching GA pattern)
	const trackEvent = useCallback((eventData: CapiEventData) => {
		// Send to client-side Meta Pixel
		sendClientEvent(eventData);

		// Send to server-side CAPI
		if (clientId) {
			sendServerEvent(eventData);
		}
	}, [sendClientEvent, sendServerEvent, clientId]);

	// Track page view
	const trackPageView = useCallback((pageUrl?: string, pageTitle?: string) => {
		const url = pageUrl || window.location.href;
		const title = pageTitle || document.title;

		trackEvent({
			event_name: 'PageView',
			custom_data: {
				page_location: url,
				page_title: title,
			},
		});
	}, [trackEvent]);

	// Track purchase
	const trackPurchase = useCallback((value: number, currency: string = 'BRL', content_ids?: string[]) => {
		trackEvent({
			event_name: 'Purchase',
			custom_data: {
				value,
				currency,
				content_ids: content_ids?.join(',') || '',
			},
		});
	}, [trackEvent]);

	// Track lead conversion
	const trackLead = useCallback((custom_data?: Record<string, string | number | boolean>) => {
		trackEvent({
			event_name: 'Lead',
			custom_data,
		});
	}, [trackEvent]);

	// Track add to cart
	const trackAddToCart = useCallback((value?: number, currency: string = 'BRL', content_ids?: string[]) => {
		trackEvent({
			event_name: 'AddToCart',
			custom_data: {
				value: value || 0,
				currency,
				content_ids: content_ids?.join(',') || '',
			},
		});
	}, [trackEvent]);

	// Track form start (matching GA pattern)
	const trackFormStart = useCallback(() => {
		trackEvent({
			event_name: 'InitiateCheckout', // Using Meta's equivalent funnel event
			custom_data: {
				currency: 'BRL',
				value: 1,
				form_name: 'contact_form',
			},
		});
	}, [trackEvent]);

	// Track form submission (matching GA pattern)
	const trackFormSubmit = useCallback((area?: string) => {
		trackEvent({
			event_name: 'Lead',
			custom_data: {
				content_name: 'Contact Form Lead',
				source: 'website',
				content_category: area || 'General',
				value: 1,
				currency: 'BRL',
				form_name: 'contact_form',
			},
		});
	}, [trackEvent]);

	return {
		clientId,
		trackEvent,
		trackPageView,
		trackPurchase,
		trackLead,
		trackAddToCart,
		trackFormStart,
		trackFormSubmit,
		sendClientEvent,
		sendServerEvent,
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
