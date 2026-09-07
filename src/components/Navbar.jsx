import { Link } from "react-router-dom";
import { Film, MessageSquarePlus } from "lucide-react";

export default function Navbar(){
    return(
        <header className="sticky top-0 z-50 backdrop-blur-md bg-secao-dark/80 border-b border-secao-border">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">


                {/* LOGO */}
                <Link to="/" className="flex items-center gap-2 group">
                    <span className="bg-secao-red text-white font-black text-xl px-2 py-1 rounded group-hover:scale-105 transition-transform">
                        E
                    </span>
                    <span className="text-xl font-bold tracking-wider text-white">
                        SEÇÃO <span className="text-secao-red">E</span>
                    </span>
                </Link>

                {/* NAVEGAÇÃO */}
                <nav className="flex items-center gap-6 text-sm font-medium">
                    <Link to="/" className="hover:text-secao-red transition flex itens-center gap-1">
                        <Film size={16} /> Inicío
                    </Link>
                    <Link to="/sugerir" className="bg-secao-purple hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg flex itens-center gap-2 transition shadow-lg shadow-purple-950">
                        <MessageSquarePlus size={16} /> Sugerir Crìtica
                    </Link>

                </nav>

            </div>
        </header>
    );
}