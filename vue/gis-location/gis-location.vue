
<template>
</template>
<script>

export default {
  name: "gisLocation",
  props: {
    source: {
      type: String
    },
  },
  data: function () {
    return {
      locationPoint: null,
      showpointLayer: null,
      tooltipLayer: null
    };
  },
  methods: {
    gisLocationshow(x, y, text) {
      if ($("#gisContainer").css("visibility") == "hidden") {
        $("#gisContainer").css("visibility", "visible");
      } else {
        $("#gisContainer").css("visibility", "hidden");
      }
      $("#closeId").on("click", this.closeGis);
      if (this.showpointLayer) {
        this.showpointLayer.clear();
      } else {
        this.showpointLayer = G.utils.LayerUtil.getLayerById(
          window.myMap,
          "plot-layer"
        );
      }
      let point = null;
      point = new g2.geom.Point({
        x: x,
        y: y,
        spatialReference: myMap.getMap().SpatialReference
      });
      myMap.setCenter(point);
      myMap.zoomTo(13);

      if (this.tooltipLayer) {
        this.tooltipLayer.clear();
      } else {
        this.tooltipLayer = new g2.ext.TooltipWare({
          map: myMap
        });
      }
      let xy = this.locationPoint.mapX.toFixed(6) + ',' + this.locationPoint.mapY.toFixed(6)
      let streetInfo = "<select disabled='true' style='width: 450px;margin-left: 10px;height: 30px;'><option value='1'>" + text.split('  ')[0] + "</option></select>";
      let buildingInfo = " <select disabled='true' style='width: 450px;margin-left: 10px;height: 30px;'><option value='2'>" + text.split('  ')[1] + "</option></select>"
      var contentTemplate =
        '<div class="contentTemplate" style="opacity:0.80;height:220px;width:550px;background-color: white;padding: 10px;border-radius:5px;cursor:default">' +
        '<div id="addressText" style="white-space: nowrap;overflow:hidden;text-overflow:ellipsis;padding: 0 20px;height: 60%;margin-top: 10px;" >' +
        "<span style='float: left;height: 45px;display: flex;'><div >街道</div>" + streetInfo + "</span>" +
        "<span style='float: left;height: 45px;display: flex;'><div >地點</div>" + buildingInfo + "</span>" +
        "<span style='float: left;height: 45px;display: flex;'><div style='margin:0 10px 0 -20px;'>經緯度</div>" + xy + "</span>" +
        '</div>' +
        '</div>'

      var tooltip = new g2.ext.Tooltip({
        anchor: point, //提示在地图上停靠位置
        content: contentTemplate, //提示内容
        layerId: "get-point", //提示所在图层ID
        offset: [-142, 3] //位置偏移量
      });
      if (this.tooltipLayer) {
        this.tooltipLayer.add(tooltip);
      }

    },
    gisLocation() {
      if ($("#gisContainer").css("visibility") == "hidden") {
        $("#gisContainer").css("visibility", "visible");
      } else {
        $("#gisContainer").css("visibility", "hidden");
      }
      $("#closeId").on("click", this.closeGis);
      if (this.showpointLayer) {
        this.showpointLayer.clear();
      } else {
        this.showpointLayer = G.utils.LayerUtil.getLayerById(
          window.myMap,
          "plot-layer"
        );
      }
      if (this.tooltipLayer) {
        this.tooltipLayer.clear();
      } else {
        this.tooltipLayer = new g2.ext.TooltipWare({
          map: myMap
        });
      }
      if (myMap) {
        myMap.off("click", this.clickListener);
      }
      if (myMap) {
        myMap.on("click", this.clickListener);
        var point = new g2.geom.Point({
          x: parseFloat("113.551784"),
          y: parseFloat("22.169403"),
          spatialReference: myMap.spatialReference
        });
        myMap.setCenter(point);
        myMap.zoomTo(13);
      }
    },
    closeGis() {
      if (this.showpointLayer) {
        this.showpointLayer.clear();
      }
      if (this.tooltipLayer) {
        this.tooltipLayer.clear();
      }
      this.showpointLayer = null;
      this.tooltipLayer = null;
      $("#gisContainer").css("visibility", "hidden");
    },
    // 绑定点击事件
    clickListener: function (data) {
      this.locationPoint = data;
      if (this.tooltipLayer) {
        this.tooltipLayer.clear();
      }
      var point1 = new g2.geom.Point({
        x: data.mapX,
        y: data.mapY,
        spatialReference: myMap.getMap().SpatialReference
      });
      let json = {
        longitude: this.locationPoint.mapX,
        latitude: this.locationPoint.mapY,
        distance: 300
      }

      let xy = this.locationPoint.mapX.toFixed(6) + ',' + this.locationPoint.mapY.toFixed(6)
      let streetInfo = "<select id='streetSelect' style='width: 450px;margin-left: 10px;height: 30px;'><option value =''>請選擇</option></select>";
      let buildingInfo = "<select id='buildingSelect' style='width: 450px;margin-left: 10px;height: 30px;'><option value =''>請選擇</option></select>";
      this.$axios.post(window.volConfig.volUrl + '/dict/getNearbyStreetByDistance', json).then(result => {
        if (result.data.data && result.data.data.length > 0) {
          let str = ''
          result.data.data.forEach(element => {
            if (element.name && element.name !== ' ') {
              str += "<option value ='" + element.id + "'>" + element.name + "</option>"
            }
          });
          streetInfo = "<select id='streetSelect' style='width: 450px;margin-left: 10px;height: 30px;'>" + str + "</select>";
        }
      })
      this.$axios.post(window.volConfig.volUrl + '/dict/getNearbyBuildingByDistance', json).then(result => {
        if (result.data.data && result.data.data.length > 0) {
          let str = ''
          result.data.data.forEach(element => {
            if (element.name && element.name !== ' ') {
              str += "<option value ='" + element.id + "'>" + element.name + "</option>"
            }
          });
          buildingInfo = "<select id='buildingSelect' style='width: 450px;margin-left: 10px;height: 30px;'>" + str + "</select>";
        }
      })
      setTimeout(() => {
        var contentTemplate =
          '<div class="contentTemplate" style="opacity:0.80;height:220px;width:550px;background-color: white;padding: 10px;border-radius:5px;cursor:default">' +
          '<div id="addressText" style="white-space: nowrap;overflow:hidden;text-overflow:ellipsis;padding: 0 20px;height: 60%;margin-top: 10px;" >' +
          "<span style='float: left;height: 45px;display: flex;'><div >街道</div>" + streetInfo + "</span>" +
          "<span style='float: left;height: 45px;display: flex;'><div >地點</div>" + buildingInfo + "</span>" +
          "<span style='float: left;height: 45px;display: flex;'><div style='margin:0 10px 0 -20px;'>經緯度</div>" + xy + "</span>" +
          '</div><div style="text-align: center;margin: 10px 0"><button style="cursor: pointer;" id="pointMapOk">確認</button><button style="margin-left:10px;cursor: pointer;" id="pointMapCancle">取消</button></div>' +
          "</div>";
        var tooltip = new g2.ext.Tooltip({
          anchor: point1, //提示在地图上停靠位置
          content: contentTemplate, //提示内容
          layerId: "get-point", //提示所在图层ID
          offset: [-142, 3] //位置偏移量
        });
        if (this.tooltipLayer) {
          this.tooltipLayer.add(tooltip);
        }
        $("#pointMapOk").on("click", this.pointMapOk);
        $("#pointMapCancle").on("click", this.pointMapCancle);
      }, 500);

    },
    pointMapCancle() {
      this.locationPoint = null;
      this.showpointLayer.clear();
      this.tooltipLayer.clear();
      //this.closeGis();
    },
    pointMapOk() {
      let json = {
        longitude: this.locationPoint.mapX.toFixed(6),
        latitude: this.locationPoint.mapY.toFixed(6),
        streetText: $('#streetSelect option:selected').text(),
        buildingText: $('#buildingSelect option:selected').text()
      }
      if (!$('#streetSelect option:selected').val()) {
        json.streetText = ''
      }
      if (!$('#buildingSelect option:selected').val()) {
        json.buildingText = ''
      }
      this.$emit("backAddr", json);
      this.closeGis();
    },
    loadJS( url, callback ){
      let  script = document.createElement('script'),
      fn = callback || function(){};
      script.type = 'text/javascript';
      //IE
      if(script.readyState){
          script.onreadystatechange = function(){
              if( script.readyState == 'loaded' || script.readyState == 'complete' ){
                  script.onreadystatechange = null;
                  fn();
              }
          };
      }else{
          //其他浏览器
          script.onload = ()=>{
              fn();
          };
          script.onerror=()=>{
            console.log("加载错误");
            fn();
          }
      }
      script.src = url;
      document.getElementsByTagName('head')[0].appendChild(script);
    }
  },
  mounted() {
    window.localStorage.setItem('map_type' , '0');
    // requirejs(['static/deps/index.js'])
    this.loadJS('static/deps/index.js');
  }
};
</script>