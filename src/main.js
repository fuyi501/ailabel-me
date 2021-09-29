import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入全局 css
import '@/styles/index.scss'

import App from './App.vue'
import router from './router'
import store from './store'

import '@/icons' // 引入自定义 svg icon 文件
import '@/permission' // permission control

// 开发环境下使用
// if (process.env.NODE_ENV === 'development') {
const { mockXHR } = require('../mock')
mockXHR()
// }

Vue.use(ElementUI)

// *************** 自定义 d2-crud-plus ******************

import request from '@/utils/request'

// d2-crud-plus 表格处理组件
import d2CrudX from 'd2-crud-x'
import { d2CrudPlus } from 'd2-crud-plus'
import pluginExport from '@d2-projects/vue-table-export'

Vue.use(d2CrudX, { name: 'd2-crud-x' }) // 注册名称为d2-crud-x ，不传name则使用d2-crud作为标签名称

Vue.use(d2CrudPlus, {
  starTip: false,
  // 获取数据字典的请求方法
  // 可在dict中配置getData方法覆盖此全局方法
  getRemoteDictFunc(url, dict) {
    return request({ // 用你项目中的http请求
      url: url,
      method: 'get'
    }).then(ret => {
      return ret.data // 返回字典数组
    })
  },
  commonOption() { // d2-crud option 全局配置，每个页面的crudOptions会以全局配置为基础进行覆盖
    return {
      format: {
        page: { // page接口返回的数据结构配置，
          request: { // 请求参数
            current: 'pageNum', // 当前
            size: 'pageSize'
          },
          response: { // 返回结果
            current: 'pageNum', // 当前页码 ret.data.current
            size: 'pageSize', // 每页条数，ret.data.size,
            // size: (data) => { return data.size }, //你也可以配置一个方法，自定义返回
            total: 'total', // 总记录数 ret.data.total
            records: 'records' // 列表数组 ret.data.records
          }
        }
      },
      formOptions: {
        closeOnClickModal: false, // 点击对话框背景关闭对话框,实际使用过程中容易误触把对话框关闭，导致输入内容丢失，建议设置为false
        nullToBlankStr: true, // 提交修改表单时，将undefined的数据修改为空字符串''，可以解决无法清空字段的问题
        defaultSpan: 12 // 默认的表单 span
      },
      options: {
        height: '100%', // 表格高度100%，此时d2-crud-x外部容器必须有高度, 使用toolbar必须设置
        size: 'small'
      },
      pageOptions: {
        compact: true, // 是否紧凑型页面
        export: {
          local: true, // 本地导出,false为服务端导出
          title: '导出数据', // 文件名
          type: 'excel' // 导出类型，excel 或 cvs
          // formatter(row,context){}
        }
      },
      viewOptions: {
        disabled: false,
        componentType: 'form' // 【form,row】 表单组件 或 行组件展示
      },
      rowHandle: {
        width: 260,
        edit: {
          type: 'primary'
        }
      }
    }
  }
})
Vue.use(pluginExport)

import { D2pFileUploader, D2pUploader } from 'd2p-extends' // 组件将会懒加载
// 配置上传参数
Vue.use(D2pUploader, {
  defaultType: 'form', // 默认类型为腾讯云上传，可选值：【cos、qiniu、alioss、form】
  form: { // 本地服务端上传
    action: '/traffic_files/file_upload', // 上传url
    name: 'file', // 上传时文件的参数名
    data: {}, // 上传附加参数
    headers: {}, // 上传请求头
    successHandle(res) { // 上传成功后，后台返回结果处理
      return { url: res.data } // data是该文件的url
    },
    withCredentials: false // 是否带cookie
  }
})
Vue.use(D2pFileUploader, { d2CrudPlus })
// ****************** 自定义 d2-crud-plus ********************

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
