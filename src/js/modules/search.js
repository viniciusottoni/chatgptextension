/**
 * Utility function to normalize a string.
 * @param {string} str - The string to normalize.
 * @returns {string} - The normalized string.
 */
function normalize(str) {
    return str.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
}

/**
 * Perform a search based on the input value.
 */
function performSearch() {
    const searchTerm = normalize(document.getElementById('searchInput').value.toLowerCase());
    const items = document.querySelectorAll('li[data-projection-id]');

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

/**
 * Add a search field to the page.
 */
function addSearchField() {
    const flex1Div = document.querySelector('.flex-col.flex-1');
    const existingSearchDiv = document.querySelector('.mb-2.flex.flex-row.gap-2');

    if (flex1Div && !existingSearchDiv) {
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

        flex1Div.parentNode.insertBefore(searchDiv, flex1Div);

        document.getElementById('searchButton').addEventListener('click', function() {
            performSearch();
        });

        document.getElementById('searchInput').addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });

        document.getElementById('searchInput').addEventListener('input', function() {
            performSearch();
        });

        const learnMoreLink = document.createElement('a');
        learnMoreLink.className = "h-9 pb-2 px-3 text-xs text-gray-500 font-medium text-ellipsis overflow-hidden break-all bg-gray-900";
        learnMoreLink.href = "#";
        learnMoreLink.innerText = chrome.i18n.getMessage("aLearnMore");
        learnMoreLink.addEventListener('click', function(event) {
            event.preventDefault();
            showPopup();
        });
        flex1Div.parentNode.insertBefore(learnMoreLink, flex1Div);
    }
}
