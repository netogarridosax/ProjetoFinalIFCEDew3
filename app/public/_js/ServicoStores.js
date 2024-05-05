let db;

const request = indexedDB.open("Servicos", 1);

// Tratamento de erro ao abrir o banco de dados
request.onerror = (event) => {
    console.error("Erro ao abrir o banco de dados:", event.target.error);
};

// Evento bem-sucedido ao abrir o banco de dados
request.onsuccess = (event) => {
    db = event.target.result;
    console.log('Banco de dados aberto com sucesso');
};

// Atualização do banco de dados, se necessário
request.onupgradeneeded = (event) => {
    const db = event.target.result;
    console.log('Atualizando o banco de dados');

    // Criar um objeto de armazenamento de objetos para "servicos"
    const objectStore = db.createObjectStore("servicos", { keyPath: "id", autoIncrement: true });
};

// Adicionar um serviço ao banco de dados
function adicionar(servico) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["servicos"], "readwrite");
        const objectStore = transaction.objectStore("servicos");
        const request = objectStore.add(servico);
        request.onsuccess = (event) => {
            const id = event.target.result;
            resolve(id);
        };
        request.onerror = (event) => {
            reject(new Error(event.target.error));
        };
    });
}

// Listar todos os serviços do banco de dados
function listar() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["servicos"], "readonly");
        const objectStore = transaction.objectStore("servicos");
        const request = objectStore.getAll();
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            reject(new Error(event.target.error));
        };
    });
}

// Excluir um serviço do banco de dados por ID
function deletar(id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["servicos"], "readwrite");
        const objectStore = transaction.objectStore("servicos");
        const request = objectStore.delete(id);
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            reject(new Error(event.target.error));
        };
    });
}
