const apiURL = 'https://e953zoeque.execute-api.us-east-1.amazonaws.com/items';

const reportURL = 'https://e953zoeque.execute-api.us-east-1.amazonaws.com/report';

const lista = document.getElementById('lista');

const form = document.getElementById('itemForm');

const inputNome = document.getElementById('nome');

let editandoId = null;


async function carregarItens() {

    try {

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

    } catch (error) {

        console.error(error);

        alert('Erro ao carregar itens');
    }
}


form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const nome = inputNome.value;

    try {

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

    } catch (error) {

        console.error(error);

        alert('Erro ao salvar item');
    }
});



function editarItem(id, nome) {

    inputNome.value = nome;

    editandoId = id;
}


async function deletarItem(id) {

    try {

        await fetch(`${apiURL}/${id}`, {

            method: 'DELETE'
        });

        carregarItens();

    } catch (error) {

        console.error(error);

        alert('Erro ao deletar item');
    }
}


async function buscarReport() {

    try {

        const response = await fetch(reportURL);

        const data = await response.json();

        alert(JSON.stringify(data, null, 2));

    } catch (error) {

        console.error(error);

        alert('Erro ao buscar relatório');
    }
}

const reportButton = document.createElement('button');

reportButton.innerText = 'Ver Report';

reportButton.style.marginTop = '20px';

reportButton.onclick = buscarReport;

document.querySelector('.container').appendChild(reportButton);



carregarItens();