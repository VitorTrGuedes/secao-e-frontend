import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Calendar, Clock, PlayCircle, Search, Star, Tv, Users, X } from 'lucide-react';
import { getApiErrorMessage } from '../utils/apiError';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

function getItems(data) {
  if (Array.isArray(data)) return data;
  return data?.results || data?.items || data?.releases || data?.titles || [];
}

function getImage(item) {
  if (item.image_url || item.poster_url || item.poster) return item.image_url || item.poster_url || item.poster;
  return item.poster_path ? `${IMAGE_URL}${item.poster_path}` : '';
}

function getProviders(item) {
  const providers = item.providers || item.streaming_providers || item.watch_providers || [];
  return Array.isArray(providers) ? providers : [];
}

export default function WhereToWatch() {
  const [titles, setTitles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [titleDetails, setTitleDetails] = useState(null);
  const [titleDetailsLoading, setTitleDetailsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      setLoading(true);
      axios.get(`${API_URL}/streaming/`, {
        params: searchTerm.trim() ? { title: searchTerm.trim() } : {}
      })
        .then((res) => {
          if (!active) return;
          setTitles(getItems(res.data));
          setLoadError('');
        })
        .catch((error) => {
          if (!active) return;
          console.error('Erro ao carregar onde assistir:', error);
          setLoadError(getApiErrorMessage(error, 'os lançamentos'));
          setTitles([]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, searchTerm.trim() ? 350 : 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (!selectedTitle) {
      setTitleDetails(null);
      return undefined;
    }

    const title = selectedTitle.title || selectedTitle.name;
    if (!title) return undefined;

    let active = true;
    setTitleDetailsLoading(true);
    setTitleDetails(null);
    axios.get(`${API_URL}/title-details/`, { params: { title } })
      .then((res) => {
        if (active) setTitleDetails(res.data);
      })
      .catch((error) => {
        if (active) {
          setTitleDetails(null);
          console.error('Erro ao carregar detalhes do título:', error);
        }
      })
      .finally(() => {
        if (active) setTitleDetailsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedTitle]);

  const streamingNames = useMemo(() => (
    [...new Set(titles.flatMap(getProviders).map(provider => provider.name || provider.provider_name).filter(Boolean))]
  ), [titles]);

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedTitle(null);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8 border-b border-secao-border pb-6">
        <h1 className="mb-2 flex items-center gap-3 text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
          <Tv className="shrink-0 text-secao-purple" /> Onde Assistir
        </h1>
        <p className="text-sm text-slate-400">
          Encontre os lançamentos e descubra em qual streaming assistir.
        </p>

        <div className="relative mt-6 w-full max-w-2xl">
          <label htmlFor="streaming-search" className="sr-only">Buscar filme ou série</label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            id="streaming-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar filme ou série..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-11 text-sm text-white outline-none transition focus:border-secao-purple"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Limpar busca"
              className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {streamingNames.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {streamingNames.map(name => (
              <span key={name} className="rounded-full border border-secao-border bg-secao-card px-3 py-1 text-xs font-semibold text-slate-300">
                {name}
              </span>
            ))}
          </div>
        )}
      </header>

      {selectedTitle ? (
        <section className="mb-8 overflow-hidden rounded-2xl border border-secao-purple/50 bg-secao-card shadow-xl">
          <div className="grid gap-6 p-5 sm:grid-cols-[12rem_1fr] sm:p-8">
            <img
              src={getImage(selectedTitle)}
              alt={selectedTitle.title || selectedTitle.name}
              className="mx-auto aspect-[2/3] w-48 rounded-xl object-cover sm:mx-0 sm:w-full"
            />
            <div className="min-w-0">
              <button type="button" onClick={() => setSelectedTitle(null)} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-secao-purple hover:text-violet-300">
                <ArrowLeft size={16} /> Voltar aos lançamentos
              </button>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">{selectedTitle.title || selectedTitle.name}</h2>
              {(selectedTitle.release_date || selectedTitle.first_air_date) && (
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                  <Calendar size={15} /> {new Date(selectedTitle.release_date || selectedTitle.first_air_date).toLocaleDateString()}
                </p>
              )}
              {selectedTitle.overview && <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">{selectedTitle.overview}</p>}
              <section aria-label="Informações do título" className="mt-6 rounded-xl border border-secao-border bg-slate-950/30 p-4">
                {titleDetailsLoading ? (
                  <p role="status" className="text-sm text-slate-400">Carregando informações do título...</p>
                ) : titleDetails ? (
                  <>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300">
                      {titleDetails.year && <span>{titleDetails.year}</span>}
                      {titleDetails.runtime && (
                        <span className="inline-flex items-center gap-1">
                          <Clock size={14} /> {titleDetails.runtime} min
                        </span>
                      )}
                      {titleDetails.genres?.length > 0 && <span>{titleDetails.genres.join(' • ')}</span>}
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
                        <p className="text-[10px] font-black uppercase tracking-wide text-yellow-300">Nota TMDB</p>
                        <p className="mt-1 flex items-center gap-1 text-lg font-black text-white">
                          <Star size={16} fill="currentColor" className="text-yellow-400" />
                          {titleDetails.vote_average ? `${Number(titleDetails.vote_average).toFixed(1)}/10` : '—'}
                        </p>
                      </div>
                      <div className="rounded-lg border border-secao-purple/30 bg-secao-purple/10 p-3">
                        <p className="text-[10px] font-black uppercase tracking-wide text-secao-purple">Popularidade</p>
                        <p className="mt-1 text-lg font-black text-white">
                          {titleDetails.popularity ? Number(titleDetails.popularity).toFixed(1) : '—'}
                        </p>
                      </div>
                      <div className="rounded-lg border border-secao-border bg-secao-card p-3">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Votos TMDB</p>
                        <p className="mt-1 text-lg font-black text-white">
                          {titleDetails.vote_count ? titleDetails.vote_count.toLocaleString('pt-BR') : '—'}
                        </p>
                      </div>
                    </div>
                    {(titleDetails.director || titleDetails.writers?.length > 0 || titleDetails.cast?.length > 0) && (
                      <div className="mt-4 space-y-2 border-t border-secao-border pt-4 text-sm text-slate-300">
                        {titleDetails.director && (
                          <p><strong className="text-white">Direção:</strong> {titleDetails.director}</p>
                        )}
                        {titleDetails.writers?.length > 0 && (
                          <p><strong className="text-white">Roteiro:</strong> {titleDetails.writers.join(', ')}</p>
                        )}
                        {titleDetails.cast?.length > 0 && (
                          <p className="flex items-start gap-2">
                            <Users size={16} className="mt-0.5 shrink-0 text-secao-purple" />
                            <span><strong className="text-white">Elenco:</strong> {titleDetails.cast.join(' • ')}</span>
                          </p>
                        )}
                      </div>
                    )}
                    {titleDetails.tmdb_url && (
                      <a
                        href={titleDetails.tmdb_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex text-xs font-semibold text-secao-purple hover:text-violet-300"
                      >
                        Ver ficha completa no TMDB
                      </a>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-slate-500">Detalhes adicionais indisponíveis para este título.</p>
                )}
              </section>
              <div className="mt-6 flex flex-wrap gap-2">
                {getProviders(selectedTitle).map(provider => (
                  <span key={`${provider.id || provider.name}-${provider.type || 'streaming'}`} className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs font-semibold text-slate-200">
                    {provider.name || provider.provider_name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section>
          <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-white">
              <PlayCircle className="text-secao-red" /> {searchTerm ? 'Resultados da busca' : 'Últimos lançamentos'}
            </h2>
          </div>

          {loading ? (
            <p role="status" className="py-10 text-center text-slate-400">Carregando lançamentos...</p>
          ) : loadError ? (
            <p role="alert" className="rounded-xl border border-rose-800 bg-rose-950/40 p-4 text-center text-sm text-rose-200">{loadError}</p>
          ) : titles.length === 0 ? (
            <p className="py-10 text-center italic text-slate-500">Nenhum título encontrado.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {titles.map((title, index) => (
                <button
                  type="button"
                  key={title.id || title.slug || `${title.title}-${index}`}
                  onClick={() => setSelectedTitle(title)}
                  className="group min-w-0 overflow-hidden rounded-xl border border-secao-border bg-secao-card text-left transition hover:-translate-y-1 hover:border-secao-purple hover:shadow-lg hover:shadow-purple-950/30"
                >
                  <div className="aspect-[2/3] overflow-hidden bg-slate-950">
                    {getImage(title) ? (
                      <img src={getImage(title)} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-700"><Tv size={32} /></div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-2 text-sm font-bold text-white group-hover:text-secao-purple">{title.title || title.name}</h3>
                    {getProviders(title).length > 0 && (
                      <p className="mt-2 line-clamp-1 text-[11px] text-slate-400">{getProviders(title).map(provider => provider.name || provider.provider_name).join(' · ')}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
