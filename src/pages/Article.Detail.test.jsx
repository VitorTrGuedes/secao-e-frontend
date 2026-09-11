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
  content: 'Análise detalhada do filme.',
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
      expect(screen.getByText(/Análise detalhada do filme/i)).toBeInTheDocument();
    });

    // 2. Verifica se o comentário do Tanjiro foi listado
    expect(screen.getByText(/Tanjiro/i)).toBeInTheDocument();
    expect(screen.getByText(/Filme sensacional!/i)).toBeInTheDocument();
  });

  it('deve permitir que o leitor preencha e envie uma nova opinião com feedback de sucesso', async () => {
    // Primeira chamada carrega o post
    axios.get.mockResolvedValueOnce({ data: mockArticle });
    // Chamada do envio do formulário de comentário
    axios.post.mockResolvedValueOnce({ data: { success: true } });
    // Chamada do recarregamento após envio
    axios.get.mockResolvedValueOnce({ data: mockArticle });

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
    const opinionInput = screen.getByPlaceholderText(/Escreva aqui sua opinião/i);
    const submitButton = screen.getByRole('button', { name: /Publicar Minha Opinião/i });

    fireEvent.change(nameInput, { target: { value: 'Nezuko' } });
    fireEvent.change(opinionInput, { target: { value: 'A animação deste filme foi nota 10!' } });

    // 2. Clica para enviar
    fireEvent.click(submitButton);

    // 3. Verifica se a mensagem de confirmação surgiu
    await waitFor(() => {
      expect(screen.getByText(/Sua opinião foi enviada com sucesso!/i)).toBeInTheDocument();
    });
  });
});