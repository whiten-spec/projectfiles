<template>
  <div class="htmlcontent">
      <div class="htmlcontentContent">
        <el-table 
          :data="currentData"
          style="width: 100%"
          stripe
          border>
              <el-table-column prop="name" label="名稱"  :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="language" label="語言"  :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="操作"  align="center">
                  <template slot-scope="scope">
                    <div class="tableBtnBox">
                      <el-button @click='detail(scope.row)' type="primary" icon="el-icon-document" size="small">詳情</el-button>
                      <el-button @click='edit(scope.row)' type="info" icon="el-icon-edit" size="small">編輯</el-button>
                    </div>
                  </template>
              </el-table-column>
          </el-table>
          <div class="foot">
              <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="10"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="dataCount">
              </el-pagination>
            </div>
      </div>

        <div v-if="showContent" style="background:red;">
           <el-dialog :close-on-click-modal="false" :close-on-press-escape="false"
            :visible.sync="showContent"
            width="70%"
            :before-close="getBackEditData">
              <htmlcontent-edit v-if="showContent" :htmlcontentModel="editData" :editTitle="editComponentTitle" @backEdit="getBackEditData" @addSuccess="addSuccess" 
                  :isShowDetail="isShowDetail" :operateType="operateType" ></htmlcontent-edit>
            </el-dialog>
        </div>
      
  </div>
</template>
<script>
import htmlcontentEdit from './htmlcontent-edit.vue';

export default {
  name: 'htmlcontent',
  components:{
    'htmlcontent-edit': htmlcontentEdit,
  },
  props: {
  },
  data: function() {
    return {
      data: [],
      showContent: false,
      isShowDetail: Boolean,
      editData: {},
      editComponentTitle: '添加',

      dataCount: 0,
      currentPage: 0,
      pageSize: 10,
      currentData: [],
      showBtns: false,
      operateType: 'add',

    }
  },
  methods: {
    handleSizeChange(val) {
        this.pageSize = val;
        this.handleCurrentChange(null);
    },
    handleCurrentChange(val) {
        if(val) {
            this.currentPage = val;
        }
        let start = this.pageSize * (this.currentPage - 1);
        this.currentData = this.data.slice(start, start + this.pageSize);
    },
    reset() {
      this.searchJson = {};
      this.search();
    },
    detail(data){
      this.editData = data;
      this.editComponentTitle = '詳細訊息';
      this.operateType = 'detail';
      this.showContent = true;
      this.isShowDetail = true;
      
    },
    edit(data){
      this.editComponentTitle = '編輯';
      this.operateType = 'edit';
      this.showContent = true;
      this.isShowDetail = false;
      this.editData = data;
    },
    addSuccess(res) {
        this.search();
    },
    getBackEditData() {
      this.showContent = false;
    },
    search(){  
        this.initData(window.volConfig.volUrl + 'sys/htmlcontent/list');
    },
    async initData(url,param){
        this.$axios.get(url).then(res => {
          this.data = res.data.data;
          this.currentPage = 1;
          this.dataCount = this.data.length;
          this.handleCurrentChange(null);
        });
    },
    async initDic(){
    }
    
  },
  mounted() {
    setTimeout(()=>{
      this.initDic();
      this.search();
    },100);
  }
}

</script>
<style lang="scss" scoped>
  .htmlcontent {
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
  .htmlcontentContent {
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
      min-height: 60px;
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

