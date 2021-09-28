<template>
  <div class="app-container">
    <div>坐标转换，像素坐标转换成物理坐标</div>
    <el-divider></el-divider>
    <span>请选择转换方向：</span>
    <el-select
      v-model="directionSelectValue"
      style="margin-bottom: 20px;"
      placeholder="请选择方向"
    >
      <el-option
        v-for="item in direction"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-row :gutter="20" type="flex" justify="center" align="middle">
      <el-col :span="11">
        <div style="height:92%;">
          <el-input
            v-model="pixelCoor"
            type="textarea"
            :rows="8"
            placeholder="请输入像素坐标"
          >
          </el-input>
        </div></el-col>
      <el-col :span="3">
        <el-button
          type="primary"
          icon="el-icon-d-arrow-right"
          @click="coorTrans"
        >转换</el-button>
      </el-col>
      <el-col :span="11">
        <el-input
          v-model="geoCoor"
          type="textarea"
          :rows="8"
          placeholder="转换生成物理坐标"
        >
        </el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { GetTransGeo } from './api' // 查询添加修改删除的http请求接口

export default {
  name: 'CDDTType',
  data() {
    return {
      pixelCoor: '[{"x":190.2483069977427,"y":144.9661399548533},{"x":510.7900677200903,"y":251.0609480812641},{"x":212.82167042889387,"y":460.99322799097064}]',
      geoCoor: '',
      directionSelectValue: '',
      direction: [
        { value: 'north', label: '北' },
        { value: 'east', label: '东' },
        { value: 'south', label: '南' },
        { value: 'west', label: '西' }
      ]
    }
  },
  methods: {
    coorTrans() {
      GetTransGeo({ direction: this.directionSelectValue, coor_list: this.pixelCoor }).then(res => {
        console.log('转换结果：', res)
        this.geoCoor = res.data
      })
    }
  }
}
</script>

<style scoped>
.app-container {
  height: 90vh;
  padding: 24px 20px 20px;
}
</style>
