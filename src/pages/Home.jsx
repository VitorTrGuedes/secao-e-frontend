import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Star, Calendar } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/articles/`)
      .then(res => {
        setArticles(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar artigos:", err);
        setLoading(false);
      });
  }, []);

  const filteredArticles = filter === 'todos' 
    ? articles 
    : articles.filter(a => a.category === filter);

  if (loading) {
    return <p className="text-center py-20 text-slate-400 font-semibold">Carregando portal Seção E...</p>;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* HERO BANNER  */}
      <header className="mb-10 text-center md:text-left border-b border-secao-border pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-white">
          Cinema, Animes & <span className="text-secao-red">Séries</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Notícias atualizadas, opiniões do autor e espaço aberto para a comunidade opinar!
        </p>

        {/* FILTROS POR CATEGORIA - Usando <nav> */}
        <nav aria-label="Filtros de categoria" className="flex flex-wrap justify-center md:justify-start gap-2 mt-6">
          {['todos', 'cinema', 'anime', 'serie'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition ${
                filter === cat 
                  ? 'bg-secao-red text-white shadow-md' 
                  : 'bg-secao-card hover:bg-slate-700 text-slate-300'
              }`}
            >
              {cat === 'todos' ? '🔥 Todos' : cat}
            </button>
          ))}
        </nav>
      </header>

      {/* GRID DE CARDS  */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.length === 0 ? (
          <p className="text-slate-500 italic col-span-full text-center py-10">Nenhum post encontrado nesta categoria.</p>
        ) : (
          filteredArticles.map(article => (
            /* CADA CARD AGORA É UM <article> SEMÂNTICO */
            <article 
              key={article.id} 
              className="bg-secao-card border border-secao-border rounded-xl overflow-hidden hover:border-secao-red transition group flex flex-col justify-between"
            >
              <Link to={`/artigo/${article.slug}`}>
                {/* CONTAINER DA IMAGEM - Usando <figure> */}
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
                    {article.post_type === 'review' ? 'Crítica do Autor' : 'Notícia'}
                  </span>
                  <h2 className="text-xl font-bold mt-1 mb-3 text-white line-clamp-2 group-hover:text-secao-red transition">
                    {article.title}
                  </h2>
                  <p className="text-slate-400 text-sm line-clamp-3">
                    {article.content}
                  </p>
                </div>
              </Link>

              {/* RODAPÉ DO CARD - Usando <footer> */}
              <footer className="p-5 pt-0 text-xs text-slate-500 flex items-center gap-1 border-t border-slate-800/50 mt-4">
                <Calendar size={12} /> {new Date(article.created_at).toLocaleDateString()}
              </footer>
            </article>
          ))
        )}
      </section>
    </main>
  );
}