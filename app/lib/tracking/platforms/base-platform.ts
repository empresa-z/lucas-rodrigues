import { TrackingPlatform, UnifiedEvent } from '../core/types';

// Base abstract class for tracking platforms
export abstract class BasePlatform implements TrackingPlatform {
	abstract name: string;
	abstract enabled: boolean;

	// Abstract methods that must be implemented by platform adapters
	abstract trackEvent(event: UnifiedEvent): Promise<boolean>;
	abstract trackPageView(event: UnifiedEvent): Promise<boolean>;
	abstract trackFormEvent(event: UnifiedEvent): Promise<boolean>;

	// Common utility methods
	protected log(message: string): void {
		console.log(`[${this.name}] ${message}`);
	}

	protected logError(message: string, error?: unknown): void {
		console.error(`[${this.name}] ${message}`, error);
	}

	// Common validation
	protected validateEvent(event: UnifiedEvent): boolean {
		return !!(event.id && event.type && event.client_id && event.timestamp);
	}

	// Common error handling wrapper
	protected async safeExecute<T>(
		operation: () => Promise<T>,
		operationName: string
	): Promise<T | null> {
		try {
			return await operation();
		} catch (error) {
			this.logError(`${operationName} failed`, error);
			return null;
		}
	}
}
