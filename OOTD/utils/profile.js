const PROFILE_KEY = 'ootd-mini-profile-v1';

function readProfile() {
  const profile = readProfileDraft();
  return missingProfileField(profile) ? null : profile;
}

function normalizeProfile(value) {
  const { city, gender, description } = value || {};
  return {
    city: typeof city === 'string' ? city.trim() : '',
    gender: gender === 'male' || gender === 'female' ? gender : '',
    description: typeof description === 'string' ? description.trim() : '',
  };
}

function readProfileDraft() {
  return normalizeProfile(wx.getStorageSync(PROFILE_KEY));
}

function missingProfileField(profile) {
  if (!profile.city) return '请输入城市';
  if (!profile.gender) return '请选择性别';
  if (!profile.description) return '请输入个人描述';
  return '';
}

function saveProfileForm(form) {
  const profile = normalizeProfile(form);
  const message = missingProfileField(profile);
  if (message) {
    wx.showToast({ title: message, icon: 'none' });
    return null;
  }
  try {
    wx.setStorageSync(PROFILE_KEY, profile);
    return profile;
  } catch {
    wx.showToast({ title: '保存失败，请重试', icon: 'none' });
    return null;
  }
}

module.exports = { readProfile, readProfileDraft, saveProfileForm };
