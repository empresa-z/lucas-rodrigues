import { UnifiedEvent } from './types';

// Generate unique event ID
export function generateEventId(): string {
	return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Generate client ID (consistent with existing format)
export function generateClientId(): string {
	return 'GA1.1.' + Math.random().toString(36).substring(2, 15) + '.' + Date.now();
}

// Generate session ID
export function generateSessionId(): string {
	return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Create a unified event structure
export function createEvent(
	type: string,
	data: Record<string, unknown>,
	clientId: string,
	sessionId?: string
): UnifiedEvent {
	return {
		id: generateEventId(),
		type,
		timestamp: Math.floor(Date.now() / 1000),
		session_id: sessionId || generateSessionId(),
		client_id: clientId,
		data,
	};
}

// Get or create client ID from localStorage
export function getOrCreateClientId(): string {
	if (typeof window === 'undefined') {
		return generateClientId();
	}

	const stored = localStorage.getItem('ga_client_id');
	if (stored) {
		return stored;
	}

	const newClientId = generateClientId();
	localStorage.setItem('ga_client_id', newClientId);
	return newClientId;
}

// Get or create session ID from sessionStorage
export function getOrCreateSessionId(): string {
	if (typeof window === 'undefined') {
		return generateSessionId();
	}

	const stored = sessionStorage.getItem('tracking_session_id');
	if (stored) {
		return stored;
	}

	const newSessionId = generateSessionId();
	sessionStorage.setItem('tracking_session_id', newSessionId);
	return newSessionId;
}
