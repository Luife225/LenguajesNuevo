import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';

interface FooterProps {
  linkText?: string;
  linkTo?: string;
}

export const Footer = ({ linkText, linkTo }: FooterProps) => {
  return (
    <footer className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 backdrop-blur-md border-t border-purple-500/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        {linkText && linkTo && (
          <div className="text-center mb-6">
            <Link
              to={linkTo}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              {linkText}
            </Link>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-purple-400" />
            <span>© 2025 GameRecommend. Todos los derechos reservados.</span>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="hover:text-purple-400 transition-colors">Términos</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Contacto</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
