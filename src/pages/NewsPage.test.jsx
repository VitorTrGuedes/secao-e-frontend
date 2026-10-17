import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import NewsPage from './NewsPage';

vi.mock('axios');

describe('Página NewsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('informa quando a API falha em vez de dizer que não existem notícias', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 500 } });

    render(
      <MemoryRouter>
        <NewsPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(/erro HTTP 500/i);
    expect(screen.queryByText(/Nenhuma notícia encontrada/i)).not.toBeInTheDocument();
  });
});
