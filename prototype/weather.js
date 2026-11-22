(() => {
  const { page, main, url, icon, init } = window.ootdApp;
  const styles = {
    male: ['运动休闲风', '商务精英风', '日系潮流风', '韩系简约风', '学院风', '街头嘻哈风', '户外机能风', '复古文艺风', '极简主义风', '工装风'],
    female: ['甜酷风', '温柔风', '学院风', '韩系简约风', '设计师品牌风', '复古文艺风', '小香风', '森女系', '运动休闲风', 'Y2K风'],
  };
  const looks = {
    运动休闲风: ['拉链卫衣、直筒运动裤', '跑鞋', ['sport', 'street', 'casual'], ['lounge', 'trendy', 'soft']],
    商务精英风: ['衬衫、垂感西裤', '德比鞋', ['formal', 'casual', 'street']],
    日系潮流风: ['宽松条纹衬衫、锥形裤', '帆布鞋', ['casual', 'sport', 'street']],
    韩系简约风: ['奶油色针织衫、直筒长裤', '简洁平底鞋', ['casual', 'formal', 'street'], ['minimal', 'soft', 'lounge']],
    学院风: ['牛津纺衬衫、针织背心', '乐福鞋', ['casual', 'formal', 'sport'], ['soft', 'minimal', 'lounge']],
    街头嘻哈风: ['廓形连帽衫、宽腿牛仔裤', '复古板鞋', ['street', 'sport', 'casual']],
    户外机能风: ['速干长袖、尼龙多口袋裤', '抓地力好的徒步鞋', ['sport', 'street', 'casual']],
    复古文艺风: ['细条纹针织衫、高腰直筒裤', '复古皮鞋', ['casual', 'formal', 'sport'], ['minimal', 'soft', 'trendy']],
    极简主义风: ['同色系圆领针织、无褶长裤', '素色皮鞋', ['formal', 'casual', 'street']],
    工装风: ['工装衬衫、水洗直筒裤', '系带短靴', ['sport', 'casual', 'street']],
    甜酷风: ['短款针织、深色直筒裙', '系带短靴', null, ['soft', 'trendy', 'minimal']],
    温柔风: ['浅色针织开衫、垂感半裙', '玛丽珍鞋', null, ['minimal', 'soft', 'lounge']],
    设计师品牌风: ['不对称剪裁上衣、垂感阔腿裤', '线条简洁的低跟鞋', null, ['minimal', 'trendy', 'soft']],
    小香风: ['短款粗花呢外套、直筒裙', '双色平底鞋', null, ['soft', 'minimal', 'trendy']],
    森女系: ['亚麻衬衫、棉质长裙', '软底皮鞋', null, ['minimal', 'soft', 'lounge']],
    Y2K风: ['短款叠搭上衣、低腰廓形牛仔裤', '厚底运动鞋', null, ['trendy', 'soft', 'lounge']],
  };
  const photos = {
    sport: '牛仔外套与休闲叠穿',
    street: '蓝色高领街头搭配',
    formal: '深色正装搭配',
    casual: '日常简约搭配',
    minimal: '中性色西装与阔腿裤',
    soft: '浅粉外套与深色短裙',
    lounge: '浅灰连帽休闲套装',
    trendy: '彩色街头叠搭',
  };
  const conditions = { partly: '晴间多云', sun: '晴', cloud: '多云', rain: '小雨' };
  const cityWeather = {
    上海: [23, 25, 18, 'partly', 64, 9, 20],
    北京: [14, 16, 7, 'sun', 38, 16, 10],
    广州: [28, 30, 23, 'rain', 82, 11, 85],
    深圳: [27, 29, 23, 'rain', 78, 13, 80],
    成都: [19, 21, 15, 'cloud', 75, 7, 35],
    杭州: [21, 23, 16, 'partly', 67, 8, 25],
    哈尔滨: [0, 3, -5, 'cloud', 52, 13, 10],
  };

  function forecast(city) {
    const name = city?.replace(/市$/, '');
    const sampleCity = Object.hasOwn(cityWeather, name) ? name : '上海';
    const [now, high, low, condition, humidity, wind, rain] = cityWeather[sampleCity];
    const days = [
      [condition, high, low], ['sun', high + 2, low + 1], ['partly', high + 1, low],
      ['rain', high - 2, low - 1], ['rain', high - 4, low - 2], ['cloud', high - 3, low - 2], ['sun', high - 1, low - 1],
    ];
    return { now, high, low, condition, humidity, wind, rain, days, sampleCity };
  }

  init((settings) => {
    const weather = forecast(settings?.city);
    if (page === 'result' && settings) {
      const resultStyle = styles[settings.gender][3];
      renderWeather(settings, weather, resultStyle);
      openResult(settings, weather, resultStyle, main.querySelector('#generate'));
      return;
    }
    renderWeather(settings, weather);
  });

  function renderWeather(settings, weather, initialStyle = '') {
    const metric = (symbol, label, value) => `
      <div class="flex min-w-0 flex-col gap-1 px-3 first:pl-0">
        <div class="flex items-center gap-1.5 text-xs text-violet-100/85">${icon(symbol, 'size-[15px]')}${label}</div>
        <strong class="text-[15px] font-semibold">${value}</strong>
      </div>`;
    main.innerHTML = `
      <section class="panel weather-hero mb-3 mt-1 px-5 pt-4 pb-4" aria-labelledby="today">
        <div class="relative z-10 flex items-center justify-between gap-2">
          <h2 id="today" class="font-semibold">今日天气</h2>
          <span class="rounded-full border border-white/20 px-2 py-0.5 text-xs text-violet-100/90">演示数据</span>
        </div>
        <img class="hero-art" src="assets/${weather.condition}.png" alt="">
        <div class="relative z-10 mt-2 w-fit max-w-[58%]">
          <div class="flex items-center gap-1 text-sm text-violet-100">${icon('map-pin', 'size-4 shrink-0')}<span id="weather-city" class="truncate"></span></div>
          <p class="my-1 text-[64px] leading-none font-light tracking-[-.08em] tabular-nums">${weather.now}<span class="ml-1 text-[42px] align-top">°</span></p>
          <p class="text-[15px] font-semibold">${conditions[weather.condition]}</p>
          <div class="mt-1.5 flex items-center gap-2 text-xs text-violet-100">
            <span>最低 ${weather.low}°</span><span class="temp-meter w-9" aria-hidden="true"></span><span>最高 ${weather.high}°</span>
          </div>
        </div>
        <div class="relative z-10 mt-3.5 grid grid-cols-3 divide-x divide-white/20 border-t border-white/20 pt-3">
          ${metric('droplets', '湿度', weather.humidity + '%')}
          ${metric('wind', '风速', weather.wind + ' km/h')}
          ${metric('umbrella', '降水概率', weather.rain + '%')}
        </div>
      </section>
      <section class="panel mb-3 px-4 py-3.5" aria-labelledby="forecast-title">
        <div class="mb-2.5 flex items-center justify-between">
          <h2 id="forecast-title" class="flex items-center gap-2 font-semibold">${icon('calendar-days', 'size-[18px] text-violet-300')}近 7 日天气</h2>
          <span class="text-xs text-violet-100/75">°C</span>
        </div>
        <ul class="grid grid-cols-7 gap-1">
          ${weather.days.map(([condition, high, low], index) => `
            <li class="forecast-day flex min-w-0 flex-col items-center py-1.5">
              <span class="text-xs text-violet-100">${dayName(index)}</span>
              <img class="size-7 object-contain" src="assets/${condition}.png" alt="${conditions[condition]}">
              <span class="text-[13px] font-semibold">${high}°</span>
              <span class="text-xs text-violet-100/75">${low}°</span>
            </li>`).join('')}
        </ul>
      </section>
      <section class="panel px-4 py-3.5" aria-labelledby="style-title">
        <h2 id="style-title" class="flex items-center gap-2 font-semibold">${icon('shirt', 'size-[18px] text-violet-300')}今日穿搭风格</h2>
        ${settings ? `
          <p class="mt-1 text-xs text-violet-100/75">选一个风格，根据今天的天气搭配。</p>
          <div id="style-options" class="my-2.5 grid grid-cols-3 gap-1.5" role="group" aria-label="选择穿搭风格">
            ${styles[settings.gender].map((style) => `<button type="button" class="choice min-h-9 px-1 text-[13px]" aria-pressed="${style === initialStyle}">${style}</button>`).join('')}
          </div>
          <button id="generate" type="button" class="primary-button flex h-11 w-full items-center justify-center gap-2 font-semibold" ${initialStyle ? '' : 'disabled'}>
            ${icon('sparkles', 'size-[18px]')} 生成今日OOTD
          </button>` : `
          <p class="mt-2 text-sm text-violet-100/85">先设置城市、性别和个人描述，即可选择穿搭风格。</p>
          <a href="${url('onboarding.html')}" class="primary-button mt-3 flex h-11 items-center justify-center gap-2 font-semibold">${icon('user-round', 'size-[18px]')} 设置穿搭档案</a>`}
      </section>`;
    main.querySelector('#weather-city').textContent = weather.sampleCity === settings?.city?.replace(/市$/, '')
      ? settings.city
      : weather.sampleCity + ' · 示例城市';
    if (!settings) return;
    const options = [...main.querySelectorAll('#style-options button')];
    const generate = main.querySelector('#generate');
    let selected = initialStyle;
    options.forEach((option) => option.addEventListener('click', () => {
      selected = option.textContent;
      options.forEach((item) => item.setAttribute('aria-pressed', String(item === option)));
      generate.disabled = false;
    }));
    generate.addEventListener('click', () => openResult(settings, weather, selected, generate));
  }

  function dayName(offset) {
    if (!offset) return '今天';
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return new Intl.DateTimeFormat('zh-CN', { weekday: 'short' }).format(date);
  }

  function outfitAdvice(settings, weather, style) {
    const [pieces, shoes, malePhotos, femalePhotos] = looks[style];
    let layers = '备一件轻外套，早晚可叠穿。';
    if (weather.low <= 10) layers = '加保暖内层和防风外套，早晚可配围巾。';
    if (weather.low >= 22) layers = '选透气的棉或亚麻面料，室内空调较冷时可加薄外套。';
    let note = weather.rain >= 60 ? '记得带伞，并换成耐水、防滑的鞋。' : '';
    const description = settings.description;
    if (/通勤|上班|地铁/.test(description)) note += ' 通勤可配一只好收纳的斜挎包。';
    if (/宽松/.test(description)) note += ' 上衣可以选稍宽松的版型。';
    const preferredShoes = /平底|走路|步行/.test(description) ? '舒适的平底鞋' : shoes;
    return {
      text: '以' + pieces + '为主，搭配' + preferredShoes + '。' + layers + note.trimStart(),
      images: (settings.gender === 'female' ? femalePhotos : malePhotos),
    };
  }

  function openResult(settings, weather, style, trigger) {
    const result = outfitAdvice(settings, weather, style);
    const dialog = document.createElement('dialog');
    dialog.className = 'sheet';
    dialog.setAttribute('aria-labelledby', 'result-title');
    dialog.innerHTML = `
      <div class="mx-auto mt-2.5 h-1 w-10 rounded-full bg-violet-200/50" aria-hidden="true"></div>
      <div class="px-5 pt-3 pb-4">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="brand-icon">${icon('sparkles')}</span>
            <div><h2 id="result-title" class="text-[23px] font-semibold">今日穿搭推荐</h2><p id="result-meta" class="mt-0.5 text-xs text-violet-100/80"></p></div>
          </div>
          <button id="close-result" class="grid size-11 place-items-center rounded-full bg-white/10" type="button" aria-label="关闭推荐" autofocus>${icon('x')}</button>
        </div>
        <section class="mt-4 rounded-2xl border border-violet-300/25 bg-violet-400/10 px-4 py-3">
          <div class="flex flex-wrap items-center justify-between gap-1">
            <h3 class="font-semibold">AI 搭配建议</h3><span class="text-xs text-violet-100/75">演示建议</span>
          </div>
          <p id="advice" class="mt-1.5 text-sm leading-relaxed text-violet-50"></p>
        </section>
        <div class="mt-4 mb-2 flex justify-between"><h3 class="font-semibold">穿搭灵感</h3><p class="text-xs text-violet-100/75">参考照片 · 左右滑动</p></div>
        <div class="carousel" role="region" aria-label="穿搭参考图片轮播" tabindex="0">
          ${result.images.map((photo, index) => `
            <figure class="slide" aria-label="第 ${index + 1} 张，共 3 张">
              <img class="h-[min(34dvh,330px)] w-full object-cover object-[50%_38%]" src="assets/${photo}.webp" alt="${photos[photo]}">
              <figcaption class="absolute right-4 bottom-3 left-4 z-10 text-sm font-semibold">${photos[photo]}</figcaption>
            </figure>`).join('')}
        </div>
        <div class="mt-2 flex items-center justify-center gap-5" aria-label="轮播控制">
          <button type="button" class="grid size-11 place-items-center rounded-full bg-white/10" data-step="-1" aria-label="上一张">${icon('chevron-left', 'size-[18px]')}</button>
          ${result.images.map((_, index) => `<button type="button" class="dot relative" data-index="${index}" aria-label="第 ${index + 1} 张" aria-current="${index === 0}"></button>`).join('')}
          <button type="button" class="grid size-11 place-items-center rounded-full bg-white/10" data-step="1" aria-label="下一张">${icon('chevron-right', 'size-[18px]')}</button>
        </div>
        <div class="home-indicator" aria-hidden="true"></div>
      </div>`;
    dialog.querySelector('#result-meta').textContent = style + ' · ' + weather.sampleCity + ' · ' + weather.low + '–' + weather.high + '°C';
    dialog.querySelector('#advice').textContent = result.text;
    document.body.append(dialog);
    lucide.createIcons();
    wireCarousel(dialog);
    dialog.querySelector('#close-result').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
      dialog.remove();
      trigger.focus({ preventScroll: true });
    });
    dialog.showModal();
  }

  function wireCarousel(dialog) {
    const track = dialog.querySelector('.carousel');
    const dots = [...dialog.querySelectorAll('[data-index]')];
    const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
    let active = 0;
    let target = 0;
    let settle;
    const go = (index) => {
      target = (index + dots.length) % dots.length;
      track.scrollTo({ left: target * track.clientWidth, behavior });
    };
    track.addEventListener('scroll', () => {
      active = Math.min(dots.length - 1, Math.round(track.scrollLeft / track.clientWidth));
      dots.forEach((dot, index) => dot.setAttribute('aria-current', String(index === active)));
      clearTimeout(settle);
      settle = setTimeout(() => { target = active; }, 140);
    }, { passive: true });
    dots.forEach((dot) => dot.addEventListener('click', () => go(Number(dot.dataset.index))));
    dialog.querySelectorAll('[data-step]').forEach((button) => button.addEventListener('click', () => go(target + Number(button.dataset.step))));
    track.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      go(target + (event.key === 'ArrowRight' ? 1 : -1));
    });
  }
})();
