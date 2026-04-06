import React from 'react';
import { useLanguage } from '../lib/LanguageContext';

export const PrintableCV = () => {
  const { lang, t } = useLanguage();

  const education = [
    {
      title: 'UMOV Academy',
      subtitle: lang === 'en' ? 'Bachelor in Experience Design Engineering & Innovation' : 'Licenciatura en Ingeniería en Diseño de Experiencias e Innovación',
      date: '2023 - 2026',
      description: lang === 'en' ? 'Focusing on innovation and user-centered design methodologies.' : 'Enfocado en innovación y metodologías de diseño centradas en el usuario.'
    },
    {
      title: 'Instituto Universitario de Nuevas Profesiones (IUNP)',
      subtitle: lang === 'en' ? 'Higher Technician in Advertising' : 'Técnico Superior en Publicidad',
      date: '2010 - 2014',
      description: lang === 'en' ? 'Foundations of visual communication and marketing strategies.' : 'Bases de comunicación visual y estrategias de marketing.'
    }
  ];

  const work = [
    {
      title: 'NTT DATA Europe & Latam',
      subtitle: 'Sr UX/UI Designer',
      date: '2022 - Present',
      description: lang === 'en' ? 'Leading design projects from user research to final visual design. Specialized in Design Systems and Atomic Design.' : 'Liderando proyectos de diseño desde la investigación hasta el diseño visual final. Especializado en Sistemas de Diseño y Diseño Atómico.'
    },
    {
      title: 'NTT DATA Europe & Latam',
      subtitle: 'UX/UI Designer',
      date: '2021 - 2022',
      description: lang === 'en' ? 'Designed intuitive solutions for complex needs. Focused on interactive prototyping and usability testing.' : 'Diseñé soluciones intuitivas para necesidades complejas. Enfocado en prototipado interactivo y pruebas de usabilidad.'
    },
    {
      title: 'DaCodes',
      subtitle: 'UX/UI Designer',
      date: '2021 - 2021',
      description: lang === 'en' ? 'Understanding product specifications and user psychology. Concept and usability testing.' : 'Entender las especificaciones del producto y la psicología del usuario. Pruebas de concepto y usabilidad.'
    },
    {
      title: 'Addinteli Mx',
      subtitle: 'Jr UX/UI Designer',
      date: '2018 - 2020',
      description: lang === 'en' ? 'Developed page layouts and prototypes based on client needs.' : 'Desarrollé esquemas de páginas y prototipos basados en las necesidades del cliente.'
    },
    {
      title: 'Fuera de La Caja',
      subtitle: lang === 'en' ? 'Graphic Designer' : 'Diseñador Gráfico',
      date: '2015 - 2017',
      description: lang === 'en' ? 'Print design, logos, and corporate identity.' : 'Diseño de impresión, logotipos e identidad corporativa.'
    }
  ];

  const skills = ['UX Design', 'UI/UX Concepts', 'Research', 'Strategy', 'Design Systems', 'Agile Methodologies'];
  const tools = ['Figma', 'Sketch', 'Miro', 'Jira'];
  const languages = ['Spanish (Native)', 'English (B2)'];

  return (
    <div className="hidden print:block bg-white text-black p-10 max-w-4xl mx-auto font-sans leading-relaxed">
      {/* Header */}
      <div className="border-b-2 border-black pb-6 mb-8 text-center">
        <h1 className="text-4xl font-extrabold mb-2 uppercase tracking-wide">Richard Falsone</h1>
        <h2 className="text-xl font-bold text-gray-700 uppercase tracking-widest mb-4">Sr UX/UI Designer</h2>
        <div className="text-sm font-medium flex justify-center gap-4 text-gray-600">
          <span>📍 Mérida, Yucatán, México</span>
        </div>
      </div>

      {/* Profile Summary */}
      <section className="mb-8">
        <h3 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 mb-4 tracking-widest">{t('professionalProfile')}</h3>
        <p className="text-sm text-justify">
          {lang === 'en' 
            ? '+20 years of experience in the design field. I specialize in translating complex requirements into highly usable and aesthetic digital experiences, focusing on user-centered methodologies, research, and scalable design systems.'
            : '+20 años de experiencia en el ámbito del diseño. Me especializo en traducir requisitos complejos en experiencias digitales altamente usables y estéticas, con un enfoque en metodologías centradas en el usuario, investigación y sistemas de diseño escalables.'}
        </p>
      </section>

      {/* Experience */}
      <section className="mb-8">
        <h3 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 mb-4 tracking-widest">{t('experience')}</h3>
        <div className="space-y-6">
          {work.map((job, idx) => (
            <div key={idx} className="break-inside-avoid">
              <div className="flex justify-between items-baseline mb-1">
                <h4 className="text-base font-bold text-black">{job.subtitle} <span className="text-gray-600 font-medium">| {job.title}</span></h4>
                <span className="text-sm font-bold text-gray-500 whitespace-nowrap">{job.date}</span>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed">{job.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-8">
        <h3 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 mb-4 tracking-widest">{t('education')}</h3>
        <div className="space-y-4">
          {education.map((edu, idx) => (
            <div key={idx} className="break-inside-avoid">
              <div className="flex justify-between items-baseline mb-1">
                <h4 className="text-base font-bold text-black">{edu.subtitle}</h4>
                <span className="text-sm font-bold text-gray-500 whitespace-nowrap">{edu.date}</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">{edu.title}</p>
              <p className="text-sm text-gray-800">{edu.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills & Others */}
      <div className="grid grid-cols-2 gap-8 mb-8 break-inside-avoid">
        <section>
          <h3 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 mb-4 tracking-widest">{t('hardSkills')}</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {skills.map((skill, idx) => (
              <li key={idx} className="text-gray-800 font-medium">{skill}</li>
            ))}
          </ul>
        </section>
        
        <section>
          <h3 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 mb-4 tracking-widest">{t('languagesAndTools')}</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {languages.map((langItem, idx) => (
              <li key={idx} className="text-gray-800 font-medium">{langItem}</li>
            ))}
            {tools.map((tool, idx) => (
              <li key={idx} className="text-gray-800 font-medium">{tool}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
