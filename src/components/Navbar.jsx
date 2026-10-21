import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, MessageSquarePlus, Star, X } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-secao-border bg-secao-dark/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" onClick={closeMenu} className="group flex shrink-0 items-center gap-2">
          <span className="text-xl font-bold tracking-wider text-white">SEÇÃO</span>
          <span className="rounded bg-secao-red px-2 py-1 text-xl font-black text-white transition-transform group-hover:scale-105">
            E
          </span>
        </Link>

        <button
          type="button"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-secao-border text-slate-200 transition hover:bg-secao-card md:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav
          id="main-navigation"
          aria-label="Navegação principal"
          className={`${menuOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-16 flex-col gap-1 border-b border-secao-border bg-secao-dark p-3 shadow-xl md:static md:flex md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          <Link
            to="/analises"
            onClick={closeMenu}
            className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-300 transition hover:bg-secao-card hover:text-secao-purple md:min-h-0 md:bg-transparent md:p-0"
          >
            <Star size={16} className="text-yellow-400" /> Análises
          </Link>

          <Link
            to="/noticias"
            onClick={closeMenu}
            className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-300 transition hover:bg-secao-card hover:text-secao-purple md:min-h-0 md:bg-transparent md:p-0"
          >
            <Star size={16} className="text-yellow-400" /> Notícias
          </Link>

          <Link
            to="/sugerir"
            onClick={closeMenu}
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-secao-purple px-4 text-sm font-semibold text-white shadow-lg shadow-purple-950/50 transition hover:bg-purple-600 active:scale-95 md:min-h-10"
          >
            <MessageSquarePlus size={16} /> Sugerir Crítica
          </Link>
        </nav>
      </div>
    </header>
  );
}