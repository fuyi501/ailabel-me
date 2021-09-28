import dayjs from 'dayjs'
import request from '@/utils/request'

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
        title: '区域名称',
        key: 'area_name',
        width: 140,
        // sortable: true, // 是否排序
        search: { // 查询配置，默认启用查询
          disabled: false // 【可选】true禁止查询, 默认为false
        },
        form: { // form表单的配置
          disabled: false, // 禁止添加输入与修改输入【可选】默认false
          rules: [ // 【可选】添加和修改时的校验规则，不配置则不校验
            { required: true, message: '请输入区域名称' }
          ]
        },
        component: {
          props: { color: 'success' },
          name: 'values-format'
        }
      },
      {
        title: '区域编号',
        key: 'area_number',
        width: 80,
        // sortable: true, // 是否排序
        search: { // 查询配置，默认启用查询
          disabled: false // 【可选】true禁止查询, 默认为false
        },
        form: { // form表单的配置
          disabled: false, // 禁止添加输入与修改输入【可选】默认false
          rules: [ // 【可选】添加和修改时的校验规则，不配置则不校验
            { required: true, message: '请输入区域编号' }
          ]
        }
        // component: {
        //   props: { color: 'success' },
        //   name: 'values-format'
        // }
      },
      {
        title: '所属摄像头',
        key: 'camera_id',
        type: 'select',
        width: 280,
        // sortable: true, // 是否排序
        search: { // 查询配置，默认启用查询
          disabled: false // 【可选】true禁止查询, 默认为false
        },
        form: { // form表单的配置
          disabled: false,
          rules: [ // 【可选】添加和修改时的校验规则，不配置则不校验
            { required: true, message: '请选择所属摄像头' }
          ],
          component: {
            span: 24
          }
        },
        dict: {
          url: '/traffic_cameras/dicts',
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
          value: 'camera_id', // 数据字典中value字段的属性名
          label: 'camera_name'
        }
      },
      {
        title: '监测事件',
        key: 'event_list',
        type: 'select',
        width: 260,
        // sortable: true, // 是否排序
        search: { // 查询配置，默认启用查询
          disabled: false // 【可选】true禁止查询, 默认为false
        },
        form: {
          disabled: false,
          rules: [
            { required: true, message: '请选择监测事件' }
          ],
          component: {
            span: 24,
            props: {
              filterable: true,
              multiple: true,
              clearable: true
            }
          },
          itemProps: { // 单独设置labelWidth
            // labelWidth: '120px'
          }
        },
        dict: {
          url: '/traffic_event_code/dicts',
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
          value: 'event_value', // 数据字典中value字段的属性名
          label: 'event_label'
        },
        component: { props: { color: 'auto' }} // 自动染色
      },
      {
        title: '像素坐标',
        key: 'pixel_coordinates',
        width: 300,
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
        title: '地理坐标',
        key: 'geo_coordinates',
        width: 300,
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
