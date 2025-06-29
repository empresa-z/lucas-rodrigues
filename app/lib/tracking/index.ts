// Public API exports for the unified tracking system

export { TrackingCoordinator } from './core/tracking-coordinator';
export {
	createEvent,
	generateEventId,
	generateClientId,
	generateSessionId,
	getOrCreateClientId,
	getOrCreateSessionId
} from './core/event-manager';

export { GoogleAnalyticsPlatform } from './platforms/google-analytics';
export { MetaCapiPlatform } from './platforms/meta-capi';
export { BasePlatform } from './platforms/base-platform';

export type {
	UnifiedEvent,
	TrackingPlatform,
	TrackingConfig,
	EventType,
	FormEventData,
	PageViewEventData,
	LeadEventData
} from './core/types';
