'use client'
import React, { useState } from 'react';

interface FormData {
	name: string;
	email: string;
	phone: string;
	area: string;
}

interface Status {
	submitting: boolean;
	message: string;
	error: boolean;
}

const ContactForm: React.FC = () => {
	const [formData, setFormData] = useState<FormData>({
		name: '',
		email: '',
		phone: '',
		area: '',
	});
	const [status, setStatus] = useState<Status>({ submitting: false, message: '', error: false });

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setStatus({ submitting: true, message: '', error: false });

		const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL as string;
		if (!webhookUrl) {
			setStatus({ submitting: false, message: 'Webhook URL não configurada.', error: true });
			return;
		}

		try {
			const response = await fetch(webhookUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				setStatus({ submitting: false, message: 'Obrigado! Seus dados foram enviados com sucesso.', error: false });
				setFormData({ name: '', email: '', phone: '', area: '' }); // Clear form
				const areaMessage = formData.area
					? `\n\nÁrea de interesse: ${formData.area}`
					: '';
				window.location.href = `https://wa.me/5521993254504?text=${encodeURIComponent(`Olá! Acabei de preencher o formulário. ${areaMessage}`)}`;
			} else {
				throw new Error('Falha no envio do formulário.');
			}
		} catch (error) {
			console.error('Form submission error:', error);
			setStatus({ submitting: false, message: 'Houve um erro ao enviar. Tente novamente.', error: true });
		}
	};

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
		const { name, value, type } = event.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'radio' ? value : value
		}));
	}

	return (
		<section id="formulario" className="py-16 md:py-24 bg-white">
			<div className="container mx-auto max-w-2xl px-6 text-center">
				<h2 className="text-3xl md:text-4xl font-bold text-slate-900">Dê o primeiro passo para uma transformação positiva</h2>
				<p className="mt-4 text-lg text-slate-600">Preencha o formulário para agendar sua conversa gratuita e sem compromisso.</p>

				<form className="mt-10 text-left space-y-6" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="nome" className="block text-sm font-medium text-slate-700">Nome Completo</label>
						<input type="text" id="nome" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
					</div>
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-slate-700">E-mail</label>
						<input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
					</div>
					<div>
						<label htmlFor="telefone" className="block text-sm font-medium text-slate-700">Telefone (WhatsApp)</label>
						<input type="tel" id="telefone" name="phone" value={formData.phone} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
					</div>
					<div>
						<p className="block text-sm font-medium text-slate-700">Você busca ajuda para qual destas áreas?</p>
						<div className="mt-2 space-y-2">
							{['Ansiedade', 'Burnout', 'Relacionamentos Interpessoais', 'Outro'].map(item => (
								<div key={item} className="flex items-center">
									<input id={item} name="area" type="radio" value={item} checked={formData.area === item} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
									<label htmlFor={item} className="ml-3 block text-sm text-slate-700">{item}</label>
								</div>
							))}
						</div>
					</div>
					<div>
						<button type="submit" disabled={status.submitting} className="w-full bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed">
							{status.submitting ? 'Enviando...' : 'QUERO AGENDAR MINHA CONVERSA GRATUITA!'}
						</button>
					</div>
					{status.message && (
						<p className={`mt-4 text-center text-sm font-medium ${status.error ? 'text-red-600' : 'text-green-600'}`}>
							{status.message}
						</p>
					)}
				</form>
			</div>
		</section>
	);
};

export default ContactForm;