import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Send, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function SuggestReview() {
  const [authorName, setAuthorName] = useState('');
  const [titleSuggested, setTitleSuggested] = useState('');
  const [category, setCategory] = useState('cinema');
  const [reason, setReason] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });

    try {
      await axios.post(`${API_URL}/suggestions/`, {
        author_name: authorName,
        title_suggested: titleSuggested,
        category: category,
        reason: reason
      });

      setMsg({
        text: 'Sua sugestão foi enviada com sucesso! Obrigado pela indicação.',
        type: 'success'
      });
      setAuthorName('');
      setTitleSuggested('');
      setCategory('cinema');
      setReason('');
    } catch (err) {
      console.error("Erro ao enviar sugestão:", err);
      setMsg({
        text: 'Erro ao enviar a sugestão. Verifique os campos e tente novamente.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* BOTÃO VOLTAR */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-secao-red transition mb-6"
      >
        <ArrowLeft size={14} /> Voltar para as publicações
      </Link>

      {/* CARD DO FORMULÁRIO DE SUGESTÃO */}
      <section className="bg-secao-card border border-secao-border p-6 md:p-10 rounded-2xl shadow-2xl">
        <header className="mb-8 border-b border-secao-border pb-6">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2">
            <Sparkles className="text-secao-purple" size={28} /> 
            Sugerir Próxima Crítica
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Quer ver a opinião do autor sobre algum filme, anime ou série específico? Mande sua indicação abaixo!
          </p>
        </header>

        {/* MENSAGEM DE FEEDBACK */}
        {msg.text && (
          <div 
            className={`p-4 rounded-xl border mb-6 flex items-center gap-3 text-sm font-semibold ${
              msg.type === 'success' 
                ? 'bg-green-950/40 border-green-800 text-green-300' 
                : 'bg-red-950/40 border-red-800 text-red-300'
            }`}
          >
            {msg.type === 'success' && <CheckCircle2 size={20} className="shrink-0 text-green-400" />}
            <p>{msg.text}</p>
          </div>
        )}

        {/* FORMULÁRIO SEMÂNTICO */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label 
              htmlFor="author_name" 
              className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
            >
              Seu Nome ou Apelido <span className="text-secao-red">*</span>
            </label>
            <input 
              id="author_name"
              type="text" 
              placeholder="Ex: Vitor"
              value={authorName} 
              onChange={e => setAuthorName(e.target.value)} 
              required
              className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-secao-purple transition text-sm"
            />
          </div>

          <div>
            <label 
              htmlFor="title_suggested" 
              className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
            >
              Nome do Filme, Anime ou Série <span className="text-secao-red">*</span>
            </label>
            <input 
              id="title_suggested"
              type="text" 
              placeholder="Ex: Interstellar, Solo Leveling, Succession"
              value={titleSuggested} 
              onChange={e => setTitleSuggested(e.target.value)} 
              required
              className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-secao-purple transition text-sm"
            />
          </div>

          <div>
            <label 
              htmlFor="category" 
              className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
            >
              Categoria <span className="text-secao-red">*</span>
            </label>
            <select 
              id="category"
              value={category} 
              onChange={e => setCategory(e.target.value)}
              className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-secao-purple transition text-sm cursor-pointer"
            >
              <option value="cinema">Cinema</option>
              <option value="anime">Anime</option>
              <option value="serie">Série</option>
            </select>
          </div>

          <div>
            <label 
              htmlFor="reason" 
              className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
            >
              Por que eu deveria fazer essa análise? <span className="text-secao-red">*</span>
            </label>
            <textarea 
              id="reason"
              placeholder="Conte um pouco do motivo da sua indicação ou o que mais te chamou atenção nessa obra..."
              value={reason} 
              onChange={e => setReason(e.target.value)} 
              required
              rows="4"
              className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-secao-purple transition text-sm leading-relaxed"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-secao-purple hover:bg-violet-600 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-purple-950/50 disabled:opacity-50 text-sm mt-4 cursor-pointer"
          >
            <Send size={18} /> {loading ? 'Enviando Indicação...' : 'Enviar Indicação'}
          </button>
        </form>
      </section>
    </main>
  );
}