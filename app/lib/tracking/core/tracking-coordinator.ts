import { TrackingPlatform, UnifiedEvent } from './types';

export class TrackingCoordinator {
	private platforms: TrackingPlatform[] = [];

	constructor(platforms: TrackingPlatform[] = []) {
		this.platforms = platforms.filter(platform => platform.enabled);
	}

	// Add a new platform
	addPlatform(platform: TrackingPlatform): void {
		if (platform.enabled && !this.platforms.find(p => p.name === platform.name)) {
			this.platforms.push(platform);
		}
	}

	// Remove a platform
	removePlatform(platformName: string): void {
		this.platforms = this.platforms.filter(p => p.name !== platformName);
	}

	// Track event across all platforms
	async trackEvent(event: UnifiedEvent): Promise<Record<string, boolean>> {
		const results: Record<string, boolean> = {};

		// Track on all platforms in parallel
		const promises = this.platforms.map(async (platform) => {
			try {
				const success = await platform.trackEvent(event);
				results[platform.name] = success;
				console.log(`${platform.name}: Event '${event.type}' tracked successfully`);
				return success;
			} catch (error) {
				console.error(`${platform.name}: Failed to track event '${event.type}':`, error);
				results[platform.name] = false;
				return false;
			}
		});

		await Promise.allSettled(promises);
		return results;
	}

	// Track page view across all platforms
	async trackPageView(event: UnifiedEvent): Promise<Record<string, boolean>> {
		const results: Record<string, boolean> = {};

		const promises = this.platforms.map(async (platform) => {
			try {
				const success = await platform.trackPageView(event);
				results[platform.name] = success;
				console.log(`${platform.name}: Page view tracked successfully`);
				return success;
			} catch (error) {
				console.error(`${platform.name}: Failed to track page view:`, error);
				results[platform.name] = false;
				return false;
			}
		});

		await Promise.allSettled(promises);
		return results;
	}

	// Track form event across all platforms
	async trackFormEvent(event: UnifiedEvent): Promise<Record<string, boolean>> {
		const results: Record<string, boolean> = {};

		const promises = this.platforms.map(async (platform) => {
			try {
				const success = await platform.trackFormEvent(event);
				results[platform.name] = success;
				console.log(`${platform.name}: Form event '${event.type}' tracked successfully`);
				return success;
			} catch (error) {
				console.error(`${platform.name}: Failed to track form event '${event.type}':`, error);
				results[platform.name] = false;
				return false;
			}
		});

		await Promise.allSettled(promises);
		return results;
	}

	// Get list of enabled platforms
	getEnabledPlatforms(): string[] {
		return this.platforms.map(p => p.name);
	}
}
