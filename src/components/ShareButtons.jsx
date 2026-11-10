import { Camera, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';

function getArticleUrl() {
  return window.location.href;
}

export default function ShareButtons({ title }) {
  const [instagramMessage, setInstagramMessage] = useState('');
  const url = getArticleUrl();
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(`${title} ${url}`);

  const openShareWindow = (shareUrl) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const shareOnInstagram = async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API indisponível');
      }
      await navigator.clipboard.writeText(url);
      setInstagramMessage('Link copiado!');
    } catch (error) {
      console.error('Não foi possível copiar o link para o Instagram:', error);
      setInstagramMessage('Copie o link da página para compartilhar.');
    }
    openShareWindow('https://www.instagram.com/');
  };

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Compartilhar publicação">
      <span className="basis-full text-xs font-semibold uppercase tracking-wide text-slate-500 sm:basis-auto sm:mr-1">Compartilhar:</span>
      <button
        type="button"
        onClick={shareOnInstagram}
        title="Copiar link e abrir o Instagram"
        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-pink-500/40 bg-pink-500/10 px-2 py-2 text-xs font-bold text-pink-300 transition hover:border-pink-400 hover:bg-pink-500/20 sm:flex-none sm:px-3"
      >
        <Camera size={16} aria-hidden="true" /> Instagram
      </button>
      <button
        type="button"
        onClick={() => openShareWindow(`https://wa.me/?text=${encodedText}`)}
        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2 py-2 text-xs font-bold text-emerald-300 transition hover:border-emerald-400 hover:bg-emerald-500/20 sm:flex-none sm:px-3"
      >
        <MessageCircle size={16} aria-hidden="true" /> WhatsApp
      </button>
      <button
        type="button"
        onClick={() => openShareWindow(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodeURIComponent(url)}`)}
        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-sky-500/40 bg-sky-500/10 px-2 py-2 text-xs font-bold text-sky-300 transition hover:border-sky-400 hover:bg-sky-500/20 sm:flex-none sm:px-3"
      >
        <Send size={16} aria-hidden="true" /> Twitter
      </button>
      {instagramMessage && (
        <span role="status" className="basis-full text-xs text-slate-400 sm:basis-auto">
          {instagramMessage}
        </span>
      )}
    </div>
  );
}
