// Example
// {
//   "name": "Hills Pet Nutrition",
//   "path": "/etc/designs/zg/cphills/desktop",
//   "aem_path": "content/cp-sites/hills/hills-pet/en_us/home",
//   "bitbucket": "bitbucket.colgate.com/projects/THM/repos/hills-theme/browse",
//   "live": "www.hillspet.com/",
//   "jenkins": "jenkins.colgate.com/job/colpal65-theme-hills-pet-live-deploy/",
//   "stageAEM": "stageaem.hillspet.com/",
//   "id": 10
// }

// URL should be: protocol + domain + flavour + path

// Global Variables
const protocol = "https://";

// Environments
let legacy_stage_domain = "";
let legacy_prod_domain = "";
let legacy_dev_domain = "";

// Flavours
let legacy_assets_flavour = "";
let legacy_experience_fragments_flavour = "";
let legacy_admin_flavour = "";
let legacy_editor_flavour = "";

document.addEventListener("DOMContentLoaded", () => {
  loadBasicUrlsFromStorage().then((basicUrls) => {
    if (basicUrls) {
      // declaring global variables

      // Cloud URL's
      aem_cloud_main = basicUrls.aem_cloud_main;
      aem_cloud_target = basicUrls.aem_cloud_target;
      aem_cloud_base = basicUrls.aem_cloud_base;
      aem_cloud_stage = basicUrls.aem_cloud_stage;
      aem_cloud_dev = basicUrls.aem_cloud_dev;
      aem_cloud_prod = basicUrls.aem_cloud_prod;

      legacy_prod_domain = basicUrls.legacy_prod_domain;
      legacy_stage_domain = basicUrls.legacy_stage_domain;
      legacy_dev_domain = basicUrls.legacy_dev_domain;
      legacy_assets_flavour = basicUrls.legacy_assets_flavour;
      legacy_experience_fragments_flavour = basicUrls.legacy_experience_fragments_flavour;
      legacy_admin_flavour = basicUrls.legacy_admin_flavour;
      legacy_editor_flavour = basicUrls.legacy_editor_flavour;
      loadDataFromStorage();
      setupEventListeners();

      initializeListeners();
    }
  });
});

function initializeListeners() {
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

  document
    .querySelector("#experienceFragmentsButton")
    .addEventListener("click", () => {
      window.open(
        protocol + legacy_stage_domain + legacy_experience_fragments_flavour.replace(/.$/, ""),
        "_blank"
      );
    });

  document.querySelector("#assetsButton").addEventListener("click", () => {
    window.open(
      protocol + legacy_stage_domain + legacy_assets_flavour.replace(/.$/, ""),
      "_blank"
    );
  });

  // Legacy Stuff
  document.querySelector("#legacy_prod").addEventListener("click", () => {
    window.open(
      protocol + legacy_prod_domain + 'aem/start.html',
      "_blank"
    );
  });
  document.querySelector("#legacy_stage").addEventListener("click", () => {
    window.open(
      protocol + legacy_stage_domain + 'aem/start.html',
      "_blank"
    );
  });
  document.querySelector("#legacy_dev").addEventListener("click", () => {
    window.open(
      protocol + legacy_dev_domain,
      "_blank"
    );
  });
  // Cloud Stuff
  document.querySelector("#cloud_dev").addEventListener("click", () => {
    window.open(
      protocol + aem_cloud_dev + aem_cloud_base + "start.html",
      "_blank"
    );
  });
  document.querySelector("#cloud_stage").addEventListener("click", () => {
    window.open(
      protocol + aem_cloud_stage + aem_cloud_base + "start.html",
      "_blank"
    );
  });
  document.querySelector("#cloud_prod").addEventListener("click", () => {
    window.open(
      protocol + aem_cloud_prod + aem_cloud_base + "start.html",
      "_blank"
    );
  });
  document.querySelector("#cloud_main").addEventListener("click", () => {
    window.open(
      protocol + aem_cloud_main + "/home.html/program/128518 ",
      "_blank"
    );
  });
  document.querySelector("#cloud_target").addEventListener("click", () => {
    window.open(protocol + aem_cloud_target, "_blank");
  });
}

// Functions

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
        if (Array.isArray(data.urls) && Array.isArray(data.urls)) {
          saveComponentsToStorage(data.urls);
          saveBasicUrlsToStorage(data.basicUrls);
          renderComponents();
        } else {
          alert("Invalid file format.");
        }
        if (data.basicUrls) {
          saveBasicUrlsToStorage(data.basicUrls);
        } else {
          alert("No basic URLs found in the JSON file.");
        }
      } catch (e) {
        alert("Error reading file." + e);
      }
      addStats();
    };
    reader.readAsText(file);
  }
}
function createAccountComponent(component, index) {
  const container = document.createElement("div");
  container.className = "component blur";
  container.id = `component-${index}`;

  container.appendChild(createTitle(component.name));
  container.appendChild(createPathSubtitle(component.path));
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
    Live: [{ id: "Live", url: component.live }],
    Admin: [
      {
        id: "Prod",
        url: protocol + legacy_prod_domain + legacy_admin_flavour + component.aem_path,
      },
      {
        id: "Stage",
        url: protocol + legacy_stage_domain + legacy_admin_flavour + component.aem_path,
      },
    ],
    Editor: [
      {
        id: "Prod",
        url:
          protocol + legacy_prod_domain + legacy_editor_flavour + component.aem_path + ".html",
      },
      {
        id: "Stage",
        url:
          protocol + legacy_stage_domain + legacy_editor_flavour + component.aem_path + ".html",
      },
    ],
    VAP: [
      {
        id: "Prod",
        url:
          protocol + legacy_prod_domain + component.aem_path + ".html?wcmmode=disabled",
      },
      {
        id: "Stage",
        url:
          protocol +
          legacy_stage_domain +
          component.aem_path +
          ".html?wcmmode=disabled",
      },
    ],
    Other: [
      { id: "Stageaem", url: protocol + component.stageAem },
      { id: "Bitbucket", url: protocol + component.bitbucket },
      { id: "Jenkins", url: protocol + component.jenkins },
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

  const label = document.createElement("div");
  label.className = "label";
  label.textContent = `${group}: `;
  row.appendChild(label);

  const buttonHolder = document.createElement("div");
  buttonHolder.className = "button-holder";

  groupButtons.forEach((btn) => {
    const button = document.createElement("button");
    button.textContent = btn.id;

    // Check if the URL is missing or invalid
    if (
      !btn.url ||
      btn.url === "#" ||
      btn.url.includes("-65.adobecqms.net/#") ||
      btn.url.includes(".html/#") ||
      btn.url.includes("https://#") ||
      !ensureAbsoluteUrl(btn.url)
    ) {
      button.disabled = true;
      button.style.backgroundColor = "gray";
    } else {
      button.onclick = () => {
        window.open(ensureAbsoluteUrl(btn.url), "_blank");
      };
    }

    buttonHolder.appendChild(button);
    row.appendChild(buttonHolder);
  });

  return row;
}
function createEditButton(component, container) {
  const div = document.createElement("div");
  div.className = "edit-button-container";

  const editButton = document.createElement("button");
  editButton.id = "edit-button";
  editButton.textContent = "Edit";
  editButton.onclick = () => {
    toggleEditButton();
    openEditForm(component, container);
  };
  div.appendChild(editButton);
  return div;
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
  const editButtons = document.querySelectorAll("#edit-button");
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
    { label: "Path", value: component.path, placeholder: "Path" },
    { label: "Live URL", value: component.live, placeholder: "Live URL" },
    {
      label: "AEM path",
      value: component.aem_path,
      placeholder: "AEM path",
    },
    {
      label: "Bitbucket URL",
      value: component.bitbucket,
      placeholder: "Bitbucket URL",
    },
    {
      label: "Jenkins URL",
      value: component.jenkins,
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

  const components = await loadComponentsFromStorage();

  const updatedComponents = components.map((comp) => {
    if (comp.id === component.id) {
      Object.assign(comp, component); // Copy all properties from `component` to `comp`
    }
    return comp; // Ensure `comp` is returned from `map`
  });

  saveComponentsToStorage(updatedComponents);

  form.remove();
  renderComponents();
}
function updateComponentData(component, form) {
  component.name = form.querySelector("input[placeholder='Name']").value;
  component.path = form.querySelector("input[placeholder='Path']").value;
  component.live = form.querySelector("input[placeholder='Live URL']").value;
  component.aem_path = form.querySelector(
    "input[placeholder='AEM path']"
  ).value;
  component.bitbucket = form.querySelector(
    "input[placeholder='Bitbucket URL']"
  ).value;
  component.jenkins = form.querySelector(
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
  loadComponentsFromStorage().then((components) => {
    // Create a new array of components without the `id` property
    const componentsWithoutId = components.map(({ id, ...rest }) => rest);

    const dataStr = JSON.stringify(componentsWithoutId, null, 2);
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
function loadDataFromStorage() {
  renderComponents();
  addStats();
}
// Saving Data
function saveComponentsToStorage(data) {
  // Add an index to each element in the array
  const indexedData = data.map((element, index) => {
    return {
      ...element,
      id: index + 1, // or use `index` if you want to start from 0
    };
  });

  // Save the modified data to Chrome storage
  chrome.storage.local.set({ components: indexedData }, () => {
    console.log("Data with indexes successfully saved to storage.");
  });
}
function saveBasicUrlsToStorage(basicUrls) {
  chrome.storage.local.set({ basicUrls }, () => {
    console.log("Basic URLs successfully saved to storage.");
  });
  legacy_prod_domain = basicUrls.legacy_prod_domain;
  legacy_stage_domain = basicUrls.legacy_stage_domain;
  legacy_dev_domain = basicUrls.legacy_dev_domain;
  legacy_assets_flavour = basicUrls.legacy_assets_flavour;
  legacy_experience_fragments_flavour = basicUrls.legacy_experience_fragments_flavour;
  legacy_admin_flavour = basicUrls.legacy_admin_flavour;
  legacy_editor_flavour = basicUrls.legacy_editor_flavour;
}
// Loading Data
async function loadComponentsFromStorage() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["components"], (result) => {
      let components = result.components || [];
      resolve(components);
    });
  });
}
async function loadBasicUrlsFromStorage() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["basicUrls"], (result) => {
      let basicUrls = result.basicUrls || [];

      resolve(basicUrls);
    });
  });
}

function addStats() {
  loadComponentsFromStorage().then((components) => {
    if (components) {
      const sitesCount = document.getElementById("sites-count");
      sitesCount.innerHTML = "Sites count: " + components.length;
      sitesCount.style.color = "white";
    }
  });
}
function renderComponents() {
  loadComponentsFromStorage().then((components) => {
    if (components) {
      const componentContainer = document.getElementById("componentContainer");
      componentContainer.innerHTML = "";
      components.forEach((component, index) => {
        componentContainer.appendChild(
          createAccountComponent(component, index)
        );
      });
    }
  });
}
