let traducoes = {
    'pt-BR': {
        'mensagem_senha_em_branco': 'A senha não pode ser em branco!',
        'mensagem_servico_cadastrado': 'Serviço cadastrado com sucesso!',
        'mensagem_servico_apagado': 'Serviço apagado com sucesso!'
    },
    'en': {
        'mensagem_senha_em_branco': 'Password cannot be empty!',
        'mensagem_servico_cadastrado': 'Service successfully registered!',
        'mensagem_servico_apagado': 'Service successfully deleted!'
    }
};

async function inserir() {
    try {
        let nome = document.querySelector('[name=nome]').value;
        let descricao = document.querySelector('[name=descricao]').value;
        let quantidade = document.querySelector('[name=quantidade]').value;

        if (!nome || !descricao) {
            throw new Error(traducoes['pt-BR']['mensagem_senha_em_branco']);
        }

        let divResposta = document.querySelector('#resposta');
        let dados = new URLSearchParams({ nome, descricao, quantidade });

        let resposta = await fetch('servicos', {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: dados
        });

        if (resposta.ok) {
            divResposta.classList.add('padrao');
            divResposta.classList.remove('npadrao');
        } else {
            divResposta.classList.add('npadrao');
            divResposta.classList.remove('padrao');
        }

        let respostaJson = await resposta.json();
        let mensagem = respostaJson.mensagem;
        divResposta.innerText = traducoes['pt-BR'][mensagem];
    } catch (error) {
        console.error('Erro ao inserir serviço:', error);
    }
}

async function listar() {
    try {
        let divServicos = document.querySelector('#servicos');
        divServicos.innerText = 'Carregando...';

        let resposta = await fetch('servico');
        let servicos = await resposta.json();

        divServicos.innerHTML = '';

        for (let servico of servicos) {
            let linha = document.createElement('tr');
            let colunaId = document.createElement('td');
            let colunaNome = document.createElement('td');
            let colunaServico = document.createElement('td');
            let colunaAcoes = document.createElement('td');
            let botaoEditar = document.createElement('button');
            let botaoApagar = document.createElement('button');

            colunaId.innerText = servico.id;
            colunaNome.innerText = servico.nome;
            colunaServico.innerText = servico.descricao;

            botaoEditar.innerText = 'Editar';
            botaoEditar.onclick = () => editar(servico.id);

            botaoApagar.innerText = 'Apagar';
            botaoApagar.onclick = () => apagar(servico.id);

            linha.appendChild(colunaId);
            linha.appendChild(colunaNome);
            linha.appendChild(colunaServico);
            linha.appendChild(colunaAcoes);
            colunaAcoes.appendChild(botaoEditar);
            colunaAcoes.appendChild(botaoApagar);

            divServicos.appendChild(linha);
        }
    } catch (error) {
        console.error('Erro ao listar serviços:', error);
    }
}

async function editar(id) {
    try {
        console.log('Editar serviço com ID:', id);
    } catch (error) {
        console.error('Erro ao editar serviço:', error);
    }
}

async function apagar(id) {
    try {
        let divResposta = document.querySelector('#resposta');
        if (confirm('Quer apagar o #' + id + '?')) {
            let resposta = await fetch('servicos/' + id, {
                method: 'delete',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            });
            let respostaJson = await resposta.json();
            let mensagem = respostaJson.mensagem;
            divResposta.innerText = traducoes['pt-BR'][mensagem];
            listar();
        }
    } catch (error) {
        console.error('Erro ao apagar serviço:', error);
    }
}
