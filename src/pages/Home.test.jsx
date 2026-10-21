import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import Home from './Home';

vi.mock('axios');

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.removeItem('secao_e_articles');
});

const mockArticles = [
  {
    id: 1,
    title: 'Review: Demon Slayer',
    slug: 'review-demon-slayer',
    category: 'anime',
    post_type: 'review',
    rating: 9,
    content: 'Análise excelente da nova temporada.',
    created_at: '2026-09-10T00:00:00Z'
  },
  {
    id: 2,
    title: 'Batman: Novo filme confirmado',
    slug: 'batman-novo-filme',
    category: 'cinema',
    post_type: 'news',
    rating: null,
    content: 'A Warner confirmou a sequência.',
    created_at: '2026-09-10T00:00:00Z'
  }
];

describe('Página Home', () => {
  it('deve listar artigos e filtrar por categoria corretamente', async () => {
    // Simula a API devolvendo os dois artigos
    axios.get.mockResolvedValueOnce({ status: 200, data: mockArticles });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // 1. Aguarda o carregamento e verifica se os 2 títulos estão na tela
    await waitFor(() => {
      expect(screen.getByText(/Review: Demon Slayer/i)).toBeInTheDocument();
      expect(screen.getByText(/Batman: Novo filme confirmado/i)).toBeInTheDocument();
    });

    // 2. Clica no botão de filtro "CINEMA"
    const cinemaFilterButton = screen.getByRole('button', { name: /CINEMA/i });
    fireEvent.click(cinemaFilterButton);

    // 3. O artigo de Cinema deve continuar na tela, mas o de Anime deve sumir
    expect(screen.getByText(/Batman: Novo filme confirmado/i)).toBeInTheDocument();
    expect(screen.queryByText(/Review: Demon Slayer/i)).not.toBeInTheDocument();
  });

  it('deve substituir artigos em cache somente quando a API responder com status 200', async () => {
    localStorage.setItem('secao_e_articles', JSON.stringify([
      { ...mockArticles[0], title: 'Publicação desatualizada' }
    ]));
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: [{ ...mockArticles[0], title: 'Publicação atualizada' }]
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(await screen.findByText('Publicação atualizada')).toBeInTheDocument();
    expect(screen.queryByText('Publicação desatualizada')).not.toBeInTheDocument();
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringMatching(/\/articles\/$/),
      { params: { _: expect.any(Number) } }
    );
  });

  it('deve manter os artigos em cache sem mostrar erro quando a API falhar', async () => {
    localStorage.setItem('secao_e_articles', JSON.stringify(mockArticles));
    axios.get.mockRejectedValueOnce({ response: { status: 500 } });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(await screen.findByText(/Review: Demon Slayer/i)).toBeInTheDocument();
    expect(screen.getByText(/Batman: Novo filme confirmado/i)).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('secao_e_articles'))).toEqual(mockArticles);
  });

  it('deve manter os artigos em cache se a API não responder com status 200', async () => {
    const cachedArticles = [{ ...mockArticles[0], title: 'Publicação em cache' }];
    localStorage.setItem('secao_e_articles', JSON.stringify(cachedArticles));
    axios.get.mockResolvedValueOnce({
      status: 204,
      data: [{ ...mockArticles[0], title: 'Resposta sem status 200' }]
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(await screen.findByText('Publicação em cache')).toBeInTheDocument();
    expect(screen.queryByText('Resposta sem status 200')).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('secao_e_articles'))).toEqual(cachedArticles);
  });
});
