const addM = document.getElementById("addM");
const botaoAdd = document.getElementById("botaoAdd");
const fecharAddM = document.getElementById("fecharAddM");
const lista = document.getElementById("lista");

let comidaParaEditar = null;
let comidaParaExcluir = null;

// Abrir e fechar modal de adicionar
botaoAdd.onclick = () => addM.showModal();
fecharAddM.onclick = () => addM.close();

// Função para buscar todos os alimentos
async function getAllComidas() {
    try {
        const response = await fetch("http://localhost:8080/cardapio");
        const alimentos = await response.json();
        renderizarComidas(alimentos);
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}

// Função para renderizar a lista de comidas
function renderizarComidas(comidas) {
    lista.innerHTML = '';
    comidas.forEach(comida => {
        const comidaDiv = document.createElement("div");
        comidaDiv.className = 'comida';
        comidaDiv.innerHTML = `
            <img src="${comida.url}" alt="${comida.nome}" class="comida-img">
            <h3>${comida.nome}</h3>
            <p>${comida.descricao}</p>
            <p>R$ ${comida.preco.toFixed(2)}</p>
            <button onclick="editarComida(${comida.id})">Editar</button>
            <button onclick="confirmarExclusao(${comida.id})">Excluir</button>
        `;
        lista.appendChild(comidaDiv);
    });
}

// Função para adicionar alimento
async function AddAlimento() {
    const nome = document.getElementById("alimento").value;
    const descricao = document.getElementById("descricao").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const url = document.getElementById("fotoAlimento").value;

    if (!nome || !descricao || !preco || !url) {
        alert("Preencha todos os campos!");
        return;
    }

    const novoAlimento = { nome, descricao, preco, url };

    try {
        const response = await fetch("http://localhost:8080/cardapio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoAlimento),
        });

        if (response.ok) {
            alert("Comida adicionada com sucesso!");
            getAllComidas();
            addM.close();
        } else {
            alert("Erro ao adicionar comida!");
        }
    } catch (error) {
        console.error("Erro ao adicionar comida:", error);
        alert("Erro na conexão com o servidor.");
    }
}

// Função para editar comida
async function editarComida(id) {
    try {
        const response = await fetch(`http://localhost:8080/cardapio/${id}`);
        const comida = await response.json();
        comidaParaEditar = comida.id;

        document.getElementById("alimentoEdit").value = comida.nome;
        document.getElementById("descricaoEdit").value = comida.descricao;
        document.getElementById("precoEdit").value = comida.preco;
        document.getElementById("fotoAlimentoEdit").value = comida.url;

        document.getElementById("editM").showModal();
    } catch (error) {
        console.error("Erro ao carregar comida:", error);
    }
}

// Função para salvar alterações na comida
async function SaveEdit() {
    const nome = document.getElementById("alimentoEdit").value;
    const descricao = document.getElementById("descricaoEdit").value;
    const preco = parseFloat(document.getElementById("precoEdit").value);
    const url = document.getElementById("fotoAlimentoEdit").value;

    if (!nome || !descricao || !preco || !url) {
        alert("Preencha todos os campos!");
        return;
    }

    const comidaEditada = { nome, descricao, preco, url };

    try {
        const response = await fetch(`http://localhost:8080/cardapio/${comidaParaEditar}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(comidaEditada),
        });

        if (response.ok) {
            alert("Comida editada com sucesso!");
            getAllComidas();
            document.getElementById("editM").close();
        } else {
            alert("Erro ao editar comida!");
        }
    } catch (error) {
        console.error("Erro ao editar comida:", error);
    }
}

// Função para confirmar exclusão
function confirmarExclusao(id) {
    comidaParaExcluir = id;
    document.getElementById("modalExcluir").showModal();
}

// Função para excluir comida
async function excluirComida() {
    try {
        const response = await fetch(`http://localhost:8080/cardapio/${comidaParaExcluir}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Comida excluída com sucesso!");
            getAllComidas();
            document.getElementById("modalExcluir").close();
        } else {
            alert("Erro ao excluir comida!");
        }
    } catch (error) {
        console.error("Erro ao excluir comida:", error);
    }
}

// Fechar modal de exclusão
document.getElementById("cancelarExcluir").onclick = () => {
    document.getElementById("modalExcluir").close();
};

document.getElementById("confirmarExcluir").onclick = excluirComida;

// Chamada inicial para carregar as comidas
getAllComidas();
