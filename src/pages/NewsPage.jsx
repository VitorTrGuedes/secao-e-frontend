import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Search, X, Newspaper } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export default function NewsPage() {
  // Gaveta nomeada de forma limpa para notícias
  const [newsList, setNewsList] = useState([]);
  const [filter, setFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // A rota do backend continua sendo /articles/
    axios.get(`${API_URL}/articles/`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        // Filtramos e guardamos apenas as notícias na lista de newsList
        setNewsList(data.filter(a => a.post_type === 'news'));
      })
      .catch(err => console.error("Erro ao carregar notícias:", err));
  }, []);

  const filteredNews = newsList.filter(news => {
    const matchCat = filter === 'todos' || news.category === filter;
    const term = searchTerm.toLowerCase().trim();
    const matchSearch = term === '' || 
      news.title?.toLowerCase().includes(term) || 
      news.content?.toLowerCase().includes(term);

    return matchCat && matchSearch;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8 border-b border-secao-border pb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3 mb-2">
          <Newspaper className="text-secao-red" /> Notícias em Tempo Real
        </h1>
        <p className="text-slate-400 text-sm">Atualizações automáticas diárias do universo do Cinema, Animes e Séries.</p>

        {/* BARRA DE PESQUISA E FILTROS */}
        <div className="flex flex-col md:flex-row gap-4 justify-start items-center mt-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Buscar notícia..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-secao-red outline-none"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          <nav className="flex gap-2">
            {['todos', 'cinema', 'anime', 'serie'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                  filter === cat 
                    ? 'bg-secao-red text-white shadow' 
                    : 'bg-secao-card text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat === 'todos' ? 'Todas' : cat}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* GRID DE NOTÍCIAS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredNews.length === 0 ? (
          <p className="text-slate-500 italic col-span-full py-10 text-center">Nenhuma notícia encontrada com esses filtros.</p>
        ) : (
          filteredNews.map(news => (
            <article key={news.id} className="bg-secao-card border border-secao-border rounded-xl overflow-hidden hover:border-secao-red transition group flex flex-col justify-between">
              <Link to={`/artigo/${news.slug}`}>
                <figure className="relative h-44 bg-slate-900 overflow-hidden">
                  <img src={news.image_url} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black uppercase px-2 py-1 rounded border border-slate-700">
                    {news.category}
                  </span>
                </figure>
                <div className="p-4">
                  <h2 className="text-base font-bold mb-2 text-white line-clamp-2 group-hover:text-secao-red transition">{news.title}</h2>
                  <p className="text-slate-400 text-xs line-clamp-3">{news.content}</p>
                </div>
              </Link>
              <footer className="p-4 pt-0 text-xs text-slate-500 flex items-center justify-between border-t border-slate-800/50 mt-3">
                <span><Calendar size={12} className="inline mr-1" />{new Date(news.created_at).toLocaleDateString()}</span>
                <span>por <strong className="text-slate-300">{news.author}</strong></span>
              </footer>
            </article>
          ))
        )}
      </section>
    </main>
  );
}