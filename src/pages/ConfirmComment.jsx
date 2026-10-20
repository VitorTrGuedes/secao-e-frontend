import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MailCheck } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export default function ConfirmComment() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState(token ? 'ready' : 'invalid');
  const [articleSlug, setArticleSlug] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirm = async () => {
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await axios.post(`${API_URL}/comments/confirm/`, { token });
      setArticleSlug(response.data.article_slug);
      setStatus('confirmed');
    } catch (error) {
      const detail = error?.response?.data?.detail;
      setErrorMessage(
        typeof detail === 'string'
          ? detail
          : 'Não foi possível confirmar o e-mail. Tente novamente mais tarde.'
      );
      setStatus('error');
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-20 text-center">
      <section className="rounded-2xl border border-secao-border bg-secao-card p-8 shadow-xl">
        <MailCheck className="mx-auto mb-4 text-secao-purple" size={40} aria-hidden="true" />
        <h1 className="mb-3 text-2xl font-extrabold text-white">Confirmação do comentário</h1>

        {status === 'ready' && (
          <>
            <p className="mb-6 text-slate-300">
              Confirme seu e-mail para publicar seu comentário. O endereço não será exibido no site.
            </p>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-lg bg-secao-purple px-6 py-3 font-bold text-white transition hover:bg-violet-600"
            >
              Confirmar e publicar comentário
            </button>
          </>
        )}

        {status === 'submitting' && (
          <p role="status" className="text-slate-300">Confirmando seu e-mail...</p>
        )}

        {status === 'confirmed' && (
          <>
            <p role="status" className="mb-6 text-green-400">
              E-mail confirmado. Seu comentário já está publicado.
            </p>
            <Link
              to={`/artigo/${articleSlug}`}
              className="inline-flex items-center gap-2 font-semibold text-secao-purple hover:underline"
            >
              Ver análise e comentário
            </Link>
          </>
        )}

        {status === 'invalid' && (
          <p role="alert" className="text-rose-200">
            O link de confirmação está incompleto. Solicite um novo link ao enviar seu comentário novamente.
          </p>
        )}

        {status === 'error' && (
          <>
            <p role="alert" className="mb-4 text-rose-200">{errorMessage}</p>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-lg bg-secao-purple px-6 py-3 font-bold text-white transition hover:bg-violet-600"
            >
              Tentar novamente
            </button>
          </>
        )}

        <Link to="/" className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white">
          <ArrowLeft size={16} aria-hidden="true" /> Voltar para o início
        </Link>
      </section>
    </main>
  );
}
