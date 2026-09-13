import{render, screen} from '@testing-library/react';
import{BrowserRouter} from 'react-router-dom';
import Navbar from './Navbar';
import{test, expect} from 'vitest';


test('Renderiza o logo da Seção E e os botões de navegação', () => {
    render(
        <BrowserRouter>
            <Navbar/>
        </BrowserRouter>
    );

    // 1. Verifica se o texto "SEÇÃO E" está na tela
    expect(screen.getByText(/SEÇÃO/i)).toBeInTheDocument();


    // 2. Verifica se o botão "Sugerir Crítica" existe
    expect(screen.getByText(/Sugerir Crítica/i)).toBeInTheDocument();

})