const PROFILE_KEY = 'ootd-mini-profile-v1';
let profile = null;
try {
  profile = JSON.parse(localStorage.getItem(PROFILE_KEY));
} catch {
  // Keep the gallery usable when browser storage is unavailable.
}

lucide.createIcons();
const frames = [...document.querySelectorAll('.device')];
const resize = new ResizeObserver((entries) => {
  for (const { target, contentRect } of entries) {
    target.style.setProperty('--scale', contentRect.width / 440);
  }
});
frames.forEach((frame) => resize.observe(frame));

window.addEventListener('message', ({ source, data }) => {
  const frame = frames.find((device) => device.firstElementChild.contentWindow === source);
  if (!frame || !data) return;
  if (data.type === 'ootd:read-profile') {
    source.postMessage({ type: 'ootd:profile', profile }, '*');
  }
  if (data.type === 'ootd:save-profile') {
    profile = data.profile;
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // In-memory state still persists between screens in this overview.
    }
    for (const device of frames) {
      device.firstElementChild.contentWindow.postMessage({ type: 'ootd:profile', profile }, '*');
    }
  }
});
