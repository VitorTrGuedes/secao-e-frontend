import { Link } from "react-router-dom";
import { Film, MessageSquarePlus, Star, Newspaper } from "lucide-react";

export default function Navbar(){
    return(
        <header className="sticky top-0 z-50 backdrop-blur-md bg-secao-dark/80 border-b border-secao-border">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">


                {/* LOGO */}
                <Link to="/" className="flex items-center gap-2 group">
                    
                    <span className="text-xl font-bold tracking-wider text-white">
                        SEÇÃO 
                    </span>

                    <span className="bg-secao-red text-white font-black text-xl px-2 py-1 rounded group-hover:scale-105 transition-transform">
                        E
                    </span>
                </Link>

                {/* NAVEGAÇÃO DIVIDIDA */}
                <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
                    <Link to="/analises" className="hover:text-secao-purple text-slate-300 transition flex items-center gap-1.5">
                        <Star size={16} className="text-yellow-400"/> Análises
                    </Link>

                    <Link to="/noticias" className="hover:text-secao-purple text-slate-300 transition flex items-center gap-1.5">
                        <Star size={16} className="text-yellow-400"/> Notícias
                    </Link>

                    <Link 
                        to="/sugerir" 
                        className="bg-secao-purple hover:bg-purple-600 text-white font-semibold px-3 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-purple-950/50 hover:scale-105 active:scale-95 text-xs sm:text-sm">
                        <MessageSquarePlus size={16} /> Sugerir
                    </Link>
                </nav>

            </div>
        </header>
    );
}