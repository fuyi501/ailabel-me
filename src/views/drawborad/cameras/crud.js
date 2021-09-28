import dayjs from 'dayjs'
import request from '@/utils/request'
import { D2pFileUploader } from 'd2p-extends'

export const crudOptions = (vm) => { // vm即this
  return {
    options: {
      height: '100%' // 表格高度100%, 使用toolbar必须设置
    },
    indexRow: { // 序号列,或者直接传true,不显示title，不居中
      title: '序号',
      // width: 100,
      align: 'center'
    },
    rowHandle: {
      width: 200,
      view: { show: false }, // 隐藏查看按钮
      fixed: 'right' // 右边固定列
    },
    // 去掉搜索栏
    searchOptions: {
      disabled: true,
      show: null
    },
    columns: [
      {
        title: '摄像头名称',
        key: 'camera_name',
        width: 120,
        // sortable: true, // 是否排序
        search: { // 查询配置，默认启用查询
          disabled: false // 【可选】true禁止查询, 默认为false
        },
        form: { // form表单的配置
          disabled: false,
          rules: [
            { required: true, message: '请输入摄像头名称' }
          ]
        }
        // component: {
        //   props: { color: 'success' },
        //   name: 'values-format'
        // }
      },
      {
        title: '摄像头类型',
        key: 'camera_type',
        type: 'select',
        width: 90,
        // sortable: true, // 是否排序
        search: { // 查询配置，默认启用查询
          disabled: false // 【可选】true禁止查询, 默认为false
        },
        form: { // form表单的配置
          disabled: false,
          rules: [
            { required: true, message: '请输入摄像头类型' }
          ]
        },
        dict: { // 本地数据字典
          data: [
            { value: '枪球机', label: '枪球机', color: 'success' },
            { value: '枪机', label: '枪机', color: 'warning' },
            { value: '球机', label: '球机', color: 'danger' }
          ]
        }
      },
      {
        title: '所在道路',
        key: 'camera_road_id',
        type: 'select',
        width: 200,
        // sortable: true, // 是否排序
        search: { // 查询配置，默认启用查询
          disabled: false // 【可选】true禁止查询, 默认为false
        },
        form: { // form表单的配置
          disabled: false,
          rules: [
            { required: true, message: '请选择所在道路路口' }
          ]
        },
        dict: {
          url: '/traffic_road/dicts',
          getData(url, dict) { // 覆盖全局获取字典请求配置
            return request({
              url: url,
              method: 'get',
              baseURL: process.env.VUE_APP_DRAW_BASE_API
            }).then(ret => {
              return ret.data
            })
          },
          // cache: false, // 默认开启缓存
          value: 'road_id', // 数据字典中value字段的属性名
          label: 'road_name'
        }
      },
      {
        title: '安装位置',
        key: 'camera_position',
        type: 'select',
        width: 80,
        // sortable: true, // 是否排序
        search: { // 查询配置，默认启用查询
          disabled: false // 【可选】true禁止查询, 默认为false
        },
        form: { // form表单的配置
          disabled: false,
          rules: [
            { required: true, message: '请选择安装位置' }
          ]
        },
        dict: { // 本地数据字典
          data: [
            { value: 'north', label: '北', color: 'success' },
            { value: '东北', label: '东北', color: 'success' },
            { value: 'east', label: '东', color: 'success' },
            { value: '东南', label: '东南', color: 'success' },
            { value: 'south', label: '南', color: 'success' },
            { value: '西南', label: '西南', color: 'success' },
            { value: 'west', label: '西', color: 'success' },
            { value: '西北', label: '西北', color: 'success' }
          ]
        }
      },
      {
        title: '地理坐标',
        key: 'camera_lonlat',
        // width: 160,
        // sortable: true, // 是否排序
        search: { // 查询配置，默认启用查询
          disabled: false // 【可选】true禁止查询, 默认为false
        },
        form: { // form表单的配置
          disabled: false,
          component: {
            span: 24
          }
        }
      },
      {
        title: '视频流地址',
        key: 'camera_video_url',
        width: 100,
        // sortable: true, // 是否排序
        search: { // 查询配置，默认启用查询
          disabled: false // 【可选】true禁止查询, 默认为false
        },
        form: { // form表单的配置
          disabled: false,
          component: {
            span: 24
          }
        }
      },
      {
        title: '原始图片',
        key: 'camera_original_image_url',
        type: 'image-uploader',
        align: 'left',
        // width: 160,
        // sortable: true, // 是否排序
        search: { // 查询配置，默认启用查询
          disabled: false // 【可选】true禁止查询, 默认为false
        },
        form: {
          component: {
            props: {
              uploader: {
                type: 'form',
                action: process.env.VUE_APP_DRAW_BASE_API + '/traffic_files/file_upload', // 上传url
                successHandle(ret, option) {
                  // console.log('上传结果：', ret, option)
                  if (ret.code !== 200) {
                    throw new Error(ret.message)
                  }
                  return { url: ret.data }
                }
              },
              // returnType: 'key', // 添加和编辑上传提交的值不要url，而只要key
              // buildUrl(value, item) {
              //   // console.log('构建 url:', value, item)
              //   return value
              // },
              elProps: { // 与el-uploader 配置一致
                multiple: false,
                limit: 1 // 限制5个文件
              }
              // sizeLimit: 100 * 1024 // 不能超过限制
            }
            // span: 24
          },
          on: {
            blur(event) {
              console.log('blur', event)
            }
          },
          // helper: '限制文件大小不能超过100k',
          rules: [{ // 当有文件还未上传完成时，阻止表单提交，等待全部上传完成，才允许提交
            validator: D2pFileUploader.createAllUploadedValidator(vm.getFormComponentRef),
            message: '还有文件正在上传，请等待上传完成，或删除它'
          }]
        },
        component: {
          props: {
            buildUrl(value, item) {
              return value
            }
          }
        }
      },
      {
        title: '标注图片',
        key: 'camera_image_url',
        type: 'image-uploader',
        align: 'left',
        // width: 160,
        // sortable: true, // 是否排序
        search: { // 查询配置，默认启用查询
          disabled: false // 【可选】true禁止查询, 默认为false
        },
        form: {
          component: {
            props: {
              uploader: {
                type: 'form',
                action: process.env.VUE_APP_DRAW_BASE_API + '/traffic_files/file_upload', // 上传url
                successHandle(ret, option) {
                  // console.log('上传结果：', ret, option)
                  if (ret.code !== 200) {
                    throw new Error(ret.message)
                  }
                  return { url: ret.data }
                }
              },
              // returnType: 'key', // 添加和编辑上传提交的值不要url，而只要key
              // buildUrl(value, item) {
              //   // console.log('构建 url:', value, item)
              //   return value
              // },
              elProps: { // 与el-uploader 配置一致
                multiple: false,
                limit: 1 // 限制5个文件
              }
              // sizeLimit: 100 * 1024 // 不能超过限制
            }
            // span: 24
          },
          on: {
            blur(event) {
              console.log('blur', event)
            }
          },
          // helper: '限制文件大小不能超过100k',
          rules: [{ // 当有文件还未上传完成时，阻止表单提交，等待全部上传完成，才允许提交
            validator: D2pFileUploader.createAllUploadedValidator(vm.getFormComponentRef),
            message: '还有文件正在上传，请等待上传完成，或删除它'
          }]
        },
        component: {
          props: {
            buildUrl(value, item) {
              return value
            }
          }
        }
      },
      {
        title: '创建日期',
        key: 'created_at',
        width: 140,
        // sortable: true,
        type: 'datetime', // 字段类型为时间选择器datepicker,根据类型可自动生成默认配置
        search: { // 查询配置，默认启用查询
          disabled: true // 【可选】true禁止查询,默认为false
        },
        form: { // form 表单的配置
          disabled: true, // 禁止添加输入与修改输入【可选】默认false
          value: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        title: '更新日期',
        key: 'updated_at',
        width: 140,
        // sortable: true,
        type: 'datetime', // 字段类型为时间选择器datepicker,根据类型可自动生成默认配置
        search: { // 查询配置，默认启用查询
          disabled: true // 【可选】true禁止查询,默认为false
        },
        form: { // form 表单的配置
          disabled: true, // 禁止添加输入与修改输入【可选】默认false
          value: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
      }
    ]
  }
}
