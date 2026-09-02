const input = document.getElementById("domain-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("domain-list");
const emptyMsg = document.getElementById("empty-msg");

function normalize(domain) {
  return domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");
}

function render(domains) {
  list.innerHTML = "";
  emptyMsg.style.display = domains.length ? "none" : "block";
  for (const domain of domains) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = domain;
    const btn = document.createElement("button");
    btn.textContent = "Remove";
    btn.className = "remove-btn";
    btn.addEventListener("click", () => removeDomain(domain));
    li.appendChild(span);
    li.appendChild(btn);
    list.appendChild(li);
  }
}

function load() {
  browser.storage.local.get("ignoredDomains").then((data) => {
    render(data.ignoredDomains || []);
  });
}

function addDomain() {
  const domain = normalize(input.value);
  if (!domain) return;
  browser.storage.local.get("ignoredDomains").then((data) => {
    const domains = data.ignoredDomains || [];
    if (!domains.includes(domain)) {
      domains.push(domain);
      browser.storage.local.set({ ignoredDomains: domains }).then(() => {
        input.value = "";
        render(domains);
      });
    }
  });
}

function removeDomain(domain) {
  browser.storage.local.get("ignoredDomains").then((data) => {
    const domains = (data.ignoredDomains || []).filter((d) => d !== domain);
    browser.storage.local.set({ ignoredDomains: domains }).then(() => {
      render(domains);
    });
  });
}

addBtn.addEventListener("click", addDomain);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addDomain();
});

load();
