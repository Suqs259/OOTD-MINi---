(() => {
  const { page, main, url, icon, init, save, editing } = window.ootdApp;
  init((settings) => {
    if (page === 'setup') renderSetup(editing ? settings : null);
    else renderProfile(settings);
  });

  function renderSetup(settings) {
    main.innerHTML = `
      <section class="panel profile-art relative mb-5 mt-2 overflow-hidden px-5 py-6">
        <div class="relative z-10 max-w-[225px]">
          <h2 class="text-[26px] leading-tight font-semibold">${editing ? '编辑个人资料' : '建立你的穿搭档案'}</h2>
          <p class="mt-2 text-sm leading-relaxed text-violet-100/80">天气按城市展示，穿搭会参考你的风格和日常需求。</p>
        </div>
        <div aria-hidden="true" class="profile-orbit absolute top-6 right-2 h-[88px] w-[125px] rounded-[50%]"></div>
        <div aria-hidden="true" class="profile-glow absolute top-8 right-8 grid size-[64px] rotate-[-12deg] place-items-center rounded-[20px]">${icon('shirt', 'size-8')}</div>
        ${icon('sparkle', 'absolute right-5 top-5 size-4 text-violet-200')}
      </section>
      <form id="profile-form" class="panel space-y-6 p-5">
        <div>
          <label for="city" class="mb-2 flex items-center gap-2 font-semibold">${icon('map-pin', 'size-[18px] text-violet-300')}城市</label>
          <input id="city" name="city" class="field h-12 w-full px-3.5" placeholder="例如：上海" maxlength="30" required>
        </div>
        <fieldset>
          <legend class="mb-2 flex items-center gap-2 font-semibold">${icon('user-round', 'size-[18px] text-violet-300')}性别</legend>
          <div class="grid grid-cols-2 gap-3">
            ${[['male', '男生'], ['female', '女生']].map(([value, label]) => `
              <label class="gender-option choice flex min-h-12 cursor-pointer items-center justify-center gap-2 focus-within:outline-2 focus-within:outline-violet-300">
                <input class="size-4 accent-violet-500" type="radio" name="gender" value="${value}" required> ${label}
              </label>`).join('')}
          </div>
        </fieldset>
        <div>
          <label for="description" class="mb-2 flex items-center gap-2 font-semibold">${icon('align-left', 'size-[18px] text-violet-300')}个人描述</label>
          <textarea id="description" name="description" class="field block min-h-[94px] w-full resize-y px-3.5 py-2.5" placeholder="例如：经常通勤，喜欢宽松款和平底鞋。" maxlength="120" aria-describedby="description-count" required></textarea>
          <p id="description-count" class="mt-1 text-right text-xs text-violet-200/75">0 / 120</p>
        </div>
        <button class="primary-button flex h-12 w-full items-center justify-center gap-2 font-semibold" type="submit">
          ${icon('check', 'size-[18px]')} ${editing ? '保存资料' : '完成设置'}
        </button>
        ${editing ? '<a href="' + url('profile.html') + '" class="block text-center text-sm text-violet-200">取消</a>' : ''}
      </form>`;
    const form = main.querySelector('form');
    const { city, gender, description } = form.elements;
    const count = main.querySelector('#description-count');
    const updateCount = () => { count.textContent = description.value.length + ' / 120'; };
    if (settings) {
      city.value = settings.city;
      gender.value = settings.gender;
      description.value = settings.description;
      updateCount();
    }
    description.addEventListener('input', updateCount);
    for (const field of [city, description]) {
      field.addEventListener('input', () => field.setCustomValidity(''));
    }
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      for (const [field, hint] of [[city, '请输入城市'], [description, '请输入个人描述']]) {
        field.setCustomValidity(field.value.trim() ? '' : hint);
        if (!field.reportValidity()) return;
      }
      save({ city: city.value.trim(), gender: gender.value, description: description.value.trim() });
      location.href = url('profile.html');
    });
  }

  function renderProfile(settings) {
    const detail = (key, symbol, label) => `
      <div class="flex items-start gap-3 py-[17px]">
        <span class="frame-icon">${icon(symbol)}</span>
        <div class="min-w-0"><dt class="mb-1 text-sm text-violet-200/80">${label}</dt><dd id="${key}" class="break-words whitespace-pre-wrap leading-relaxed"></dd></div>
      </div>`;
    main.innerHTML = `
      <section class="panel profile-art relative mb-5 mt-2 flex min-h-[184px] flex-col items-center justify-center overflow-hidden p-5">
        <div class="profile-orbit absolute top-8 h-[90px] w-[190px] rounded-[50%]" aria-hidden="true"></div>
        <div class="profile-glow relative grid size-[68px] place-items-center rounded-[22px]">${icon('user-round', 'size-8')}</div>
        <h2 class="relative mt-3 text-2xl font-semibold">我的穿搭档案</h2>
      </section>
      <section class="panel p-5">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-lg font-semibold">个人资料</h3>
          <a class="choice flex min-h-11 items-center gap-2 px-3 text-sm" href="${url('onboarding.html', { edit: '1' })}">${icon('pencil', 'size-4')} 编辑</a>
        </div>
        <dl class="mt-2 divide-y divide-violet-300/20">
          ${detail('profile-city', 'map-pin', '城市')}
          ${detail('profile-gender', 'user-round', '性别')}
          ${detail('profile-description', 'align-left', '个人描述')}
        </dl>
      </section>
      <a class="primary-button mt-5 flex h-12 items-center justify-center gap-2 font-semibold" href="${url('weather.html')}">${icon('shirt', 'size-[18px]')} 去选今日穿搭</a>`;
    main.querySelector('#profile-city').textContent = settings.city;
    main.querySelector('#profile-gender').textContent = settings.gender === 'male' ? '男生' : '女生';
    main.querySelector('#profile-description').textContent = settings.description;
  }
})();
