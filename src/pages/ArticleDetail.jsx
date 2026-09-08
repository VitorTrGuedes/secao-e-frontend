{/* LISTA SEMÂNTICA DE COMENTÁRIOS */}
<ul className="space-y-4">
  {article.comments.length === 0 ? (
    <p className="text-slate-500 italic text-center py-4">Ninguém opinou ainda. Seja o primeiro!</p>
  ) : (
    article.comments.map(c => (
      <li key={c.id} className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
        <header className="flex justify-between items-center mb-2">
          <strong className="text-secao-purple flex items-center gap-1 text-sm">
            <User size={14} /> {c.author_name}
          </strong>
          <time className="text-[10px] text-slate-500">{new Date(c.created_at).toLocaleDateString()}</time>
        </header>
        <p className="text-slate-300 text-sm leading-relaxed">{c.opinion}</p>
      </li>
    ))
  )}
</ul>