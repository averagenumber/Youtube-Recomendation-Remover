function saveSettings(removeMainPage, removeRecomendation) {
    browser.storage.sync.set({
        redirect: removeMainPage,
        recommendations: removeRecomendation
    });
}

function loadSettings() {
    browser.storage.sync.get(['redirect', 'recommendations']).then((result) => {
        document.getElementById('redirect').checked = result.redirect ?? false;
        document.getElementById('recommendations').checked = result.recommendations ?? false;
    });
}

function apply() {
    const removeMainPage = document.getElementById('redirect').checked;
    const removeRecomendation = document.getElementById('recommendations').checked;
    saveSettings(removeMainPage, removeRecomendation);
    browser.tabs.query({url: ["*://*.youtube.com/*", "*://youtube.com/*"]}).then((tabs) => {
        for (const tab of tabs){
            browser.tabs.reload(tab.id);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
});

document.getElementById('apply').addEventListener('click', apply);