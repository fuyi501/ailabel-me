<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="交通道路">
        <el-select
          v-model="roadSelectValue"
          style="width:300px;"
          placeholder="请选择道路"
          @change="roadSelectChange"
        >
          <el-option
            v-for="item in roadOptions"
            :key="item.road_id"
            :label="item.road_name"
            :value="item.road_id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="监控摄像头">
        <el-select
          v-model="cameraSelectValue"
          style="width:360px;"
          placeholder="请选择监控摄像头"
          @change="cameraSelectChange"
        >
          <el-option
            v-for="item in cameraOptions"
            :key="item.camera_id"
            :label="item.camera_name"
            :value="item.camera_id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-divider class="mydivider"></el-divider>
    <el-row :gutter="20">
      <el-col :span="18">
        <!-- 绘制容器 -->
        <div id="ailabelmap"></div>
        <el-button plain type="primary" @click="setMode('PAN')">平移</el-button>
        <el-button plain type="primary" @click="setMode('RECT')">绘制矩形</el-button>
        <el-button plain type="primary" @click="setMode('POLYGON')">绘制多边形</el-button>
        <p>注：在绘制模式时，双击图形可进行选中编辑；单击未选中图形区域或切换mode模式会取消选中。双击右侧表格的某一行也可以选中编辑。</p>

      </el-col>
      <el-col :span="6">
        <div class="mytable">
          <div class="headerinfo">
            <span style="font-size: 18px;">标注信息（{{ markerList.length }}）</span>
          </div>
          <el-table
            ref="singleTable"
            :key="tableKey"
            :data="markerList"
            highlight-current-row
            style="width: 100%"
            size="mini"
            @row-dblclick="tableRowClick"
          >
            <el-table-column
              type="index"
              width="40"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
            >
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column
              label="编辑"
              width="40"
            >
              <template slot-scope="scope">
                <el-button slot="reference" type="text" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="删除"
              width="50"
            >
              <template slot-scope="scope">
                <el-button slot="reference" type="text" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-dialog class="mydialog" title="标注信息" :visible.sync="isVisibleDialog">
      <el-form
        label-width="120px"
      >
        <el-form-item label="标注名称">
          <el-tag type="danger">{{ dialogTagName || dialogInfo['name'] }}</el-tag>
        </el-form-item>
        <el-form-item label="标注框坐标">
          <!-- <el-tag type="danger">{{ dialogInfo['positionData'] }}</el-tag> -->
          <!-- {{ dialogInfo['positionData'] }} -->
          <el-alert
            :title="JSON.stringify(dialogInfo['positionData'])"
            type="info"
            :closable="false"
          >
          </el-alert>
        </el-form-item>
      </el-form>
      <el-form label-width="120px">
        <el-form-item label="请选择标注类型">
          <el-select
            v-model="typeValue"
            placeholder="请选择标注类型"
            @change="changeAnnoType"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请选择区域事件">
          <el-select
            v-model="areaSelectValue"
            style="width:100%;"
            multiple
            placeholder="请选择区域事件"
            :disabled="isDisabledDialogForm"
          >
            <el-option
              v-for="item in areaOption"
              :key="item.event_value"
              :label="item.event_label"
              :value="item.event_value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form
        label-width="120px"
        :inline="true"
        :disabled="!isDisabledDialogForm"
      >
        <el-form-item label="请选择车道方向">
          <el-select
            v-model="laneSelectValue"
            placeholder="请选择车道方向"
          >
            <el-option
              v-for="item in laneOption"
              :key="item.lane_value"
              :label="item.lane_label"
              :value="item.lane_value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请输入车道限速">
          <el-input v-model="laneMaxSpeed"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isVisibleDialog = false">取 消</el-button>
        <el-button type="primary" @click="handelDialogButton">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AILabel from 'ailabel'
import {
  GetRoadList,
  GetCamerasList,
  GetAreaListByCameraId,
  GetLaneListByCameraId,
  GetEventCodeList,
  GetLaneCodeList,
  GetCamerasOneInfo,
  AddAreaObj,
  AddLaneObj,
  DelObjByAreaId,
  DelObjByLaneId,
  UpdateAreaShape,
  UpdateLaneShape
} from './api'
import Promise from 'lie'

export default {
  name: 'StagePicPage',
  data() {
    return {
      // AILabel 绘图组件相关参数
      gMap: null,
      drawingStyle: {}, // 绘制过程中样式
      getStyle: {
        'RECT': { strokeStyle: '#00f', lineWidth: 1, fillStyle: '#0f0', globalAlpha: 0.3, fill: true, stroke: true },
        'POLYGON': { strokeStyle: '#00f', lineWidth: 1, fillStyle: '#0f0', globalAlpha: 0.3, fill: true, stroke: true }
      },
      gFirstImageLayer: null, // 图片层，用于展示图片
      // 图片图层的参数
      currentImage: 'http://39.99.145.119:9002/api/draw/traffic_files/previewfile/north.png',
      imageWidth: 1920, // 图片默认值
      imageHeight: 1080,
      gFirstFeatureLayer: null, // 矢量图层（用于展示矢量图形）
      gFirstTextLayer: null, // text 文本图层，用于展示文本
      defaultTextName: '标签名称',
      // 文本显示 style
      drawingTextStyle: { fillStyle: '#F4A460', strokeStyle: '#D2691E', background: true, globalAlpha: 1, fontColor: '#0f0' },

      // 监控选择
      roadOptions: [], // 道路列表
      roadSelectValue: '',
      cameraOptions: [], // 摄像头列表
      cameraSelectValue: '',

      // 标注区域类别参数
      typeOptions: [
        { value: 'area', label: '区域' },
        { value: 'lane', label: '车道' }
      ],
      typeValue: 'area',
      isDisabledDialogForm: false,
      areaOption: [], // 区域事件
      areaSelectValue: [],
      laneOption: [], // 车道类别
      laneSelectValue: '', // 车道选择
      laneMaxSpeed: 60,
      isVisibleDialog: false, // 是否打开 dialog
      dialogInfo: {},

      markerList: [], // 标注信息列表
      tableKey: 0, // 刷新表格
      oldTableRowData: '' // 点击表格数据时，保存上次点击的值
    }
  },
  computed: {
    dialogTagName: {
      get() {
        if (this.areaSelectValue.length !== 0) {
          const areaName = this.areaOption.filter(e => e.event_value === this.areaSelectValue[0])
          // console.log('名称：', this.areaSelectValue, areaName)
          return areaName[0]['event_label'] + '等事件'
        } else if (this.laneSelectValue !== '') {
        // console.log(this.laneOption)
          const laneName = this.laneOption.filter(e => e.lane_value === this.laneSelectValue)
          return laneName[0]['lane_label'] + '，限速 ' + this.laneMaxSpeed
        }
        return '标签名称'
      },
      set(newVal) {
        return newVal
      }
    }
  },
  mounted() {
    this.initRoadCameraParams()
    this.initAILabel()
  },
  methods: {
    // 初始化交通道路和监控摄像头参数
    initRoadCameraParams() {
      // 初始化选择 监控摄像机
      GetRoadList().then(ret => {
        console.log('GetRoadList', ret)
        this.roadOptions = ret.data.records

        this.roadSelectValue = this.roadOptions[0]['road_id']
        GetCamerasList(this.roadSelectValue).then(ret => {
          this.cameraOptions = ret.data

          this.cameraSelectValue = this.cameraOptions[0]['camera_id']
          this.cameraSelectChange(this.cameraSelectValue)
        })
      })
      GetEventCodeList().then(ret => {
        console.log('GetEventCodeList', ret)
        this.areaOption = ret.data
      })
      GetLaneCodeList().then(ret => {
        console.log('GetLaneCodeList', ret)
        this.laneOption = ret.data
      })
    },
    // 初始化 AILabel 组件
    initAILabel() {
      // 创建 gMap，gMap将作为后续使用的容器实例
      this.gMap = new AILabel.Map('ailabelmap', {
        center: { x: 960, y: 540 }, // 为了让图片居中，x，y 为图片宽高的一半
        zoom: 2000, // 这个值设置成图片的宽，就可以占满整个空间
        mode: 'PAN', // 平移
        refreshDelayWhenZooming: true, // 缩放时是否允许刷新延时，性能更优
        zoomWhenDrawing: true,
        panWhenDrawing: true
      })
      // 添加矢量图层（用于展示矢量图形）
      this.gFirstFeatureLayer = new AILabel.Layer.Feature(
        'first-layer-feature', // id
        { name: '第一个矢量图层' }, // props
        { zIndex: 10 } // style
      )
      this.gMap.addLayer(this.gFirstFeatureLayer)

      // 添加 text 文本图层，用于展示文本
      this.gFirstTextLayer = new AILabel.Layer.Text(
        'first-layer-text', // id
        { name: '第一个文本图层' }, // props
        { zIndex: 12, opacity: 1 } // style
      )
      this.gMap.addLayer(this.gFirstTextLayer)

      // 添加图片层，用于展示图片
      this.gFirstImageLayer = new AILabel.Layer.Image(
        'first-layer-image', // id
        {
          src: this.currentImage,
          width: this.imageWidth,
          height: this.imageHeight,
          position: { // 左上角相对中心点偏移量
            x: 0,
            y: 0
          },
          grid: { // 3 * 3
            columns: [{ color: '#9370DB' }, { color: '#FF6347' }],
            rows: [{ color: '#9370DB' }, { color: '#FF6347' }]
          }
        }, // imageInfo
        { name: '第一个图片图层' }, // props
        { zIndex: 5 } // style
      )
      this.gMap.addLayer(this.gFirstImageLayer)

      // 绘制结束时触发
      this.gMap.events.on('drawDone', this.AILabelDrawDone)
      // 在绘制模式下双击 feature 触发选中
      this.gMap.events.on('featureSelected', this.AILabelFeatureSelected)
      // 当模式切换或单击其他地方触发
      this.gMap.events.on('featureUnselected', this.AILabelFeatureUnselected)
      // feature 编辑完成触发
      this.gMap.events.on('featureUpdated', this.AILabelFeatureUpdated)
    },
    // AILabel 绘制结束时触发
    AILabelDrawDone(type, data) {
      console.log('--AILabelDrawDone data--', type, data)
      // 绘制矩形
      if (type === 'RECT') {
        // 文本ID，删除图标的 id，矩形 ID
        const rectFeatureId = `rect-feature-id-${+new Date()}`
        const relatedTextId = `rect-label-text-id-${+new Date()}`
        const relatedDeleteMarkerId = `rect-delete-marker-id-${+new Date()}`
        // 绘制矩形 feature
        const rectFeature = new AILabel.Feature.Rect(
          rectFeatureId, // id
          data, // shape，空间信息
          { // props，props 中可以添加自己私有信息
            name: this.defaultTextName,
            textId: relatedTextId,
            deleteMarkerId: relatedDeleteMarkerId // 删除图标的id
          },
          this.drawingStyle // style，样式
        )
        this.gFirstFeatureLayer.addFeature(rectFeature)
        // 添加 文本
        const { x: ltx, y: lty } = data
        this.addLayerText(relatedTextId, this.defaultTextName, { x: ltx, y: lty })

        // 添加到表格中
        this.markerList.push({
          featureType: 'RECT',
          feature: rectFeature,
          uuid: rectFeatureId,
          name: '标签名称',
          shape: data,
          props: { // props，props 中可以添加自己私有信息
            textId: relatedTextId,
            deleteMarkerId: relatedDeleteMarkerId // 删除图标的id
          }
        })
        console.log('标注列表：', this.markerList)
      } else if (type === 'POLYGON') {
        // 多边形ID, 文本ID，删除图标的 ID
        const polygonFeatureId = `polygon-feature-id-${+new Date()}`
        const relatedTextId = `polygon-label-text-id-${+new Date()}`
        const relatedDeleteMarkerId = `polygon-delete-marker-id-${+new Date()}`
        const polygonFeature = new AILabel.Feature.Polygon(
          polygonFeatureId, // id
          { points: data }, // shape
          {
            name: '多边形矢量图形',
            textId: relatedTextId, // 这里也要添加 text 和 marker ，为了后面更新使用 id
            deleteMarkerId: relatedDeleteMarkerId // 删除图标的 id
          }, // props
          this.drawingStyle // style
        )
        this.gFirstFeatureLayer.addFeature(polygonFeature)
        // 多边形 添加 文本
        const textPosition = { x: data[0]['x'], y: data[0]['y'] }
        this.addLayerText(relatedTextId, this.defaultTextName, textPosition)

        // 添加到表格中
        this.markerList.push({
          featureType: 'POLYGON',
          feature: polygonFeature,
          uuid: polygonFeatureId,
          name: '标签名称',
          shape: { points: data },
          props: { // props，props 中可以添加自己私有信息
            textId: relatedTextId,
            deleteMarkerId: relatedDeleteMarkerId // 删除图标的id
          }
        })
        console.log('标注列表：', this.markerList)
      }
    },
    // 添加文本
    addLayerText(textId, textName, textPosition) {
      // 添加一个文本
      const gFirstText = new AILabel.Text(
        textId, // id
        { text: textName, position: textPosition, offset: { x: 0, y: 0 }},
        { name: textName }, // props
        this.drawingTextStyle
      )
      this.gFirstTextLayer.addText(gFirstText)
    },
    // 在绘制模式下双击 feature 触发选中
    AILabelFeatureSelected(feature) {
      console.log('--AILabelFeatureSelected--', feature)
      // 高亮选中 feature
      this.gMap.setActiveFeature(feature)
      if (feature.type === 'RECT') {
        // console.log('--矩形 添加删除图标 marker--')
        const markerPosition = feature.getPoints()[1]
        this.addDeleteMarker(feature, markerPosition)
      } else if (feature.type === 'POLYGON') { // 绘制多边形
        // console.log('--多边形 添加删除图标 marker--')
        const markerPosition = feature.shape.points[1]
        this.addDeleteMarker(feature, markerPosition)
      }
      // 标注列表对应项也高亮
      const item = this.markerList.find(ele => ele.uuid === feature.id)
      this.$refs['singleTable'].setCurrentRow(item)
    },
    // 添加删除marker
    addDeleteMarker(feature, markerPosition) {
      const markerId = feature.props.deleteMarkerId
      // 添加 delete-icon
      const gFirstMarker = new AILabel.Marker(
        markerId, // id
        {
          src: 'https://alioss.fuwenwei.com/img/20210916131014.png',
          position: markerPosition, // marker 位置
          offset: {
            x: -20,
            y: -4
          }
        }, // markerInfo
        { name: '删除 marker' } // props
      )
      this.gMap.markerLayer.addMarker(gFirstMarker)

      gFirstMarker.events.on('click', marker => {
        // 首先删除当前 marker
        this.gMap.markerLayer.removeMarkerById(marker.id)
        // 删除对应 text
        this.gFirstTextLayer.removeTextById(feature.props.textId)
        // 删除对应 feature
        this.gFirstFeatureLayer.removeFeatureById(feature.id)
        // 标注列表对应项也删除
        const itemIndex = this.markerList.findIndex(ele => ele.uuid === feature.id)
        const item = this.markerList.find(ele => ele.uuid === feature.id)
        this.markerList.splice(itemIndex, 1)

        // 删除数据库中的
        if (item.annoType === 'area') {
          DelObjByAreaId(item.uuid).then(ret => {
            console.log('删除区域:', ret)
            this.$message({ message: '删除区域成功', type: 'success' })
          })
        } else if (item.annoType === 'lane') {
          DelObjByLaneId(item.uuid).then(ret => {
            console.log('删除车道：', ret)
            this.$message({ message: '删除车道成功', type: 'success' })
          })
        }
      })
    },
    // 当模式切换或单击其他地方触发
    AILabelFeatureUnselected(feature) {
      console.log('--AILabelFeatureUnselected--', feature)
      // 取消高亮，移除 删除marker
      this.gMap.setActiveFeature(null)
      this.gMap.markerLayer.removeMarkerById(feature.props.deleteMarkerId)
      // 标注列表对应项也取消高亮
      this.$refs['singleTable'].setCurrentRow()
    },
    AILabelFeatureUpdated(feature, shape) {
      console.log('--FeatureUpdated--', feature, shape)
      feature.updateShape(shape)

      // 标注列表对应项也更新 shape
      const itemIndex = this.markerList.findIndex(ele => ele.uuid === feature.id)
      const item = this.markerList.find(ele => ele.uuid === feature.id)
      item.shape = shape
      this.markerList.splice(itemIndex, 1, item)

      console.log('--FeatureUpdated this.markerList item--', item)

      // 拖动图形之后，只有 shape 发生了变化，所以只需要更新数据库中的 shape就可以
      if (item.annoType === 'area') {
        UpdateAreaShape({
          area_id: item.uuid,
          shape: JSON.stringify(item.shape.points || item.shape)
        }).then(res => {
          console.log('更新区域 shape', res)
          this.$message({ message: '更新 shape 成功', type: 'success' })
        })
      } else if (item.annoType === 'lane') {
        UpdateLaneShape({
          lane_id: item.uuid,
          shape: JSON.stringify(item.shape.points || item.shape)
        }).then(res => {
          console.log('更新车道 shape', res)
          this.$message({ message: '更新 shape 成功', type: 'success' })
        })
      }

      const deleteMarkerId = feature.props.deleteMarkerId
      const textId = feature.props.textId

      if (feature.type === 'RECT') {
        // console.log('---更新矩形---')
        // 更新marker位置
        const targetMarker = this.gMap.markerLayer.getMarkerById(deleteMarkerId)
        // console.log('--targetMarker--', targetMarker)
        targetMarker.updatePosition(feature.getPoints()[1])
        // 更新text位置
        const targetText = this.gFirstTextLayer.getTextById(textId)
        // console.log('--targetText--', targetText)
        targetText.updatePosition(feature.getPoints()[0])
      } else if (feature.type === 'POLYGON') {
        // console.log('---更新多边形---')
        // 更新删除图标 marker 的位置
        const targetMarker2 = this.gMap.markerLayer.getMarkerById(deleteMarkerId)
        // console.log('---targetMarker2---', targetMarker2)
        targetMarker2.updatePosition(feature.shape.points[1])
        // 更新 text 的位置
        const targetText = this.gFirstTextLayer.getTextById(textId)
        // console.log('--targetText--', targetText)
        targetText.updatePosition(feature.shape.points[0])
      }
    },
    // 选择道路，获取道路的监控摄像机列表
    roadSelectChange(road_id) {
      // console.log('选中：', road_id)
      GetCamerasList(road_id).then(ret => {
        this.cameraOptions = ret.data
      })
    },
    // 选择监控摄像机，获取监控摄像机图片地址
    cameraSelectChange(camera_id) {
      GetCamerasOneInfo(camera_id).then(ret => {
        // console.log('选中监控摄像机：', ret)
        this.currentImage = ret.data.camera_original_image_url
        console.log('选中监控摄像机 currentImage：', this.currentImage)

        // 在切换摄像机之后，要销毁之前的 gMap 绘图层，重新初始化
        // console.log('this.gMap 销毁前：', this.gMap)
        this.gMap && this.gMap.destroy()
        // console.log('this.gMap 销毁后：', this.gMap)
        this.initAILabel()
        // console.log('this.gMap 销毁后 重新初始化：', this.gMap)
        this.GetAreaLaneListByCameraId(camera_id)
      })
    },
    // 获取标注好的区域和车道的信息
    GetAreaLaneListByCameraId(camera_id) {
      Promise.all([
        GetAreaListByCameraId(camera_id),
        GetLaneListByCameraId(camera_id)
      ]).then(([res1, res2]) => {
        console.log('res1, res2 摄像机区域监控：', res1, res2)

        const areaList = res1.data.map((ele) => {
          const props = JSON.parse(ele.props)
          let feature = null
          let shape = ''
          if (props.featureType === 'RECT') {
            const gFirstFeatureRect = new AILabel.Feature.Rect(
              ele.area_id, // id
              JSON.parse(ele.pixel_coordinates), // shape
              {
                name: ele.area_name,
                textId: props.textId,
                deleteMarkerId: props.deleteMarkerId
              }, // props
              this.getStyle['POLYGON']
            )
            this.gFirstFeatureLayer.addFeature(gFirstFeatureRect)
            // 矩形 添加 文本
            const textPosition = { x: JSON.parse(ele.pixel_coordinates)['x'], y: JSON.parse(ele.pixel_coordinates)['y'] }
            this.addLayerText(props.textId, ele.area_name, textPosition)
            feature = gFirstFeatureRect
            shape = JSON.parse(ele.pixel_coordinates)
          }
          if (props.featureType === 'POLYGON') {
            // 绘制多边形
            const gFirstFeaturePolygon = new AILabel.Feature.Polygon(
              ele.area_id, // id
              { points: JSON.parse(ele.pixel_coordinates) }, // shape
              {
                name: ele.area_name,
                textId: props.textId,
                deleteMarkerId: props.deleteMarkerId
              }, // props
              this.getStyle['POLYGON'] // style
            )
            this.gFirstFeatureLayer.addFeature(gFirstFeaturePolygon)
            // 多边形 添加 文本
            const textPosition = { x: JSON.parse(ele.pixel_coordinates)[0]['x'], y: JSON.parse(ele.pixel_coordinates)[0]['y'] }
            this.addLayerText(props.textId, ele.area_name, textPosition)

            feature = gFirstFeaturePolygon
            shape = { points: JSON.parse(ele.pixel_coordinates) }
          }

          return {
            featureType: props.featureType,
            feature: feature,
            annoType: 'area',
            uuid: ele.area_id,
            name: ele.area_name,
            number: ele.area_number,
            camera_id: ele.camera_id,
            event_list: ele.event_list,
            shape: shape,
            props: { // props，props 中可以添加自己私有信息
              textId: props.textId,
              deleteMarkerId: props.deleteMarkerId // 删除图标的id
            }
          }
        })
        console.log('--areaList--', areaList)

        const laneList = res2.data.map((ele, index) => {
          const props = JSON.parse(ele.props)
          let feature = null
          let shape = ''
          if (props.featureType === 'RECT') {
            const gFirstFeatureRect = new AILabel.Feature.Rect(
              ele.lane_id, // id
              JSON.parse(ele.pixel_coordinates), // shape
              {
                name: ele.lane_name,
                textId: props.textId,
                deleteMarkerId: props.deleteMarkerId
              }, // props
              this.getStyle['POLYGON']
            )
            this.gFirstFeatureLayer.addFeature(gFirstFeatureRect)
            // 矩形 添加 文本
            const textPosition = { x: JSON.parse(ele.pixel_coordinates)['x'], y: JSON.parse(ele.pixel_coordinates)['y'] }
            this.addLayerText(props.textId, ele.lane_name, textPosition)
            feature = gFirstFeatureRect
            shape = JSON.parse(ele.pixel_coordinates)
          }
          if (props.featureType === 'POLYGON') {
            // 绘制多边形
            const gFirstFeaturePolygon = new AILabel.Feature.Polygon(
              ele.lane_id, // id
              { points: JSON.parse(ele.pixel_coordinates) }, // shape
              {
                name: ele.lane_name,
                textId: props.textId,
                deleteMarkerId: props.deleteMarkerId
              }, // props
              this.getStyle['POLYGON'] // style
            )
            this.gFirstFeatureLayer.addFeature(gFirstFeaturePolygon)
            // 多边形 添加 文本
            const textPosition = { x: JSON.parse(ele.pixel_coordinates)[0]['x'], y: JSON.parse(ele.pixel_coordinates)[0]['y'] }
            this.addLayerText(props.textId, ele.lane_name, textPosition)

            feature = gFirstFeaturePolygon
            shape = { points: JSON.parse(ele.pixel_coordinates) }
          }

          return {
            featureType: props.featureType,
            feature: feature,
            annoType: 'lane',
            uuid: ele.lane_id,
            name: ele.lane_name,
            number: ele.lane_number,
            camera_id: ele.camera_id,
            lane_direction: ele.lane_direction,
            max_speed: ele.max_speed,
            shape: shape,
            props: { // props，props 中可以添加自己私有信息
              textId: props.textId,
              deleteMarkerId: props.deleteMarkerId // 删除图标的id
            }
          }
        })
        console.log('--laneList--', laneList)
        this.markerList = [...areaList, ...laneList]

        this.$message({ message: '获取成功', type: 'success' })
      })
    },
    tableRowClick(row, column) {
      // 如果当前行的 uuid 不等于 上次点击行的 uuid ，则取消上次的高亮和marker
      if (this.oldTableRowData !== '' && row.uuid !== this.oldTableRowData.uuid) {
        // 取消高亮，移除 删除marker
        this.gMap.setActiveFeature(null)
        this.gMap.markerLayer.removeMarkerById(this.oldTableRowData.feature.props.deleteMarkerId)
      }
      // 取消上次的高亮之后，再次高亮当前的 feature
      // 高亮选中 feature
      this.gMap.setActiveFeature(row.feature)
      if (row.featureType === 'RECT') {
        // console.log('--矩形 添加删除图标 marker--')
        const markerPosition = row.feature.getPoints()[1]
        this.addDeleteMarker(row.feature, markerPosition)
      } else if (row.featureType === 'POLYGON') { // 绘制多边形
        // console.log('--多边形 添加删除图标 marker--')
        const markerPosition = row.feature.shape.points[1]
        this.addDeleteMarker(row.feature, markerPosition)
      }
      this.oldTableRowData = row
    },
    // 改变标注类型
    changeAnnoType() {
      this.isDisabledDialogForm = !this.isDisabledDialogForm
      this.areaSelectValue = []
      this.laneSelectValue = ''
    },
    handleEdit(row) {
      console.log('编辑图层：', row)
      this.dialogInfo = row

      this.typeValue = this.dialogInfo['annoType'] || 'area'
      this.areaSelectValue = this.dialogInfo['event_list'] || []
      this.laneSelectValue = this.dialogInfo['lane_direction'] || ''
      this.laneMaxSpeed = this.dialogInfo['max_speed'] || 60
      this.isDisabledDialogForm = !(this.typeValue === 'area')
      this.dialogInfo['positionData'] = row.shape
      this.dialogTagName = this.dialogInfo['name']
      console.log('查看 this.dialogInfo', this.dialogInfo)

      this.isVisibleDialog = true
    },
    // // 在每次编辑完 dialog 后，把处理结果保存到对应的列表中
    handelDialogButton() {
      console.log('handelDialogButton')
      // 更新 markerList 列表
      if (this.typeValue === 'area') {
        const itemIndex = this.markerList.findIndex(ele => ele.uuid === this.dialogInfo.uuid)
        const item = this.markerList.find(ele => ele.uuid === this.dialogInfo.uuid)
        item['name'] = this.dialogTagName
        item['event_list'] = this.areaSelectValue
        item['annoType'] = this.typeValue
        this.markerList.splice(itemIndex, 1, item)
        console.log('区域标注：', item, this.markerList)
      }
      if (this.typeValue === 'lane') {
        const itemIndex = this.markerList.findIndex(ele => ele.uuid === this.dialogInfo.uuid)
        const item = this.markerList.find(ele => ele.uuid === this.dialogInfo.uuid)
        item['name'] = this.dialogTagName
        item['lane_direction'] = this.laneSelectValue
        item['max_speed'] = this.laneMaxSpeed
        item['annoType'] = this.typeValue
        this.markerList.splice(itemIndex, 1, item)
        console.log('车道标注：', item, this.markerList)
      }

      if (this.dialogInfo.featureType === 'RECT') {
        // 删除 旧文本，再添加新文本
        this.gFirstTextLayer.removeTextById(this.dialogInfo.props.textId)
        const textPosition = { x: this.dialogInfo.shape['x'], y: this.dialogInfo.shape['y'] }
        this.addLayerText(this.dialogInfo.props.textId, this.dialogTagName, textPosition)
      } else if (this.dialogInfo.featureType === 'POLYGON') {
        // 删除 旧文本，再添加新文本
        this.gFirstTextLayer.removeTextById(this.dialogInfo.props.textId)
        const textPosition = { x: this.dialogInfo.shape.points[0]['x'], y: this.dialogInfo.shape.points[0]['y'] }
        this.addLayerText(this.dialogInfo.props.textId, this.dialogTagName, textPosition)
      }
      this.$message({ message: '编辑成功', type: 'success' })
      this.isVisibleDialog = false
      this.uploadAreaLaneData(this.dialogInfo)
    },
    // 删除按钮
    handleDelete(row) {
      console.log('列表删除：', row)
      // 首先删除当前 marker
      this.gMap.markerLayer.removeMarkerById(row.props.deleteMarkerId)
      // 删除对应 text
      this.gFirstTextLayer.removeTextById(row.props.textId)
      // 删除对应 feature
      this.gFirstFeatureLayer.removeFeatureById(row.feature.id)
      // 标注列表对应项也删除
      const itemIndex = this.markerList.findIndex(ele => ele.uuid === row.uuid)
      this.markerList.splice(itemIndex, 1)

      // 删除数据库中的
      if (row.annoType === 'area') {
        DelObjByAreaId(row.uuid).then(ret => {
          console.log('删除区域:', ret)
          this.$message({ message: '删除区域成功', type: 'success' })
        })
      } else if (row.annoType === 'lane') {
        DelObjByLaneId(row.uuid).then(ret => {
          console.log('删除车道：', ret)
          this.$message({ message: '删除车道成功', type: 'success' })
        })
      }
    },
    uploadAreaLaneData(areaLaneData) {
      console.log('上传：', areaLaneData)
      let shapeData = ''
      if (areaLaneData.featureType === 'RECT') {
        shapeData = JSON.stringify(areaLaneData.shape)
      } else if (areaLaneData.featureType === 'POLYGON') {
        shapeData = JSON.stringify(areaLaneData.shape.points)
      }

      if (areaLaneData.annoType === 'area') {
        const uploadAreaData = {
          'area_id': areaLaneData.uuid,
          'area_name': areaLaneData.name,
          'area_number': 0,
          'camera_id': this.cameraSelectValue,
          'event_list': areaLaneData.event_list,
          'pixel_coordinates': shapeData,
          'props': JSON.stringify({
            ...areaLaneData.props,
            featureType: areaLaneData.featureType
          })
        }

        AddAreaObj(uploadAreaData).then(ret => {
          console.log('area 上传结果：', ret)
          // this.$message({ message: '上传成功', type: 'success' })
        })
      }
      if (areaLaneData.annoType === 'lane') {
        const uploadLaneData = {
          'lane_id': areaLaneData.uuid,
          'lane_name': areaLaneData.name,
          'lane_number': 0,
          'camera_id': this.cameraSelectValue,
          'lane_direction': areaLaneData.lane_direction,
          'max_speed': areaLaneData.max_speed,
          'pixel_coordinates': shapeData,
          'props': JSON.stringify({
            ...areaLaneData.props,
            featureType: areaLaneData.featureType
          })
        }

        AddLaneObj(uploadLaneData).then(ret => {
          console.log('lane 上传结果：', ret)
          // this.$message({ message: '上传成功', type: 'success' })
        })
      }
    },
    setMode(mode) {
      this.gMap.setMode(mode)
      // 后续对应模式处理
      switch (this.gMap.mode) {
        case 'PAN': {
          break
        }
        case 'RECT': {
          this.drawingStyle = { strokeStyle: '#00f', lineWidth: 1, fillStyle: '#0f0', globalAlpha: 0.3, fill: true, stroke: true }
          this.gMap.setDrawingStyle(this.drawingStyle)
          break
        }
        case 'POLYGON': {
          this.drawingStyle = { strokeStyle: '#00f', fillStyle: '#0f0', globalAlpha: 0.3, lineWidth: 1, fill: true, stroke: true }
          this.gMap.setDrawingStyle(this.drawingStyle)
          break
        }
        default:
          break
      }
    }
  }
}
</script>

<style>
.app-container {
  height: 90vh;
  padding: 24px 20px 20px;
}
#ailabelmap {
  overflow: hidden;
  position: relative;
  height: 500px;
  margin-bottom: 10px;
  border: 1px dashed #ccc;
}
.mytable {
  border: solid 1px #E4E7ED;
  height: 500px;
}
.mytable .el-table .cell {
  padding-right: 0px;
}
.headerinfo {
  padding: 15px;
  line-height: 28px;
  border-bottom: solid 1px #E4E7ED;
}
.mydivider {
  margin-top: 0px;
}
.mydialog .el-dialog__body {
  padding-top: 15px;
  padding-bottom: 0px;
}
</style>
