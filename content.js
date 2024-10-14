// Floating Badges
function displayQuickActions() {
  const htmlTag = document.querySelector("html");
  if (htmlTag) {
    createQuickActionBadge(`Quick Actions`, 150, "rgba(250, 135, 217, 0.3)");
  }
}
function displayLocaleBadge() {
  const htmlTag = document.querySelector("html");
  if (htmlTag) {
    const lang = htmlTag.getAttribute("lang");
    if (lang) {
      createFloatingBadge(`Locale: ${lang}`, 100, "rgba(135, 206, 250, 0.3)");
    }
  }
}
function displayEnvironmentBadge(environment) {
  if (environment == "Stage") {
    createFloatingBadge(
      `Environment: ${environment}`,
      50,
      "rgba(119, 255, 73, 0.3)"
    );
  }
  if (environment == "Dev") {
    createFloatingBadge(
      `Environment: ${environment}`,
      50,
      "rgba(73, 132, 255, 0.3)"
    );
  }
  if (environment == "Prod") {
    createFloatingBadge(
      `Environment: ${environment}`,
      50,
      "rgba(255, 73, 73, 0.3)"
    );
  }
}

// Quick actions Menu
function showQuickActionsMenu(badge) {
  const menu = document.createElement("div");
  menu.className = "quick-actions-menu";
  menu.style.position = "fixed";
  menu.style.display = "block";
  menu.style.right = "calc(10px + " + badge.offsetWidth + "px)";
  menu.style.width = "365px";
  menu.style.color = "black";
  menu.style.padding = "10px";
  menu.style.borderRadius = "8px";
  menu.style.boxShadow = "0px 4px 15px rgba(0, 0, 0, 0.2)";
  menu.style.zIndex = "10001";
  menu.style.transition = "transform 0.3s ease"; // Smooth transition
  menu.style.transform = "translateX(10px)";
  menu.style.opacity = "1";
  menu.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  menu.style.bottom = badge.style.bottom;

  // Menu content
  const message = document.createElement("div");
  message.textContent = "You are on " + getFlavour() + ":";
  message.style.marginBottom = "10px";
  message.style.color = "white";

  // Menu path
  const path = document.createElement("div");
  const pathValue = document
    .querySelector("body")
    .getAttribute("data-theme-path");
  path.textContent = "Path: \n" + pathValue ? pathValue : "Unknown path";
  path.style.marginBottom = "10px";
  path.style.color = "gray";

  // Button for VAP to Editor
  const vapToEditorButton = document.createElement("button");
  vapToEditorButton.textContent = "Go to Editor";
  vapToEditorButton.style.width = "100%";
  vapToEditorButton.style.padding = "5px";
  vapToEditorButton.style.backgroundColor = "lightblue";
  vapToEditorButton.style.border = "none";
  vapToEditorButton.style.borderRadius = "4px";
  vapToEditorButton.style.cursor = "pointer";

  // Button for Editor to Admin
  const editorToAdminButton = document.createElement("button");
  editorToAdminButton.textContent = "Go to Admin";
  editorToAdminButton.style.width = "100%";
  editorToAdminButton.style.padding = "5px";
  editorToAdminButton.style.marginTop = "5px";
  editorToAdminButton.style.backgroundColor = "lightgreen";
  editorToAdminButton.style.border = "none";
  editorToAdminButton.style.borderRadius = "4px";
  editorToAdminButton.style.cursor = "pointer";

  // Button for View in Admin
  const adminToEditorBtton = document.createElement("button");
  adminToEditorBtton.textContent = "Go to Editor";
  adminToEditorBtton.style.width = "100%";
  adminToEditorBtton.style.padding = "5px";
  adminToEditorBtton.style.marginTop = "5px";
  adminToEditorBtton.style.backgroundColor = "yellow";
  adminToEditorBtton.style.border = "none";
  adminToEditorBtton.style.borderRadius = "4px";
  adminToEditorBtton.style.cursor = "pointer";

  // Button for Admin to VAP
  const adminToVapButton = document.createElement("button");
  adminToVapButton.textContent = "Go to VAP";
  adminToVapButton.style.width = "100%";
  adminToVapButton.style.padding = "5px";
  adminToVapButton.style.marginTop = "5px";
  adminToVapButton.style.backgroundColor = "orange";
  adminToVapButton.style.border = "none";
  adminToVapButton.style.borderRadius = "4px";
  adminToVapButton.style.cursor = "pointer";

  // Button for Delete Cache
  const cleanCacheButton = document.createElement("button");
  cleanCacheButton.textContent = "Clean Cache";
  cleanCacheButton.style.width = "100%";
  cleanCacheButton.style.padding = "5px";
  cleanCacheButton.style.marginTop = "5px";
  cleanCacheButton.style.backgroundColor = "red";
  cleanCacheButton.style.border = "none";
  cleanCacheButton.style.borderRadius = "4px";
  cleanCacheButton.style.cursor = "pointer";

  path.addEventListener("click", () => {
    navigator.clipboard
      .writeText(pathValue)
      .then(() => {
        // Display a notification
        const copiedMessage = document.createElement("div");
        copiedMessage.textContent = "Text copied!";
        copiedMessage.style.position = "fixed";
        copiedMessage.style.bottom = "200px";
        copiedMessage.style.right = "10px";
        copiedMessage.style.maxWidth = "300px";
        copiedMessage.style.maxWidth = "fit-content";
        copiedMessage.style.minWidth = "fit-content";
        copiedMessage.style.height = "fit-content";
        copiedMessage.style.backgroundColor = "rgba(247, 255, 49, 0.3)";
        copiedMessage.style.color = "black";
        copiedMessage.style.padding = "10px 15px";
        copiedMessage.style.borderRadius = "8px";
        copiedMessage.style.boxShadow = "0px 4px 15px rgba(0, 0, 0, 0.2)";
        copiedMessage.style.zIndex = "10000";
        copiedMessage.style.cursor = "move";
        copiedMessage.style.fontFamily = "'Nunito', sans-serif";
        copiedMessage.style.fontSize = "0.9em";

        copiedMessage.style.backdropFilter = "blur(4.6px)";
        copiedMessage.style.webkitBackdropFilter = "blur(4.6px)"; // Webkit-specific property
        copiedMessage.style.border = "1px solid rgba(255, 255, 255, 0.69)";

        document.body.appendChild(copiedMessage);

        // Remove the message after 2 seconds
        setTimeout(() => {
          document.body.removeChild(copiedMessage);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  });

  // URLS's Logic
  editorToAdminButton.addEventListener("click", () => {
    switchEditorAdmin();
  });
  adminToEditorBtton.addEventListener("click", () => {
    switchEditorAdmin();
  });

  // The following need optimization or implementation of above logic
  vapToEditorButton.addEventListener("click", () => {
    const u = location.href.split(".net/");
    window.open(
      u[0] + ".net/editor.html/" + u[1].split("?wcmmode=disabled")[0],
      "_blank"
    );
  });

  adminToVapButton.addEventListener("click", () => {
    const url = window.location.href;
    if (
      url.includes("author-colgate-stage-65.adobecqms.net/sites.html/content/")
    ) {
      // Delete extra stuff
      if (url.includes("?wcmmode=disabled")) {
        url.replace("?wcmmode=disabled", "");
      }

      const newUrl = url.replace("sites.html/", "") + ".html";
      window.open(newUrl, "_blank");
    } else {
      alert(
        "You seem not to be on an admin page, or you have not clicked the page you want to go to."
      );
    }
  });
  cleanCacheButton.addEventListener("click", () => {
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
    alert("About to clean cache on " + document.title);
    window.location.reload(true);
  });

  menu.appendChild(message);
  menu.appendChild(path);

  if (getFlavour() == "Editor") {
    menu.appendChild(editorToAdminButton);
  }
  if (getFlavour() == "Vap") {
    menu.appendChild(vapToEditorButton);
  }
  if (getFlavour() == "Admin") {
    menu.appendChild(adminToEditorBtton);
    menu.appendChild(adminToVapButton);
  }

  menu.appendChild(cleanCacheButton);
  document.body.appendChild(menu);

  setTimeout(() => {
    menu.style.transform = "translateX(0)";
  }, 10);
}

// Helper Functions
function makeDraggable(el) {
  let isDragging = false;
  let offsetX, offsetY;

  el.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - el.getBoundingClientRect().left;
    offsetY = e.clientY - el.getBoundingClientRect().top;
    el.style.position = "fixed";
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      el.style.left = `${e.clientX - offsetX}px`;
      el.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}
function createFloatingBadge(
  text,
  bottomOffset = 50,
  bgColor = "rgba(135, 206, 250, 0.3)"
) {
  const badge = document.createElement("div");
  badge.className = "floating-badge";
  badge.style.position = "fixed";
  badge.style.bottom = bottomOffset ? bottomOffset + "px" : "50px";
  badge.style.right = "10px";
  badge.style.maxWidth = "300px";
  badge.style.maxWidth = "fit-content";
  badge.style.minWidth = "fit-content";
  badge.style.height = "fit-content";
  badge.style.backgroundColor = bgColor ? bgColor : red;
  badge.style.color = "black";
  badge.style.padding = "10px 15px";
  badge.style.borderRadius = "8px";
  badge.style.boxShadow = "0px 4px 15px rgba(0, 0, 0, 0.2)";
  badge.style.zIndex = "10000";
  badge.style.cursor = "move";
  badge.style.fontFamily = "'Nunito', sans-serif";
  badge.style.fontSize = "0.9em";

  badge.style.backdropFilter = "blur(4.6px)";
  badge.style.webkitBackdropFilter = "blur(4.6px)"; // Webkit-specific property
  badge.style.border = "1px solid rgba(255, 255, 255, 0.69)";

  badge.innerHTML = text;

  document.body.appendChild(badge);

  makeDraggable(badge);
}
function createQuickActionBadge(
  text,
  bottomOffset = 50,
  bgColor = "rgba(135, 206, 250, 0.3)"
) {
  const badge = document.createElement("div");
  badge.className = "floating-badge quick-action-badge";
  badge.style.position = "fixed";
  badge.style.bottom = bottomOffset ? bottomOffset + "px" : "50px";
  badge.style.right = "10px";
  badge.style.maxWidth = "fit-content";
  badge.style.minWidth = "fit-content";
  badge.style.height = "fit-content";
  badge.style.backgroundColor = bgColor ? bgColor : "red";
  badge.style.color = "black";
  badge.style.padding = "10px 15px";
  badge.style.borderRadius = "8px";
  badge.style.boxShadow = "0px 4px 15px rgba(0, 0, 0, 0.2)";
  badge.style.zIndex = "10000";
  badge.style.cursor = "pointer";
  badge.style.fontFamily = "'Nunito', sans-serif";
  badge.style.fontSize = "0.9em";
  badge.style.backdropFilter = "blur(4.6px)";
  badge.style.webkitBackdropFilter = "blur(4.6px)"; // Webkit-specific property
  badge.style.border = "1px solid rgba(255, 255, 255, 0.69)";
  badge.innerHTML = text;

  document.body.appendChild(badge);

  makeDraggable(badge);

  // Add event listener to toggle the menu
  badge.addEventListener("click", () => {
    toggleQuickActionsMenu(badge);
  });
}
function toggleQuickActionsMenu(badge) {
  let existingMenu = document.querySelector(".quick-actions-menu");

  if (existingMenu) {
    existingMenu.style.transform = "translateX(0)";
    existingMenu.style.opacity = "1";

    setTimeout(() => {
      existingMenu.style.transform = "translateX(10px)";
      existingMenu.style.opacity = "0";
    }, 10);

    setTimeout(() => {
      existingMenu.remove();
    }, 310);
  } else {
    showQuickActionsMenu(badge);
  }
}
function switchEditorAdmin() {
  var url = window.location.href;

  // Editor -> Admin
  if (url.includes("editor.html")) {
    url = url.replace("editor.html", "sites.html").slice(0, -5);
    window.open(url, "_blank");
  }
  // Admin -> Editor
  else if (url.includes("sites.html")) {
    url = url.replace("sites.html", "editor.html") + ".html";
    window.open(url, "_blank");
  } else {
    alert("This is not Editor nor Admin");
  }
}
function switchAdminVap() {
  var url = window.location.href;
  // Admin -> VAP
  if (isAdmin(url)) {
    url = url.replace("sites.html", "").slice(0, -5);
    window.open(url, "_blank");
  }
  // VAP -> Admin
  else if (isVap(url)) {
  }
}

function isVap(url) {
  return url.slice(-5) == ".html" && !url.includes("editor.html");
}
function isEditor(url) {
  return url.includes("editor.html") && url.slice(0, -5) == ".html";
}
function isAdmin(url) {
  return url.includes("sites.html");
}

function detectOverrides() {
  const elements = document.querySelectorAll("*");
  for (const element of elements) {
    const computedStyle = window.getComputedStyle(element);
    for (const property of computedStyle) {
      const priority = computedStyle.getPropertyPriority(property);
      if (priority === "important") {
        console.log("Override detected:", element, property);
        // Add a badge or highlight the element here
      } else {
        console.log("No Override detected");
      }
    }
  }
}

const VAP =
  "https://author-colgate-stage-65.adobecqms.net/content/cp-sites-aem/hills/hills-pet/en_us/home/pet-adoption-resources.html?wcmmode=disabled";
const Admin =
  "https://author-colgate-stage-65.adobecqms.net/sites.html/content/cp-sites-aem/hills/hills-pet/en_us/home/pet-adoption-resources";

const Editor =
  "https://author-colgate-stage-65.adobecqms.net/editor.html/content/cp-sites-aem/hills/hills-pet/en_us/home/pet-adoption-resources.html";

function getEnvironment() {
  const currentUrl = window.location.href.toLowerCase();

  let environment = "";

  if (currentUrl.includes("author-colgate-prod")) {
    environment = "Prod";
  } else if (currentUrl.includes("author-colgate-stage")) {
    environment = "Stage";
  } else if (currentUrl.includes("3.95.170.167:4502")) {
    environment = "Dev";
  }
  return environment;
}

function getFlavour() {
  const url = window.location.href;
  let ret = "";

  if (
    url.includes("author-colgate-stage-65.adobecqms.net/sites.html/content/")
  ) {
    ret = "Admin";
  } else if (
    url.includes("author-colgate-stage-65.adobecqms.net/editor.html/content/")
  ) {
    ret = "Editor";
  } else if (url.includes("author-colgate-stage-65.adobecqms.net/content/")) {
    ret = "Vap";
  } else if (url.includes("3.95.170.167:4502")) {
    ret = "DEV";
  }

  return ret;
}

// Initialize Popup
function init() {
  let environment = getEnvironment();

  getFlavour();

  if (environment) {
    displayEnvironmentBadge(environment);
    displayQuickActions();
    displayLocaleBadge();
    // detectOverrides();
  }
}

init();

// function to delete cache, i need to add it as a quick actions button
// if ('caches' in window) {
//   caches.keys().then((names) => {
//     names.forEach((name) => {
//       caches.delete(name);
//     });
//   });
//   console.log("Site cache cleared.");
// } else {
//   console.log("Cache API not supported.");
// }
// window.location.reload(true); // Reload the page and force revalidation from the server
