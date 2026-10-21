import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Star, Calendar, Search, X, ArrowRight, Newspaper, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export default function Home() {
  const [articles, setArticles] = useState(() => {
    try {
      const cached = localStorage.getItem('secao_e_articles');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => !localStorage.getItem('secao_e_articles'));

  const [filter, setFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/articles/`, { params: { _: Date.now() } })
      .then(res => {
        if (res.status !== 200) return;

        const data = Array.isArray(res.data) 
          ? res.data 
          : (res.data?.results || []);
        
        setArticles(data);
        localStorage.setItem('secao_e_articles', JSON.stringify(data));
      })
      .catch(err => {
        console.error("Erro ao carregar artigos:", err);
      })
      .finally(() => setLoading(false));
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

  const latestReviews = filteredArticles.filter(a => a.post_type === 'review').slice(0, 3);
  const latestNews = filteredArticles.filter(a => a.post_type === 'news').slice(0, 6);

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
        <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
          Cinema, Animes & <span className="text-secao-red">Séries</span>
        </h1>
        <p className="mb-8 text-base text-slate-400 sm:text-lg">
          Notícias, opiniões e análises simples e diretas, além de espaço aberto para a comunidade opinar!
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
          <nav aria-label="Filtros de categoria" className="grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center md:w-auto">
            {['todos', 'cinema', 'anime', 'serie'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`min-h-11 rounded-xl px-3 py-2 text-xs font-bold uppercase transition sm:px-4 ${
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

     {/* 🌟 SEÇÃO 1: ÚLTIMAS ANÁLISES DA OBRA */}
      <section className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-white sm:text-2xl">
            <Sparkles className="text-secao-purple" /> Últimas Análises da Obra
          </h2>
          <Link to="/analises" className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-secao-purple transition hover:text-violet-400">
            Ver todas as análises <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestReviews.length === 0 ? (
            <p className="text-slate-500 italic col-span-full">
              {filter !== 'todos' || searchTerm ? 'Nenhuma análise encontrada com esses filtros.' : 'Nenhuma análise cadastrada ainda.'}
            </p>
          ) : (
            latestReviews.map(article => (
              <article key={article.id} className="bg-secao-card border border-secao-border rounded-xl overflow-hidden hover:border-secao-purple transition group flex flex-col justify-between">
                <Link to={`/artigo/${article.slug}`}>
                  <figure className="relative aspect-video overflow-hidden bg-slate-900">
                    <img src={article.image_url} alt={article.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
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
                    <span className="text-xs font-semibold text-secao-purple uppercase tracking-wider">Análise</span>
                    <h3 className="text-lg font-bold mt-1 mb-2 text-white line-clamp-2 group-hover:text-secao-purple transition">
                      {article.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2">{article.content}</p>
                  </div>
                </Link>
                <footer className="p-5 pt-0 text-xs text-slate-500 flex items-center justify-between border-t border-slate-800/50 mt-4">
                  <span><Calendar size={12} className="inline mr-1" />{new Date(article.created_at).toLocaleDateString()}</span>
                  <span>por <strong className="text-slate-300">{article.author || 'Autor'}</strong></span>
                </footer>
              </article>
            ))
          )}
        </div>
      </section>

      {/* 📰 SEÇÃO 2: ÚLTIMAS NOTÍCIAS */}
      <section className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-white sm:text-2xl">
            <Newspaper className="text-secao-red" /> Notícias Recentes
          </h2>
          <Link to="/noticias" className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-secao-red transition hover:text-rose-400">
            Ver todas as notícias <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.length === 0 ? (
            <p className="text-slate-500 italic col-span-full">
              {filter !== 'todos' || searchTerm ? 'Nenhuma notícia encontrada com esses filtros.' : 'Nenhuma notícia disponível no momento.'}
            </p>
          ) : (
            latestNews.map(article => (
              <article key={article.id} className="bg-secao-card border border-secao-border rounded-xl overflow-hidden hover:border-secao-red transition group flex flex-col justify-between">
                <Link to={`/artigo/${article.slug}`}>
                  <figure className="relative aspect-video overflow-hidden bg-slate-900">
                    <Newspaper aria-hidden="true" className="absolute inset-0 m-auto text-slate-700" size={36} />
                    {article.image_url && (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        onError={(event) => { event.currentTarget.hidden = true; }}
                        className="relative h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    )}
                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black uppercase px-2 py-1 rounded border border-slate-700">
                      {article.category}
                    </span>
                  </figure>
                  <div className="p-4">
                    <span className="text-xs font-semibold text-secao-red uppercase tracking-wider">Notícia</span>
                    <h3 className="text-base font-bold mt-1 mb-2 text-white line-clamp-2 group-hover:text-secao-red transition">
                      {article.title}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-2">{article.content}</p>
                  </div>
                </Link>
                <footer className="p-4 pt-0 text-xs text-slate-500 flex items-center justify-between border-t border-slate-800/50 mt-3">
                  <span><Calendar size={12} className="inline mr-1" />{new Date(article.created_at).toLocaleDateString()}</span>
                  <span>por <strong className="text-slate-300">{article.author}</strong></span>
                </footer>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}