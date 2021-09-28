import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/ailabel-me/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/ailabel-me/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/ailabel-me/user/logout',
    method: 'post'
  })
}
