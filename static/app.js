//  SISTEMA DE MINHA LISTA ORIGINAL
function addToListFromButton(button) {
    const id = parseInt(button.getAttribute("data-id"));
    const title = button.getAttribute("data-title");
    const coverImage = button.getAttribute("data-cover");

    addToList({ id, title, coverImage });
}

function getUserList() {
    const list = localStorage.getItem("userList");
    return list ? JSON.parse(list) : [];
}

function saveUserList(list) {
    localStorage.setItem("userList", JSON.stringify(list));
}

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

    displayList();
}

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

function removeFromList(id) {
    let list = getUserList();
    list = list.filter(item => item.id !== id);
    saveUserList(list);
    displayList();
}

let currentFilter = "all";
function filterList(filter) {
    currentFilter = filter;
    displayList();
}

function getStatusLabel(status) {
    const labels = {
        watching: "Assistindo",
        completed: "Assistido",
        dropped: "Dropado"
    };
    return labels[status] || status;
}

// SISTEMA DE PLAYLISTS
function getUserLists() {
    const lists = localStorage.getItem("animePlaylists");
    return lists ? JSON.parse(lists) : [];
}

function saveUserLists(lists) {
    localStorage.setItem("animePlaylists", JSON.stringify(lists));
}

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

    lists.push({ name: name, animes: [] });
    saveUserLists(lists);

    alert("Lista criada com sucesso!");
    displayList();
}

function deletePlaylist(name) {
    if (!confirm(`Tem certeza que deseja excluir a lista "${name}"?`)) return;

    let lists = getUserLists();
    lists = lists.filter(l => l.name !== name);
    saveUserLists(lists);

    displayList();
}

function addAnimeToSpecificList(id, title, image, listName) {
    let lists = getUserLists();
    let list = lists.find(l => l.name === listName);

    if (!list) return;

    if (list.animes.some(a => a.id === id)) {
        alert("Este anime já está nessa lista.");
        return;
    }

    list.animes.push({ id, title, image });
    saveUserLists(lists);

    alert(`Anime adicionado à lista "${listName}"!`);
}

function removeAnimeFromList(listName, id) {
    let lists = getUserLists();
    let list = lists.find(l => l.name === listName);

    list.animes = list.animes.filter(a => a.id !== id);
    saveUserLists(lists);

    showListContent(listName);
}

function showListContent(listName) {
    const lists = getUserLists();
    const list = lists.find(l => l.name === listName);
    const container = document.getElementById("anime-list");

    container.innerHTML = `
        <h2>${listName}</h2>
        <button onclick="displayList()">Voltar</button>
        <button onclick="deletePlaylist('${listName}')">Apagar Lista</button>
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

// EXIBIR TUDO JUNTO (ANIMES + PLAYLISTS)
function displayPlaylistsSection() {
    const lists = getUserLists();

    let html = `<h2>Playlists</h2>`;

    if (lists.length === 0) {
        html += "<p>Nenhuma playlist criada.</p>";
        return html;
    }

    lists.forEach(list => {
        html += `
            <div class="playlist-box">
                <h3>${list.name}</h3>
                <button onclick="showListContent('${list.name}')">Ver</button>
                <button onclick="deletePlaylist('${list.name}')">Apagar</button>
            </div>
        `;
    });

    return html;
}

// EXIBIR ANIMES + PLAYLISTS
function displayList() {
    const container = document.getElementById("anime-list");
    if (!container) return;

    let html = "";

    // EXIBIR PLAYLISTS SEMPRE
    html += displayPlaylistsSection();
    html += "<hr>";

    // EXIBIR OS ANIMES DE MINHA LISTA
    let list = getUserList();

    if (currentFilter !== "all") {
        list = list.filter(item => item.status === currentFilter);
    }

    if (list.length === 0) {
        html += "<p>Nenhum anime nesta categoria.</p>";
        container.innerHTML = html;
        return;
    }

    html += `<ul>`;
    list.forEach(item => {
        html += `
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

                <select onchange="addAnimeToSpecificList(${item.id}, '${item.title}', '${item.coverImage}', this.value)">
                    <option value="">Adicionar à playlist...</option>
                    ${getUserLists().map(l => `<option value="${l.name}">${l.name}</option>`).join("")}
                </select>
            </li>
        `;
    });
    html += `</ul>`;

    container.innerHTML = html;
}
