const noteBox = document.getElementById("note");
const notePreview = document.getElementById("notePreview");
const counter = document.getElementById("counter");
const selector = document.getElementById("noteSelector");
const newNoteBtn = document.getElementById("newNote");
const deleteBtn = document.getElementById("deleteBtn");
const confirmBox = document.getElementById("confirmBox");
const confirmDelete = document.getElementById("confirmDelete");
const cancelDelete = document.getElementById("cancelDelete");
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettings = document.getElementById("closeSettings");
const stickyNote = document.querySelector(".sticky");
const confirmDeleteToggle = document.getElementById("confirmDeleteToggle");
const richTextToggle = document.getElementById("richTextToggle");
const themeSelect = document.getElementById("themeSelect");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const importStatus = document.getElementById("importStatus");

let notes = {};
let currentNote = "Note 1";
let settings = {
  confirmDelete: true,
  richText: true,
  theme: "classic"
};

/* ---------- Helpers ---------- */

function updateFontSize() {
  const len = noteBox.value.length;

  let size = 16;
  if (len > 400) size = 14;
  if (len > 800) size = 12;
  if (len > 1400) size = 10;

  noteBox.style.fontSize = size + "px";
  notePreview.style.fontSize = size + "px";
}

function updateCounter() {
  counter.textContent = `${noteBox.value.length} / 2048`;
}

function saveNotes() {
  chrome.storage.local.set({ notes, currentNote });
}

function saveSettings() {
  chrome.storage.local.set({ settings });
}

function refreshSelector() {
  selector.innerHTML = "";
  Object.keys(notes).forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    selector.appendChild(option);
  });
  selector.value = currentNote;
}

/* ---------- Rich text (safe <b>/<i> only) ---------- */

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderRichText(raw) {
  let safe = escapeHtml(raw);
  // Only these two whitelisted tag pairs get turned back into real markup.
  safe = safe.replace(/&lt;b&gt;([\s\S]*?)&lt;\/b&gt;/g, "<b>$1</b>");
  safe = safe.replace(/&lt;i&gt;([\s\S]*?)&lt;\/i&gt;/g, "<i>$1</i>");
  return safe.replace(/\n/g, "<br>");
}

function showEditMode() {
  notePreview.hidden = true;
  noteBox.hidden = false;
}

function showPreviewMode() {
  if (!settings.richText) return;
  if (noteBox.value.trim() === "") return;

  notePreview.innerHTML = renderRichText(noteBox.value);
  noteBox.hidden = true;
  notePreview.hidden = false;
}

function refreshNoteView() {
  // Always reset to a known state first so stale preview/edit
  // state from a previous note can't stick around.
  showEditMode();
  showPreviewMode();
}

/* ---------- Settings ---------- */

function applyTheme(theme) {
  document.body.dataset.theme = theme;
}

function applySettingsToUI() {
  confirmDeleteToggle.checked = settings.confirmDelete;
  richTextToggle.checked = settings.richText;
  themeSelect.value = settings.theme;
  applyTheme(settings.theme);
}

function showImportStatus(message) {
  importStatus.textContent = message;
  importStatus.hidden = false;
  setTimeout(() => {
    importStatus.hidden = true;
  }, 3000);
}

function normalizeSettings(raw) {
  const merged = Object.assign(
    { confirmDelete: true, richText: true, theme: "classic" },
    raw || {}
  );
  // Migrate the old "neo" theme value (now renamed "Modern")
  if (merged.theme === "neo") {
    merged.theme = "modern";
  }
  return merged;
}

/* ---------- Load ---------- */

chrome.storage.local.get(["notes", "currentNote", "settings"], (data) => {
  notes = data.notes || { "Note 1": "" };

  // Guarantee Note 1 always exists
  if (!notes["Note 1"]) {
    notes["Note 1"] = "";
  }

  currentNote = data.currentNote || "Note 1";
  settings = normalizeSettings(data.settings);

  refreshSelector();
  noteBox.value = notes[currentNote];
  applySettingsToUI();

  updateCounter();
  updateFontSize();
  refreshNoteView();
});

/* ---------- Events ---------- */

noteBox.addEventListener("input", () => {
  notes[currentNote] = noteBox.value;
  updateCounter();
  updateFontSize();
  saveNotes();
});

noteBox.addEventListener("blur", () => {
  showPreviewMode();
});

notePreview.addEventListener("click", () => {
  showEditMode();
  noteBox.focus();
});

selector.addEventListener("change", () => {
  currentNote = selector.value;
  noteBox.value = notes[currentNote];
  showEditMode();
  updateCounter();
  updateFontSize();
  saveNotes();
});

newNoteBtn.addEventListener("click", () => {
  let i = 1;
  let name;

  do {
    i++;
    name = `Note ${i}`;
  } while (notes[name]);

  notes[name] = "";
  currentNote = name;

  refreshSelector();
  noteBox.value = "";
  showEditMode();
  updateCounter();
  updateFontSize();
  saveNotes();
});

/* ---------- Delete Logic ---------- */

deleteBtn.addEventListener("click", () => {
  if (settings.confirmDelete) {
    confirmBox.hidden = false;
  } else {
    performDelete();
  }
});

cancelDelete.addEventListener("click", () => {
  confirmBox.hidden = true;
});

function performDelete() {
  if (currentNote === "Note 1") {
    // Clear contents only
    notes["Note 1"] = "";
    noteBox.value = "";
  } else {
    // Fully delete other notes
    delete notes[currentNote];
    currentNote = "Note 1";
  }

  refreshSelector();
  noteBox.value = notes[currentNote] || "";
  showEditMode();

  updateCounter();
  updateFontSize();
  saveNotes();

  confirmBox.hidden = true;
}

confirmDelete.addEventListener("click", performDelete);

/* ---------- Settings Panel ---------- */

function openSettingsPanel() {
  stickyNote.hidden = true;
  settingsPanel.hidden = false;
}

function closeSettingsPanel() {
  settingsPanel.hidden = true;
  stickyNote.hidden = false;
  refreshNoteView();
}

settingsBtn.addEventListener("click", () => {
  if (settingsPanel.hidden) {
    openSettingsPanel();
  } else {
    closeSettingsPanel();
  }
});

closeSettings.addEventListener("click", closeSettingsPanel);

confirmDeleteToggle.addEventListener("change", () => {
  settings.confirmDelete = confirmDeleteToggle.checked;
  saveSettings();
});

richTextToggle.addEventListener("change", () => {
  settings.richText = richTextToggle.checked;
  saveSettings();
  refreshNoteView();
});

themeSelect.addEventListener("change", () => {
  settings.theme = themeSelect.value;
  applyTheme(settings.theme);
  saveSettings();
});

/* ---------- Export / Import ---------- */

exportBtn.addEventListener("click", () => {
  const payload = { notes, currentNote, settings };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "sticky-notes-backup.json";
  a.click();

  URL.revokeObjectURL(url);
});

importBtn.addEventListener("click", () => {
  importFile.click();
});

importFile.addEventListener("change", () => {
  const file = importFile.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);

      if (!data.notes || typeof data.notes !== "object") {
        throw new Error("Missing notes in file");
      }

      notes = data.notes;
      if (!notes["Note 1"]) {
        notes["Note 1"] = "";
      }

      currentNote = (data.currentNote && notes[data.currentNote] !== undefined)
        ? data.currentNote
        : "Note 1";

      if (data.settings && typeof data.settings === "object") {
        settings = normalizeSettings(data.settings);
        applySettingsToUI();
      }

      refreshSelector();
      noteBox.value = notes[currentNote];
      updateCounter();
      updateFontSize();
      refreshNoteView();
      saveNotes();
      saveSettings();

      showImportStatus("Notes imported successfully.");
    } catch (err) {
      showImportStatus("Couldn't read that file — is it a valid backup?");
    }
  };

  reader.readAsText(file);
  importFile.value = "";
});
