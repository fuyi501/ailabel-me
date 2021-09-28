import request from '@/utils/request'
const apiUrl = process.env.VUE_APP_DRAW_BASE_API

export function GetTransGeo(query) {
  return request({
    url: '/traffic_trans/trans',
    method: 'post',
    params: query,
    baseURL: apiUrl
  }).then(ret => {
    return ret
  })
}

