import request from '@/utils/request'
// import dayjs from 'dayjs'
const apiUrl = process.env.VUE_APP_DRAW_BASE_API

export function GetList(query) {
  query.pageNum = Number(query.pageNum)
  query.pageSize = Number(query.pageSize)
  return request({
    url: '/traffic_lane/list',
    method: 'get',
    params: query,
    baseURL: apiUrl
  }).then(ret => {
    return ret
  })
}
export function AddObj(obj) {
  return request({
    url: '/traffic_lane/create',
    method: 'post',
    data: obj,
    baseURL: apiUrl
  })
}
export function UpdateObj(obj) {
  return request({
    url: '/traffic_lane/update',
    method: 'put',
    data: obj,
    baseURL: apiUrl
  })
}
export function DelObj(id) {
  return request({
    url: '/traffic_lane/delete',
    method: 'delete',
    params: { id },
    baseURL: apiUrl
  })
}
