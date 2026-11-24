const { readProfileDraft, saveProfileForm } = require('../../utils/profile');
const { getHeaderLayout, updateField, chooseGender } = require('../../utils/profile-form');

Page({
  data: {
    form: { city: '', gender: '', description: '' },
    statusBarHeight: 0,
    headerHeight: 0,
    submitting: false,
  },

  onLoad() {
    this.setData({ form: readProfileDraft(), ...getHeaderLayout() });
  },

  updateField,
  chooseGender,

  saveProfile() {
    if (this.data.submitting || !saveProfileForm(this.data.form)) return;
    this.setData({ submitting: true });
    wx.redirectTo({
      url: '/pages/profile/profile',
      fail: () => {
        this.setData({ submitting: false });
        wx.showToast({ title: '资料已保存，请重试打开「我的」', icon: 'none' });
      },
    });
  },
});
