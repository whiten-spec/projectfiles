<template>
  <div class="dicthonorlevel">
      <div class="searchBox" v-if="false">
          <el-button @click='search' icon="el-icon-search" type="primary" size="small">搜索</el-button>
      </div>
      <div class="dicthonorlevelContent">
          <el-table 
            :data="data"
            style="width: 100%"
            stripe
            border>
                <el-table-column prop="name" label="活動類型" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="score" label="係數" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="updatorName" label="設置人"  :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="updateTime" label="設置時間"  :show-overflow-tooltip="true" :formatter="formatDate" ></el-table-column>
                <el-table-column prop="note" label="備注"  :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button @click='detail(scope.row)' type="primary" icon="el-icon-document" size="small">詳情</el-button>
                        <el-button @click='edit(scope.row)' type="info" icon="el-icon-edit" size="small">編輯</el-button>
                  </template>
                </el-table-column>
            </el-table>
      </div>
      <div v-if="showEditComponent">
          <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" height="100%"
          :visible.sync="showEditComponent" :title="editComponentTitle"
          width="30%"
          :before-close="getBackEditData">
              <honorleveledit v-if="showEditComponent" :dicthonorlevelModel="editData" @backEdit="getBackEditData" @onSuccess="onSuccess" 
                  :isShowDetail="isShowDetail" :operateType="operateType" >
              </honorleveledit>
          </el-dialog>
      </div>
  </div>
</template>
<script>
import honorleveledit from './honorlevel-edit.vue';
import StaticDic from '../../common/static/infoDic'
export default {
  name: 'honorlevelmanager',
  components:{
    'honorleveledit': honorleveledit,
  },
  props: {
  },
  data: function() {
    return {
      data: [],
      showEditComponent: false,
      isShowDetail: Boolean,
      editData: {},
      editComponentTitle: '添加',

      showBtns: false,
      operateType: 'add',
    }
  },
  methods: {
    formatDate(row, column) {
      return StaticDic.tableDateDataFormat(row, column);
    },
    detail(data){
      this.editComponentTitle = '詳細訊息';
      this.operateType = 'detail';
      this.showEditComponent = true;
      this.isShowDetail = true;
      this.editData = data;
    },
    edit(data){
      this.editComponentTitle = '編輯';
      this.operateType = '2';
      this.showEditComponent = true;
      this.isShowDetail = false;
      this.editData = data;
    },
    getBackEditData() {
      this.showEditComponent = false;
    },
    onSuccess(res) {
        this.search();
    },
    search(){  
        this.searchJson={} 
        this.initData(window.volConfig.volUrl + 'dict/volunteerLevel',this.searchJson);
    },
    async initData(url,param){
        this.$axios.post(url, param).then(res => {
          this.data = res.data.data;
        });
    },
  },
  mounted() {
    this.search();
  },
  create(){

  }
}

</script>
<style lang="scss" scoped>
  .dicthonorlevel {
    padding: 10px;
    height: 95%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background-color: #fff;
  }
  .searchBox {
    height: 50px;
    padding: 0 0 10px 0;
  }
  .dicthonorlevelContent {
    padding-top: 10px;
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
    /deep/ .el-table{
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      flex: 1;

    }

    /deep/ .el-table__header-wrapper {
      min-height: 40px;
      max-height: 143px;
    }
    /deep/ .el-table__body-wrapper {
      display: block;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
  .tableBtnBox {
    text-align: center;
    .el-button{ 
      margin: 5px 0;
    }
    button {
      width: 137px;
    }
  }
  .btnBox {
      margin-bottom: 10px;
      text-align: right;
  }
</style>

