import React from 'react';
import { Check, ArrowBigRight } from 'lucide-react';

const SolutionSection = () => (
	<section id="solucao" className="py-16 md:py-24 bg-slate-50">
		<div className="container mx-auto max-w-5xl px-6">
			<div className="text-center">
				<h2 className="text-3xl md:text-4xl font-bold text-slate-900">Entenda Sua Dor e Encontre o Caminho</h2>
				<p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">Você já se pegou pensando em alguma destas situações?</p>
			</div>

			{/* Pain Points Grid */}
			<div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm"><p className="font-semibold text-slate-700">&quot;Não consigo me desligar, minha mente está sempre acelerada.&quot;</p></div>
				<div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm"><p className="font-semibold text-slate-700">&quot;O trabalho me esgotou, sinto que não tenho mais energia para nada.&quot;</p></div>
				<div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm"><p className="font-semibold text-slate-700">&quot;Meus relacionamentos são sempre conturbados e cheios de atritos.&quot;</p></div>
				<div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm"><p className="font-semibold text-slate-700">&quot;Tenho medo de me expressar ou de me aproximar das pessoas.&quot;</p></div>
			</div>

			{/* The Solution */}
			<div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-8 md:p-12 rounded-xl shadow-xl">
				<div>
					<h3 className="text-2xl font-bold text-slate-900">Por Que a Psicoterapia é a Solução?</h3>
					<p className="mt-4 text-slate-600">A psicoterapia, especialmente a <strong>TCC</strong>, oferece as ferramentas que você precisa para mudar essa realidade. No meu atendimento online, você encontrará um espaço:</p>
					<ul className="mt-6 space-y-4 text-slate-700">
						<li className="flex items-start"><Check /><div><strong>Acolhedor e sem julgamentos:</strong> Para você se expressar livremente e ser ouvido com atenção.</div></li>
						<li className="flex items-start"><Check /><div><strong>Com apoio técnico e especializado:</strong> Para compreender a origem das suas dificuldades.</div></li>
						<li className="flex items-start"><Check /><div><strong>Focado em resultados:</strong> A TCC é uma abordagem ativa que te ajuda a modificar pensamentos e comportamentos.</div></li>
					</ul>
				</div>
				<div className="bg-blue-50 p-8 rounded-lg border border-blue-100">
					<h4 className="text-xl font-bold text-blue-900">Vamos trabalhar juntos para:</h4>
					<ul className="mt-4 space-y-3 text-blue-800">
						<li className="flex items-center"><ArrowBigRight /><strong>Gerenciar a ansiedade</strong></li>
						<li className="flex items-center"><ArrowBigRight /><strong>Superar o burnout</strong></li>
						<li className="flex items-center"><ArrowBigRight /><strong>Construir relacionamentos saudáveis</strong></li>
					</ul>
				</div>
			</div>
		</div>
	</section>
);
export default SolutionSection;
