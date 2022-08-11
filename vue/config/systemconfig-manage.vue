<template>
  <div class="systemconfig">
      <div class="systemconfigContent">
        <el-table 
          :data="currentData"
          style="width: 100%"
          stripe
          border>
              <el-table-column prop="code" label="配置名稱"  :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="content" label="配置描述"  :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="value" label="配置值"  :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="unit" label="配置單位"  :show-overflow-tooltip="true"></el-table-column>
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

        <div v-if="showEditComponent">
            <el-dialog :close-on-click-modal="false" :close-on-press-escape="false"
            :visible.sync="showEditComponent"
            width="70%"
            :before-close="getBackEditData">
              <systemconfig-edit v-if="showEditComponent" :systemconfigModel="editData" :editTitle="editComponentTitle" @backEdit="getBackEditData" @addSuccess="addSuccess" 
                  :isShowDetail="isShowDetail" systemconfigType="2" :operateType="operateType" ></systemconfig-edit>
            </el-dialog>
        </div>
      
  </div>
</template>
<script>
import systemconfigEdit from './systemconfig-edit';

export default {
  name: 'systemconfig',
  components:{
    'systemconfig-edit': systemconfigEdit,
  },
  props: {
  },
  data: function() {
    return {
      data: [],
      showEditComponent: false,
      isShowDetail: Boolean,
      editData: {},
      editComponentTitle: '添加訊息',

      searchJson: {
        name: ''
      },
      dataCount: 0,
      currentPage: 0,
      pageSize: 10,
      currentData: [],
      showBtns: false,
      operateType: 'add',

    }
  },
  methods: {
    formatDate(row, column) {
        return StaticDic.tableDateDataFormat(row, column);
    },
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
    deleteSingle(data) {
      this.$confirm('是否刪除?', '刪除', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get(window.volConfig.volUrl + 'systemconfig/delete/' + data.id).then(res => {
          if (res.data.success) {
            this.search();
            this.$message({
              type: 'success',
              message: '刪除成功',
            });
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '刪除已取消',
        });
      });
    },
 
    add(){
      this.editComponentTitle = '添加配置';
      this.operateType = 'add';
      this.showEditComponent = true;
      this.isShowDetail = false;
      this.editData = new Object();
    },
    detail(data){
      console.log(data);
      this.editComponentTitle = '詳細訊息';
      this.operateType = 'detail';
      this.showEditComponent = true;
      this.isShowDetail = true;
      this.editData = data;
    },
    edit(data){
      this.editComponentTitle = '編輯配置';
      this.operateType = 'edit';
      this.showEditComponent = true;
      this.isShowDetail = false;
      this.editData = data;
    },
    addSuccess(res) {
        this.search();
        this.showEditComponent = false;
    },
    getBackEditData() {
      this.showEditComponent = false;
    },
    search(){  
        this.searchJson.type = '2';   
        this.initData(window.volConfig.volUrl + 'sys/config/list',this.searchJson);
    },
    async initData(url,param){
        this.$axios.post(url, param).then(res => {
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
  .systemconfig {
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
  .systemconfigContent {
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
      min-height: 50px;
      max-height: 143px;
    }
    /deep/ .el-table__body-wrapper {
      display: block;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }

  .btnBox {
      margin-bottom: 10px;
      text-align: right;
  }
</style>

