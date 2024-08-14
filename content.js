function createFloatingBadge(
  text,
  bottomOffset = 50,
  bgColor = "rgba(135, 206, 250, 0.9)"
) {
  const badge = document.createElement("div");
  badge.className = "floating-badge";
  badge.style.bottom = `${bottomOffset}px`;
  badge.style.backgroundColor = bgColor;
  badge.innerHTML = text;

  document.body.appendChild(badge);

  // Make the badge draggable
  makeDraggable(badge);
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

function displayLocaleBadge() {
  const htmlTag = document.querySelector("html");
  if (htmlTag) {
    const lang = htmlTag.getAttribute("lang");
    if (lang) {
      createFloatingBadge(`Locale: ${lang}`, 100, "rgba(135, 206, 250, 0.9)");
    }
  }
}

function displayEnvironmentBadge() {
  const currentUrl = window.location.href.toLowerCase();
  let environment = "";

  if (currentUrl.includes("prod")) {
    environment = "Prod";
  } else if (currentUrl.includes("stage")) {
    environment = "Stage";
  }

  if ((environment == "Stage")) {
    createFloatingBadge(
      `Environment: ${environment}`,
      50,
      "rgb(119 255 73 / 90%)"
    );
  }
  if ((environment == "Prod")) {
    createFloatingBadge(
      `Environment: ${environment}`,
      50,
      "rgb(255 73 73 / 90%)"
    );
  }
}

function init() {
  displayLocaleBadge();
  displayEnvironmentBadge();
}

// Initialize badges
init();
