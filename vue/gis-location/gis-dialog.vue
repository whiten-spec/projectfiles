<template>
  <div id="gisContainer">
    <div class="popup_style" id="gisHead">
      <p style="float: left;margin-left: 9px;margin-top: 3px;color:#00785e;"><i class="el-icon-location"></i>位置選擇</p>
      <i class="el-icon-close" id="closeId" style="cursor: pointer;color:#00785e;"></i>
    </div>
    <div class="Boder">
      <div id="map_small"></div>
    </div>
  </div>
</template>
<script>
export default {
    name: 'gisDialog',
}
</script>
<style>
#gisHead {
  background-image: url('../../themes/img/bg/banner_bg.png');
  background-size: 100% 100%;
}
#gisContainer {
  position: absolute;
  z-index: 9999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 800px;
  max-width: 1304px;
  min-width: 1000px;
  width: 80%;
  border: 1px;
  max-height: 800px;
  /* display: block; */
  visibility: hidden;
}
.popup_style {
  background-color: #009688;
  color: #eee;
  height: 39px;
  line-height: 36px;
}
.popup_style > i {
  font-weight: normal;
  font-size: 22px;
  line-height: 36px;
  float: right;
  padding-right: 4px;
  color: #eee;
}
.language li {
  border-radius: 5px;
}
</style>

