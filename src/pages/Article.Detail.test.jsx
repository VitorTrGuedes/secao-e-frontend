import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import ArticleDetail from './ArticleDetail';

vi.mock('axios');

const mockArticle = {
  id: 1,
  title: 'Review: Demon Slayer - Castelo Infinito',
  slug: 'review-demon-slayer',
  category: 'anime',
  post_type: 'review',
  rating: 9,
  image_url: 'https://example.com/poster.jpg',
  content: 'Análise detalhada do filme.',
  content_html: '<p>Análise detalhada do <strong>filme</strong>.</p>',
  source_url: 'https://example.com/materia-original',
  created_at: '2026-09-10T00:00:00Z',
  comments: [
    {
      id: 10,
      author_name: 'Tanjiro',
      opinion: 'Filme sensacional!',
      created_at: '2026-09-10T01:00:00Z'
    }
  ]
};

describe('Página ArticleDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve carregar e exibir os dados da crítica e os comentários existentes', async () => {
    // Simula a API retornando o artigo
    axios.get.mockResolvedValueOnce({ data: mockArticle });
    axios.get.mockResolvedValueOnce({ data: [
      { id: 2, slug: 'noticia-star-wars', post_type: 'news', category: 'cinema', title: 'Notícia de Star Wars', image_url: 'https://example.com/star-wars.jpg' },
    ] });

    render(
      <MemoryRouter initialEntries={['/artigo/review-demon-slayer']}>
        <Routes>
          <Route path="/artigo/:slug" element={<ArticleDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // 1. Verifica se o título, nota e conteúdo estão na tela
    await waitFor(() => {
      expect(screen.getByText(/Review: Demon Slayer - Castelo Infinito/i)).toBeInTheDocument();
      expect(screen.getByText(/Nota: 9\/10/i)).toBeInTheDocument();
      expect(screen.getByText('filme')).toBeInTheDocument();
    });
    expect(screen.getByRole('img', { name: mockArticle.title }))
      .toHaveClass('max-h-80', 'sm:max-h-[32rem]');
    expect(screen.getByRole('link', { name: /Acessar matéria original/i }))
      .toHaveAttribute('href', mockArticle.source_url);
    expect(screen.getByRole('link', { name: /Notícia de Star Wars/i }))
      .toHaveAttribute('href', '/artigo/noticia-star-wars');

    // 2. Verifica se o comentário do Tanjiro foi listado
    expect(screen.getByText(/Tanjiro/i)).toBeInTheDocument();
    expect(screen.getByText(/Filme sensacional!/i)).toBeInTheDocument();
  });

  it('deve evitar espaços extras entre os blocos de conteúdo HTML da análise', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        ...mockArticle,
        content_html: '<p>Primeiro parágrafo da análise.</p>\n\n\n<p>Segundo parágrafo.</p>'
      }
    });
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter initialEntries={['/artigo/review-demon-slayer']}>
        <Routes>
          <Route path="/artigo/:slug" element={<ArticleDetail />} />
        </Routes>
      </MemoryRouter>
    );

    const article = await screen.findByRole('article');
    const content = article.querySelector('div.max-w-none');
    expect(content).toBeInTheDocument();
    expect(content).not.toHaveClass('whitespace-pre-line');
    expect(content.querySelectorAll('p')).toHaveLength(2);
    expect(content).toHaveTextContent('Primeiro parágrafo da análise.');
    expect(content).toHaveTextContent('Segundo parágrafo.');
  });

  it('deve permitir que o leitor preencha e envie uma nova opinião com feedback de sucesso', async () => {
    // Primeira chamada carrega o post
    axios.get.mockResolvedValueOnce({ data: mockArticle });
    axios.get.mockResolvedValueOnce({ data: [] });
    // Chamada do envio do formulário de comentário
    axios.post.mockResolvedValueOnce({
      data: { detail: 'Enviamos um link de confirmação para o e-mail informado.' }
    });

    render(
      <MemoryRouter initialEntries={['/artigo/review-demon-slayer']}>
        <Routes>
          <Route path="/artigo/:slug" element={<ArticleDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Review: Demon Slayer/i)).toBeInTheDocument();
    });

    // 1. Preenche o formulário de opinião
    const nameInput = screen.getByPlaceholderText(/Seu nome ou apelido/i);
    const emailInput = screen.getByPlaceholderText(/Seu e-mail/i);
    const opinionInput = screen.getByPlaceholderText(/Escreva aqui sua opinião/i);
    const submitButton = screen.getByRole('button', { name: /Enviar para confirmação/i });

    fireEvent.change(nameInput, { target: { value: 'Nezuko' } });
    fireEvent.change(emailInput, { target: { value: 'nezuko@example.com' } });
    fireEvent.change(opinionInput, { target: { value: 'A animação deste filme foi nota 10!' } });

    // 2. Clica para enviar
    fireEvent.click(submitButton);

    // 3. Verifica se a mensagem de confirmação surgiu
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/link de confirmação para seu e-mail/i);
    });
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(axios.post).toHaveBeenCalledWith(expect.stringMatching(/\/comments\/$/), {
      article: mockArticle.id,
      author_name: 'Nezuko',
      email: 'nezuko@example.com',
      opinion: 'A animação deste filme foi nota 10!'
    });
  });

  it('deve mostrar erro da API sem informar incorretamente que a publicação não existe', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 500 } });
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter initialEntries={['/artigo/review-demon-slayer']}>
        <Routes>
          <Route path="/artigo/:slug" element={<ArticleDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(/erro HTTP 500/i);
    expect(screen.queryByText(/Publicação não encontrada/i)).not.toBeInTheDocument();
  });
});