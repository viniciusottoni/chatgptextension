function normalize(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function performSearch() {
    const searchTerm = normalize(document.getElementById('searchInput').value.toLowerCase());
    const items = document.querySelectorAll('li[data-projection-id]');

    // Se o campo de busca estiver vazio, mostre todos os li's e retorne
    if (!searchTerm.trim()) {
        items.forEach(item => {
            item.style.display = 'block';
        });
        return;
    }

    items.forEach(item => {
        const innerDiv = item.querySelector('a div');
        if (innerDiv && normalize(innerDiv.textContent.toLowerCase()).includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function showPopup() {
    // Crie o overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.zIndex = '1000';
    document.body.appendChild(overlay);

    // Crie o conteúdo do popup
    const popupContent = document.createElement('div');
    let xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.runtime.getURL('description.html'), true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                const pDescription = chrome.i18n.getMessage("pDescription");
                const aDonate = chrome.i18n.getMessage("aDonate");
                const spnDevelopedBy = chrome.i18n.getMessage("spnDevelopedBy");
                
                popupContent.innerHTML = xhr.responseText
                    .replace("__MSG_pDescription__", pDescription)
                    .replace("__MSG_aDonate__", aDonate)
                    .replace("__MSG_spnDevelopedBy__", spnDevelopedBy);

                // Adicione o conteúdo do popup ao documento
                document.body.appendChild(popupContent);
            } else {
                console.error('Erro ao carregar popup.html:', xhr.statusText);
            }
        }
    };
    xhr.send();
    popupContent.style.position = 'fixed';
    popupContent.style.top = '50%';
    popupContent.style.left = '50%';
    popupContent.style.transform = 'translate(-50%, -50%)';
    popupContent.style.zIndex = '1001';
    document.body.appendChild(popupContent);

    // Adicione um evento de clique ao overlay para fechar o popup
    overlay.addEventListener('click', function() {
        document.body.removeChild(overlay);
        document.body.removeChild(popupContent);
    });
}

function addSearchField() {
    // Seleciona a div 'flex-col.flex-1'
    const flex1Div = document.querySelector('.flex-col.flex-1');

    // Verifica se o campo de busca já foi adicionado
    const existingSearchDiv = document.querySelector('.mb-2.flex.flex-row.gap-2');

    // Verifica se a div foi encontrada e se o campo de busca ainda não foi adicionado
    if (flex1Div && !existingSearchDiv) {
        // Cria o elemento div para conter o campo de busca e o botão
        const searchPlaceholder = chrome.i18n.getMessage("txtSearchPlaceholder");
        const searchDiv = document.createElement('div');
        searchDiv.className = "mb-2 flex flex-row gap-2";
        searchDiv.innerHTML = `
            <input type="text" id="searchInput" class="flex-grow px-3 min-h-[44px] gap-3 py-1 text-sm rounded-md border border-white/20 bg-gray-900 text-white" placeholder="${searchPlaceholder}">
            <button id="searchButton" class="flex px-3 py-1 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md border border-white/20 hover:bg-gray-500/10 h-11 w-11">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </button>
        `;

        // Injeta o novo elemento imediatamente antes da div 'flex-1'
        flex1Div.parentNode.insertBefore(searchDiv, flex1Div);

        // Adiciona o evento de clique ao botão de busca
        document.getElementById('searchButton').addEventListener('click', function() {
            performSearch();
        });

        // Adiciona o evento de pressionar tecla ao campo de entrada
        document.getElementById('searchInput').addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });

        // Adiciona o evento de input ao campo de entrada
        document.getElementById('searchInput').addEventListener('input', function() {
            performSearch();
        });

        // Adicione o link "Saiba mais..." abaixo do campo de busca
        const learnMoreLink = document.createElement('a');
        learnMoreLink.className = "h-9 pb-2 px-3 text-xs text-gray-500 font-medium text-ellipsis overflow-hidden break-all bg-gray-900";
        learnMoreLink.href = "#";
        learnMoreLink.innerText = "Saiba mais...";
        learnMoreLink.addEventListener('click', function(event) {
            event.preventDefault();
            showPopup();
        });
        flex1Div.parentNode.insertBefore(learnMoreLink, flex1Div);
    }
}

function startMutationObserver() {
    const observer = new MutationObserver(() => {
        const existingSearchDiv = document.querySelector('.mb-2.flex.flex-row.gap-2');
        if (!existingSearchDiv) {
            addSearchField();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

window.addEventListener('load', function() {
    addSearchField();
    startMutationObserver();
});