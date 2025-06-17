// Aplica o tema salvo
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  document.getElementById("toggle-theme").textContent = "🌞";
  updateTitleColor();  // Atualiza a cor do título para escuro
}

// Aplica o título salvo
const savedTitle = localStorage.getItem("siteTitle");
if (savedTitle) {
  document.getElementById("site-title").value = savedTitle;
  updateTitleColor();  // Atualiza a cor do título conforme o tema
}

// Aplica o tipo de visualização salvo
const savedView = localStorage.getItem("viewType");
if (savedView) {
  const notesContainer = document.getElementById("notes-container");
  notesContainer.classList.remove("grid-view", "list-view");
  notesContainer.classList.add(savedView);
}

// Salva o título do site sempre que for alterado
document.getElementById("site-title").addEventListener("input", function () {
  localStorage.setItem("siteTitle", this.value);
  updateTitleColor();  // Atualiza a cor do título ao alterar
});

// Atualiza a cor do título conforme o tema
function updateTitleColor() {
  const siteTitleElement = document.getElementById("site-title");
  if (document.body.classList.contains("dark")) {
    siteTitleElement.style.color = "#F0F0F0"; // Cor para o tema escuro
  } else {
    siteTitleElement.style.color = "#2C2C2C"; // Cor para o tema claro
  }
}

// Carrega as notas salvas
function loadNotes() {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const container = document.getElementById("notes-container");
  container.innerHTML = "";
  notes.forEach(noteData => createNote(noteData));
}

// Salva todas as notas
function saveNotes() {
  const notes = [];
  document.querySelectorAll(".note").forEach(note => {
    const title = note.querySelector("h3").textContent;
    const content = note.querySelector(".content-area").innerHTML;
    const color = note.style.backgroundColor;
    const date = note.getAttribute("data-date");
    const titleColor = note.querySelector("h3").style.color;
    notes.push({ title, content, color, date, titleColor });
  });
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Alterna o tema
document.getElementById("toggle-theme").addEventListener("click", function () {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  this.textContent = isDark ? "🌞" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateTitleColor();  // Atualiza a cor do título sempre que o tema mudar
});

// Botão de adicionar nota
document.getElementById("add-note").addEventListener("click", function () {
  createNote();
  saveNotes();
});

// Alterna visualização
document.getElementById("toggle-view").addEventListener("click", function () {
  const notesContainer = document.getElementById("notes-container");
  notesContainer.classList.toggle("grid-view");
  notesContainer.classList.toggle("list-view");
  const isGrid = notesContainer.classList.contains("grid-view");
  localStorage.setItem("viewType", isGrid ? "grid-view" : "list-view");
});

// Criação de nota
function createNote(data = {}) {
  const note = document.createElement("div");
  note.classList.add("note");

  const noteHeader = document.createElement("header");
  noteHeader.classList.add("note-header");

  const noteTitleElement = document.createElement("h3");
  noteTitleElement.textContent = data.title || "Nota Padrão";
  noteTitleElement.setAttribute("contenteditable", true);
  noteTitleElement.style.flexGrow = "1";
  noteTitleElement.style.margin = "0";
  noteTitleElement.style.paddingRight = "10px";
  noteTitleElement.style.color = "#2C2C2C";  // Cor inicial para o título
  noteTitleElement.addEventListener("input", saveNotes);

  const colorToggleButton = document.createElement("button");
  colorToggleButton.classList.add("color-toggle");
  colorToggleButton.textContent = "🎨";
  colorToggleButton.style.marginLeft = "5px";

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-note");
  deleteButton.textContent = "🗑️";
  deleteButton.style.marginLeft = "5px";
  deleteButton.addEventListener("click", () => {
    note.remove();
    saveNotes();
  });

  noteHeader.appendChild(noteTitleElement);
  noteHeader.appendChild(colorToggleButton);
  noteHeader.appendChild(deleteButton);

  const colors = [
    "#FFEB3B", "#F9F871", "#4CAF50", "#A5D6A7", "#2196F3", "#90CAF9",
    "#FF9800", "#FFB74D", "#9C27B0", "#CE93D8", "#E91E63", "#F48FB1",
    "#FFC107", "#FFECB3", "#FF5722", "#FF7043", "#FF8A65", "#FFAB91",
    "#D32F2F", "#F44336", "#E57373", "#C2185B", "#D81B60", "#F06292",
    "#9C27B0", "#8E24AA", "#7B1FA2", "#6A1B9A", "#4A148C", "#BA68C8",
    "#8E44AD", "#7E57C2", "#5E35B1", "#512DA8", "#3F51B5", "#303F9F",
    "#1976D2", "#0288D1", "#039BE5", "#00BCD4", "#00ACC1", "#26C6DA",
    "#009688", "#00796B", "#004D40", "#388E3C", "#2C6E2F", "#2E7D32",
    "#689F38", "#43A047", "#66BB6A", "#81C784", "#A5D6A7", "#7CB342"
  ];

  let currentColor = 0;
  if (data.color && colors.includes(data.color)) {
    currentColor = colors.indexOf(data.color);
  } else if (data.color) {
    colors.unshift(data.color);
    currentColor = 0;
  }

  note.style.backgroundColor = colors[currentColor];

  colorToggleButton.addEventListener("click", () => {
    currentColor = (currentColor + 1) % colors.length;
    note.style.backgroundColor = colors[currentColor];
    saveNotes();
  });

  const contentArea = document.createElement("div");
  contentArea.classList.add("content-area");
  contentArea.setAttribute("contenteditable", true);
  contentArea.innerHTML = data.content || "Conteúdo da nota";
  contentArea.addEventListener("input", saveNotes);

  const footer = document.createElement("footer");
  footer.style.display = "flex";
  footer.style.justifyContent = "space-between";
  footer.style.marginTop = "1rem";
  footer.style.fontSize = "0.9rem";
  footer.style.color = "#2C2C2C";  // Cor para o rodapé

  const date = data.date || new Date().toLocaleString();
  note.setAttribute("data-date", date);
  const dateElement = document.createElement("div");
  dateElement.classList.add("note-date");
  dateElement.textContent = date;

  footer.appendChild(dateElement);

  note.appendChild(noteHeader);
  note.appendChild(contentArea);
  note.appendChild(footer);

  // Insere a nota no início do contêiner
  document.getElementById("notes-container").insertBefore(note, document.getElementById("notes-container").firstChild);
}

// Inicializa
loadNotes();
