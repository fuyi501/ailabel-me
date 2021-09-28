import request from '@/utils/request'
import dayjs from 'dayjs'
const apiUrl = process.env.VUE_APP_DRAW_BASE_API

export function GetList(query) {
  query.pageNum = Number(query.pageNum)
  query.pageSize = Number(query.pageSize)
  return request({
    url: '/traffic_road/list',
    method: 'get',
    params: query,
    baseURL: apiUrl
  }).then(ret => {
    return ret
  })
}
export function AddObj(obj) {
  obj.created_at = dayjs(obj.created_at).format('YYYY-MM-DD HH:mm:ss')
  return request({
    url: '/traffic_road/create',
    method: 'post',
    params: obj,
    baseURL: apiUrl
  })
}
export function UpdateObj(obj) {
  return request({
    url: '/traffic_road/update',
    method: 'put',
    params: obj,
    baseURL: apiUrl
  })
}
export function DelObj(id) {
  return request({
    url: '/traffic_road/delete',
    method: 'delete',
    params: { id },
    baseURL: apiUrl
  })
}
