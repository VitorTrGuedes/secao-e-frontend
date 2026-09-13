import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Star, Calendar, Search, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/articles/`)
      .then(res => {
        const data = Array.isArray(res.data) 
          ? res.data 
          : (res.data?.results || []);
        
        setArticles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar artigos:", err);
        setArticles([]);
        setLoading(false);
      });
  }, []);

  // 🔍 LÓGICA DE FILTRO COMBINADO (Categoria + Texto de Busca)
  const safeArticles = Array.isArray(articles) ? articles : [];
  
  const filteredArticles = safeArticles.filter(article => {
    // 1. Valida a Categoria
    const matchesCategory = filter === 'todos' || article.category === filter;

    // 2. Valida o Texto digitado (busca no Título e no Conteúdo, ignorando maiúsculas)
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = term === '' || 
      article.title?.toLowerCase().includes(term) ||
      article.content?.toLowerCase().includes(term);

    // Só exibe se bater os dois critérios juntos
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400 font-semibold text-lg animate-pulse">Carregando portal Seção E...</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* CABEÇALHO / HERO BANNER */}
      <header className="mb-10 text-center md:text-center border-b border-secao-border pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-white">
          Cinema, Animes & <span className="text-secao-red">Séries</span>
        </h1>
        <p className="text-slate-400 text-lg mb-8">
          Notícias atualizadas, opiniões do autor e espaço aberto para a comunidade opinar!
        </p>

        {/* 🔎 BARRA DE PESQUISA E FILTROS */}
        <section className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center">
          
          {/* CAMPO DE PESQUISA */}
          <div className="relative w-full md:w-96">
            <label htmlFor="search-input" className="sr-only">Pesquisar notícias e críticas</label>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            
            <input
              id="search-input"
              type="text"
              placeholder="Buscar por título ou assunto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-secao-red transition text-sm shadow-inner"
            />

            {/* Botão X para limpar busca rápido */}
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                title="Limpar busca"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* BOTÕES DE CATEGORIA */}
          <nav aria-label="Filtros de categoria" className="flex flex-wrap justify-center gap-2 w-full md:w-auto">
            {['todos', 'cinema', 'anime', 'serie'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${
                  filter === cat 
                    ? 'bg-secao-red text-white shadow-lg shadow-rose-950/40 scale-105' 
                    : 'bg-secao-card hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat === 'todos' ? '🔥 Todos' : cat}
              </button>
            ))}
          </nav>

        </section>

        {/* CONTADOR DE RESULTADOS */}
        {searchTerm && (
          <p className="text-xs text-slate-400 mt-4">
            Mostrando resultados para <span className="text-secao-red font-bold">"{searchTerm}"</span> 
            {filter !== 'todos' && <span> na categoria <strong className="uppercase text-white">{filter}</strong></span>}
            : {filteredArticles.length} {filteredArticles.length === 1 ? 'publicação encontrada' : 'publicações encontradas'}.
          </p>
        )}
      </header>

      {/* GRID DE CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-secao-card/30 rounded-2xl border border-slate-800/80 p-8">
            <p className="text-slate-400 text-lg font-semibold mb-1">Nenhum post encontrado</p>
            <p className="text-slate-500 text-sm">
              Tente pesquisar por outros termos ou trocar a categoria selecionada.
            </p>
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(''); setFilter('todos'); }}
                className="mt-4 text-xs font-bold uppercase text-secao-purple hover:underline"
              >
                Limpar todos os filtros
              </button>
            )}
          </div>
        ) : (
          filteredArticles.map(article => (
            <article 
              key={article.id} 
              className="bg-secao-card border border-secao-border rounded-xl overflow-hidden hover:border-secao-red transition group flex flex-col justify-between"
            >
              <Link to={`/artigo/${article.slug}`}>
                <figure className="relative h-48 bg-slate-900 overflow-hidden">
                  {article.image_url ? (
                    <img 
                      src={article.image_url} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                    />
                  ) : (
                    <figcaption className="w-full h-full flex items-center justify-center text-slate-600 font-bold tracking-widest">
                      SEÇÃO E
                    </figcaption>
                  )}
                  
                  <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black uppercase px-2 py-1 rounded border border-slate-700">
                    {article.category}
                  </span>

                  {article.rating && (
                    <span className="absolute top-3 right-3 bg-yellow-500/90 text-slate-950 font-black text-xs px-2 py-1 rounded flex items-center gap-1 shadow">
                      <Star size={12} fill="currentColor" /> {article.rating}/10
                    </span>
                  )}
                </figure>

                <div className="p-5">
                  <span className="text-xs font-semibold text-secao-purple uppercase tracking-wider">
                    {article.post_type === 'review' ? 'Review da Obra' : 'Notícia'}
                  </span>
                  <h2 className="text-xl font-bold mt-1 mb-3 text-white line-clamp-2 group-hover:text-secao-red transition">
                    {article.title}
                  </h2>
                  <p className="text-slate-400 text-sm line-clamp-3">
                    {article.content}
                  </p>
                </div>
              </Link>

              <footer className="p-5 pt-0 text-xs text-slate-500 flex items-center justify-between border-t border-slate-800/50 mt-4">
              <span>
                <Calendar size={12} /> {new Date(article.created_at).toLocaleDateString()}
              </span>
              {article.author &&(
                <span>
                  <strong className='text-slate-200 font-semibold'>{article.author}</strong>
                </span>
              )}
              </footer>
            </article>
          ))
        )}
      </section>
    </main>
  );
}