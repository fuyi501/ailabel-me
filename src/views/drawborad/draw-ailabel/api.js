import request from '@/utils/request'
const apiUrl = process.env.VUE_APP_DRAW_BASE_API

export function GetRoadList() {
  const query = {
    pageNum: 1,
    pageSize: 100
  }
  return request({
    url: '/traffic_road/list',
    method: 'get',
    params: query,
    baseURL: apiUrl
  }).then(ret => {
    return ret
  })
}

export function GetCamerasList(road_id) {
  return request({
    url: '/traffic_cameras/selectlist',
    method: 'get',
    params: { road_id },
    baseURL: apiUrl
  }).then(ret => {
    return ret
  })
}

export function GetAreaListByCameraId(camera_id) {
  return request({
    url: '/traffic_area/get_area_list_by_cameraId',
    method: 'get',
    params: { camera_id },
    baseURL: apiUrl
  }).then(ret => {
    return ret
  })
}

export function GetLaneListByCameraId(camera_id) {
  return request({
    url: '/traffic_lane/get_lane_list_by_cameraId',
    method: 'get',
    params: { camera_id },
    baseURL: apiUrl
  }).then(ret => {
    return ret
  })
}

export function GetEventCodeList() {
  return request({
    url: '/traffic_event_code/dicts',
    method: 'get',
    baseURL: apiUrl
  }).then(ret => {
    return ret
  })
}

export function GetLaneCodeList() {
  return request({
    url: '/traffic_lane_code/dicts',
    method: 'get',
    baseURL: apiUrl
  }).then(ret => {
    return ret
  })
}

export function GetCamerasOneInfo(camera_id) {
  return request({
    url: '/traffic_cameras/oneinfo',
    method: 'get',
    params: { camera_id },
    baseURL: apiUrl
  }).then(ret => {
    return ret
  })
}

export function AddAreaObj(obj) {
  console.log('创建区域：', obj)
  return request({
    url: '/traffic_area/create',
    method: 'post',
    data: obj,
    baseURL: apiUrl
  })
}

export function AddManyAreaObj(obj) {
  console.log('创建区域：', obj)
  return request({
    url: '/traffic_area/create_many',
    method: 'post',
    data: obj,
    baseURL: apiUrl
  })
}

export function AddLaneObj(obj) {
  console.log('创建车道：', obj)
  return request({
    url: '/traffic_lane/create',
    method: 'post',
    data: obj,
    baseURL: apiUrl
  })
}

export function AddManyLaneObj(obj) {
  console.log('创建车道：', obj)
  return request({
    url: '/traffic_lane/create_many',
    method: 'post',
    data: obj,
    baseURL: apiUrl
  })
}

export function DelObjByAreaId(area_id) {
  return request({
    url: '/traffic_area/delete_by_area_id',
    method: 'delete',
    params: { area_id },
    baseURL: apiUrl
  })
}

export function DelObjByLaneId(lane_id) {
  return request({
    url: '/traffic_lane/delete_by_lane_id',
    method: 'delete',
    params: { lane_id },
    baseURL: apiUrl
  })
}

export function UpdateAreaShape(obj) {
  console.log('更新区域 shape：', obj)
  return request({
    url: '/traffic_area/update_shape',
    method: 'put',
    params: obj,
    baseURL: apiUrl
  })
}

export function UpdateLaneShape(obj) {
  console.log('更新车道 shape：', obj)
  return request({
    url: '/traffic_lane/update_shape',
    method: 'put',
    params: obj,
    baseURL: apiUrl
  })
}

