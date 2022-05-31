import axios from 'axios';

export async function queryCSRF() {
  const { data: res } = await axios.get('/api/user/csrf');
  if (res.success) {
    window.localStorage.setItem('x-csrf-token', res.data.csrf);
    return res.data.csrf;
  } else {
    console.log('xxx');
    throw new Error('csrf获取失败');
  }
}

export function getCSRF() {
  const csrf = window.localStorage.getItem('x-csrf-token');
  if (csrf) {
    return csrf;
  } else {
    return null;
  }
}
