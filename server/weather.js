const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function decode(value) {
  if (typeof value !== 'string') return value;
  const json = value.trim().replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/i, '$1');
  return JSON.parse(json);
}

function readNumber(value, suffix) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  const numeric = value.trim().replace(suffix, '').trim();
  const parsed = Number(numeric);
  return /^[-+]?\d+(?:\.\d+)?$/.test(numeric) && Number.isFinite(parsed) ? parsed : null;
}

function weatherIcon(label) {
  if (/雷/.test(label)) return '⛈️';
  if (/雪/.test(label)) return '🌨️';
  if (/雨/.test(label)) return '🌧️';
  if (/雾|霾|沙/.test(label)) return '🌫️';
  if (/晴.*云|云.*晴/.test(label)) return '🌤️';
  if (/云|阴/.test(label)) return '☁️';
  if (/晴/.test(label)) return '☀️';
  return '🌡️';
}

function readDay(day) {
  const date = day?.date;
  const timestamp = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? Date.parse(date + 'T00:00:00Z')
    : NaN;
  const high = readNumber(day?.high, /°\s*C?$|℃$/i);
  const low = readNumber(day?.low, /°\s*C?$|℃$/i);
  const label = typeof day?.condition === 'string' ? day.condition.trim() : '';
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== date
      || high === null || low === null || high < low || !label) {
    throw new TypeError('Invalid forecast day');
  }
  const value = new Date(timestamp);
  const dateLabel = (value.getUTCMonth() + 1) + '月' + value.getUTCDate() + '日';
  return { date, dateLabel, day: weekdays[value.getUTCDay()], high, low, label, emoji: weatherIcon(label) };
}

function readWeather(response, requestedCity) {
  if (response?.code !== 0) throw new Error('Coze workflow failed');
  const payload = decode(response.data);
  const data = decode(payload?.output ?? payload);
  const forecasts = data?.days ?? data?.forecast;
  if (!Array.isArray(forecasts) || forecasts.length < 7 || !data.current) {
    throw new TypeError('Expected current weather and seven forecast days');
  }
  const days = forecasts.map(readDay).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 7);
  for (let i = 1; i < days.length; i++) {
    if (Date.parse(days[i].date) - Date.parse(days[i - 1].date) !== 86400000) {
      throw new TypeError('Expected consecutive forecast dates');
    }
  }
  const { high, low } = days[0];
  const now = readNumber(data.current.temperature ?? data.current.temp, /°\s*C?$|℃$/i);
  if (now === null) throw new TypeError('Expected the current temperature');
  const currentCondition = data.current.condition;
  const label = typeof currentCondition === 'string' && currentCondition.trim()
    ? currentCondition.trim()
    : days[0].label;
  const city = typeof data.city === 'string' && data.city.trim() ? data.city.trim() : requestedCity;
  days[0].day = '今天';
  return {
    city,
    now,
    high,
    low,
    label,
    emoji: weatherIcon(label),
    humidity: readNumber(data.current.humidity, /%$/),
    wind: readNumber(data.current.windSpeed, /km\s*\/\s*h$/i),
    rain: readNumber(data.current.precipitationProbability, /%$/),
    days,
  };
}

module.exports = { readWeather };
