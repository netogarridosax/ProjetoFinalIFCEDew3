import { ref } from 'vue';

export default {
    props: {
        servicos: Array
    },
    setup(props, { emit }) {
        const nome = ref('');
        const preco = ref(0);
        const quantidade = ref('');

        function inserir() {
            if (!nome.value || preco.value <= 0 || !quantidade.value) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            const novoServico = { nome: nome.value, preco: preco.value, quantidade: quantidade.value };
            props.servicos.push(novoServico);
            nome.value = '';
            preco.value = 0;
            quantidade.value = '';

            alert('Serviço adicionado com sucesso!');
        }

        return {
            nome,
            preco,
            quantidade,
            inserir
        };
    },
    template: `
    <div>
        <h2>Digite abaixo os dados:</h2>
        <form @submit.prevent="inserir">
            <label for="nome">Nome:</label>
            <input type="text" id="nome" v-model="nome">
            <label for="preco">Preço:</label>
            <input type="number" id="preco" v-model="preco">
            <label for="quantidade">Quantidade:</label>
            <input type="text" id="quantidade" v-model="quantidade">
            <button type="submit">Adicionar Serviço</button>
        </form>
    </div>
    `
};
