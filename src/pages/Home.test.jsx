import{render, screen, fireEvente, waitFor, fireEvent} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import Home from './Home';

vi.mock('axios');

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
    axios.get.mockResolvedValueOnce({ data: mockArticles });

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
});
