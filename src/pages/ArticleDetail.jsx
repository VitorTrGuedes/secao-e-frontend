import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, Send, MessageSquare, User, Calendar, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [authorName, setAuthorName] = useState('');
  const [opinion, setOpinion] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const loadArticle = () => {
    axios.get(`${API_URL}/articles/${slug}/`)
      .then(res => {
        setArticle(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar o post:", err);
        setArticle(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!article) return;
    try {
      await axios.post(`${API_URL}/comments/`, {
        article: article.id,
        author_name: authorName,
        opinion: opinion
      });
      setMsg('Sua opinião foi enviada com sucesso!');
      setAuthorName('');
      setOpinion('');
      loadArticle();
    } catch (err) {
      setMsg('Erro ao enviar sua opinião. Tente novamente.');
    }
  };

  // 🛡️ BLINDAGEM: Se comments não existir, assume uma lista vazia []
  const comments = Array.isArray(article?.comments) ? article.comments : [];

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400 font-medium text-lg animate-pulse">Carregando análise da Seção E...</p>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Publicação não encontrada</h1>
        <Link to="/" className="inline-flex items-center gap-2 text-secao-purple hover:underline">
          <ArrowLeft size={16} /> Voltar para o início
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* BOTÃO VOLTAR */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-secao-red transition mb-6"
      >
        <ArrowLeft size={14} /> Voltar para as publicações
      </Link>

      {/* ARTIGO PRINCIPAL */}
      <article className="bg-secao-card border border-secao-border rounded-2xl p-6 md:p-10 shadow-2xl mb-12">
        {article.image_url && (
          <figure className="relative -mx-6 -mt-6 md:-mx-10 md:-mt-10 mb-8 overflow-hidden rounded-t-2xl">
            <img 
              src={article.image_url} 
              alt={article.title} 
              className="w-full h-80 md:h-96 object-cover" 
            />
          </figure>
        )}

        <header className="mb-8 border-b border-secao-border pb-6">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="bg-secao-red text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wide">
                {article.category}
              </span>
              <time className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Calendar size={14} /> {new Date(article.created_at).toLocaleDateString()}
              </time>
              {article.author && (
                <span className='text-xs text-slate-400 font-medium'>
                  por <strong className='text-slate-200 font-semibold'>{article.author}</strong>
                </span>
              )}
            </div>

            {article.rating && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-black text-lg px-4 py-1.5 rounded-xl flex items-center gap-2 shadow">
                <Star fill="currentColor" size={20} /> Nota: {article.rating}/10
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            {article.title}
          </h1>
        </header>

        <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed whitespace-pre-line">
          {article.content}
        </div>
      </article>

      {/* SEÇÃO DE COMENTÁRIOS */}
      <section className="bg-secao-card border border-secao-border rounded-2xl p-6 md:p-8 shadow-xl">
        <header className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-secao-purple">
            <MessageSquare /> Opiniões da Comunidade
          </h2>
          {/* ✅ AQUI ESTAVA O ERRO: Agora usamos a variável protegida 'comments' */}
          <span className="text-xs font-bold bg-slate-900 px-3 py-1 rounded-full text-slate-400 border border-slate-800">
            {comments.length} {comments.length === 1 ? 'opinião' : 'opiniões'}
          </span>
        </header>

        {/* FORMULÁRIO DE ENVIO */}
        <form onSubmit={handleCommentSubmit} className="space-y-4 mb-10 bg-slate-950/70 p-5 rounded-xl border border-slate-800">
          <h3 className="font-semibold text-slate-200 text-sm">
            O que você achou desta obra? Deixe sua visão abaixo:
          </h3>
          
          {msg && <p className="text-sm font-semibold text-green-400 bg-green-950/40 p-3 rounded border border-green-800">{msg}</p>}

          <div>
            <label htmlFor="author_name" className="sr-only">Seu nome ou apelido</label>
            <input 
              id="author_name"
              type="text" 
              placeholder="Seu nome ou apelido"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-secao-purple text-sm"
            />
          </div>

          <div>
            <label htmlFor="opinion" className="sr-only">Sua opinião</label>
            <textarea 
              id="opinion"
              placeholder="Escreva aqui sua opinião sobre o filme, série ou anime..."
              value={opinion}
              onChange={(e) => setOpinion(e.target.value)}
              required
              rows="3"
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-secao-purple text-sm"
            />
          </div>

          <button 
            type="submit" 
            className="bg-secao-purple hover:bg-violet-600 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition shadow-lg shadow-purple-950/50 text-sm"
          >
            <Send size={16} /> Publicar Minha Opinião
          </button>
        </form>

        {/* LISTA DE COMENTÁRIOS */}
        <ul className="space-y-4">
          {comments.length === 0 ? (
            <li className="text-slate-500 italic text-center py-6 bg-slate-950/30 rounded-xl border border-slate-900">
              Nenhum leitor opinou ainda. Seja o primeiro a deixar sua marca!
            </li>
          ) : (
            comments.map(c => (
              <li key={c.id} className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/80">
                <header className="flex justify-between items-center mb-2">
                  <strong className="font-bold text-secao-purple flex items-center gap-1.5 text-sm">
                    <User size={14} /> {c.author_name}
                  </strong>
                  <time className="text-[10px] text-slate-500">
                    {new Date(c.created_at).toLocaleDateString()}
                  </time>
                </header>
                <p className="text-slate-300 text-sm leading-relaxed">{c.opinion}</p>
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  );
}