'use client'
import React, { useState } from 'react';
import { submitContactForm } from '../app/actions/form-actions';
import { useContactForm } from './hooks/useContactForm';
import { WhatsAppRedirect } from './WhatsAppRedirect';

const ContactForm: React.FC = () => {
	const {
		formData,
		status,
		isPending,
		handleInputChange,
		submitForm,
	} = useContactForm();

	const [shouldRedirect, setShouldRedirect] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		submitForm(async (data) => {
			const result = await submitContactForm(data);
			// Trigger WhatsApp redirect on successful submission
			setShouldRedirect(true);
			return result;
		});
	};

	const handleRedirect = () => {
		setShouldRedirect(false);
	};

	return (
		<section id="formulario" className="py-16 md:py-24 bg-white">
			<div className="container mx-auto max-w-2xl px-6 text-center">
				<h2 className="text-3xl md:text-4xl font-bold text-slate-900">Dê o primeiro passo para uma transformação positiva</h2>
				<p className="mt-4 text-lg text-slate-600">Preencha o formulário para agendar sua conversa gratuita e sem compromisso.</p>

				<form className="mt-10 text-left space-y-6" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="nome" className="block text-sm font-medium text-slate-700">Nome Completo</label>
						<input
							type="text"
							id="nome"
							name="name"
							value={formData.name}
							onChange={handleInputChange}
							required
							className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-slate-700">E-mail</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
							required
							className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label htmlFor="telefone" className="block text-sm font-medium text-slate-700">Telefone (WhatsApp)</label>
						<input
							type="tel"
							id="telefone"
							name="phone"
							value={formData.phone}
							onChange={handleInputChange}
							required
							className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<p className="block text-sm font-medium text-slate-700">Você busca ajuda para qual destas áreas?</p>
						<div className="mt-2 space-y-2">
							{['Ansiedade', 'Burnout', 'Relacionamentos Interpessoais', 'Outro'].map(item => (
								<div key={item} className="flex items-center">
									<input
										id={item}
										name="area"
										type="radio"
										value={item}
										checked={formData.area === item}
										onChange={handleInputChange}
										className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
									/>
									<label htmlFor={item} className="ml-3 block text-sm text-slate-700">{item}</label>
								</div>
							))}
						</div>
					</div>
					<div>
						<button
							type="submit"
							disabled={isPending}
							className="w-full bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
						>
							{isPending ? 'Enviando...' : 'QUERO AGENDAR MINHA CONVERSA GRATUITA!'}
						</button>
					</div>
					{status.message && (
						<p className={`mt-4 text-center text-sm font-medium ${status.error ? 'text-red-600' : 'text-green-600'}`}>
							{status.message}
						</p>
					)}
				</form>

				<WhatsAppRedirect
					formData={formData}
					shouldRedirect={shouldRedirect}
					onRedirect={handleRedirect}
				/>
			</div>
		</section>
	);
};

export default ContactForm;
