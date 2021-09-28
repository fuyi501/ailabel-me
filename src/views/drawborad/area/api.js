import request from '@/utils/request'
const apiUrl = process.env.VUE_APP_DRAW_BASE_API

export function GetList(query) {
  query.pageNum = Number(query.pageNum)
  query.pageSize = Number(query.pageSize)
  return request({
    url: '/traffic_area/list',
    method: 'get',
    params: query,
    baseURL: apiUrl
  }).then(ret => {
    return ret
  })
}
export function AddObj(obj) {
  console.log('创建：', obj)
  return request({
    url: '/traffic_area/create',
    method: 'post',
    data: obj,
    baseURL: apiUrl
  })
}
export function UpdateObj(obj) {
  console.log('更新：', obj)
  return request({
    url: '/traffic_area/update',
    method: 'put',
    data: obj,
    baseURL: apiUrl
  })
}
export function DelObj(id) {
  return request({
    url: '/traffic_area/delete',
    method: 'delete',
    params: { id },
    baseURL: apiUrl
  })
}
