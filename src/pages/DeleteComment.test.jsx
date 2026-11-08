import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import DeleteComment from './DeleteComment';

vi.mock('axios');

describe('Página DeleteComment', () => {
  it('deve excluir o comentário usando o token do e-mail', async () => {
    axios.delete.mockResolvedValueOnce({ status: 204 });

    render(
      <MemoryRouter initialEntries={['/excluir-comentario?token=token-seguro']}>
        <DeleteComment />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Apagar meu comentário/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/apagado com sucesso/i);
    });
    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringMatching(/\/comments\/delete\/$/),
      { data: { token: 'token-seguro' } }
    );
  });

  it('não permite exclusão sem token', () => {
    render(
      <MemoryRouter initialEntries={['/excluir-comentario']}>
        <DeleteComment />
      </MemoryRouter>
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/incompleto/i);
    expect(screen.queryByRole('button', { name: /Apagar meu comentário/i })).not.toBeInTheDocument();
  });
});
