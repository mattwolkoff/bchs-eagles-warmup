// app.js

// Use the data attached to window by exercises.js
const exercises = (window.FIFA11_EXERCISES || []).slice().sort(
  (a, b) => a.sequenceIndex - b.sequenceIndex
);

// ------------------ State ------------------
let currentIndex = 0;
let currentLevelIndex = 0;
let timerInterval = null;
let timerRemaining = 0;
let timerRunning = false;
let pirateMode = false;

const SETS_KEY = "fifa11_sets_progress_v2";
let setsState = {};

// ------------------ Storage ------------------
function loadSetsState() {
  try {
    const raw = localStorage.getItem(SETS_KEY);
    if (raw) setsState = JSON.parse(raw);
  } catch {
    setsState = {};
  }
}
function saveSetsState() {
  try {
    localStorage.setItem(SETS_KEY, JSON.stringify(setsState));
  } catch {}
}

// ------------------ Pirate text helpers ------------------
function pirateify(text) {
  if (!text) return text;
  let t = text;
  const replacements = [
    [/\byou\b/gi, "ye"],
    [/\byour\b/gi, "yer"],
    [/\bcoach\b/gi, "capt'n"],
    [/\bcoaches\b/gi, "capt'ns"],
    [/\bplayer\b/gi, "matey"],
    [/\bplayers\b/gi, "mateys"],
    [/\bfriend\b/gi, "matey"],
    [/\bfriends\b/gi, "mateys"],
    [/\bleg\b/gi, "sea leg"],
    [/\blegs\b/gi, "sea legs"],
    [/\bknee\b/gi, "knee o' the sea"],
    [/\bball\b/gi, "cannonball"],
    [/\brun\b/gi, "sail"],
    [/\brunning\b/gi, "sailing"],
    [/\bruns\b/gi, "voyages"],
    [/\bhips\b/gi, "hip bones"],
    [/\bhold\b/gi, "grip"],
    [/\bexercise\b/gi, "drill"],
    [/\bexercises\b/gi, "drills"]
  ];
  for (const [regex, repl] of replacements) {
    t = t.replace(regex, repl);
  }
  if (t.length > 40 && !t.startsWith("Arrr")) {
    t = "Arrr, " + t.charAt(0).toLowerCase() + t.slice(1);
  }
  return t;
}
function tt(text) {
  return pirateMode ? pirateify(text) : text;
}

// ------------------ DOM ------------------
const exerciseListEl = document.getElementById("exerciseList");
const searchInput = document.getElementById("searchInput");
const sidebar = document.getElementById("sidebar");
const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");
const pirateToggleBtn = document.getElementById("pirateToggleBtn");
const resetSessionBtn = document.getElementById("resetSessionBtn");

const sidebarTitleEl = document.getElementById("sidebarTitle");
const currentTitleEl = document.getElementById("currentTitle");
const currentPartEl = document.getElementById("currentPart");
const levelsHeadingEl = document.getElementById("levelsHeading");
const levelsSubtitleEl = document.getElementById("levelsSubtitle");
const setsHeadingEl = document.getElementById("setsHeading");
const timerHeadingEl = document.getElementById("timerHeading");

const levelsContainer = document.getElementById("levelsContainer");
const setsContainer = document.getElementById("setsContainer");
const timerDisplay = document.getElementById("timerDisplay");
const timerStartPauseBtn = document.getElementById("timerStartPauseBtn");
const timerResetBtn = document.getElementById("timerResetBtn");
const timerCard = document.getElementById("timerCard");
const setsCard = document.getElementById("setsCard");

const prevCard = document.getElementById("prevCard");
const nextCard = document.getElementById("nextCard");
const prevTitleEl = document.getElementById("prevTitle");
const nextTitleEl = document.getElementById("nextTitle");
const prevLabelEl = document.getElementById("prevLabel");
const nextLabelEl = document.getElementById("nextLabel");

// ------------------ Helpers ------------------
function getActiveExerciseAndLevel() {
  const ex = exercises[currentIndex];
  const level =
    ex.levels[Math.max(0, Math.min(currentLevelIndex, ex.levels.length - 1))];
  return { ex, level };
}

// ------------------ Rendering ------------------
function renderExerciseList(filter = "") {
  exerciseListEl.innerHTML = "";
  const query = filter.trim().toLowerCase();

  exercises.forEach((ex, index) => {
    if (
      query &&
      !ex.name.toLowerCase().includes(query) &&
      !ex.part.toLowerCase().includes(query)
    ) {
      return;
    }

    const item = document.createElement("div");
    item.className =
      "exercise-item" + (index === currentIndex ? " active" : "");

    const title = document.createElement("div");
    title.className = "exercise-title";
    title.textContent = tt(`${ex.id}. ${ex.name}`);

    const part = document.createElement("div");
    part.className = "exercise-part";
    part.textContent = tt(ex.part);

    item.appendChild(title);
    item.appendChild(part);

    item.addEventListener("click", () => {
      setCurrentIndex(index);
      if (window.innerWidth <= 800) {
        sidebar.classList.remove("open");
      }
    });

    exerciseListEl.appendChild(item);
  });

  sidebarTitleEl.textContent = tt("FIFA 11+ List");
}

function setCurrentIndex(index) {
  if (index < 0 || index >= exercises.length) return;
  currentIndex = index;
  currentLevelIndex = 0;
  renderExerciseList(searchInput.value);
  renderCurrentExercise();
}

function renderCurrentExercise() {
  const { ex, level } = getActiveExerciseAndLevel();

  currentTitleEl.textContent = tt(ex.name);
  currentPartEl.textContent = tt(ex.part);
  levelsHeadingEl.textContent = tt("Levels / Variations");
  levelsSubtitleEl.textContent = tt("Tap a level to focus its sets & timer");
  setsHeadingEl.textContent = tt("Sets");
  timerHeadingEl.textContent = tt("Timer");
  prevLabelEl.textContent = tt("Previous");
  nextLabelEl.textContent = tt("Next");
  resetSessionBtn.textContent = tt("Reset session");

  // Levels
  levelsContainer.innerHTML = "";
  if (!ex.levels || ex.levels.length === 0) {
    const p = document.createElement("p");
    p.textContent = tt("No specific levels defined for this exercise.");
    p.style.fontSize = "14px";
    p.style.color = "var(--text-muted)";
    levelsContainer.appendChild(p);
  } else {
    ex.levels.forEach((lvl, idx) => {
      const card = document.createElement("div");
      card.className =
        "level-card" + (idx === currentLevelIndex ? " active" : "");

      const name = document.createElement("div");
      name.className = "level-name";
      name.textContent = tt(lvl.label);

      const desc = document.createElement("div");
      desc.className = "level-desc";
      desc.textContent = tt(lvl.description);

      card.appendChild(name);
      card.appendChild(desc);

      if (lvl.reps) {
        const row = document.createElement("div");
        row.className = "level-meta-row";
        const label = document.createElement("span");
        label.className = "level-meta-label";
        label.textContent = tt("Reps / time");
        const chip = document.createElement("span");
        chip.className = "level-meta-chip";
        chip.textContent = tt(lvl.reps);
        row.appendChild(label);
        row.appendChild(chip);
        card.appendChild(row);
      }

      if (lvl.recommendation) {
        const row = document.createElement("div");
        row.className = "level-meta-row";
        const label = document.createElement("span");
        label.className = "level-meta-label";
        label.textContent = tt("Coach note");
        const note = document.createElement("span");
        note.className = "level-meta-note";
        note.textContent = tt(lvl.recommendation);
        row.appendChild(label);
        row.appendChild(note);
        card.appendChild(row);
      }

      card.addEventListener("click", () => {
        currentLevelIndex = idx;
        stopTimer();
        initTimerForCurrentLevel();
        initSetsForCurrentLevel();
        renderCurrentExercise();
      });

      levelsContainer.appendChild(card);
    });
  }

  // Sets & timer
  initSetsForCurrentLevel();
  initTimerForCurrentLevel();

  // Navigation previews
  const prevEx = currentIndex > 0 ? exercises[currentIndex - 1] : null;
  const nextEx =
    currentIndex < exercises.length - 1 ? exercises[currentIndex + 1] : null;

  if (prevEx) {
    prevCard.style.visibility = "visible";
    prevTitleEl.textContent = tt(prevEx.name);
  } else {
    prevCard.style.visibility = "hidden";
  }

  if (nextEx) {
    nextCard.style.visibility = "visible";
    nextTitleEl.textContent = tt(nextEx.name);
  } else {
    nextCard.style.visibility = "hidden";
  }
}

function initSetsForCurrentLevel() {
  const { ex, level } = getActiveExerciseAndLevel();
  const totalSets = level.sets || 0;
  setsContainer.innerHTML = "";

  if (totalSets > 0) {
    setsCard.style.display = "";
    const key = `${ex.id}_${currentLevelIndex}`;
    if (!setsState[key] || setsState[key].length !== totalSets) {
      setsState[key] = new Array(totalSets).fill(false);
    }
    setsState[key].forEach((checked, i) => {
      const row = document.createElement("label");
      row.className = "set-item";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!checked;
      cb.addEventListener("change", () => {
        setsState[key][i] = cb.checked;
        saveSetsState();
      });
      const span = document.createElement("span");
      span.textContent = tt(`Set ${i + 1}`);
      row.appendChild(cb);
      row.appendChild(span);
      setsContainer.appendChild(row);
    });
  } else {
    setsCard.style.display = "none";
  }
}

function initTimerForCurrentLevel() {
  const { level } = getActiveExerciseAndLevel();
  const duration = level.durationSeconds || 0;
  if (duration > 0) {
    timerCard.style.display = "";
    timerRemaining = duration;
    timerRunning = false;
    updateTimerDisplay();
    timerStartPauseBtn.textContent = tt("Start");
  } else {
    timerCard.style.display = "none";
    stopTimer();
  }
}

// ------------------ Timer ------------------
function updateTimerDisplay() {
  const m = String(Math.floor(timerRemaining / 60)).padStart(2, "0");
  const s = String(timerRemaining % 60).padStart(2, "0");
  timerDisplay.textContent = `${m}:${s}`;
}
function startTimer() {
  if (timerRunning || timerRemaining <= 0) return;
  timerRunning = true;
  timerStartPauseBtn.textContent = tt("Pause");
  timerInterval = setInterval(() => {
    if (timerRemaining <= 1) {
      timerRemaining = 0;
      updateTimerDisplay();
      stopTimer();
      return;
    }
    timerRemaining -= 1;
    updateTimerDisplay();
  }, 1000);
}
function pauseTimer() {
  timerRunning = false;
  timerStartPauseBtn.textContent = tt("Start");
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}
function stopTimer() {
  timerRunning = false;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}
function resetTimer() {
  const { level } = getActiveExerciseAndLevel();
  const duration = level.durationSeconds || 0;
  timerRemaining = duration;
  stopTimer();
  updateTimerDisplay();
  timerStartPauseBtn.textContent = tt("Start");
}

// ------------------ Events ------------------
searchInput.addEventListener("input", () => {
  renderExerciseList(searchInput.value);
});

timerStartPauseBtn.addEventListener("click", () => {
  const { level } = getActiveExerciseAndLevel();
  if (!level.durationSeconds || level.durationSeconds <= 0) return;
  if (timerRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
});

timerResetBtn.addEventListener("click", () => {
  const { level } = getActiveExerciseAndLevel();
  if (!level.durationSeconds || level.durationSeconds <= 0) return;
  resetTimer();
});

prevCard.addEventListener("click", () => {
  setCurrentIndex(currentIndex - 1);
});
nextCard.addEventListener("click", () => {
  setCurrentIndex(currentIndex + 1);
});

toggleSidebarBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

pirateToggleBtn.addEventListener("click", () => {
  pirateMode = !pirateMode;
  document.body.classList.toggle("pirate", pirateMode);
  pirateToggleBtn.textContent = pirateMode
    ? "☠ Pirate mode: ON"
    : "☠ Pirate mode";
  renderExerciseList(searchInput.value);
  renderCurrentExercise();
});

resetSessionBtn.addEventListener("click", () => {
  const msg = pirateMode
    ? "Arrr, clear all yer sets fer this voyage?"
    : "Reset all sets for this session?";
  if (!confirm(msg)) return;
  setsState = {};
  try {
    localStorage.removeItem(SETS_KEY);
  } catch {}
  renderCurrentExercise();
});

// ------------------ Init ------------------
loadSetsState();
renderExerciseList();
setCurrentIndex(0);
