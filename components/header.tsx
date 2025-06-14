// components/header.tsx
import React from 'react';
import Image from 'next/image';

const Header = () => (
	<header id="inicio" className="bg-white">
		<div className="container mx-auto max-w-6xl px-6 py-12 md:py-20">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
				{/* Text Content */}
				<div className="text-center lg:text-left">
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
						Cansado da Ansiedade Dominando Sua Vida?
					</h1>
					<p className="mt-4 text-lg md:text-xl text-slate-600">
						Dê o Primeiro Passo Rumo ao Bem-Estar com o Psicólogo Lucas Rodrigues.
					</p>
					<p className="mt-6 text-base text-slate-600">
						Você se sente constantemente sobrecarregado, com a mente a mil e dificuldade para relaxar? A <strong>ansiedade</strong>, o <strong>burnout</strong> e os desafios nos seus <strong>relacionamentos</strong> podem estar tirando sua paz. Mas você não precisa enfrentar isso sozinho.
					</p>
					<div className="mt-8 text-center lg:text-left">
						<a href="#formulario" className="inline-block bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">
							Quero Agendar Minha Conversa Gratuita!
						</a>
					</div>
				</div>

				{/* Image & Intro */}
				<div className="bg-slate-100 p-8 rounded-xl shadow-lg">
					<Image
						src="/images/lucas-profile.jpeg"
						alt="Foto do Psicólogo Lucas Rodrigues"
						width={1080}
						height={1080}
						className="mx-auto w-48 h-48 rounded-full object-cover border-4 border-white shadow-md"
					/>
					<div className="mt-6 text-center">
						<h2 className="text-2xl font-bold text-slate-900">Lucas Rodrigues</h2>
						<p className="text-slate-600">Psicólogo Clínico</p>
						<p className="mt-4 text-sm text-slate-600">
							Meu foco é ajudar você a encontrar equilíbrio com a <strong>Terapia Cognitivo-Comportamental (TCC)</strong>, uma abordagem comprovada e eficaz para identificar os padrões que te prendem e desenvolver novas formas de lidar com seus desafios.
						</p>
					</div>
				</div>
			</div>
		</div>
	</header>
);

export default Header;
