(() => {
  const key = 'ootd-mini-profile-v1';
  const page = document.body.dataset.page;
  const main = document.querySelector('#main');
  const params = new URLSearchParams(location.search);
  const demo = params.get('demo') === '1';
  const editing = params.get('edit') === '1';
  const embedded = window.parent !== window;
  const demoProfile = { city: '上海', gender: 'female', description: '日常地铁通勤，喜欢宽松、低饱和的搭配，偏好舒适的平底鞋。' };
  let savedProfile = null;
  try {
    savedProfile = JSON.parse(localStorage.getItem(key));
  } catch {
    // The overview can still provide state when file storage is unavailable.
  }

  function icon(name, classes = 'size-5') {
    return '<i data-lucide="' + name + '" class="' + classes + '" aria-hidden="true"></i>';
  }

  function url(file, options = {}) {
    const query = new URLSearchParams();
    if (demo) query.set('demo', '1');
    for (const [name, value] of Object.entries(options)) query.set(name, value);
    return file + (query.size ? '?' + query.toString() : '');
  }

  function profile() {
    return savedProfile || (demo ? demoProfile : null);
  }

  function init(render) {
    let rendered = false;
    let retry;
    function load() {
      if (rendered) return;
      rendered = true;
      clearTimeout(retry);
      const settings = profile();
      if (page === 'profile' && !settings) {
        location.replace(url('onboarding.html'));
        return;
      }
      if (page === 'setup' && !editing && settings && !embedded) {
        location.replace(url('profile.html'));
        return;
      }
      drawChrome(settings);
      render(settings);
      lucide.createIcons();
    }
    if (embedded) {
      window.addEventListener('message', (event) => {
        if (event.source !== parent || event.data?.type !== 'ootd:profile') return;
        if (event.data.profile) savedProfile = event.data.profile;
        load();
      });
      retry = setTimeout(load, 180);
      parent.postMessage({ type: 'ootd:read-profile' }, '*');
    } else {
      load();
    }
  }

  function save(settings) {
    savedProfile = settings;
    try {
      localStorage.setItem(key, JSON.stringify(settings));
    } catch {
      // The overview keeps an in-memory copy for iframe navigation.
    }
    if (embedded) parent.postMessage({ type: 'ootd:save-profile', profile: settings }, '*');
  }

  function drawChrome(settings) {
    const weatherTab = page === 'weather' || page === 'result';
    const title = weatherTab ? 'OOTD' : '我的';
    const tab = (label, symbol, file, active) => `
      <a class="flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-xs ${active ? 'tab-active font-semibold' : 'text-violet-200/75'}"
         href="${url(file)}" ${active ? 'aria-current="page"' : ''}>
        <span class="tab-icon grid h-7 w-12 place-items-center rounded-full">${icon(symbol)}</span>${label}
      </a>`;
    document.querySelector('#app-header').innerHTML = `
      <div aria-hidden="true" class="relative flex h-[53px] items-center justify-between px-8 pt-1">
        <span class="text-[15px] font-semibold tracking-wide">9:41</span><span class="dynamic-island"></span>
        <span class="flex items-center gap-1.5">${icon('signal', 'size-4')}${icon('wifi', 'size-4')}${icon('battery-full', 'h-4 w-6')}</span>
      </div>
      <div class="flex h-[59px] items-center justify-between px-5">
        <div class="flex items-center gap-2.5"><span class="brand-icon">${icon(weatherTab ? 'shirt' : 'user-round')}</span><h1 class="text-[23px] font-bold tracking-tight">${title}</h1></div>
        <span aria-hidden="true" class="mini-capsule flex h-8 items-center gap-2.5 px-2.5">${icon('ellipsis', 'size-5')}<span class="h-4 w-px bg-white/25"></span>${icon('circle-dot', 'size-[17px]')}</span>
      </div>`;
    document.querySelector('#app-footer').innerHTML = `
      <nav class="tab-bar flex px-8 pt-1" aria-label="小程序导航">
        ${tab('OOTD', 'shirt', 'weather.html', weatherTab)}
        ${tab('我的', 'user-round', settings ? 'profile.html' : 'onboarding.html', !weatherTab)}
      </nav><div class="tab-bar !border-0"><div class="home-indicator" aria-hidden="true"></div></div>`;
  }

  window.ootdApp = { page, main, url, icon, init, save, editing };
})();
