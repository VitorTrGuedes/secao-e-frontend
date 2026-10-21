import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('renderiza logo e navegação principal', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText(/SEÇÃO/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Sugerir Crítica/i })).toHaveAttribute('href', '/sugerir');
  });

  it('abre e fecha a navegação mobile ao interagir com o botão', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const openButton = screen.getByRole('button', { name: 'Abrir menu' });
    const navigation = screen.getByRole('navigation', { name: 'Navegação principal' });

    expect(openButton).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(openButton);
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true');
    expect(navigation).toHaveClass('flex');

    fireEvent.click(screen.getByRole('link', { name: /Análises/i }));
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('mantém os links de navegação dentro da barra no layout desktop', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const navigation = screen.getByRole('navigation', { name: 'Navegação principal' });
    expect(navigation).toHaveClass('md:flex-row');
    expect(navigation.querySelectorAll('a')).toHaveLength(3);
  });
});