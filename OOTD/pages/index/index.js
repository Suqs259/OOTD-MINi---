const { readProfile } = require('../../utils/profile');
const { weatherUrl } = require('../../config/api');

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
    profile: null,
    onboardingRedirectFailed: false,
    weather: null,
    weatherStatus: 'idle',
    weatherError: '',
    forecastIndex: 0,
    styles: [],
    selectedStyle: '',
    result: null,
  },

  onLoad() {
    wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#241a3d' });
    wx.setNavigationBarTitle({ title: 'OOTD' });
    const profile = readProfile();
    if (!profile) {
      wx.redirectTo({
        url: '/pages/onboarding/onboarding',
        fail: () => this.setData({ onboardingRedirectFailed: true }),
      });
      return;
    }
    this.setData({ profile, styles: styles[profile.gender] });
    this.loadWeather();
  },

  onUnload() {
    this.weatherRequestId = (this.weatherRequestId || 0) + 1;
    if (this.weatherRequest) this.weatherRequest.abort();
  },

  loadWeather() {
    const { profile, weatherStatus } = this.data;
    if (!profile || weatherStatus === 'loading') return;
    const requestId = (this.weatherRequestId || 0) + 1;
    this.weatherRequestId = requestId;
    this.setData({ weatherStatus: 'loading', weatherError: '' });

    const showError = (message) => {
      if (requestId !== this.weatherRequestId) return;
      this.setData({ weatherStatus: 'error', weatherError: message });
    };

    this.weatherRequest = wx.request({
      url: weatherUrl,
      data: { city: profile.city },
      timeout: 18000,
      success: ({ statusCode, data }) => {
        if (requestId !== this.weatherRequestId) return;
        if (statusCode !== 200 || !Array.isArray(data?.days) || data.days.length !== 7) {
          showError(data?.message || '天气数据暂时不可用');
          return;
        }
        this.setData({ weather: data, weatherStatus: 'ready', forecastIndex: 0 });
      },
      fail: () => showError('天气加载失败，请检查网络后重试'),
      complete: () => {
        if (requestId === this.weatherRequestId) this.weatherRequest = null;
      },
    });
  },

  selectForecastDay(event) {
    const index = Number(event.currentTarget.dataset.index);
    if (Number.isInteger(index) && this.data.weather?.days[index] && index !== this.data.forecastIndex) {
      this.setData({ forecastIndex: index });
    }
  },

  chooseStyle(event) {
    this.setData({ selectedStyle: event.currentTarget.dataset.style });
  },

  generateOutfit() {
    const { profile, weather, selectedStyle } = this.data;
    if (!profile || !weather || !selectedStyle) return;
    this.setData({
      result: {
        ...outfitAdvice(profile, weather, selectedStyle),
        subtitle: selectedStyle + ' · ' + weather.city + ' · ' + weather.low + '–' + weather.high + '°C',
      },
    });
  },

  closeResult() {
    this.setData({ result: null });
  },
});
