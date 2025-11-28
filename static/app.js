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
