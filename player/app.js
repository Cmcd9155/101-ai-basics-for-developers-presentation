const deckMatch = window.location.pathname.match(/\/presentations\/([^/]+)\/player\/?/);
const DECK_ID = deckMatch?.[1] || "101";
const ROOT_PREFIX = "../";
const MANIFEST_URL = `${ROOT_PREFIX}narration/manifest.json`;
const SCRIPT_URL = `${ROOT_PREFIX}narration/script.json`;
const FEEDBACK_URL = `/api/feedback?deck=${encodeURIComponent(DECK_ID)}`;
const FEEDBACK_STORAGE_KEY = `araDeckSlideFeedback:${DECK_ID}:v1`;
const PANEL_COLLAPSED_STORAGE_KEY = "araDeckPanelCollapsed:v1";
const LEGACY_CURRENT_SLIDE_STORAGE_KEY = `araDeckCurrentSlide:${DECK_ID}:v1`;
const CURRENT_SLIDE_STORAGE_KEY = `araDeckCurrentSlide:${DECK_ID}:v2`;
const PREVIEW_CACHE_TOKEN = String(Date.now());

const elements = {
  audio: document.querySelector("#audio"),
  autoadvance: document.querySelector("#autoadvance"),
  deckStatus: document.querySelector("#deck-status"),
  deckTitle: document.querySelector("#deck-title"),
  elapsed: document.querySelector("#elapsed"),
  image: document.querySelector("#slide-image"),
  feedback: document.querySelector("#slide-feedback"),
  feedbackStatus: document.querySelector("#feedback-status"),
  floatingPlay: document.querySelector("#floating-play"),
  floatingPlayIcon: document.querySelector("#floating-play-icon"),
  floatingNext: document.querySelector("#floating-next"),
  floatingPrevious: document.querySelector("#floating-previous"),
  next: document.querySelector("#next"),
  panel: document.querySelector("#control-panel"),
  panelShell: document.querySelector("#player-shell"),
  panelToggle: document.querySelector("#panel-toggle"),
  panelToggleIcon: document.querySelector("#panel-toggle-icon"),
  panelToggleLabel: document.querySelector("#panel-toggle-label"),
  play: document.querySelector("#play"),
  playLabel: document.querySelector("#play-label"),
  previous: document.querySelector("#previous"),
  remaining: document.querySelector("#remaining"),
  replay: document.querySelector("#replay"),
  seek: document.querySelector("#seek"),
  slideCaption: document.querySelector("#slide-caption"),
  slideCount: document.querySelector("#slide-count"),
  slideTitle: document.querySelector("#slide-title"),
  slideTranscript: document.querySelector("#slide-transcript"),
};

let manifest = null;
let currentIndex = 0;
let feedback = {};
let feedbackSaveTimer = null;
let panelCollapsed = false;
let seeking = false;
let syncingLocation = false;

function formatSeconds(value) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const total = Math.round(value);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function stripSpeechTags(text) {
  return text
    .replace(/\[(?:pause|long-pause|hum-tune|laugh|chuckle|giggle|cry|tsk|tongue-click|lip-smack|breath|inhale|exhale|sigh)\]/gi, " ")
    .replace(/<\/?(?:soft|whisper|loud|build-intensity|decrease-intensity|higher-pitch|lower-pitch|slow|fast|sing-song|singing|laugh-speak|emphasis)>/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function rootPath(path) {
  return `${ROOT_PREFIX}${path}`;
}

function cacheBustedRootPath(path) {
  const separator = path.includes("?") ? "&" : "?";
  return `${rootPath(path)}${separator}v=${encodeURIComponent(PREVIEW_CACHE_TOKEN)}`;
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

async function loadManifest() {
  try {
    return await fetchJson(MANIFEST_URL);
  } catch {
    const script = await fetchJson(SCRIPT_URL);
    return {
      version: script.version,
      title: script.title,
      generatedAt: null,
      voice: script.voice,
      timing: {
        ...script.timing,
        actualTotalSeconds: 0,
      },
      slides: script.slides.map((slide) => ({
        slideId: slide.slideId,
        slideNumber: slide.slideNumber,
        title: slide.title,
        targetSeconds: slide.targetSeconds,
        actualDurationSeconds: null,
        imagePath: `previews/${slide.slideId}.png`,
        audioPath: `narration/audio/${slide.slideId}.mp3`,
        captionText: slide.captionText,
        ttsText: slide.ttsText,
      })),
      missingAudio: true,
    };
  }
}

function readLocalFeedback() {
  try {
    const stored = JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || "{}");
    return stored && typeof stored === "object" ? stored : {};
  } catch {
    return {};
  }
}

function writeLocalFeedback() {
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedback));
}

async function loadFeedback() {
  feedback = readLocalFeedback();
  try {
    const remoteFeedback = await fetchJson(FEEDBACK_URL);
    feedback = {
      ...feedback,
      ...(remoteFeedback.slides || {}),
    };
    writeLocalFeedback();
    elements.feedbackStatus.textContent = "Saved";
  } catch {
    elements.feedbackStatus.textContent = "Local only";
  }
}

function setFeedbackStatus(message) {
  elements.feedbackStatus.textContent = message;
}

function updateFeedbackField(slide) {
  elements.feedback.value = feedback[slide.slideId] || "";
}

function readPanelCollapsed() {
  return localStorage.getItem(PANEL_COLLAPSED_STORAGE_KEY) === "true";
}

function slideIndexFromValue(value, slideCount) {
  const match = String(value || "").trim().match(/^(?:#?slide-?)?0?(\d{1,2})$/i);
  if (!match) return null;
  const slideNumber = Number.parseInt(match[1], 10);
  if (!Number.isInteger(slideNumber)) return null;
  return Math.max(0, Math.min(slideNumber - 1, slideCount - 1));
}

function readCurrentSlideIndex(slideCount) {
  localStorage.removeItem(LEGACY_CURRENT_SLIDE_STORAGE_KEY);

  const hashIndex = slideIndexFromValue(window.location.hash, slideCount);
  if (hashIndex !== null) return hashIndex;

  const requestedSlide = new URLSearchParams(window.location.search).get("slide");
  const queryIndex = slideIndexFromValue(requestedSlide, slideCount);
  if (queryIndex !== null) {
    return queryIndex;
  }

  const stored = Number.parseInt(localStorage.getItem(CURRENT_SLIDE_STORAGE_KEY) || "0", 10);
  if (!Number.isInteger(stored)) return 0;
  return Math.max(0, Math.min(stored, slideCount - 1));
}

function writeCurrentSlideIndex(index, slide) {
  localStorage.setItem(CURRENT_SLIDE_STORAGE_KEY, String(index));
  if (!slide) return;
  const nextHash = `#${slide.slideId}`;
  if (window.location.hash === nextHash) return;
  syncingLocation = true;
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
  syncingLocation = false;
}

function setPanelCollapsed(collapsed) {
  panelCollapsed = collapsed;
  elements.panelShell.classList.toggle("panel-collapsed", panelCollapsed);
  elements.panelToggle.setAttribute("aria-expanded", String(!panelCollapsed));
  elements.panelToggle.title = panelCollapsed ? "Show panel" : "Hide panel";
  elements.panelToggleIcon.textContent = panelCollapsed ? "‹" : "›";
  elements.panelToggleLabel.textContent = panelCollapsed ? "Show panel" : "Hide panel";
  localStorage.setItem(PANEL_COLLAPSED_STORAGE_KEY, String(panelCollapsed));
}

async function saveFeedbackNow() {
  writeLocalFeedback();
  setFeedbackStatus("Saving...");
  try {
    const saved = await postJson(FEEDBACK_URL, { slides: feedback });
    feedback = saved.slides || feedback;
    writeLocalFeedback();
    if (saved.githubPush?.status === "pushed") {
      setFeedbackStatus("Pushed to GitHub");
    } else if (saved.githubPush?.status === "failed") {
      setFeedbackStatus("Saved, push failed");
    } else {
      setFeedbackStatus("Saved");
    }
  } catch {
    setFeedbackStatus("Saved locally");
  }
}

function scheduleFeedbackSave() {
  if (feedbackSaveTimer) {
    window.clearTimeout(feedbackSaveTimer);
  }
  setFeedbackStatus("Unsaved");
  feedbackSaveTimer = window.setTimeout(() => {
    feedbackSaveTimer = null;
    void saveFeedbackNow();
  }, 450);
}

function currentSlide() {
  return manifest.slides[currentIndex];
}

function setStatus(message) {
  elements.deckStatus.textContent = message;
}

function updateButtons() {
  const canPlay = Boolean(manifest?.slides?.length);
  elements.previous.disabled = !canPlay || currentIndex === 0;
  elements.floatingPrevious.disabled = !canPlay || currentIndex === 0;
  elements.next.disabled = !canPlay || currentIndex === manifest.slides.length - 1;
  elements.floatingNext.disabled = !canPlay || currentIndex === manifest.slides.length - 1;
  elements.replay.disabled = !canPlay;
  elements.play.disabled = !canPlay;
  elements.floatingPlay.disabled = !canPlay;
  const isPaused = elements.audio.paused;
  const playLabel = isPaused ? "Play" : "Pause";
  elements.playLabel.textContent = playLabel;
  elements.play.setAttribute("aria-label", `${playLabel} presentation`);
  elements.play.title = `${playLabel} presentation`;
  elements.floatingPlay.setAttribute("aria-label", `${playLabel} presentation`);
  elements.floatingPlay.title = `${playLabel} presentation`;
  elements.floatingPlayIcon.textContent = isPaused ? "▶" : "❚❚";
}

function updateTime() {
  const duration = Number.isFinite(elements.audio.duration) ? elements.audio.duration : 0;
  const current = Number.isFinite(elements.audio.currentTime) ? elements.audio.currentTime : 0;
  elements.elapsed.textContent = formatSeconds(current);
  elements.remaining.textContent = `-${formatSeconds(Math.max(duration - current, 0))}`;
  if (!seeking) {
    elements.seek.value = duration > 0 ? String(Math.round((current / duration) * 1000)) : "0";
  }
}

function seekToSliderValue({ keepSeeking = false } = {}) {
  const duration = Number.isFinite(elements.audio.duration) ? elements.audio.duration : 0;
  if (duration <= 0) {
    elements.seek.value = "0";
    updateTime();
    seeking = keepSeeking;
    return;
  }

  const ratio = Math.max(0, Math.min(Number(elements.seek.value) / 1000, 1));
  const nextTime = ratio * duration;
  elements.audio.currentTime = nextTime;
  elements.elapsed.textContent = formatSeconds(nextTime);
  elements.remaining.textContent = `-${formatSeconds(Math.max(duration - nextTime, 0))}`;
  seeking = keepSeeking;
}

function finishSeeking() {
  if (!seeking) return;
  seeking = false;
  updateTime();
}

function loadSlide(index, { autoplay = false, restart = true } = {}) {
  currentIndex = Math.max(0, Math.min(index, manifest.slides.length - 1));
  const slide = currentSlide();
  writeCurrentSlideIndex(currentIndex, slide);

  elements.image.src = cacheBustedRootPath(slide.imagePath);
  elements.image.alt = `Slide ${slide.slideNumber}: ${slide.title}`;
  elements.slideCount.textContent = `Slide ${slide.slideNumber} of ${manifest.slides.length}`;
  elements.slideTitle.textContent = slide.title;
  elements.slideCaption.textContent = slide.captionText;
  elements.slideTranscript.textContent = stripSpeechTags(slide.ttsText);
  updateFeedbackField(slide);
  elements.audio.src = rootPath(slide.audioPath);
  if (restart) elements.audio.currentTime = 0;
  elements.seek.value = "0";
  updateTime();
  updateButtons();

  if (manifest.missingAudio) {
    setStatus("Narration script loaded. Generate audio before full playback.");
  } else {
    const total = manifest.timing?.actualTotalSeconds ? `Total audio ${formatSeconds(manifest.timing.actualTotalSeconds)}.` : "";
    setStatus(`${manifest.voice?.voiceId?.toUpperCase() ?? "Ara"} voice ready. ${total}`.trim());
  }

  if (autoplay) {
    void play();
  }
}

async function play() {
  try {
    await elements.audio.play();
    updateButtons();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Audio playback failed.");
  }
}

function pause() {
  elements.audio.pause();
  updateButtons();
}

function togglePlay() {
  if (elements.audio.paused) {
    void play();
  } else {
    pause();
  }
}

function go(delta, options = {}) {
  loadSlide(currentIndex + delta, options);
}

function replay() {
  elements.audio.currentTime = 0;
  void play();
}

elements.play.addEventListener("click", togglePlay);
elements.previous.addEventListener("click", () => go(-1, { autoplay: !elements.audio.paused }));
elements.floatingPrevious.addEventListener("click", () => go(-1, { autoplay: !elements.audio.paused }));
elements.next.addEventListener("click", () => go(1, { autoplay: !elements.audio.paused }));
elements.floatingNext.addEventListener("click", () => go(1, { autoplay: !elements.audio.paused }));
elements.floatingPlay.addEventListener("click", togglePlay);
elements.replay.addEventListener("click", replay);
elements.panelToggle.addEventListener("click", () => {
  setPanelCollapsed(!panelCollapsed);
});
elements.feedback.addEventListener("input", () => {
  const slide = currentSlide();
  const comment = elements.feedback.value;
  if (comment.trim()) {
    feedback[slide.slideId] = comment;
  } else {
    delete feedback[slide.slideId];
  }
  scheduleFeedbackSave();
});

elements.seek.addEventListener("pointerdown", () => {
  seeking = true;
});

elements.seek.addEventListener("input", () => {
  seekToSliderValue({ keepSeeking: true });
});

elements.seek.addEventListener("change", () => {
  seekToSliderValue();
  updateTime();
});

elements.seek.addEventListener("pointerup", finishSeeking);
elements.seek.addEventListener("keyup", finishSeeking);
elements.seek.addEventListener("blur", finishSeeking);

elements.audio.addEventListener("loadedmetadata", updateTime);
elements.audio.addEventListener("timeupdate", updateTime);
elements.audio.addEventListener("play", updateButtons);
elements.audio.addEventListener("pause", updateButtons);
elements.audio.addEventListener("error", () => {
  setStatus("Audio file is not available yet. Run npm run narration:generate when ready.");
  updateButtons();
});
elements.audio.addEventListener("ended", () => {
  updateButtons();
  if (elements.autoadvance.checked && currentIndex < manifest.slides.length - 1) {
    loadSlide(currentIndex + 1, { autoplay: true });
  }
});

window.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
  if (event.code === "Space") {
    event.preventDefault();
    togglePlay();
  } else if (event.key === "ArrowRight") {
    go(1, { autoplay: !elements.audio.paused });
  } else if (event.key === "ArrowLeft") {
    go(-1, { autoplay: !elements.audio.paused });
  }
});

window.addEventListener("hashchange", () => {
  if (syncingLocation || !manifest?.slides?.length) return;
  const hashIndex = slideIndexFromValue(window.location.hash, manifest.slides.length);
  if (hashIndex === null || hashIndex === currentIndex) return;
  loadSlide(hashIndex, { autoplay: !elements.audio.paused });
});

async function init() {
  try {
    manifest = await loadManifest();
    await loadFeedback();
    elements.deckTitle.textContent = manifest.title;
    setPanelCollapsed(readPanelCollapsed());
    loadSlide(readCurrentSlideIndex(manifest.slides.length));
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Could not load narration.");
    updateButtons();
  }
}

void init();
