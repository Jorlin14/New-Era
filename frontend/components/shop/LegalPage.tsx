
import Link from 'next/link';

interface Section {
    id?: string;
    title?: string;
    heading?: string;
    content: string;
}

interface LegalPageProps {
    title: string;
    description?: string;
    sections: Array<Section>;
}

export default function LegalPage({ title, description, sections }: LegalPageProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-[60vh] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Botón de volver */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#1c6554] hover:text-[#1c6554]/80 font-medium mb-8"
        >
          ← Volver al inicio
        </Link>

        {/* Header de la página */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{title}</h1>
          {description && <p className="text-slate-600 dark:text-slate-400">{description}</p>}
        </header>

        {/* Contenedor de secciones */}
        <div className="space-y-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
          {sections.map((section, index) => {
            const sectionTitle = section.title || section.heading;
            const sectionId = section.id || section.heading || `section-${index}`;
            
            return (
              <section key={sectionId} id={sectionId}>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  {sectionTitle}
                </h2>
                <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 prose prose-slate dark:prose-invert max-w-none">
                  {section.content.split('\n\n').map((paragraph, pIndex) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;
                    
                    // Detectar títulos markdown (##)
                    if (trimmed.startsWith('## ')) {
                      return (
                        <h3 key={`${sectionId}-h3-${pIndex}`} className="text-base font-semibold text-slate-800 dark:text-white mt-6 mb-2">
                          {trimmed.replace('## ', '')}
                        </h3>
                      );
                    }
                    
                    // Detectar listas con guiones
                    if (trimmed.startsWith('- ')) {
                      const items = trimmed.split('\n').filter(line => line.trim().startsWith('- '));
                      return (
                        <ul key={`${sectionId}-ul-${pIndex}`} className="list-disc pl-5 space-y-2">
                          {items.map((item, iIndex) => (
                            <li key={`${sectionId}-li-${pIndex}-${iIndex}`}>
                              {item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    
                    // Párrafo normal con soporte de negrita (**)
                    return (
                      <p key={`${sectionId}-p-${pIndex}`} dangerouslySetInnerHTML={{
                        __html: trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }} />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

