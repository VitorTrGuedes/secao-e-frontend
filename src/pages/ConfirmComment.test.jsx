import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import ConfirmComment from './ConfirmComment';

vi.mock('axios');

describe('Página ConfirmComment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('confirma o e-mail sob ação explícita e leva à análise', async () => {
    axios.post.mockResolvedValueOnce({
      data: { article_slug: 'filme-batman' }
    });

    render(
      <MemoryRouter initialEntries={['/confirmar-comentario?token=token-de-teste']}>
        <Routes>
          <Route path="/confirmar-comentario" element={<ConfirmComment />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Confirmar e publicar comentário/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/seu comentário já está publicado/i);
    });
    expect(axios.post).toHaveBeenCalledWith(expect.stringMatching(/\/comments\/confirm\/$/), {
      token: 'token-de-teste'
    });
    expect(screen.getByRole('link', { name: /Ver análise e comentário/i }))
      .toHaveAttribute('href', '/artigo/filme-batman');
  });

  it('não permite confirmar sem token', () => {
    render(
      <MemoryRouter initialEntries={['/confirmar-comentario']}>
        <Routes>
          <Route path="/confirmar-comentario" element={<ConfirmComment />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/link de confirmação está incompleto/i);
    expect(screen.queryByRole('button', { name: /Confirmar e publicar comentário/i })).not.toBeInTheDocument();
  });
});
