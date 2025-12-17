'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">MarIA S.A.</h3>
            <p className="text-gray-300 text-sm">
              Tu aliado gamer desde 2018. Hardware, perifericos y notebooks.
              Calidad garantizada y atencion con IA 24/7.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Consultas disponibles a través del chat
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Asistente virtual disponible 24/7
              </li>
            </ul>
          </div>

          {/* Info Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Información</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>✓ Envío a todo el país</li>
              <li>✓ Múltiples medios de pago</li>
              <li>✓ Garantía en todos los productos</li>
              <li>✓ Atención personalizada</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p className="mb-2">
            © {new Date().getFullYear()} MarIA S.A. - Demo by Traid Agency
          </p>
          <p className="flex items-center justify-center gap-1">
            Desarrollado por{' '}
            <a
              href="https://traidagency.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ml-yellow hover:text-yellow-400 font-medium transition-colors inline-flex items-center gap-1"
            >
              Traid Agency
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
