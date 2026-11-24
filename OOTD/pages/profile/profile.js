const { readProfile, saveProfileForm } = require('../../utils/profile');
const { getHeaderLayout, updateField, chooseGender } = require('../../utils/profile-form');

Page({
  data: {
    profile: null,
    form: { city: '', gender: '', description: '' },
    editing: false,
    statusBarHeight: 0,
    headerHeight: 0,
  },

  onLoad() {
    const profile = readProfile();
    if (!profile) {
      wx.redirectTo({ url: '/pages/onboarding/onboarding' });
      return;
    }
    this.setData({ profile, ...getHeaderLayout() });
  },

  editProfile() {
    this.setData({ editing: true, form: { ...this.data.profile } });
  },

  cancelEdit() {
    this.setData({ editing: false });
  },

  updateField,
  chooseGender,

  saveProfile() {
    const profile = saveProfileForm(this.data.form);
    if (profile) {
      this.setData({ profile, editing: false });
    }
  },
});
