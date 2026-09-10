import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import SuggestReview from './pages/SuggestReview';

export default function App(){
  return(
    <BrowserRouter>
      <Navbar />
        <main className="pb-16">
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/artigo/:slug" element={<ArticleDetail />}/>
            <Route path="/sugerir" element={<SuggestReview />}/>
          </Routes>
        </main>
    </BrowserRouter>
  );
}