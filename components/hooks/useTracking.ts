'use client';

import { useCallback, useEffect, useState } from 'react';
import {
	TrackingCoordinator,
	GoogleAnalyticsPlatform,
	MetaCapiPlatform,
	createEvent,
	getOrCreateClientId,
	getOrCreateSessionId,
	type EventType,
	type FormEventData,
	type PageViewEventData,
	type LeadEventData
} from '../../app/lib/tracking';

export const useTracking = () => {
	const [coordinator, setCoordinator] = useState<TrackingCoordinator | null>(null);
	const [clientId, setClientId] = useState<string>('');
	const [sessionId, setSessionId] = useState<string>('');

	// Initialize tracking coordinator and IDs
	useEffect(() => {
		const initTracking = () => {
			// Get or create client and session IDs
			const cId = getOrCreateClientId();
			const sId = getOrCreateSessionId();
			setClientId(cId);
			setSessionId(sId);

			// Initialize platforms
			const googlePlatform = new GoogleAnalyticsPlatform();
			const metaPlatform = new MetaCapiPlatform();

			// Create coordinator with platforms
			const trackingCoordinator = new TrackingCoordinator([
				googlePlatform,
				metaPlatform,
			]);

			setCoordinator(trackingCoordinator);
		};

		initTracking();
	}, []);

	// Generic event tracking
	const trackEvent = useCallback(async (
		eventType: EventType,
		data: Record<string, unknown> = {}
	): Promise<Record<string, boolean> | null> => {
		if (!coordinator || !clientId) {
			console.warn('Tracking not initialized');
			return null;
		}

		const event = createEvent(eventType, data, clientId, sessionId);
		return await coordinator.trackEvent(event);
	}, [coordinator, clientId, sessionId]);

	// Page view tracking
	const trackPageView = useCallback(async (
		pageUrl?: string,
		pageTitle?: string
	): Promise<Record<string, boolean> | null> => {
		if (!coordinator || !clientId) return null;

		const url = pageUrl || (typeof window !== 'undefined' ? window.location.href : '');
		const title = pageTitle || (typeof window !== 'undefined' ? document.title : '');

		const data: PageViewEventData = {
			page_location: url,
			page_title: title,
		};

		const event = createEvent('page_view', data, clientId, sessionId);
		return await coordinator.trackPageView(event);
	}, [coordinator, clientId, sessionId]);

	// Form start tracking
	const trackFormStart = useCallback(async (
		formName: string = 'contact_form'
	): Promise<Record<string, boolean> | null> => {
		if (!coordinator || !clientId) return null;

		const data: FormEventData = {
			form_name: formName,
			currency: 'BRL',
			value: 1,
		};

		const event = createEvent('form_start', data, clientId, sessionId);
		return await coordinator.trackFormEvent(event);
	}, [coordinator, clientId, sessionId]);

	// Form submit tracking
	const trackFormSubmit = useCallback(async (
		area?: string,
		formName: string = 'contact_form'
	): Promise<Record<string, boolean> | null> => {
		if (!coordinator || !clientId) return null;

		const data: FormEventData = {
			form_name: formName,
			area,
			currency: 'BRL',
			value: 1,
		};

		const event = createEvent('form_submit', data, clientId, sessionId);
		return await coordinator.trackFormEvent(event);
	}, [coordinator, clientId, sessionId]);

	// Lead conversion tracking
	const trackLead = useCallback(async (
		leadData: Partial<LeadEventData> = {}
	): Promise<Record<string, boolean> | null> => {
		if (!coordinator || !clientId) return null;

		const data: LeadEventData = {
			content_name: 'Contact Form Lead',
			source: 'website',
			currency: 'BRL',
			value: 1,
			...leadData,
		};

		const event = createEvent('lead', data, clientId, sessionId);
		return await coordinator.trackEvent(event);
	}, [coordinator, clientId, sessionId]);

	// Purchase tracking
	const trackPurchase = useCallback(async (
		value: number,
		currency: string = 'BRL',
		additionalData: Record<string, unknown> = {}
	): Promise<Record<string, boolean> | null> => {
		if (!coordinator || !clientId) return null;

		const data = {
			value,
			currency,
			transaction_id: `purchase_${Date.now()}`,
			...additionalData,
		};

		const event = createEvent('purchase', data, clientId, sessionId);
		return await coordinator.trackEvent(event);
	}, [coordinator, clientId, sessionId]);

	// Custom event tracking
	const trackCustomEvent = useCallback(async (
		eventName: string,
		data: Record<string, unknown> = {}
	): Promise<Record<string, boolean> | null> => {
		if (!coordinator || !clientId) return null;

		const event = createEvent('custom', { ...data, custom_event_name: eventName }, clientId, sessionId);
		return await coordinator.trackEvent(event);
	}, [coordinator, clientId, sessionId]);

	// Get current event ID (useful for correlation)
	const getCurrentEventId = useCallback((): string => {
		const event = createEvent('temp', {}, clientId, sessionId);
		return event.id;
	}, [clientId, sessionId]);

	return {
		// Core tracking methods
		trackEvent,
		trackPageView,
		trackFormStart,
		trackFormSubmit,
		trackLead,
		trackPurchase,
		trackCustomEvent,

		// Utility methods
		getCurrentEventId,

		// State
		clientId,
		sessionId,
		isInitialized: !!coordinator,
		enabledPlatforms: coordinator?.getEnabledPlatforms() || [],
	};
};
