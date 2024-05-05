export default {
    props: {
        servicos: Array
    },
    setup(props, { emit }) {
        const router = VueRouter.useRouter();

        function selecionar(servico) {
            router.push(`/detalhes/${servico.id}`);
        }

        function excluir(servico) {
            const confirmacao = confirm(`Tem certeza que deseja excluir o servico ${servico.nome}?`);
            if (confirmacao) {
                emit('excluir-servico', servico.id);
            }
        }

        return {
            selecionar,
            excluir
        };
    },
    template: `
    <div>
        <h1>Lista de Servicos</h1>
        <div v-for="servico of servicos" :key="servico.id" class="linha">
            {{servico.nome}} - Preço: R$ {{servico.preco.toFixed(2)}}
            - Quantidade: {{servico.quantidade}}
            <button @click="selecionar(servico);">Selecionar</button>
            <button @click="excluir(servico);">Excluir</button>
        </div>
    </div>
    `
};
