function displayDomains() {
  chrome.storage.sync.get(["prodDomains", "stageDomains", "liveDomains"], function (data) {
    const prodList = document.getElementById("prodList");
    const stageList = document.getElementById("stageList");
    const liveList = document.getElementById("liveList");

    prodList.innerHTML = "<h4>PROD Domains</h4>";
    stageList.innerHTML = "<h4>STAGE Domains</h4>";
    liveList.innerHTML = "<h4>LIVE Domains</h4>";

    if (data.prodDomains && data.prodDomains.length > 0) {
      data.prodDomains.forEach((domain) => {
        const div = document.createElement("div");
        div.className = "domain-item";
        div.innerHTML = `${domain} <button class="deleteProd" data-domain="${domain}">Delete</button>`;
        prodList.appendChild(div);
      });
    } else {
      prodList.innerHTML += "<p>No PROD domains added</p>";
    }

    if (data.stageDomains && data.stageDomains.length > 0) {
      data.stageDomains.forEach((domain) => {
        const div = document.createElement("div");
        div.className = "domain-item";
        div.innerHTML = `${domain} <button class="deleteStage" data-domain="${domain}">Delete</button>`;
        stageList.appendChild(div);
      });
    } else {
      stageList.innerHTML += "<p>No STAGE domains added</p>";
    }

    if (data.liveDomains && data.liveDomains.length > 0) {
      data.liveDomains.forEach((domain) => {
        const div = document.createElement("div");
        div.className = "domain-item";
        div.innerHTML = `${domain} <button class="deleteLive" data-domain="${domain}">Delete</button>`;
        liveList.appendChild(div);
      });
    } else {
      liveList.innerHTML += "<p>No LIVE domains added</p>";
    }

    attachDeleteHandlers();
  });
}

function attachDeleteHandlers() {
  document.querySelectorAll(".deleteProd").forEach((button) => {
    button.addEventListener("click", function () {
      const domain = this.getAttribute("data-domain");
      chrome.storage.sync.get(["prodDomains"], function (data) {
        const prodDomains = data.prodDomains.filter((d) => d !== domain);
        chrome.storage.sync.set({ prodDomains: prodDomains }, function () {
          displayDomains();
        });
      });
    });
  });

  document.querySelectorAll(".deleteStage").forEach((button) => {
    button.addEventListener("click", function () {
      const domain = this.getAttribute("data-domain");
      chrome.storage.sync.get(["stageDomains"], function (data) {
        const stageDomains = data.stageDomains.filter((d) => d !== domain);
        chrome.storage.sync.set({ stageDomains: stageDomains }, function () {
          displayDomains();
        });
      });
    });
  });

  document.querySelectorAll(".deleteLive").forEach((button) => {
    button.addEventListener("click", function () {
      const domain = this.getAttribute("data-domain");
      chrome.storage.sync.get(["liveDomains"], function (data) {
        const liveDomains = data.liveDomains.filter((d) => d !== domain);
        chrome.storage.sync.set({ liveDomains: liveDomains }, function () {
          displayDomains();
        });
      });
    });
  });
}

document.getElementById("addProdDomain").addEventListener("click", function () {
  const domain = document.getElementById("domainInput").value;
  if (domain) {
    chrome.storage.sync.get(["prodDomains"], function (data) {
      const prodDomains = data.prodDomains || [];
      if (!prodDomains.includes(domain)) {
        prodDomains.push(domain);
        chrome.storage.sync.set({ prodDomains: prodDomains }, function () {
          alert(`Added ${domain} to PROD`);
          document.getElementById("domainInput").value = "";
          displayDomains();
        });
      } else {
        alert(`${domain} is already in the PROD list`);
      }
    });
  }
});

document.getElementById("addStageDomain").addEventListener("click", function () {
  const domain = document.getElementById("domainInput").value;
  if (domain) {
    chrome.storage.sync.get(["stageDomains"], function (data) {
      const stageDomains = data.stageDomains || [];
      if (!stageDomains.includes(domain)) {
        stageDomains.push(domain);
        chrome.storage.sync.set({ stageDomains: stageDomains }, function () {
          alert(`Added ${domain} to STAGE`);
          document.getElementById("domainInput").value = "";
          displayDomains();
        });
      } else {
        alert(`${domain} is already in the STAGE list`);
      }
    });
  }
});

document.getElementById("addLiveDomain").addEventListener("click", function () {
  const domain = document.getElementById("domainInput").value;
  if (domain) {
    chrome.storage.sync.get(["liveDomains"], function (data) {
      const liveDomains = data.liveDomains || [];
      if (!liveDomains.includes(domain)) {
        liveDomains.push(domain);
        chrome.storage.sync.set({ liveDomains: liveDomains }, function () {
          alert(`Added ${domain} to LIVE`);
          document.getElementById("domainInput").value = "";
          displayDomains();
        });
      } else {
        alert(`${domain} is already in the LIVE list`);
      }
    });
  }
});

document.getElementById("clearDomains").addEventListener("click", function () {
  chrome.storage.sync.clear(function () {
    alert("Cleared all domains");
    displayDomains();
  });
});

// Handle adding domains from file
document.getElementById("addDomainsFromFile").addEventListener("click", function () {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.addEventListener('change', function () {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                try {
                    const data = JSON.parse(reader.result);
                    if (Array.isArray(data.urls)) {
                        const prodDomains = [];
                        const stageDomains = [];
                        const liveDomains = [];
                        
                        data.urls.forEach((entry) => {
                            switch (entry.environment) {
                                case "PROD":
                                    prodDomains.push(entry.url);
                                    break;
                                case "STAGE":
                                    stageDomains.push(entry.url);
                                    break;
                                case "LIVE":
                                    liveDomains.push(entry.url);
                                    break;
                            }
                        });

                        chrome.storage.sync.get(["prodDomains", "stageDomains", "liveDomains"], function (storedData) {
                            chrome.storage.sync.set({
                                prodDomains: [...(storedData.prodDomains || []), ...prodDomains],
                                stageDomains: [...(storedData.stageDomains || []), ...stageDomains],
                                liveDomains: [...(storedData.liveDomains || []), ...liveDomains]
                            }, function () {
                                alert("Domains added from file.");
                                displayDomains();
                            });
                        });
                    } else {
                        alert("Invalid file format.");
                    }
                } catch (e) {
                    alert("Error reading file.");
                }
            };
            reader.readAsText(file);
        }
    });

    input.click();
});

// Handle exporting domains
document.getElementById("exportDomains").addEventListener("click", function () {
    chrome.storage.sync.get(["prodDomains", "stageDomains", "liveDomains"], function (data) {
        const blob = new Blob([JSON.stringify({ urls: [
            ...data.prodDomains.map(url => ({ url, environment: "PROD" })),
            ...data.stageDomains.map(url => ({ url, environment: "STAGE" })),
            ...data.liveDomains.map(url => ({ url, environment: "LIVE" }))
        ]}, null, 2)], { type: "application/json" });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "GoiaTools Domain List.json";
        a.click();
        URL.revokeObjectURL(url);
    });
});

// Initial display
displayDomains();
