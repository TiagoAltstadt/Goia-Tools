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

function showQuickActionsMenu(badge) {
  const menu = document.createElement("div");
  menu.className = "quick-actions-menu";
  menu.style.position = "fixed";
  menu.style.display = "block";
  menu.style.bottom = badge.style.bottom;
  menu.style.right = "calc(10px + " + badge.offsetWidth + "px)";
  menu.style.width = "200px";
  menu.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  menu.style.color = "black";
  menu.style.padding = "10px";
  menu.style.borderRadius = "8px";
  menu.style.boxShadow = "0px 4px 15px rgba(0, 0, 0, 0.2)";
  menu.style.zIndex = "10001";
  menu.style.transition = "transform 0.3s ease"; // Smooth transition
  menu.style.transform = "translateX(10px)";
  menu.style.opacity = "1";

  // Menu content
  const message = document.createElement("div");
  message.textContent = "Quick Actions:";
  message.style.marginBottom = "10px";
  message.style.color = "white";

  // Button for VAP to Editor
  const editorButton = document.createElement("button");
  editorButton.textContent = "VAP to Editor";
  editorButton.style.width = "100%";
  editorButton.style.padding = "5px";
  editorButton.style.backgroundColor = "lightblue";
  editorButton.style.border = "none";
  editorButton.style.borderRadius = "4px";
  editorButton.style.cursor = "pointer";
  editorButton.addEventListener("click", () => {
    const u = location.href.split(".net/");
    window.open(
      u[0] + ".net/editor.html/" + u[1].split("?wcmmode=disabled")[0],
      "_blank"
    );
  });

  // Button for Editor to Admin
  const adminButton = document.createElement("button");
adminButton.textContent = "Editor to Admin";
adminButton.style.width = "100%";
adminButton.style.padding = "5px";
adminButton.style.marginTop = "5px";
adminButton.style.backgroundColor = "lightgreen";
adminButton.style.border = "none";
adminButton.style.borderRadius = "4px";
adminButton.style.cursor = "pointer";
adminButton.addEventListener("click", () => {
  var url = window.location.href;

  // Make sure we're in the editor context
  if (
    url.startsWith(
      "https://author-colgate-stage-65.adobecqms.net/editor.html/content/"
    )
  ) {
    // Remove the editor.html part and the .html extension from the content URL
    var path = url.replace(
      "https://author-colgate-stage-65.adobecqms.net/editor.html/content/",
      ""
    );
    var cleanPath = path.replace(".html", "");

    // Rebuild the URL for the admin view
    var newUrl =
      "https://author-colgate-stage-65.adobecqms.net/sites.html/content/" +
      cleanPath;
    console.log("Transformed URL:", newUrl);
    window.open(newUrl, "_blank");
  } else {
    alert("The current page URL does not match the expected format.");
  }
});


  // New Button for View in Admin
  const viewAdminButton = document.createElement("button");
  viewAdminButton.textContent = "Admin to Editor";
  viewAdminButton.style.width = "100%";
  viewAdminButton.style.padding = "5px";
  viewAdminButton.style.marginTop = "5px";
  viewAdminButton.style.backgroundColor = "yellow";
  viewAdminButton.style.border = "none";
  viewAdminButton.style.borderRadius = "4px";
  viewAdminButton.style.cursor = "pointer";
  viewAdminButton.addEventListener("click", () => {
    const url = window.location.href;
    if (
      url.startsWith(
        "https://author-colgate-stage-65.adobecqms.net/sites.html/content/"
      )
    ) {
      const newUrl = url.replace(
        "sites.html",
        "editor.html"
      ) + ".html";
      console.log("View in Admin Transformed URL:", newUrl);
      window.open(newUrl, "_blank");
    } else {
      alert("The current page URL does not match the expected format.");
    }
  });

  menu.appendChild(message);
  menu.appendChild(editorButton);
  menu.appendChild(adminButton);
  menu.appendChild(viewAdminButton); // Append new button
  document.body.appendChild(menu);

  // Smoothly move the menu into place
  setTimeout(() => {
    menu.style.transform = "translateX(0)";
  }, 10);
}


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
  if (environment == "Prod") {
    createFloatingBadge(
      `Environment: ${environment}`,
      50,
      "rgba(255, 73, 73, 0.3)"
    );
  }
}

function init() {
  const currentUrl = window.location.href.toLowerCase();
  let environment = "";

  if (currentUrl.includes("prod")) {
    environment = "Prod";
  } else if (currentUrl.includes("stage")) {
    environment = "Stage";
  }
  if (environment) {
    displayEnvironmentBadge(environment);
    displayQuickActions();
    displayLocaleBadge();
  }
}

init();
