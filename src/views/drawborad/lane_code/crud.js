import dayjs from 'dayjs'

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
      view: { show: false } // 隐藏查看按钮
    },
    // 去掉搜索栏
    searchOptions: {
      disabled: true,
      show: null
    },
    columns: [
      {
        title: '车道方向编号',
        key: 'lane_value',
        // width: 160,
        sortable: true, // 是否排序
        search: { // 查询配置，默认启用查询
          disabled: false // 【可选】true禁止查询, 默认为false
        },
        form: {
          title: '车道编号',
          disabled: false,
          rules: [
            { required: true, message: '请输入车道方向编号' }
          ],
          component: {
            span: 24
          }
        }
      },
      {
        title: '车道方向名称',
        key: 'lane_label',
        // width: 160,
        // sortable: true, // 是否排序
        search: {
          disabled: false // 【可选】true禁止查询, 默认为false
        },
        form: {
          title: '车道名称',
          disabled: false,
          rules: [
            { required: true, message: '请输入车道方向名称' }
          ],
          component: {
            span: 24
          }
        },
        component: {
          props: { color: 'auto' },
          name: 'values-format'
        }
      },
      {
        title: '创建日期',
        key: 'created_at',
        // width: 260,
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
        // width: 260,
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
