const express = require('express');
const path = require('node:path');
const { readWeather } = require('./weather');

const WORKFLOW_URL = 'https://api.coze.cn/v1/workflow/run';

function createApp({ env = process.env, fetchWeather = fetch } = {}) {
  const app = express();
  app.disable('x-powered-by');

  app.get('/api/weather', async (req, res) => {
    const city = typeof req.query.city === 'string' ? req.query.city.trim() : '';
    if (!city || city.length > 30 || /[\x00-\x1f\x7f]/.test(city)) {
      return res.status(400).json({ message: '请输入有效的城市名称' });
    }

    const token = env.COZE_TOKEN?.trim();
    const workflowId = env.COZE_WORKFLOW_ID?.trim();
    if (!token || !workflowId) {
      return res.status(503).json({ message: '天气服务尚未配置' });
    }

    try {
      const upstream = await fetchWeather(WORKFLOW_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow_id: workflowId,
          parameters: { [env.COZE_CITY_PARAMETER?.trim() || 'city']: city },
        }),
        redirect: 'error',
        signal: AbortSignal.timeout(15000),
      });
      if (!upstream.ok) {
        return res.status(502).json({ message: '天气服务暂时不可用，请稍后重试' });
      }
      const weather = readWeather(await upstream.json(), city);
      return res.json(weather);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        return res.status(504).json({ message: '天气服务响应超时，请重试' });
      }
      return res.status(502).json({ message: '天气数据获取失败，请稍后重试' });
    }
  });

  return app;
}

if (require.main === module) {
  try {
    process.loadEnvFile(path.join(__dirname, '.env'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || '127.0.0.1';
  createApp().listen(port, host, () => {
    console.log(`OOTD weather API listening at http://${host}:${port}`);
  });
}

module.exports = { createApp };
