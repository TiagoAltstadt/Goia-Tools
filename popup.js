document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  loadDataFromStorage();
});

function setupEventListeners() {
  document.getElementById("clearData").addEventListener("click", clearAllData);
  document.getElementById("addDataFromFile").addEventListener("click", triggerFileInput);
  document.getElementById("exportData").addEventListener("click", exportData);
  document.getElementById("searchInput").addEventListener("input", filterComponents);
  document.getElementById("fileInput").addEventListener("change", handleFileUpload);
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
      } catch (e) {
        console.error("Error parsing JSON file:", e);
        alert("Error reading file.");
      }
    };
    reader.readAsText(file);
  }
}

function createComponent(component) {
  const container = document.createElement("div");
  container.className = "component";
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
    button.onclick = () => window.open(ensureAbsoluteUrl(btn.url), "_blank");
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

function toggleQuickActions(titleElement) {
  const buttonContainer = titleElement.nextElementSibling.nextElementSibling; // Get the button container

  if (buttonContainer) {
    buttonContainer.style.display = buttonContainer.style.display === "none" ? "flex" : "none";
  }
}

function toggleEditButton() {
  const editButtons = document.querySelectorAll(".edit-button");
  editButtons.forEach((editButton) => {
    editButton.style.display = editButton.style.display === "none" ? "block" : "none";
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
    { label: "Editor Prod URL", value: component.AEM_Prod, placeholder: "Editor Prod URL" },
    { label: "Editor Stage URL", value: component.AEM_Stage, placeholder: "Editor Stage URL" },
    { label: "VAP Prod URL", value: component.VAP_Prod, placeholder: "VAP Prod URL" },
    { label: "VAP Stage URL", value: component.VAP_Stage, placeholder: "VAP Stage URL" },
    { label: "Bitbucket URL", value: component.Bitbucket, placeholder: "Bitbucket URL" },
    { label: "Jenkins URL", value: component.Jenkins, placeholder: "Jenkins URL" },
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
  console.log("Before update:", component);
  console.log("Form values:", {
    name: form.querySelector("input[placeholder='Name']").value,
    path: form.querySelector("input[placeholder='Path']").value,
    liveUrl: form.querySelector("input[placeholder='Live URL']").value,
    aemProd: form.querySelector("input[placeholder='Editor Prod URL']").value,
    aemStage: form.querySelector("input[placeholder='Editor Stage URL']").value,
    vapProd: form.querySelector("input[placeholder='VAP Prod URL']").value,
    vapStage: form.querySelector("input[placeholder='VAP Stage URL']").value,
    bitbucket: form.querySelector("input[placeholder='Bitbucket URL']").value,
    jenkins: form.querySelector("input[placeholder='Jenkins URL']").value,
  });

  updateComponentData(component, form);

  const components = await getComponentsFromStorage();
  console.log("Components retrieved from storage:", components);

  const updatedComponents = components.map((comp) =>
    comp.id === component.id ? { ...component } : comp
  );
  console.log("Updated components list:", updatedComponents);

  saveDataToStorage(updatedComponents);

  form.remove();
  renderComponents(updatedComponents);
}

function updateComponentData(component, form) {
  component.name = form.querySelector("input[placeholder='Name']").value;
  component.Path = form.querySelector("input[placeholder='Path']").value;
  component.Live = form.querySelector("input[placeholder='Live URL']").value;
  component.AEM_Prod = form.querySelector("input[placeholder='Editor Prod URL']").value;
  component.AEM_Stage = form.querySelector("input[placeholder='Editor Stage URL']").value;
  component.VAP_Prod = form.querySelector("input[placeholder='VAP Prod URL']").value;
  component.VAP_Stage = form.querySelector("input[placeholder='VAP Stage URL']").value;
  component.Bitbucket = form.querySelector("input[placeholder='Bitbucket URL']").value;
  component.Jenkins = form.querySelector("input[placeholder='Jenkins URL']").value;
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
    const title = component.querySelector("h3").textContent.toLowerCase();
    component.style.display = title.includes(searchText) ? "" : "none";
  });
}

function saveDataToStorage(data) {
  console.log("Saving data to storage:", data);
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
      renderComponents(components);
    }
  });
}

function renderComponents(components) {
  const componentContainer = document.getElementById("componentContainer");
  componentContainer.innerHTML = "";
  components.forEach((component) => {
    componentContainer.appendChild(createComponent(component));
  });
}
