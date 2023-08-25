// mutationObserver.js

/**
 * Start observing mutations on the page.
 */
function startMutationObserver() {
    const observer = new MutationObserver(() => {
        const existingSearchDiv = document.querySelector('.mb-2.flex.flex-row.gap-2');
        if (!existingSearchDiv) {
            addSearchField();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}
