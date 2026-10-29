import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReviewsPage from './pages/ReviewPage'; // ✨ Importe a página de Análises
import NewsPage from './pages/NewsPage';       // ✨ Importe a página de Notícias
import ArticleDetail from './pages/ArticleDetail';
import ConfirmComment from './pages/ConfirmComment';
import SuggestReview from './pages/SuggestReview';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <main className="pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analises" element={<ReviewsPage />} /> {/* ✨ Rota /analises */}
          <Route path="/noticias" element={<NewsPage />} />   {/* ✨ Rota /noticias */}
          <Route path="/artigo/:slug" element={<ArticleDetail />} />
          <Route path="/confirmar-comentario" element={<ConfirmComment />} />
          <Route path="/sugerir" element={<SuggestReview />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}