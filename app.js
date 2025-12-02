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

const PART_FILTER_DEFAULT = { "1": true, "2": true, "3": true };
let activePartsFilter = { ...PART_FILTER_DEFAULT };
let partCollapseState = { "1": false, "2": false, "3": false };
let gameDayMode = false;


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
    [/you/gi, "ye"],
    [/your/gi, "yer"],
    [/coach/gi, "capt'n"],
    [/coaches/gi, "capt'ns"],
    [/player/gi, "matey"],
    [/players/gi, "mateys"],
    [/friend/gi, "matey"],
    [/friends/gi, "mateys"],
    [/leg/gi, "sea leg"],
    [/legs/gi, "sea legs"],
    [/knee/gi, "knee o' the sea"],
    [/ball/gi, "cannonball"],
    [/run/gi, "sail"],
    [/running/gi, "sailing"],
    [/runs/gi, "voyages"],
    [/hips/gi, "hip bones"],
    [/hold/gi, "grip"],
    [/exercise/gi, "drill"],
    [/exercises/gi, "drills"]
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

const filterPart1Btn = document.getElementById("filterPart1Btn");
const filterPart2Btn = document.getElementById("filterPart2Btn");
const filterPart3Btn = document.getElementById("filterPart3Btn");
const gameDayToggleBtn = document.getElementById("gameDayToggleBtn");

const timerPopupEl = document.getElementById("timerPopup");
const timerPopupDismissBtn = document.getElementById("timerPopupDismissBtn");

const prevCard = document.getElementById("prevCard");
const nextCard = document.getElementById("nextCard");
const prevTitleEl = document.getElementById("prevTitle");
const nextTitleEl = document.getElementById("nextTitle");
const prevLabelEl = document.getElementById("prevLabel");
const nextLabelEl = document.getElementById("nextLabel");

// ------------------ Helpers ------------------
function getExercisePartNumber(ex) {
  if (!ex || !ex.part) return null;
  if (ex.part.startsWith("Part 1")) return "1";
  if (ex.part.startsWith("Part 2")) return "2";
  if (ex.part.startsWith("Part 3")) return "3";
  return null;
}

function getActiveExerciseAndLevel() {
  const ex = exercises[currentIndex];
  const level =
    ex.levels[Math.max(0, Math.min(currentLevelIndex, ex.levels.length - 1))];
  return { ex, level };
}

function getFilteredExerciseIndices() {
  const result = [];
  exercises.forEach((ex, idx) => {
    const partNum = getExercisePartNumber(ex);
    if (partNum && activePartsFilter[partNum]) {
      result.push(idx);
    }
  });
  return result;
}

function ensureCurrentIndexInActiveParts() {
  const filtered = getFilteredExerciseIndices();
  if (filtered.length === 0) return;
  if (!filtered.includes(currentIndex)) {
    currentIndex = filtered[0];
    currentLevelIndex = 0;
  }
}

function getPrevNextExerciseIndices() {
  const filtered = getFilteredExerciseIndices();
  const pos = filtered.indexOf(currentIndex);
  return {
    prevIndex: pos > 0 ? filtered[pos - 1] : null,
    nextIndex: pos >= 0 && pos < filtered.length - 1 ? filtered[pos + 1] : null,
  };
}

function updatePartFilterButtonStates() {
  if (filterPart1Btn) {
    filterPart1Btn.classList.toggle("active", !!activePartsFilter["1"]);
  }
  if (filterPart2Btn) {
    filterPart2Btn.classList.toggle("active", !!activePartsFilter["2"]);
  }
  if (filterPart3Btn) {
    filterPart3Btn.classList.toggle("active", !!activePartsFilter["3"]);
  }
  if (gameDayToggleBtn) {
    gameDayToggleBtn.classList.toggle("active", !!gameDayMode);
  }
}

function setGameDayMode(on) {
  gameDayMode = !!on;
  if (gameDayMode) {
    activePartsFilter = { "1": true, "2": false, "3": true };
  } else {
    activePartsFilter = { ...PART_FILTER_DEFAULT };
  }
  updatePartFilterButtonStates();
  ensureCurrentIndexInActiveParts();
  renderExerciseList(searchInput.value);
  renderCurrentExercise();
}

function togglePartFilter(partNum) {
  if (!["1", "2", "3"].includes(partNum)) return;
  // If game day mode is on, turning individual filters changes it back to manual mode
  if (gameDayMode) {
    gameDayMode = false;
  }
  const currentlyOn = !!activePartsFilter[partNum];
  const activeCount = Object.values(activePartsFilter).filter(Boolean).length;
  // Prevent turning off the last active part
  if (currentlyOn && activeCount === 1) {
    return;
  }
  activePartsFilter[partNum] = !currentlyOn;
  updatePartFilterButtonStates();
  ensureCurrentIndexInActiveParts();
  renderExerciseList(searchInput.value);
  renderCurrentExercise();
}

function showTimerCompletePopup() {
  if (!timerPopupEl) return;
  timerPopupEl.classList.add("visible");
}

function hideTimerCompletePopup() {
  if (!timerPopupEl) return;
  timerPopupEl.classList.remove("visible");
}

// ------------------ Rendering ------------------
function renderExerciseList(filter = "") {
  exerciseListEl.innerHTML = "";
  const query = filter.trim().toLowerCase();

  const partsMeta = [
    { num: "1", title: tt("Part 1 – Running exercises") },
    { num: "2", title: tt("Part 2 – Strength / Core stability") },
    { num: "3", title: tt("Part 3 – Running exercises") },
  ];

  partsMeta.forEach((meta) => {
    if (!activePartsFilter[meta.num]) {
      return;
    }

    const groupContainer = document.createElement("div");
    groupContainer.className = "part-group";

    const header = document.createElement("button");
    header.type = "button";
    header.className =
      "part-group-header" + (partCollapseState[meta.num] ? " collapsed" : "");
    const titleSpan = document.createElement("span");
    titleSpan.className = "part-group-title";
    titleSpan.textContent = meta.title;
    const toggleSpan = document.createElement("span");
    toggleSpan.className = "part-group-toggle";
    toggleSpan.textContent = "▾";

    header.appendChild(titleSpan);
    header.appendChild(toggleSpan);

    const listEl = document.createElement("div");
    listEl.className = "part-group-list";
    if (partCollapseState[meta.num]) {
      listEl.style.display = "none";
    }

    let hasAny = false;

    exercises.forEach((ex, index) => {
      const partNum = getExercisePartNumber(ex);
      if (partNum !== meta.num) return;

      if (
        query &&
        !ex.name.toLowerCase().includes(query) &&
        !ex.part.toLowerCase().includes(query)
      ) {
        return;
      }

      hasAny = true;

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

      listEl.appendChild(item);
    });

    if (!hasAny) {
      return;
    }

    header.addEventListener("click", () => {
      const isCollapsed = !partCollapseState[meta.num];
      partCollapseState[meta.num] = isCollapsed;
      if (isCollapsed) {
        header.classList.add("collapsed");
        listEl.style.display = "none";
      } else {
        header.classList.remove("collapsed");
        listEl.style.display = "";
      }
    });

    groupContainer.appendChild(header);
    groupContainer.appendChild(listEl);
    exerciseListEl.appendChild(groupContainer);
  });

  sidebarTitleEl.textContent = tt("FIFA 11+ List");

  updatePartFilterButtonStates();
}


function setCurrentIndex(index) {
  if (index < 0 || index >= exercises.length) return;

  // Stop and fully reset timer when switching exercises
  stopTimer(true);

  currentIndex = index;
  currentLevelIndex = 0;
  renderExerciseList(searchInput.value);
  renderCurrentExercise();
}

function renderCurrentExercise() {
  // Extra safety: ensure any stray timer is stopped whenever we re-render
  stopTimer(true);

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
        // Stop and reset timer when switching levels
        stopTimer(true);
        renderCurrentExercise();
      });

      levelsContainer.appendChild(card);
    });
  }

  // Sets & timer for active level
  initSetsForCurrentLevel();
  initTimerForCurrentLevel();

  // Navigation previews
  const { prevIndex, nextIndex } = getPrevNextExerciseIndices();
  const prevEx = prevIndex != null ? exercises[prevIndex] : null;
  const nextEx = nextIndex != null ? exercises[nextIndex] : null;

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
    stopTimer(true);
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
      stopTimer(false);
      showTimerCompletePopup();
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
function stopTimer(resetToDuration) {
  // Clear any running interval and mark as not running
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerRunning = false;
  hideTimerCompletePopup();

  if (resetToDuration) {
    const { level } = getActiveExerciseAndLevel();
    const duration = level && level.durationSeconds ? level.durationSeconds : 0;
    timerRemaining = duration;
    if (typeof updateTimerDisplay === "function") {
      updateTimerDisplay();
    }
    if (timerStartPauseBtn) {
      timerStartPauseBtn.textContent = tt("Start");
    }
  }
}
function resetTimer() {
  stopTimer(true);
}

// ------------------ Events ------------------
searchInput.addEventListener("input", () => {
  renderExerciseList(searchInput.value);
});

if (filterPart1Btn) {
  filterPart1Btn.addEventListener("click", () => togglePartFilter("1"));
}
if (filterPart2Btn) {
  filterPart2Btn.addEventListener("click", () => togglePartFilter("2"));
}
if (filterPart3Btn) {
  filterPart3Btn.addEventListener("click", () => togglePartFilter("3"));
}
if (gameDayToggleBtn) {
  gameDayToggleBtn.addEventListener("click", () => {
    setGameDayMode(!gameDayMode);
  });
}
if (timerPopupDismissBtn) {
  timerPopupDismissBtn.addEventListener("click", () => {
    hideTimerCompletePopup();
  });
}
if (timerPopupEl) {
  timerPopupEl.addEventListener("click", (e) => {
    if (e.target === timerPopupEl) {
      hideTimerCompletePopup();
    }
  });
}

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
  const { prevIndex } = getPrevNextExerciseIndices();
  if (prevIndex != null) {
    setCurrentIndex(prevIndex);
  }
});
nextCard.addEventListener("click", () => {
  const { nextIndex } = getPrevNextExerciseIndices();
  if (nextIndex != null) {
    setCurrentIndex(nextIndex);
  }
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
