'use client';

import { useEffect } from 'react';
import { useTracking } from './hooks/useTracking';

interface PageViewTrackerProps {
	pageTitle?: string;
	pageUrl?: string;
}

export const PageViewTracker: React.FC<PageViewTrackerProps> = ({
	pageTitle,
	pageUrl
}) => {
	const { trackPageView } = useTracking();

	useEffect(() => {
		// Track page view with all enabled platforms when component mounts
		trackPageView(pageUrl, pageTitle);
	}, [trackPageView, pageUrl, pageTitle]);

	return null; // This component doesn't render anything
};
