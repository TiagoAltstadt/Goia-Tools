const experienceFragmentsURL =
  "https://author-colgate-stage-65.adobecqms.net/aem/experience-fragments.html";
const assetsURL = "https://author-colgate-stage-65.adobecqms.net/assets.html/";

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  loadDataFromStorage();
});

document
  .querySelector("#experienceFragmentsButton")
  .addEventListener("click", () => {
    window.open(experienceFragmentsURL, "_blank");
  });

document.querySelector("#assetsButton").addEventListener("click", () => {
  window.open(assetsURL, "_blank");
});
// Messager for content.js ----------------------------------------
document.querySelector("#hideBadgesButton").addEventListener("click", () => {
  const button = document.querySelector("#hideBadgesButton");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "toggleBadges" },
      (response) => {
        if (response.status === "badges visible") {
          button.textContent = "Hide Badges";
        } else if (response.status === "badges hidden") {
          button.textContent = "Show Badges";
        }
      }
    );
  });
});

// Functions
function saveBasicUrlsToStorage(basicUrls) {
  chrome.storage.local.set({ basicUrls }, () => {
    console.log("Basic URLs successfully saved to storage.");
  });
}
function setupEventListeners() {
  document.getElementById("clearData").addEventListener("click", clearAllData);
  document
    .getElementById("addDataFromFile")
    .addEventListener("click", triggerFileInput);
  document.getElementById("exportData").addEventListener("click", exportData);
  document
    .getElementById("searchInput")
    .addEventListener("input", filterComponents);
  document
    .getElementById("fileInput")
    .addEventListener("change", handleFileUpload);
}
function triggerFileInput() {
  document.getElementById("fileInput").click();
}
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (Array.isArray(data.urls) && Array.isArray(data.urls[0])) {
          saveDataToStorage(data.urls[0]);
          renderComponents(data.urls[0]);
        } else {
          alert("Invalid file format.");
        }
        if (data.basicUrls) {
          saveBasicUrlsToStorage(data.basicUrls);
        } else {
          alert("No basic URLs found in the JSON file.");
        }
      } catch (e) {
        console.error("Error parsing JSON file:", e);
        alert("Error reading file.");
      }
    };
    reader.readAsText(file);
  }
}
function createAccountComponent(component) {
  const container = document.createElement("div");
  container.className = "component blur";
  container.id = `component-${component.id}`;

  container.appendChild(createTitle(component.name));
  container.appendChild(createPathSubtitle(component.Path));
  container.appendChild(createButtonContainer(component));
  container.appendChild(createEditButton(component, container));

  return container;
}
function createTitle(name) {
  const title = document.createElement("h3");
  title.textContent = name;
  title.className = "title";
  title.onclick = () => {
    toggleQuickActions(title);
  };
  return title;
}
function createPathSubtitle(path) {
  const pathSubtitle = document.createElement("div");
  pathSubtitle.className = "path-subtitle";
  pathSubtitle.textContent = path;
  return pathSubtitle;
}
function createButtonContainer(component) {
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  buttonContainer.style.display = "none";

  const buttonGroups = {
    Live: [{ id: "Live", url: component.Live }],
    Editor: [
      { id: "Prod", url: component.AEM_Prod },
      { id: "Stage", url: component.AEM_Stage },
    ],
    VAP: [
      { id: "Prod", url: component.VAP_Prod },
      { id: "Stage", url: component.VAP_Stage },
    ],
    "Bitbucket & Jenkins": [
      { id: "Bitbucket", url: component.Bitbucket },
      { id: "Jenkins", url: component.Jenkins },
    ],
  };

  for (const [group, groupButtons] of Object.entries(buttonGroups)) {
    const row = createButtonRow(group, groupButtons);
    buttonContainer.appendChild(row);
  }

  return buttonContainer;
}
function createButtonRow(group, groupButtons) {
  const row = document.createElement("div");
  row.className = "button-row";
  row.textContent = `${group}: `;

  groupButtons.forEach((btn) => {
    const button = document.createElement("button");
    button.textContent = btn.id;

    // Check if the URL is missing or invalid
    if (!btn.url || btn.url === "#" || !ensureAbsoluteUrl(btn.url)) {
      button.disabled = true;
      button.style.backgroundColor = "gray";
    } else {
      button.onclick = () => window.open(ensureAbsoluteUrl(btn.url), "_blank");
    }

    row.appendChild(button);
  });

  return row;
}
function createEditButton(component, container) {
  const editButton = document.createElement("button");
  editButton.className = "edit-button";
  editButton.textContent = "Edit";
  editButton.onclick = () => {
    toggleEditButton();
    openEditForm(component, container);
  };
  return editButton;
}

// Helper Functions
function toggleQuickActions(titleElement) {
  const buttonContainer = titleElement.nextElementSibling.nextElementSibling;

  if (buttonContainer) {
    buttonContainer.style.display =
      buttonContainer.style.display === "none" ? "flex" : "none";
  }
}
function toggleEditButton() {
  const editButtons = document.querySelectorAll(".edit-button");
  editButtons.forEach((editButton) => {
    editButton.style.display =
      editButton.style.display === "none" ? "block" : "none";
  });
}
function openEditForm(component, container) {
  let form = container.querySelector(".edit-form");
  if (!form) {
    form = createEditForm(component);
    container.appendChild(form);
  } else {
    form.style.display = "block";
  }
}
function createEditForm(component) {
  const form = document.createElement("div");
  form.className = "edit-form";

  const fields = [
    { label: "Name", value: component.name, placeholder: "Name" },
    { label: "Path", value: component.Path, placeholder: "Path" },
    { label: "Live URL", value: component.Live, placeholder: "Live URL" },
    {
      label: "Editor URL (Prod)",
      value: component.AEM_Prod,
      placeholder: "Editor URL (Prod)",
    },
    {
      label: "Editor URL (Stage)",
      value: component.AEM_Stage,
      placeholder: "Editor URL (Stage)",
    },
    {
      label: "VAP URL (Prod)",
      value: component.VAP_Prod,
      placeholder: "VAP URL (Prod)",
    },
    {
      label: "VAP URL (Stage)",
      value: component.VAP_Stage,
      placeholder: "VAP URL (Stage)",
    },
    {
      label: "Bitbucket URL",
      value: component.Bitbucket,
      placeholder: "Bitbucket URL",
    },
    {
      label: "Jenkins URL",
      value: component.Jenkins,
      placeholder: "Jenkins URL",
    },
  ];

  fields.forEach((field) => form.appendChild(createInputField(field)));
  form.appendChild(createFormButtons(component, form));

  return form;
}
function createInputField({ label, value, placeholder }) {
  const labelElement = document.createElement("label");
  labelElement.textContent = label;

  const input = document.createElement("input");
  input.value = value;
  input.placeholder = placeholder;

  const container = document.createElement("div");
  container.appendChild(labelElement);
  container.appendChild(input);

  return container;
}
function createFormButtons(component, form) {
  const buttonContainer = document.createElement("div");

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.onclick = () => saveEdit(component, form);

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.onclick = () => {
    form.remove();
    toggleEditButton();
  };

  buttonContainer.appendChild(saveButton);
  buttonContainer.appendChild(cancelButton);

  return buttonContainer;
}
async function saveEdit(component, form) {
  updateComponentData(component, form);

  const components = await getComponentsFromStorage();

  const updatedComponents = components.map((comp) =>
    comp.id === component.id ? { ...component } : comp
  );

  saveDataToStorage(updatedComponents);

  form.remove();
  renderComponents(updatedComponents);
}
function updateComponentData(component, form) {
  component.name = form.querySelector("input[placeholder='Name']").value;
  component.Path = form.querySelector("input[placeholder='Path']").value;
  component.Live = form.querySelector("input[placeholder='Live URL']").value;
  component.AEM_Prod = form.querySelector(
    "input[placeholder='Editor URL (Prod)']"
  ).value;
  component.AEM_Stage = form.querySelector(
    "input[placeholder='Editor URL (Stage)']"
  ).value;
  component.VAP_Prod = form.querySelector(
    "input[placeholder='VAP URL (Prod)']"
  ).value;
  component.VAP_Stage = form.querySelector(
    "input[placeholder='VAP URL (Stage)']"
  ).value;
  component.Bitbucket = form.querySelector(
    "input[placeholder='Bitbucket URL']"
  ).value;
  component.Jenkins = form.querySelector(
    "input[placeholder='Jenkins URL']"
  ).value;
}
function ensureAbsoluteUrl(url) {
  if (!url || url === "#") return null;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "https://" + url;
  }
  return url;
}
function clearAllData() {
  chrome.storage.local.remove("components", () => {
    document.getElementById("componentContainer").innerHTML = "";
  });
}
function exportData() {
  getComponentsFromStorage().then((components) => {
    const dataStr = JSON.stringify(components, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "GoiaTools-Data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}
function filterComponents() {
  const searchText = document.getElementById("searchInput").value.toLowerCase();
  const components = document.querySelectorAll(".component");

  components.forEach((component) => {
    if (!component.querySelector("h3")) return;
    const title = component.querySelector("h3").textContent.toLowerCase();
    component.style.display = title.includes(searchText) ? "" : "none";
  });
}
function saveDataToStorage(data) {
  chrome.storage.local.set({ components: data }, () => {
    console.log("Data successfully saved to storage.");
  });
}
async function getComponentsFromStorage() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["components"], (result) => {
      const components = result.components || [];
      resolve(components);
    });
  });
}
function loadDataFromStorage() {
  getComponentsFromStorage().then((components) => {
    if (components) {
      addStats(components);
      renderComponents(components);
    }
  });
}
function addStats(components) {
  const sitesCount = document.getElementById("sites-count");
  sitesCount.innerHTML = "Sites count: " + components.length;
  sitesCount.style.color = "white";
}
function renderComponents(components) {
  const componentContainer = document.getElementById("componentContainer");
  componentContainer.innerHTML = "";
  components.forEach((component) => {
    componentContainer.appendChild(createAccountComponent(component));
  });
}
