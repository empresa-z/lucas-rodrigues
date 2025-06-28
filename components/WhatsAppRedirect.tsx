'use client';

import { useEffect } from 'react';

interface WhatsAppRedirectProps {
	formData: {
		name: string;
		email: string;
		phone: string;
		area: string;
	};
	shouldRedirect: boolean;
	onRedirect?: () => void;
}

export const WhatsAppRedirect: React.FC<WhatsAppRedirectProps> = ({
	formData,
	shouldRedirect,
	onRedirect
}) => {
	useEffect(() => {
		if (shouldRedirect && formData.name) {
			const timer = setTimeout(() => {
				const areaMessage = formData.area ? `\n\nÁrea de interesse: ${formData.area}` : '';
				const message = `Olá! Acabei de preencher o formulário. ${areaMessage}`;
				const whatsappUrl = `https://wa.me/5521993254504?text=${encodeURIComponent(message)}`;

				window.location.href = whatsappUrl;
				onRedirect?.();
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [shouldRedirect, formData, onRedirect]);

	return null; // This component doesn't render anything
};
