import { useState, useTransition } from 'react';

interface FormData {
	name: string;
	email: string;
	phone: string;
	area: string;
}

interface Status {
	message: string;
	error: boolean;
}

export const useContactForm = () => {
	const [formData, setFormData] = useState<FormData>({
		name: '',
		email: '',
		phone: '',
		area: '',
	});

	const [status, setStatus] = useState<Status>({ message: '', error: false });
	const [isPending, startTransition] = useTransition();

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type } = event.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'radio' ? value : value
		}));
	};

	const resetForm = () => {
		setFormData({ name: '', email: '', phone: '', area: '' });
		setStatus({ message: '', error: false });
	};

	const setStatusMessage = (message: string, error: boolean = false) => {
		setStatus({ message, error });
	};

	const submitForm = (action: (formData: FormData) => Promise<{ success: boolean }>) => {
		startTransition(async () => {
			try {
				await action(formData);
				setStatus({
					message: 'Obrigado! Seus dados foram enviados com sucesso.',
					error: false
				});
				resetForm();
			} catch (error) {
				console.error('Form submission error:', error);
				setStatus({
					message: 'Houve um erro ao enviar. Tente novamente.',
					error: true
				});
			}
		});
	};

	return {
		formData,
		status,
		isPending,
		handleInputChange,
		resetForm,
		setStatusMessage,
		submitForm,
	};
};
