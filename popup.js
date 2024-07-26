document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("clearData").addEventListener("click", clearAllData);
    document.getElementById("addDataFromFile").addEventListener("click", () => document.getElementById("fileInput").click());
    document.getElementById("exportData").addEventListener("click", exportData);
    document.getElementById("searchInput").addEventListener("input", filterComponents);

    document.getElementById("fileInput").addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                try {
                    const data = JSON.parse(reader.result);
                    if (Array.isArray(data.urls) && Array.isArray(data.urls[0])) {
                        saveDataToStorage(data.urls[0]);
                        renderComponents(data.urls[0]);
                    } else {
                        alert("Invalid file format.");
                    }
                } catch (e) {
                    console.error("Error parsing JSON file:", e);
                    alert("Error reading file.");
                }
            };
            reader.readAsText(file);
        }
    });

    loadDataFromStorage();
});

function createComponent(component) {
    const container = document.createElement("div");
    container.className = "component";

    // Title
    const title = document.createElement("h3");
    title.textContent = component.name;
    container.appendChild(title);

    // Path Subtitle
    if (component.Path) {
        const pathSubtitle = document.createElement("p");
        pathSubtitle.className = "path-subtitle";
        pathSubtitle.textContent = component.Path;
        container.appendChild(pathSubtitle);
    }

    // Buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    const buttons = [
        { id: 'Live', url: component.Live },
        { id: 'Bitbucket', url: component.Bitbucket },
        { id: 'Jenkins', url: component.Jenkins }
    ];

    // First row of buttons
    const firstRow = document.createElement("div");
    firstRow.className = "button-row";
    buttons.forEach(btn => {
        if (btn.url && btn.url !== "#") {
            const button = document.createElement("button");
            button.textContent = btn.id;
            button.onclick = () => window.open(ensureAbsoluteUrl(btn.url), '_blank');
            firstRow.appendChild(button);
        }
    });
    buttonContainer.appendChild(firstRow);

    // Second row: Editor Prod and Editor Stage
    const editorButtons = [
        { id: 'Editor: Prod', url: component.AEM_Prod },
        { id: 'Editor: Stage', url: component.AEM_Stage }
    ];

    const secondRow = document.createElement("div");
    secondRow.className = "button-row";
    const editorLabel = document.createElement("span");
    editorLabel.textContent = "Editor: ";
    secondRow.appendChild(editorLabel);
    editorButtons.forEach(btn => {
        if (btn.url && btn.url !== "#") {
            const button = document.createElement("button");
            button.textContent = btn.id.split(': ')[1];
            button.onclick = () => window.open(ensureAbsoluteUrl(btn.url), '_blank');
            secondRow.appendChild(button);
        }
    });
    buttonContainer.appendChild(secondRow);

    // Third row: VAP Prod and VAP Stage
    const vapButtons = [
        { id: 'VAP: Prod', url: component.VAP_Prod },
        { id: 'VAP: Stage', url: component.VAP_Stage }
    ];

    const thirdRow = document.createElement("div");
    thirdRow.className = "button-row";
    const vapLabel = document.createElement("span");
    vapLabel.textContent = "VAP: ";
    thirdRow.appendChild(vapLabel);
    vapButtons.forEach(btn => {
        if (btn.url && btn.url !== "#") {
            const button = document.createElement("button");
            button.textContent = btn.id.split(': ')[1];
            button.onclick = () => window.open(ensureAbsoluteUrl(btn.url), '_blank');
            thirdRow.appendChild(button);
        }
    });
    buttonContainer.appendChild(thirdRow);

    container.appendChild(buttonContainer);

    if (shouldShowLocaleMessage(component)) {
        const localeMessage = document.createElement("div");
        localeMessage.className = "locale-message";
        localeMessage.textContent = "Locale message for specific domains.";
        container.appendChild(localeMessage);
    }

    return container;
}


function ensureAbsoluteUrl(url) {
    if (!url || url === "#") {
        return null; // or handle it accordingly, e.g., return an empty string
    }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return "https://" + url;
    }
    return url;
}

function shouldShowLocaleMessage(component) {
    const currentDomain = window.location.hostname;
    const domainsToCheck = [
        component.Live,
        component.AEM_Prod,
        component.AEM_Stage,
        component.VAP_Prod,
        component.VAP_Stage
    ];

    return domainsToCheck.some(url => {
        try {
            const absoluteUrl = ensureAbsoluteUrl(url);
            return absoluteUrl && new URL(absoluteUrl).hostname === currentDomain;
        } catch (e) {
            console.warn("Invalid URL:", url);
            return false;
        }
    });
}

function clearAllData() {
    chrome.storage.local.remove('components', () => {
        document.getElementById("componentContainer").innerHTML = "";
    });
}

function exportData() {
    alert("Export functionality not yet implemented.");
}

function filterComponents() {
    const searchText = document.getElementById("searchInput").value.toLowerCase();
    const components = document.querySelectorAll(".component");

    components.forEach(component => {
        const title = component.querySelector("h3").textContent.toLowerCase();
        if (title.includes(searchText)) {
            component.style.display = "";
        } else {
            component.style.display = "none";
        }
    });
}

function saveDataToStorage(data) {
    chrome.storage.local.set({ components: data }, () => {
        console.log("Data saved to storage.");
    });
}

function loadDataFromStorage() {
    chrome.storage.local.get(['components'], (result) => {
        if (result.components) {
            renderComponents(result.components);
        }
    });
}

function renderComponents(components) {
    const componentContainer = document.getElementById("componentContainer");
    componentContainer.innerHTML = "";
    components.forEach(component => {
        const componentElement = createComponent(component);
        componentContainer.appendChild(componentElement);
    });
}
