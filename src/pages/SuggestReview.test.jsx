import{render, screen, fireEvente, waitFor, fireEvent} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import SuggestReview from './SuggestReview';

// Simula a biblioteca axios para não fazer chamadas reais de rede no teste
vi.mock('axios')


describe('Pagina SuggestReview', () => {
    it('deve permitir preencher o formulário e exibir mensagem de sucesso ao enviar', async() => {
    //Simula resposta com sucesso da API(status 201)
    axios.post.mockResolvedValueOnce({data:{success: true} });

    render(
        <BrowserRouter>
            <SuggestReview/>
        </BrowserRouter>
    );

    // 1. Veirifca se os campos existem na tela
    const nameInput = screen.getByLabelText(/Seu Nome ou Apelido/i);
    const titleInput = screen.getByLabelText(/Nome do Filme, Anime ou Série/i);
    const reasonInput = screen.getByLabelText(/Por que eu deveria/i);
    const submitButton = screen.getByRole('button', {name: /Enviar Indicação/i });

    // 2. Simula o usuário digitando nos campos
    fireEvent.change(nameInput, {target: {value: 'OtakuTester' } });
    fireEvent.change(titleInput, {target: {value: 'Cyberpunk Edgerunners' } });
    fireEvent.change(reasonInput, {target: {value: 'Quero ver a análise sobre o final emocionante' } });

    // 3. Clica no botão de enviar
    fireEvent.click(submitButton);

    //4. Aguarda e valida se a mensagem verde de sucesso aparaeceu
    await waitFor(() => {
        expect(screen.getByText(/Sua sugestão foi enviada com sucesso!/i)).toBeInTheDocument();
    });
});
});