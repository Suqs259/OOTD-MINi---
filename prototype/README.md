# OOTD MINi 原型与开发交接

打开 `index.html` 查看四个并列的交互界面。每个设备框都能独立点击、滚动和切换 Tab。样式库、图标和照片均在本地。用静态 HTTP 服务预览时，可在项目根目录运行：

```powershell
python -m http.server 8765 --bind 127.0.0.1 --directory prototype
```

浏览器访问 `http://127.0.0.1:8765/`。直接打开 `weather.html` 可以从无示例资料的状态体验完整流程。要再次体验全新用户状态，可清除此预览地址的本地存储。

## 产品结构与交互

| 界面 | 页面结构和交互 |
| --- | --- |
| OOTD | 今日天气优先呈现当前气温、最高最低温和天气状态，其次是七日预报，再到风格选择。未填写资料时可进入首次设置。已填写资料时按性别显示对应的 10 种风格，选中一个后启用生成按钮。 |
| 穿搭推荐 | 在 OOTD 内从底部打开。先展示选中的风格、适用天气与搭配建议，再展示三张图片。可左右滑动、使用切换按钮或键盘方向键。关闭后回到原选择。 |
| 首次设置 | 引导卡说明填写用途。用户输入城市和个人描述，并选择性别。必填项通过校验后保存并进入「我的」。 |
| 我的 | 展示已保存的三项资料。点击「编辑」进入预填表单。保存后可去 OOTD 查看对应城市及风格。 |

首次使用路径为「OOTD → 设置穿搭档案 → 完成设置 → 我的 → 去选今日穿搭 → 选择风格 → 生成今日OOTD」。两个 Tab 始终是「OOTD」和「我的」，首次设置属于「我的」，推荐弹层属于「OOTD」。

## 文件与接入点

| 文件 | 用途 |
| --- | --- |
| `index.html`、`overview.js` | iframe 总览、iPhone 16 Pro Max 440 × 956 pt 缩放和预览资料同步。 |
| `weather.html`、`ootd.html`、`weather.js` | 天气、风格和推荐入口。结果预览复用与正常生成相同的弹层。 |
| `onboarding.html`、`profile.html`、`profile.js` | 首次设置、资料编辑及展示。 |
| `app.js` | 状态栏、微信小程序胶囊、底部 Tab、资料读写。资料结构为 `{ city, gender, description }`，性别取 `male` 或 `female`。 |
| `ui.css`、`assets/` | 特殊组件与动效、Tailwind、Lucide、天气图标及照片。常规版式使用 Tailwind 类。 |

开发微信小程序时，可将两项 Tab 对应到 `app.json` 的 tabBar。资料读写可迁移到 `wx.getStorageSync` / `wx.setStorageSync`，弹层内轮播可使用 `swiper`。天气数据入口是 `forecast()`，输出当前气温、温度区间、天气、湿度、风速、降水概率及七天列表。建议入口是 `outfitAdvice()`，接收资料、当天预报和选中风格，返回建议正文及三张图片。当前天气为城市示例，未收录的城市展示明确标记的上海样例。推荐为本地规则，图片来自图库。上线时应把这两个入口替换为后端天气与 AI 服务，并补充对应的加载、失败和重试状态。Tailwind 在原型中通过本地浏览器包运行，正式 Web 构建可用 Tailwind CLI 生成静态 CSS。

## 素材

- 天气图标来自 [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji)，界面图标来自 [Lucide](https://lucide.dev/)。
- 穿搭图片来自 Pexels。[牛仔叠穿](https://www.pexels.com/photo/1040945/)、[蓝色高领](https://www.pexels.com/photo/2466756/)、[正装](https://www.pexels.com/photo/2955376/)、[简约](https://www.pexels.com/photo/842811/)、[中性色西装](https://www.pexels.com/photo/1926769/)、[浅粉外套](https://www.pexels.com/photo/2043590/)、[灰色套装](https://www.pexels.com/photo/6311392/)、[彩色叠搭](https://www.pexels.com/photo/1126993/)。
