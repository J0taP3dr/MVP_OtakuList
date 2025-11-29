// Função chamada pelos botões "Adicionar"

function addToListFromButton(button) {
    const id = parseInt(button.getAttribute("data-id"));
    const title = button.getAttribute("data-title");
    const coverImage = button.getAttribute("data-cover");

    addToList({ id, title, coverImage });
}

// SISTEMA DE LISTA PRINCIPAL (ANIMES)

// LocalStorage – Ler e Salvar Lista

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
        displayList();  
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

// SISTEMA DE PLAYLISTS

// Obtém todas as playlists criadas

function getUserLists() {
    const lists = localStorage.getItem("animePlaylists");
    return lists ? JSON.parse(lists) : [];
}

// Salva as playlists

function saveUserLists(lists) {
    localStorage.setItem("animePlaylists", JSON.stringify(lists));
}

// Criar playlist

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
    displayList();  
}


// Adiciona anime em playlist específica

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

// EXIBIÇÃO FINAL — ANIMES E PLAYLISTS NA MESMA PÁGINA

function displayList() {
    const container = document.getElementById("anime-list");
    if (!container) return;

    container.innerHTML = ""; 

    // EXIBIR AS PLAYLISTS SEMPRE (PRIMEIRO)
    
    const lists = getUserLists();

    const playlistsDiv = document.createElement("div");
    playlistsDiv.innerHTML = `<h2>Suas Playlists</h2>`;

    if (lists.length === 0) {
        playlistsDiv.innerHTML += `<p>Nenhuma playlist criada ainda.</p>`;
    } else {
        lists.forEach(list => {
            const div = document.createElement("div");
            div.className = "playlist-box";

            div.innerHTML = `
                <h3>${list.name}</h3>
                <button onclick="showListContent('${list.name}')">Ver animes</button>
            `;

            playlistsDiv.appendChild(div);
        });
    }

    container.appendChild(playlistsDiv);

    // EXIBE A LISTA PRINCIPAL DE ANIMES

    let list = getUserList();

    if (currentFilter !== "all") {
        list = list.filter(item => item.status === currentFilter);
    }

    const animesDiv = document.createElement("div");
    animesDiv.innerHTML = `<h2>Animes da sua Lista</h2>`;

    if (list.length === 0) {
        animesDiv.innerHTML += "<p>Nenhum anime nesta categoria.</p>";
        container.appendChild(animesDiv);
        return;
    }

    list.forEach(item => {
        const div = document.createElement("div");
        div.innerHTML = `
            <img src="${item.coverImage}" width="150">
            <h3>${item.title}</h3>

            <p>Status: ${item.status}</p>
            <select onchange="updateStatus(${item.id}, this.value)">
                <option value="watching" ${item.status === "watching" ? "selected" : ""}>Assistindo</option>
                <option value="completed" ${item.status === "completed" ? "selected" : ""}>Assistido</option>
                <option value="dropped" ${item.status === "dropped" ? "selected" : ""}>Dropado</option>
            </select>

            <button onclick="removeFromList(${item.id})">Remover</button>
        `;

        animesDiv.appendChild(div);
    });

    container.appendChild(animesDiv);
}

// VER CONTEÚDO DE UMA PLAYLIST

function showListContent(listName) {
    const lists = getUserLists();
    const list = lists.find(l => l.name === listName);

    const container = document.getElementById("anime-list");
    container.innerHTML = `
        <h2>${listName}</h2>
        <button onclick="displayList()">Voltar</button>
        <br><br>
    `;

    if (!list || list.animes.length === 0) {
        container.innerHTML += "<p>Nenhum anime nesta playlist.</p>";
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
