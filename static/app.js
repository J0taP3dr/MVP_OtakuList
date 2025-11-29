// Função chamada pelos botões "Adicionar"
function addToListFromButton(button) {
    const id = parseInt(button.getAttribute("data-id"));
    const title = button.getAttribute("data-title");
    const coverImage = button.getAttribute("data-cover");

    addToList({ id, title, coverImage });
}

// LocalStorage – Ler e Salvar Lista Principal
function getUserList() {
    const list = localStorage.getItem("userList");
    return list ? JSON.parse(list) : [];
}

function saveUserList(list) {
    localStorage.setItem("userList", JSON.stringify(list));
}

// Adicionar anime à lista principal
function addToList(anime) {
    let list = getUserList();

    if (!list.some(item => item.id === anime.id)) {
        anime.status = "watching";
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
        if (item.id === id) item.status = status;
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

// CONTROLE DE MODO DE EXIBIÇÃO 
let viewMode = "playlists"; 

function filterList(filter) {
    currentFilter = filter;
    displayList();
    displayListsInPage();
}

// Rótulos
function getStatusLabel(status) {
    const labels = {
        watching: "Assistindo",
        completed: "Assistido",
        dropped: "Dropado"
    };
    return labels[status] || status;
}

// EXIBIR A LISTA PRINCIPAL

function displayList() {
    const container = document.getElementById("anime-list");
    if (!container) return;

    let list = getUserList();

    container.innerHTML = ""; // limpa a tela SEM apagar playlists

    // --- PRIMEIRO: mostrar PLAYLISTS sempre ---
    const playlistsContainer = document.createElement("div");
    playlistsContainer.id = "playlists-section";
    container.appendChild(playlistsContainer);

    displayListsInPage(); // garante que playlists aparecem SEMPRE

    // --- SEGUNDO: mostrar os ANIMES filtrados ---

    const animesContainer = document.createElement("div");
    animesContainer.id = "animes-section";
    container.appendChild(animesContainer);

    if (currentFilter !== "all") {
        list = list.filter(item => item.status === currentFilter);
    }

    if (list.length === 0) {
        animesContainer.innerHTML = "<p>Nenhum anime nesta categoria.</p>";
        return;
    }

    animesContainer.innerHTML = `
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

//   SISTEMA DE LISTAS

function getUserLists() {
    const lists = localStorage.getItem("animePlaylists");
    return lists ? JSON.parse(lists) : [];
}

function saveUserLists(lists) {
    localStorage.setItem("animePlaylists", JSON.stringify(lists));
}

// Criar nova playlist
function createNewList() {
    const name = prompt("Digite o nome da nova lista:");

    if (!name || name.trim() === "") {
        alert("O nome da lista não pode ser vazio.");
        return;
    }

    const lists = getUserLists();

    if (lists.some(list => list.name === name)) {
        alert("Já existe uma lista com esse nome.");
        return;
    }

    lists.push({
        name: name,
        animes: []
    });

    saveUserLists(lists);
    alert("Lista criada com sucesso!");
    viewMode = "playlists";
    displayListsInPage();
}

// ADICIONAR ANIME A UMA PLAYLIST
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

// MOSTRA AS PLAYLISTS NA TELA
function displayListsInPage() {
    const container = document.getElementById("anime-list");
    if (!container) return;

    viewMode = "playlists";

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

// MOSTRA CONTEÚDO DE UMA LISTA
function showListContent(listName) {
    const lists = getUserLists();
    const list = lists.find(l => l.name === listName);

    if (!list) return;

    const container = document.getElementById("anime-list");
    viewMode = "playlists";

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

// Remover anime de playlist
function removeAnimeFromList(listName, id) {
    let lists = getUserLists();
    let list = lists.find(l => l.name === listName);

    list.animes = list.animes.filter(a => a.id !== id);
    saveUserLists(lists);

    showListContent(listName);
}

// BOTÃO “VOLTAR”
function switchToPlaylists() {
    viewMode = "playlists";
    displayListsInPage();
}

// Selecionar playlist para adicionar anime
function openPlaylistSelector(id, title, image) {
    const lists = getUserLists();

    if (lists.length === 0) {
        alert("Nenhuma playlist criada!");
        return;
    }

    const listName = prompt(
        "Digite o nome da playlist para adicionar:\n" +
        lists.map(l => "- " + l.name).join("\n")
    );

    if (!listName) return;

    addAnimeToSpecificList(id, title, image, listName);
}
