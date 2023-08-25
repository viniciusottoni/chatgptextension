// ui.js

/**
 * Show the popup on the page.
 */
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
    xhr.open("GET", chrome.runtime.getURL('src/html/description.html'), true);
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