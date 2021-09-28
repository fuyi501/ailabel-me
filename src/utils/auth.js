import Cookies from 'js-cookie'

// cookie 中存储 token
const TokenKey = 'user_token'

// localStorage 在浏览器中存储 key/value 对。没有过期时间。
// sessionStorage 在浏览器中存储 key/value 对。 在关闭窗口或标签页之后将会删除这些数据。

export function getToken() {
  // console.log('localStorage', window.localStorage.getItem(TokenKey))
  // console.log('sessionStorage', window.sessionStorage.getItem(TokenKey))
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  window.localStorage.setItem(TokenKey, token)
  window.sessionStorage.setItem(TokenKey, token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  window.localStorage.removeItem(TokenKey)
  window.sessionStorage.removeItem(TokenKey)
  return Cookies.remove(TokenKey)
}
