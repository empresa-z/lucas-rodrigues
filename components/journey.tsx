import React from 'react';
import Image from 'next/image';

const JourneyCTA = () => (
	<section id="jornada" className="bg-slate-800 text-white py-16 md:py-24">
		<div className="container mx-auto max-w-5xl px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
			<div className="order-2 md:order-1">
				<h2 className="text-3xl md:text-4xl font-bold">Sua Jornada de Mudança Começa Aqui!</h2>
				<p className="mt-4 text-slate-300">Acredito que o <strong>vínculo terapêutico</strong> é a base para qualquer mudança significativa. Ofereço um espaço ético, seguro e comprometido com você.</p>
				<p className="mt-4 text-slate-300">Não espere mais para se sentir melhor. Você merece ser ouvido com atenção, respeito e profissionalismo.</p>
				<div className="mt-8">
					<a href="#formulario" className="inline-block bg-white text-blue-600 font-bold text-lg px-10 py-4 rounded-lg shadow-lg hover:bg-slate-200 transition-colors duration-300">
						Quero Agendar Minha Conversa Gratuita
					</a>
				</div>
			</div>
			<div className="order-1 md:order-2">
				<Image
					width={600}
					height={400}
					src="/images/lucas-journey.jpeg"
					alt="Imagem ilustrativa de um caminho ou porta se abrindo"
					className="rounded-lg shadow-2xl w-full h-auto"
				/>
			</div>
		</div>
	</section>
);

export default JourneyCTA;
