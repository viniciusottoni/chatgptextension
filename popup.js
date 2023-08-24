document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('pDescription').innerHTML = chrome.i18n.getMessage("pDescription");
    document.getElementById('aDonate').innerText = chrome.i18n.getMessage("aDonate");
    document.getElementById('spnDevelopedBy').innerText = chrome.i18n.getMessage("spnDevelopedBy");
});
