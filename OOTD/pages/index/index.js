const PROFILE_KEY = 'ootd-mini-profile-v1';

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
const conditions = {
  partly: { label: '晴间多云', emoji: '🌤️' },
  sun: { label: '晴', emoji: '☀️' },
  cloud: { label: '多云', emoji: '☁️' },
  rain: { label: '小雨', emoji: '🌧️' },
};
const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
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
  const name = (city || '').replace(/市$/, '');
  const sampleCity = Object.prototype.hasOwnProperty.call(cityWeather, name) ? name : '上海';
  const [now, high, low, condition, humidity, wind, rain] = cityWeather[sampleCity];
  const days = [
    [condition, high, low], ['sun', high + 2, low + 1], ['partly', high + 1, low],
    ['rain', high - 2, low - 1], ['rain', high - 4, low - 2], ['cloud', high - 3, low - 2], ['sun', high - 1, low - 1],
  ];
  const today = new Date();
  return {
    now, high, low, humidity, wind, rain, sampleCity,
    cityLabel: sampleCity === name ? city : sampleCity + ' · 示例城市',
    days: days.map(([code, max, min], index) => {
      const date = new Date(today);
      date.setDate(date.getDate() + index);
      return {
        day: index ? weekdays[date.getDay()] : '今天',
        date: (date.getMonth() + 1) + '月' + date.getDate() + '日',
        high: max, low: min, ...conditions[code],
      };
    }),
  };
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
    text: '以' + pieces + '为主，搭配' + preferredShoes + '。' + layers + note.trim(),
    images: (settings.gender === 'female' ? femalePhotos : malePhotos).map((key) => ({
      key, caption: photos[key], src: '/pages/index/assets/' + key + '.webp',
    })),
  };
}

Page({
  data: {
    tab: 'weather',
    profile: null,
    editing: false,
    form: { city: '', gender: '', description: '' },
    weather: forecast(''),
    forecastIndex: 0,
    styles: [],
    selectedStyle: '',
    result: null,
    slideIndex: 0,
  },

  onLoad() {
    const stored = wx.getStorageSync(PROFILE_KEY);
    const profile = stored && (stored.gender === 'male' || stored.gender === 'female') && typeof stored.city === 'string'
      && typeof stored.description === 'string' ? stored : null;
    this.applyProfile(profile);
    wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#241a3d' });
    wx.setNavigationBarTitle({ title: 'OOTD' });
  },

  applyProfile(profile) {
    this.setData({
      profile,
      weather: forecast(profile ? profile.city : ''),
      forecastIndex: 0,
      styles: profile ? styles[profile.gender] : [],
      selectedStyle: '',
    });
  },

  switchTab(event) {
    this.showTab(event.currentTarget.dataset.tab);
  },

  showTab(tab) {
    if (tab === this.data.tab) return;
    this.setData({ tab, result: null });
    wx.setNavigationBarTitle({ title: tab === 'weather' ? 'OOTD' : '我的' });
  },

  openProfileForm() {
    const { profile } = this.data;
    this.setData({
      editing: true,
      form: profile ? { ...profile } : { city: '', gender: '', description: '' },
    });
    this.showTab('profile');
  },

  cancelEdit() {
    this.setData({ editing: false });
  },

  updateField(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({ ['form.' + field]: event.detail.value });
  },

  chooseGender(event) {
    this.setData({ 'form.gender': event.currentTarget.dataset.gender });
  },

  saveProfile() {
    const { city, gender, description } = this.data.form;
    const profile = { city: city.trim(), gender, description: description.trim() };
    const missing = !profile.city ? '请输入城市' : !gender ? '请选择性别' : !profile.description ? '请输入个人描述' : '';
    if (missing) {
      wx.showToast({ title: missing, icon: 'none' });
      return;
    }
    try {
      wx.setStorageSync(PROFILE_KEY, profile);
    } catch {
      wx.showToast({ title: '保存失败，请重试', icon: 'none' });
      return;
    }
    this.applyProfile(profile);
    this.setData({ editing: false });
  },

  selectForecastDay(event) {
    const index = Number(event.currentTarget.dataset.index);
    if (Number.isInteger(index) && this.data.weather.days[index] && index !== this.data.forecastIndex) {
      this.setData({ forecastIndex: index });
    }
  },

  chooseStyle(event) {
    this.setData({ selectedStyle: event.currentTarget.dataset.style });
  },

  generateOutfit() {
    const { profile, weather, selectedStyle } = this.data;
    if (!profile || !selectedStyle) return;
    this.setData({ result: outfitAdvice(profile, weather, selectedStyle), slideIndex: 0 });
  },

  closeResult() {
    this.setData({ result: null });
  },

  updateSlide(event) {
    this.setData({ slideIndex: event.detail.current });
  },

  selectSlide(event) {
    this.setData({ slideIndex: event.currentTarget.dataset.slide });
  },

  stepSlide(event) {
    const count = this.data.result.images.length;
    const step = Number(event.currentTarget.dataset.step);
    this.setData({ slideIndex: (this.data.slideIndex + step + count) % count });
  },
});
