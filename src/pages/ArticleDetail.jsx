import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, Send, MessageSquare, User, Calendar, ArrowLeft, ExternalLink, Newspaper } from 'lucide-react';
import { getApiErrorMessage } from '../utils/apiError';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [recentNews, setRecentNews] = useState([]);
  const [relatedError, setRelatedError] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [email, setEmail] = useState('');
  const [opinion, setOpinion] = useState('');
  const [commentMessage, setCommentMessage] = useState('');
  const [commentError, setCommentError] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [loadedSlug, setLoadedSlug] = useState(null);
  const [loadError, setLoadError] = useState('');
  const loading = loadedSlug !== slug;

  const loadArticle = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/articles/${slug}/`);
      setArticle(res.data);
      setLoadError('');
    } catch (err) {
      console.error("Erro ao carregar o post:", err);
      setArticle(null);
      if (err?.response?.status === 404) {
        setLoadError('');
      } else {
        setLoadError(getApiErrorMessage(err, 'esta publicação'));
      }
    } finally {
      setLoadedSlug(slug);
    }
  }, [slug]);

  useEffect(() => {
    loadArticle();
  }, [loadArticle]);

  useEffect(() => {
    axios.get(`${API_URL}/articles/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        setRecentNews(data.filter((item) => item.post_type === 'news' && item.slug !== slug).slice(0, 8));
        setRelatedError('');
      })
      .catch((err) => {
        console.error('Erro ao carregar outras notícias:', err);
        setRelatedError(getApiErrorMessage(err, 'outras notícias'));
      });
  }, [slug]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!article) return;
    setCommentSubmitting(true);
    setCommentMessage('');
    setCommentError('');
    try {
      await axios.post(`${API_URL}/comments/`, {
        article: article.id,
        author_name: authorName,
        email,
        opinion: opinion
      });
      setCommentMessage('Enviamos um link de confirmação para seu e-mail. Seu comentário aparecerá após a confirmação.');
      setAuthorName('');
      setEmail('');
      setOpinion('');
    } catch (error) {
      const detail = error?.response?.data?.detail;
      setCommentError(
        typeof detail === 'string'
          ? detail
          : 'Não foi possível enviar o comentário. Confira os dados e tente novamente.'
      );
    } finally {
      setCommentSubmitting(false);
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
        {loadError ? (
          <>
            <h1 className="text-2xl font-bold text-white mb-4">Não foi possível carregar a publicação</h1>
            <p role="alert" className="mb-6 text-rose-200">{loadError}</p>
            <button
              type="button"
              onClick={() => {
                setLoadedSlug(null);
                loadArticle();
              }}
              className="mr-4 text-secao-purple hover:underline"
            >
              Tentar novamente
            </button>
          </>
        ) : (
          <h1 className="text-2xl font-bold text-white mb-4">Publicação não encontrada</h1>
        )}
        <Link to="/" className="inline-flex items-center gap-2 text-secao-purple hover:underline">
          <ArrowLeft size={16} /> Voltar para o início
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* BOTÃO VOLTAR */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-secao-red transition mb-6"
      >
        <ArrowLeft size={14} /> Voltar para as publicações
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] gap-8 items-start">
      {/* ARTIGO PRINCIPAL */}
      <article className="min-w-0 bg-secao-card border border-secao-border rounded-2xl p-6 md:p-10 shadow-2xl">
        {article.image_url && (
          <figure className="relative -mx-6 -mt-6 md:-mx-10 md:-mt-10 mb-8 min-h-40 overflow-hidden rounded-t-2xl bg-slate-950 flex items-center justify-center">
            <Newspaper aria-hidden="true" className="absolute text-slate-700" size={40} />
            <img 
              src={article.image_url} 
              alt={article.title} 
              onError={(event) => { event.currentTarget.hidden = true; }}
              className="relative block max-h-80 w-full object-contain bg-slate-950 sm:max-h-[32rem]"
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

          <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
            {article.title}
          </h1>
        </header>

        {article.content_html ? (
          <div
            className="max-w-none text-slate-300 text-lg leading-relaxed [&_p]:mb-5 [&_strong]:font-bold [&_strong]:text-white [&_ul]:my-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-secao-red [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:my-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:my-5 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_a]:text-secao-red [&_a]:underline [&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl"
            dangerouslySetInnerHTML={{ __html: article.content_html }}
          />
        ) : (
          <div className="max-w-none whitespace-pre-line text-lg leading-relaxed text-slate-300">
            {article.content}
          </div>
        )}
        {article.source_url && (
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-secao-red hover:text-rose-400 transition"
          >
            Acessar matéria original <ExternalLink size={16} aria-hidden="true" />
          </a>
        )}
      </article>

      <aside className="rounded-2xl border border-secao-border bg-secao-card p-5 lg:sticky lg:top-6">
        <h2 className="mb-5 border-b border-secao-border pb-3 text-lg font-extrabold uppercase tracking-wide text-white">
          <span className="border-l-4 border-secao-red pl-3">Mais notícias</span>
        </h2>
        {relatedError ? (
          <p role="alert" className="text-sm text-rose-200">{relatedError}</p>
        ) : recentNews.length === 0 ? (
          <p className="text-sm text-slate-400">Não há outras notícias disponíveis.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            {recentNews.map((news) => (
              <Link
                key={news.id}
                to={`/artigo/${news.slug}`}
                className="group min-w-0"
              >
                <figure className="relative mb-2 flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-slate-950">
                  <Newspaper aria-hidden="true" className="absolute text-slate-700" size={30} />
                  {news.image_url && (
                    <img
                      src={news.image_url}
                      alt=""
                      onError={(event) => { event.currentTarget.hidden = true; }}
                      className="relative h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  )}
                </figure>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secao-red">
                  {news.category}
                </span>
                <span className="mt-1 block text-sm font-semibold leading-snug text-slate-200 transition group-hover:text-white">
                  {news.title}
                </span>
              </Link>
            ))}
          </div>
        )}
      </aside>
      </div>

      {/* SEÇÃO DE COMENTÁRIOS */}
      <section className="bg-secao-card border border-secao-border rounded-2xl p-6 md:p-8 shadow-xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-secao-purple sm:text-2xl">
            <MessageSquare className="shrink-0" /> Opiniões da Comunidade
          </h2>
          {/* ✅ AQUI ESTAVA O ERRO: Agora usamos a variável protegida 'comments' */}
          <span className="text-xs font-bold bg-slate-900 px-3 py-1 rounded-full text-slate-400 border border-slate-800">
            {comments.length} {comments.length === 1 ? 'opinião' : 'opiniões'}
          </span>
        </header>

        {/* FORMULÁRIO DE ENVIO */}
        <form onSubmit={handleCommentSubmit} className="mb-10 space-y-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5">
          <h3 className="font-semibold text-slate-200 text-sm">
            O que você achou desta obra? Deixe sua visão abaixo:
          </h3>
          
          {commentMessage && (
            <p role="status" className="text-sm font-semibold text-green-400 bg-green-950/40 p-3 rounded border border-green-800">
              {commentMessage}
            </p>
          )}
          {commentError && (
            <p role="alert" className="text-sm font-semibold text-rose-200 bg-rose-950/40 p-3 rounded border border-rose-800">
              {commentError}
            </p>
          )}

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
            <label htmlFor="comment_email" className="sr-only">Seu e-mail</label>
            <input
              id="comment_email"
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              maxLength={254}
              required
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-secao-purple text-sm"
            />
            <p className="mt-2 text-xs text-slate-500">
              Enviaremos um link para confirmar seu endereço. Seu e-mail não será exibido no site.
            </p>
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
            disabled={commentSubmitting}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-secao-purple px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-950/50 transition hover:bg-violet-600 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
          >
            <Send size={16} /> {commentSubmitting ? 'Enviando...' : 'Enviar para confirmação'}
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