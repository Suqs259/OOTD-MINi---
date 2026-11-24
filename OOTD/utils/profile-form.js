function getHeaderLayout() {
  const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
  const statusBarHeight = windowInfo.statusBarHeight || 0;
  const menu = wx.getMenuButtonBoundingClientRect();
  const referenceHeight = 59 * windowInfo.windowWidth / 440;
  const menuHeight = menu.height + 2 * Math.max(menu.top - statusBarHeight, 0);
  return { statusBarHeight, headerHeight: Math.max(referenceHeight, menuHeight || 0) };
}

function updateField(event) {
  const field = event.currentTarget.dataset.field;
  this.setData({ ['form.' + field]: event.detail.value });
}

function chooseGender(event) {
  this.setData({ 'form.gender': event.currentTarget.dataset.gender });
}

module.exports = { getHeaderLayout, updateField, chooseGender };
