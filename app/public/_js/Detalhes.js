import { useRoute } from 'vue-router';

export default {
    props: {
        servicos: Array
    },
    setup(props, { emit }) {
        const route = useRoute();
        const id = route.params.id;
        const servico = props.servicos.find(p => p.id == id);

        if (!servico) {
            console.error('Servico não encontrado');
        }

        return {
            servico
        };
    },
    template: `
    <div v-if="servico">
        <h2>Detalhes do Servico</h2>
        <p>ID: {{ servico.id }}</p>
        <p>Nome: {{ servico.nome }}</p>
        <p>Preço: R$ {{ servico.preco.toFixed(2) }}</p>
        <p>Quantidade: {{ servico.quantidade }}</p>
    </div>
    <div v-else>
        <p>Servico não encontrado.</p>
    </div>
    `
};
