// Função chamada pelos botões "Adicionar"

function addToListFromButton(button) {
    const id = parseInt(button.getAttribute("data-id"));
    const title = button.getAttribute("data-title");
    const coverImage = button.getAttribute("data-cover");

    addToList({ id, title, coverImage });
}

// LocalStorage – Ler e Salvar Lista

function getUserList() {
    const list = localStorage.getItem("userList");
    return list ? JSON.parse(list) : [];
}

function saveUserList(list) {
    localStorage.setItem("userList", JSON.stringify(list));
}

// Adicionar anime à lista

function addToList(anime) {
    let list = getUserList();

    if (!list.some(item => item.id === anime.id)) {
        anime.status = "watching";   // padrão
        list.push(anime);
        saveUserList(list);
        alert("Anime adicionado à sua lista!");
    } else {
        alert("Este anime já está na sua lista.");
    }
}

// Atualizar status

function updateStatus(id, status) {
    let list = getUserList();
    list = list.map(item => {
        if (item.id === id) {
            item.status = status;
        }
        return item;
    });
    saveUserList(list);
    displayList();
}

// Remover anime

function removeFromList(id) {
    let list = getUserList();
    list = list.filter(item => item.id !== id);
    saveUserList(list);
    displayList();
}

// FILTRO
let currentFilter = "all";

function filterList(filter) {
    currentFilter = filter;
    displayList();
}

// Função auxiliar de rótulos

function getStatusLabel(status) {
    const labels = {
        watching: "Assistindo",
        completed: "Assistido",
        dropped: "Dropado"
    };
    return labels[status] || status;
}

// Exibir lista na página minha-lista.html

function displayList() {
    const container = document.getElementById("anime-list");
    if (!container) return; // se não estiver nesta página, ignore

    let list = getUserList();

    if (currentFilter !== "all") {
        list = list.filter(item => item.status === currentFilter);
    }

    if (list.length === 0) {
        container.innerHTML = "<p>Nenhum anime nesta categoria.</p>";
        return;
    }

    container.innerHTML = `
        <ul>
            ${list
                .map(
                    item => `
                <li>
                    <img src="${item.coverImage}" width="150">
                    <h3>${item.title}</h3>

                    <p>Status: ${getStatusLabel(item.status)}</p>
                    <select onchange="updateStatus(${item.id}, this.value)">
                        <option value="watching" ${item.status === "watching" ? "selected" : ""}>Assistindo</option>
                        <option value="completed" ${item.status === "completed" ? "selected" : ""}>Assistido</option>
                        <option value="dropped" ${item.status === "dropped" ? "selected" : ""}>Dropado</option>
                    </select>

                    <button onclick="removeFromList(${item.id})">Remover</button>
                </li>
            `
                )
                .join("")}
        </ul>
    `;
}

// ------------------------------
//   SISTEMA DE LISTAS (PLAYLISTS)
// ------------------------------

// Obtém todas as listas criadas
function getUserLists() {
    const lists = localStorage.getItem("animePlaylists");
    return lists ? JSON.parse(lists) : [];
}

// Salva todas as listas
function saveUserLists(lists) {
    localStorage.setItem("animePlaylists", JSON.stringify(lists));
}

// Cria nova lista
function createNewList() {
    const name = prompt("Digite o nome da nova lista:");

    if (!name || name.trim() === "") {
        alert("O nome da lista não pode ser vazio.");
        return;
    }

    const lists = getUserLists();

    // Evita nomes repetidos
    if (lists.some(list => list.name === name)) {
        alert("Já existe uma lista com esse nome.");
        return;
    }

    lists.push({
        name: name,
        animes: [] // cada lista guarda seus animes
    });

    saveUserLists(lists);
    alert("Lista criada com sucesso!");
    displayListsInPage();
}

// Adiciona um anime na lista selecionada
function addAnimeToSpecificList(id, title, image, listName) {
    let lists = getUserLists();
    let list = lists.find(l => l.name === listName);

    if (!list) {
        alert("Erro: lista não encontrada.");
        return;
    }

    if (list.animes.some(a => a.id === id)) {
        alert("Este anime já está nessa lista.");
        return;
    }

    list.animes.push({ id, title, image });
    saveUserLists(lists);
    alert(`Anime adicionado à lista "${listName}"!`);
}

// Renderiza as listas na página “Minha Lista”
function displayListsInPage() {
    const container = document.getElementById("anime-list");
    if (!container) return;

    const lists = getUserLists();

    if (lists.length === 0) {
        container.innerHTML = `<p>Nenhuma lista criada ainda.</p>`;
        return;
    }

    container.innerHTML = "";

    lists.forEach(list => {
        const div = document.createElement("div");
        div.className = "playlist-box";

        div.innerHTML = `
            <h2>${list.name}</h2>
            <button onclick="showListContent('${list.name}')">Ver animes</button>
        `;

        container.appendChild(div);
    });
}

// Mostra os animes dentro de uma lista
function showListContent(listName) {
    const lists = getUserLists();
    const list = lists.find(l => l.name === listName);

    if (!list) return;

    const container = document.getElementById("anime-list");
    container.innerHTML = `
        <h2>${listName}</h2>
        <button onclick="displayListsInPage()">Voltar</button>
        <br><br>
    `;

    if (list.animes.length === 0) {
        container.innerHTML += "<p>Nenhum anime nesta lista.</p>";
        return;
    }

    list.animes.forEach(anime => {
        const div = document.createElement("div");
        div.innerHTML = `
            <img src="${anime.image}" width="120">
            <h3>${anime.title}</h3>
            <button onclick="removeAnimeFromList('${listName}', ${anime.id})">Remover</button>
        `;
        container.appendChild(div);
    });
}

// Remove anime de uma lista específica
function removeAnimeFromList(listName, id) {
    let lists = getUserLists();
    let list = lists.find(l => l.name === listName);

    list.animes = list.animes.filter(a => a.id !== id);
    saveUserLists(lists);

    showListContent(listName);
}
