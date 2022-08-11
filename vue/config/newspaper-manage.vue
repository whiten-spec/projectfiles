<template>
  <div style="overflow-y: auto; height: 100%">
    <div class="reward" v-if="!showEditComponent">
      <div>
        <el-button style="float:right" @click='add' icon="el-icon-plus" type="success" size="small">添加</el-button>
      </div>
      <div class="rewardContent">
        <el-table
            :data="currentData"
            style="width: 100%"
            stripe
            border>
          <el-table-column prop="title" label="標題" width="480px" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="uploadTime" label="上傳時間" width="200px" :formatter="formatDate"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="leftImage" label="主題圖" width="145px" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <img @click="previewImg(scope.row.leftImage)" :src="mongoServiceUrl+'/'+scope.row.leftImage" alt=""/>
            </template>
          </el-table-column>
          <el-table-column prop="section" label="主題內容" width="690px" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div class="tableBtnBox">
                <el-button @click='detail(scope.row)' type="primary" icon="el-icon-document" size="small">詳情</el-button>
                <el-button @click='edit(scope.row)' type="info" icon="el-icon-edit" size="small">編輯</el-button>
                <el-button @click="deleteSingle(scope.row)" type="danger" icon="el-icon-delete" size="small">刪除
                </el-button>
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
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img :src="dialogImgUrl" width="100%" alt="" />
    </el-dialog>
    <div v-if="showEditComponent" style="height: 100%">
      <newspaper-edit v-if="showEditComponent" ref="newspaperEdit" :displayModel="editData"
                      :editTitle="editComponentTitle" @backEdit="getBackEditData" @addSuccess="addSuccess"
                      :isShowDetail="isShowDetail" :operateType="operateType"></newspaper-edit>
    </div>

  </div>
</template>
<script>
import newspaperEdit from './newspaper-edit';
import StaticDic from '../../common/static/infoDic'

export default {
  name: 'newspaper-manage',
  components: {
    'newspaper-edit': newspaperEdit,
  },
  props: {},
  data: function () {
    return {
      data: [],
      showEditComponent: false,
      isShowDetail: Boolean,
      editData: {},
      editComponentTitle: '添加新聞稿',

      searchJson: {},
      dataCount: 0,
      currentPage: 0,
      pageSize: 10,
      currentData: [],
      showBtns: false,
      operateType: 'add',
      mongoServiceUrl: window.volConfig.mongoServiceUrl,
      dialogVisible: false,
      dialogImgUrl: ''
    }
  },
  methods: {
    previewImg(data) {
      this.dialogVisible = true;
      this.dialogImgUrl = this.mongoServiceUrl+'/'+data;
    },
    formatDate(row, column) {
      return StaticDic.tableDateDataFormat(row, column);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleCurrentChange(null);
    },
    handleCurrentChange(val) {
      if (val) {
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
        this.$axios.post(window.volConfig.volUrl + 'display/delete', data).then(res => {
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
    add() {
      this.editComponentTitle = '添加新聞稿';
      this.operateType = 'add';
      this.showEditComponent = true;
      this.isShowDetail = false;
      // ref 本身是作为渲染结果而被创建的，在渲染时还不能访问
      // 需要在 this.$nextTick() 中引入
      this.$nextTick(() => {
        this.$refs.newspaperEdit.enableEditorE();
      });
      this.editData = {};
    },
    detail(data) {
      this.$axios.get(window.volConfig.volUrl + 'display/get/' + data.id).then(res => {
        if (res.data.success) {
          this.editComponentTitle = '詳細';
          this.operateType = 'detail';
          this.showEditComponent = true;
          this.isShowDetail = true;
          this.$nextTick(() => {
            this.$refs.newspaperEdit.disableEditorE();
          });
          this.editData = res.data.data;
        }
      })
    },
    edit(data) {
      this.$axios.get(window.volConfig.volUrl + 'display/get/' + data.id).then(res => {
        if (res.data.success) {
          this.editComponentTitle = '編輯新聞稿';
          this.operateType = 'edit';
          this.showEditComponent = true;
          this.isShowDetail = false;
          this.$nextTick(() => {
            this.$refs.newspaperEdit.enableEditorE();
          });
          this.editData = res.data.data;
        }
      })
    },
    addSuccess() {
      this.search();
      this.showEditComponent = false;
    },
    getBackEditData() {
      this.showEditComponent = false;
    },
    search() {
      this.initData(window.volConfig.volUrl + 'display/list', this.searchJson);
    },
    async initData(url, param) {
      this.$axios.post(url, param).then(res => {
        this.data = res.data.data;
        this.currentPage = 1;
        this.dataCount = this.data.length;
        this.handleCurrentChange(null);
      });
    }
  },
  mounted() {
    setTimeout(() => {
      this.search();
    }, 100);
  }
}

</script>
<style lang="scss" scoped>
.reward {
  padding: 10px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.searchBox {
  height: 50px;
  padding: 0 0 10px 0;
}

.rewardContent {
  padding-top: 10px;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;

  /deep/ .el-table {
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

    img {
      height: 40px;
    }
  }
}

.btnBox {
  margin-bottom: 10px;
  text-align: right;
}
</style>

