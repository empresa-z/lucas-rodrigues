// Shared types for unified tracking system

export interface UnifiedEvent {
	id: string;           // Unique event ID
	type: string;         // Event type (page_view, form_start, etc.)
	timestamp: number;    // Unix timestamp
	session_id: string;   // Session identifier
	client_id: string;    // Client identifier
	data: Record<string, unknown>; // Event-specific data
}

export interface TrackingPlatform {
	name: string;
	enabled: boolean;
	trackEvent(event: UnifiedEvent): Promise<boolean>;
	trackPageView(event: UnifiedEvent): Promise<boolean>;
	trackFormEvent(event: UnifiedEvent): Promise<boolean>;
}

export interface TrackingConfig {
	platforms: TrackingPlatform[];
	enableServerSide: boolean;
	enableClientSide: boolean;
}

export type EventType =
	| 'page_view'
	| 'form_start'
	| 'form_submit'
	| 'lead'
	| 'purchase'
	| 'add_to_cart'
	| 'custom';

export interface FormEventData extends Record<string, unknown> {
	form_name: string;
	area?: string;
	value?: number;
	currency?: string;
}

export interface PageViewEventData extends Record<string, unknown> {
	page_location: string;
	page_title: string;
}

export interface LeadEventData extends Record<string, unknown> {
	content_name: string;
	source: string;
	content_category?: string;
	value?: number;
	currency?: string;
}
