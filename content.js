// URL should be: protocol + domain + flavour + path

// Global variables ----------------------------------------
const badgeLength = "160px";
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

// Identificators
const vapIdentificator = ".adobecqms.net/content/";

async function getBasicUrlsFromStorage() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["basicUrls"], (result) => {
      let basicUrls = result.basicUrls || [];
      // declaring global variables

      // Cloud URL's
      aem_cloud_main = basicUrls.aem_cloud_main;
      aem_cloud_target = basicUrls.aem_cloud_target;
      aem_cloud_base = basicUrls.aem_cloud_base;
      aem_cloud_dev = basicUrls.aem_cloud_dev;
      aem_cloud_stage = basicUrls.aem_cloud_stage;
      aem_cloud_prod = basicUrls.aem_cloud_prod;

      legacy_prod_domain = basicUrls.legacy_prod_domain;
      legacy_stage_domain = basicUrls.legacy_stage_domain;
      legacy_dev_domain = basicUrls.legacy_dev_domain;
      legacy_assets_flavour = basicUrls.legacy_assets_flavour;
      legacy_experience_fragments_flavour =
        basicUrls.legacy_experience_fragments_flavour;
      legacy_admin_flavour = basicUrls.legacy_admin_flavour;
      legacy_editor_flavour = basicUrls.legacy_editor_flavour;
      resolve(basicUrls);
    });
  });
}

// Listener from popup.js ----------------------------------------

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleBadges") {
    const badges = document.querySelectorAll(".floating-badge");
    let allHidden = true;

    badges.forEach((badge) => {
      if (badge.style.display === "none") {
        badge.style.display = "block";
      } else {
        badge.style.display = "none";
        allHidden = false;
      }
    });

    if (allHidden) {
      sendResponse({ status: "badges visible" });
    } else {
      sendResponse({ status: "badges hidden" });
    }
  }
});

// Floating Badges ----------------------------------------
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
  if (environment == "Cloud Dev") {
    createFloatingBadge(
      `Environment: ${environment}`,
      50,
      "rgb(73 89 255 / 30%)"
    );
  }
  if (environment == "Cloud Stage") {
    createFloatingBadge(
      `Environment: ${environment}`,
      50,
      "rgb(73 89 255 / 30%)"
    );
  }
  if (environment == "Cloud Prod") {
    createFloatingBadge(
      `Environment: ${environment}`,
      50,
      "rgba(255, 73, 73, 0.3)"
    );
  }
  if (environment == "Cloud Main") {
    createFloatingBadge(
      `Environment: ${environment}`,
      50,
      "rgba(255, 73, 73, 0.3)"
    );
  }
  if (environment == "Cloud Target") {
    createFloatingBadge(
      `Environment: ${environment}`,
      50,
      "rgba(255, 73, 73, 0.3)"
    );
  }
}

// Quick actions Menu   -----------------------------------
function showQuickActionsMenu(badge) {
  const menu = document.createElement("div");
  menu.className = "quick-actions-menu";
  menu.style.position = "fixed";
  menu.style.display = "block";
  menu.style.right = "calc(15px + " + badge.offsetWidth + "px)";
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
  vapToEditorButton.style.fontSize = "14.4px";
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
  editorToAdminButton.style.fontSize = "14.4px";
  editorToAdminButton.style.borderRadius = "4px";
  editorToAdminButton.style.cursor = "pointer";

  // Button for Editor to VAP
  const editorToVapButton = document.createElement("button");
  editorToVapButton.textContent = "Go to VAP";
  editorToVapButton.style.fontSize = "14.4px";
  editorToVapButton.style.width = "100%";
  editorToVapButton.style.padding = "5px";
  editorToVapButton.style.marginTop = "5px";
  editorToVapButton.style.backgroundColor = "orange";
  editorToVapButton.style.border = "none";
  editorToVapButton.style.borderRadius = "4px";
  editorToVapButton.style.cursor = "pointer";

  // Button for View in Admin
  const adminToEditorBtton = document.createElement("button");
  adminToEditorBtton.textContent = "Go to Editor";
  adminToEditorBtton.style.width = "100%";
  adminToEditorBtton.style.padding = "5px";
  adminToEditorBtton.style.marginTop = "5px";
  adminToEditorBtton.style.backgroundColor = "yellow";
  adminToEditorBtton.style.border = "none";
  adminToEditorBtton.style.borderRadius = "4px";
  adminToEditorBtton.style.fontSize = "14.4px";
  adminToEditorBtton.style.cursor = "pointer";

  // Button for Admin to VAP
  const adminToVapButton = document.createElement("button");
  adminToVapButton.textContent = "Go to VAP";
  adminToVapButton.style.fontSize = "14.4px";
  adminToVapButton.style.width = "100%";
  adminToVapButton.style.padding = "5px";
  adminToVapButton.style.marginTop = "5px";
  adminToVapButton.style.backgroundColor = "orange";
  adminToVapButton.style.border = "none";
  adminToVapButton.style.borderRadius = "4px";
  adminToVapButton.style.cursor = "pointer";

  // Button for Stage <-> Prod swap
  const stageProdSwapButton = document.createElement("button");
  stageProdSwapButton.textContent =
    getEnvironment() == "Prod" ? "Swp to Stage" : "Swap to Prod";
  stageProdSwapButton.style.width = "100%";
  stageProdSwapButton.style.padding = "5px";
  stageProdSwapButton.style.marginTop = "5px";
  stageProdSwapButton.style.backgroundColor = "yellow";
  stageProdSwapButton.style.border = "none";
  stageProdSwapButton.style.borderRadius = "4px";
  stageProdSwapButton.style.cursor = "pointer";
  stageProdSwapButton.style.fontSize = "14.4px";

  // Button for Delete Cache
  const cleanCacheButton = document.createElement("button");
  cleanCacheButton.textContent = "Clean Cache";
  cleanCacheButton.style.width = "100%";
  cleanCacheButton.style.padding = "5px";
  cleanCacheButton.style.marginTop = "5px";
  cleanCacheButton.style.backgroundColor = "red";
  cleanCacheButton.style.border = "none";
  cleanCacheButton.style.fontSize = "14.4px";

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
        copiedMessage.style.fontSize = "14.4px";

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

  stageProdSwapButton.addEventListener("click", () => {
    var url = window.location.href;
    if (url.includes(legacy_prod_domain)) {
      url = url.replace(legacy_prod_domain, legacy_stage_domain);
      window.open(url, "_blank");
    } else if (url.includes(legacy_stage_domain)) {
      url = url.replace(legacy_stage_domain, legacy_prod_domain);
      window.open(url, "_blank");
    }
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
      u[0] +
        ".net/" +
        legacy_editor_flavour +
        u[1].split("?wcmmode=disabled")[0],
      "_blank"
    );
  });
  adminToVapButton.addEventListener("click", () => {
    const url = window.location.href;
    if (url.includes(legacy_stage_domain + legacy_admin_flavour)) {
      // Delete extra stuff
      if (url.includes("?wcmmode=disabled")) {
        url.replace("?wcmmode=disabled", "");
      }

      const newUrl = url.replace(legacy_admin_flavour, "") + ".html";
      window.open(newUrl, "_blank");
    } else {
      alert(
        "You seem not to be on an admin page, or you have not clicked the page you want to go to."
      );
    }
  });
  editorToVapButton.addEventListener("click", () => {
    let url = window.location.href;
    if (url.includes(legacy_editor_flavour)) {
      // Delete extra stuff
      url = url.replace(legacy_editor_flavour, "");
      if (url.includes("?wcmmode=disabled")) {
        url = url.replace("?wcmmode=disabled", "");
      }

      const newUrl = url.replace(legacy_admin_flavour, "") + ".html";
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
    menu.appendChild(editorToVapButton);
  }
  if (getFlavour() == "Vap") {
    menu.appendChild(vapToEditorButton);
  }
  if (getFlavour() == "Admin") {
    menu.appendChild(adminToEditorBtton);
    menu.appendChild(adminToVapButton);
  }

  menu.appendChild(stageProdSwapButton);
  menu.appendChild(cleanCacheButton);
  document.body.appendChild(menu);

  setTimeout(() => {
    menu.style.transform = "translateX(0)";
  }, 10);
}

// Badge creator  ----------------------------------------
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
  badge.style.width = badgeLength;
  badge.style.textAlign = "center";
  badge.style.height = "fit-content";
  badge.style.fontSize = "14.4px";
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
  badge.style.width = badgeLength;
  badge.style.textAlign = "center";
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

// Helper Functions     -----------------------------------
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
  if (url.includes(legacy_editor_flavour)) {
    url = url.replace(legacy_editor_flavour, legacy_admin_flavour).slice(0, -5);
    window.open(url, "_blank");
  }
  // Admin -> Editor
  else if (url.includes(legacy_admin_flavour)) {
    url = url.replace(legacy_admin_flavour, legacy_editor_flavour) + ".html";
    window.open(url, "_blank");
  } else {
    alert("This is not Editor nor Admin");
  }
}
function switchAdminVap() {
  var url = window.location.href;
  // Admin -> VAP
  if (isAdmin(url)) {
    url = url.replace(legacy_admin_flavour, "").slice(0, -5);
    window.open(url, "_blank");
  }
  // VAP -> Admin
  else if (isVap(url)) {
  }
}

// Detectors  ---------------------------------------------
function isVap(url) {
  return url.slice(-5) == ".html" && !url.includes(legacy_editor_flavour);
}
function isEditor(url) {
  return url.includes(legacy_editor_flavour) && url.slice(0, -5) == ".html";
}
function isAdmin(url) {
  return url.includes(legacy_admin_flavour);
}
function getEnvironment() {
  const currentUrl = window.location.href.toLowerCase();
  let environment = "";

  if (currentUrl.includes(legacy_prod_domain)) {
    environment = "Prod";
  } else if (currentUrl.includes(legacy_stage_domain)) {
    environment = "Stage";
  } else if (currentUrl.includes(legacy_dev_domain)) {
    environment = "Dev";
  } else if (currentUrl.includes(aem_cloud_main)) {
    environment = "Cloud Main";
  } else if (currentUrl.includes(aem_cloud_target)) {
    environment = "Cloud Target";
  } else if (currentUrl.includes(aem_cloud_dev)) {
    environment = "Cloud Dev";
  } else if (currentUrl.includes(aem_cloud_stage)) {
    environment = "Cloud Stage";
  } else if (currentUrl.includes(aem_cloud_prod)) {
    environment = "Cloud Prod";
  }
  return environment;
}
function getFlavour() {
  const url = window.location.href;
  let ret = "";

  if (url.includes(legacy_admin_flavour)) {
    ret = "Admin";
  } else if (url.includes(legacy_editor_flavour)) {
    ret = "Editor";
  } else if (url.includes(legacy_assets_flavour)) {
    ret = "Assets";
  } else if (url.includes(legacy_experience_fragments_flavour)) {
    ret = "Experience Fragments";
  } else {
    ret = "Vap";
  }

  return ret;
}

// Initialize Popup   -----------------------------------
async function init() {
  await getBasicUrlsFromStorage();

  getFlavour();

  let environment = getEnvironment();
  if (environment) {
    displayEnvironmentBadge(environment);
    displayQuickActions();
    displayLocaleBadge();
    // detectOverrides();
  }
}

init();
