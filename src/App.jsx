import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReviewsPage from './pages/ReviewPage'; // ✨ Importe a página de Análises
import NewsPage from './pages/NewsPage';       // ✨ Importe a página de Notícias
import ArticleDetail from './pages/ArticleDetail';
import SuggestReview from './pages/SuggestReview';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analises" element={<ReviewsPage />} /> {/* ✨ Rota /analises */}
          <Route path="/noticias" element={<NewsPage />} />   {/* ✨ Rota /noticias */}
          <Route path="/artigo/:slug" element={<ArticleDetail />} />
          <Route path="/sugerir" element={<SuggestReview />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}