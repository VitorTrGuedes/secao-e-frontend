import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Star, Calendar, Search, X, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export default function ReviewsPage() {
  // Gaveta nomeada de forma limpa e semântica
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // A rota do backend continua sendo /articles/
    axios.get(`${API_URL}/articles/`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        // Filtramos e guardamos apenas as críticas na lista de reviews
        setReviews(data.filter(a => a.post_type === 'review'));
      })
      .catch(err => console.error("Erro ao carregar análises:", err));
  }, []);

  const filteredReviews = reviews.filter(review => {
    const matchCat = filter === 'todos' || review.category === filter;
    const term = searchTerm.toLowerCase().trim();
    const matchSearch = term === '' || 
      review.title?.toLowerCase().includes(term) || 
      review.content?.toLowerCase().includes(term);

    return matchCat && matchSearch;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8 border-b border-secao-border pb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3 mb-2">
          <Sparkles className="text-secao-purple" /> Análises da Obra
        </h1>
        <p className="text-slate-400 text-sm">Críticas autorais sobre filmes, séries e animes com notas e espaço aberto para o debate.</p>

        {/* BARRA DE PESQUISA E FILTROS */}
        <div className="flex flex-col md:flex-row gap-4 justify-start items-center mt-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Buscar análise..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-secao-purple outline-none"
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
                    ? 'bg-secao-purple text-white shadow' 
                    : 'bg-secao-card text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat === 'todos' ? 'Todas' : cat}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* GRID DE ANÁLISES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredReviews.length === 0 ? (
          <p className="text-slate-500 italic col-span-full py-10 text-center">Nenhuma análise encontrada com esses filtros.</p>
        ) : (
          filteredReviews.map(review => (
            <article key={review.id} className="bg-secao-card border border-secao-border rounded-xl overflow-hidden hover:border-secao-purple transition group flex flex-col justify-between">
              <Link to={`/artigo/${review.slug}`}>
                <figure className="relative h-48 bg-slate-900 overflow-hidden">
                  <img src={review.image_url} alt={review.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black uppercase px-2 py-1 rounded border border-slate-700">
                    {review.category}
                  </span>
                  {review.rating && (
                    <span className="absolute top-3 right-3 bg-yellow-500/90 text-slate-950 font-black text-xs px-2 py-1 rounded flex items-center gap-1 shadow">
                      <Star size={12} fill="currentColor" /> {review.rating}/10
                    </span>
                  )}
                </figure>
                <div className="p-5">
                  <h2 className="text-lg font-bold mb-2 text-white line-clamp-2 group-hover:text-secao-purple transition">{review.title}</h2>
                  <p className="text-slate-400 text-sm line-clamp-3">{review.content}</p>
                </div>
              </Link>
              <footer className="p-5 pt-0 text-xs text-slate-500 flex items-center justify-between border-t border-slate-800/50 mt-4">
                <span><Calendar size={12} className="inline mr-1" />{new Date(review.created_at).toLocaleDateString()}</span>
                <span>por <strong className="text-slate-300">{review.author || 'Autor'}</strong></span>
              </footer>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
