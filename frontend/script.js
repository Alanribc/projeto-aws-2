const apiURL = 'http://localhost:3000/items';

const lista = document.getElementById('lista');
const form = document.getElementById('itemForm');
const inputNome = document.getElementById('nome');

let editandoId = null;

async function carregarItens() {

    const response = await fetch(apiURL);

    const items = await response.json();

    lista.innerHTML = '';

    items.forEach(item => {

        const li = document.createElement('li');

        li.innerHTML = `
            ${item.nome}

            <button onclick="editarItem(${item.id}, '${item.nome}')">
                Editar
            </button>

            <button onclick="deletarItem(${item.id})">
                Deletar
            </button>
        `;

        lista.appendChild(li);
    });
}

form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const nome = inputNome.value;

    if (editandoId) {

        await fetch(`${apiURL}/${editandoId}`, {

            method: 'PUT',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ nome })
        });

        editandoId = null;

    } else {

        await fetch(apiURL, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ nome })
        });
    }

    form.reset();

    carregarItens();
});

function editarItem(id, nome) {

    inputNome.value = nome;

    editandoId = id;
}

async function deletarItem(id) {

    await fetch(`${apiURL}/${id}`, {
        method: 'DELETE'
    });

    carregarItens();
}

carregarItens();