import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export default function DeleteComment() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState(token ? 'ready' : 'invalid');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = async () => {
    if (!token) return;
    setStatus('submitting');
    setErrorMessage('');

    try {
      await axios.delete(`${API_URL}/comments/delete/`, { data: { token } });
      setStatus('deleted');
    } catch (error) {
      const detail = error?.response?.data?.detail;
      setErrorMessage(
        typeof detail === 'string'
          ? detail
          : 'O link de exclusão é inválido, expirou ou já foi utilizado.'
      );
      setStatus('error');
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-20 text-center">
      <section className="rounded-2xl border border-secao-border bg-secao-card p-8 shadow-xl">
        <Trash2 className="mx-auto mb-4 text-secao-red" size={40} aria-hidden="true" />
        <h1 className="mb-3 text-2xl font-extrabold text-white">Apagar comentário</h1>

        {status === 'ready' && (
          <>
            <p className="mb-6 text-slate-300">
              Este link confirma que você é a pessoa que publicou o comentário. Deseja apagá-lo?
            </p>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg bg-secao-red px-6 py-3 font-bold text-white transition hover:bg-rose-700"
            >
              Apagar meu comentário
            </button>
          </>
        )}

        {status === 'submitting' && (
          <p role="status" className="text-slate-300">Apagando comentário...</p>
        )}

        {status === 'deleted' && (
          <>
            <p role="status" className="mb-6 flex items-center justify-center gap-2 text-green-400">
              <CheckCircle size={18} /> Comentário apagado com sucesso.
            </p>
            <Link to="/" className="font-semibold text-secao-purple hover:underline">
              Voltar para o início
            </Link>
          </>
        )}

        {status === 'invalid' && (
          <p role="alert" className="text-rose-200">
            O link de exclusão está incompleto.
          </p>
        )}

        {status === 'error' && (
          <>
            <p role="alert" className="mb-5 text-rose-200">{errorMessage}</p>
            <Link to="/" className="font-semibold text-secao-purple hover:underline">
              Voltar para o início
            </Link>
          </>
        )}

        {status !== 'deleted' && (
          <Link to="/" className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white">
            <ArrowLeft size={16} aria-hidden="true" /> Voltar para o início
          </Link>
        )}
      </section>
    </main>
  );
}
