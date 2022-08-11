<template>
  <div class="notification">
    <div>
      <el-button size="small" style="float: right" icon="el-icon-plus" type="success" @click="add">新增</el-button>
    </div>

    <div class="notificationContent">
      <el-table
          :data="currentData"
          style="width: 100%"
          stripe
          border>
        <!--  通知条件  -->
        <el-table-column prop="notificationConditions" label="通知條件" width="300px" :formatter="formatConditions"
                         :show-overflow-tooltip="true" sortable></el-table-column>

        <!--  通知方式  -->
        <el-table-column prop="notificationMethod" label="通知方式" width="150px" :formatter="formatMethod"
                         :show-overflow-tooltip="true" sortable></el-table-column>

        <!--  通知语言  -->
        <el-table-column prop="notificationLanguage" label="通知語言" width="150px" :formatter="formatLanguage"
                         :show-overflow-tooltip="true" sortable></el-table-column>

        <!--  创建人  -->
        <el-table-column prop="creatorName" label="創建人" width="200px" :show-overflow-tooltip="true" sortable></el-table-column>

        <!--  创建时间  -->
        <el-table-column prop="createTime" label="創建時間" width="300px" :formatter="formatDate"
                         :show-overflow-tooltip="true" sortable></el-table-column>

        <!--  通知内容  -->
        <el-table-column prop="notificationText" label="通知內容" width="500px" :show-overflow-tooltip="true">
        </el-table-column>

        <!--  操作  -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="tableBtnBox">
              <el-button @click='edit(scope.row)' type="text"
                         icon="el-icon-edit" size="small"
                         style="color: #00a59e">編輯
              </el-button>
              <el-button @click='detail(scope.row)' type="text" icon="el-icon-document" size="small"
                         style="color: #959b9b;margin: 0 10px 0 20px;">詳情
              </el-button>
              <el-button @click="deleteSingle(scope.row)" type="text" icon="el-icon-delete" size="small"
                         style="color: #ff0000">刪除
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
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dataCount">
        </el-pagination>
      </div>
      <div v-if="notificationShow">
        <el-dialog :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :visible.sync="notificationShow"
                   width="75%"
                   height="80%">
          <notification-edit
              :editTitle="editTitle"
              :notificationModel="notificationModel"
              :operateType="operateType"
              :notificationConditionsList="notificationConditionsList"
              :notificationMethodList="notificationMethodList"
              :notificationLanguageList="notificationLanguageList"
              @backEdit="backEdit"
              @addSuccess="addSuccess"
          >
          </notification-edit>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import StaticDic from '../../common/static/infoDic';
import pdf from 'vue-pdf-signature';
import CMapReaderFactory from "vue-pdf-signature/src/CMapReaderFactory";
import notificationEdit from './notification-edit';

export default {
  name: 'notification-manage',
  props: {},
  components: {
    pdf,
    CMapReaderFactory,
    notificationEdit
  },
  data: function () {
    return {
      // 编辑栏标题
      editTitle: '新增通知內容模板',
      // 通知内容 model
      notificationModel: {},
      // 操作类型
      operateType: 'add',
      // 控制弹框显隐
      notificationShow: false,
      // 从 1开始
      currentPage: 1,
      // 默认为 10
      pageSize: 10,
      // 列表数据
      currentData: [],
      // 分页个数
      dataCount: 0,
      // 当前用户 id
      currentUserId: sessionStorage.getItem('userId'),
      // 当前用户名称
      currentUserName: sessionStorage.getItem('userName'),
      // 通知条件
      notificationConditionsParentCode: '10200000',
      // 通知方式
      notificationMethodParentCode: '10210000',
      // 通知语言
      notificationLanguageParentCode: '10220000',
      // 所有字典项列表
      pubDictList: [],
      // 通知条件列表
      notificationConditionsList: [],
      // 通知方式列表
      notificationMethodList: [],
      // 通知语言列表
      notificationLanguageList: []
    }
  },
  methods: {
    // 通知条件格式转换
    formatConditions(row, column) {
      // 获取单元格数据
      const data = row[column.property];
      // 循环遍历出结果
      for (let i = 0; i < this.notificationConditionsList.length; i++) {
        if (data === this.notificationConditionsList[i].code) {
          return this.notificationConditionsList[i].name;
        }
      }
    },
    // 通知方式格式转换
    formatMethod(row, column) {
      // 获取单元格数据
      const data = row[column.property];
      // 循环遍历出结果
      for (let i = 0; i < this.notificationMethodList.length; i++) {
        if (data === this.notificationMethodList[i].code) {
          return this.notificationMethodList[i].name;
        }
      }
    },
    // 通知语言格式转换
    formatLanguage(row, column) {
      // 获取单元格数据
      const data = row[column.property];
      // 循环遍历出结果
      for (let i = 0; i < this.notificationLanguageList.length; i++) {
        if (data === this.notificationLanguageList[i].code) {
          return this.notificationLanguageList[i].name;
        }
      }
    },
    // 日期格式转换
    formatDate(row, column) {
      return StaticDic.tableDateDataFormatFull(row, column);
    },
    // 页码变化(10項/頁)
    handleSizeChange(val) {
      this.pageSize = val;
      this.getNotificationContentList();
    },
    // 页面变化(1)
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getNotificationContentList();
    },
    // 删除按钮
    deleteSingle(data) {
      this.$confirm('是否刪除?', '刪除', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(window.volConfig.volUrl + 'notification/delete', data).then(res => {
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
    // 新增
    add() {
      this.notificationShow = true;
      // 编辑栏标题
      this.editTitle = '新增通知內容模板';
      // 通知内容 model
      this.notificationModel = {};
      // 操作类型
      this.operateType = 'add';
    },
    // 详情
    detail(data) {
      this.notificationShow = true;
      // 编辑栏标题
      this.editTitle = '通知內容模板詳情';
      // 通知内容 model
      this.notificationModel = data;
      // 操作类型
      this.operateType = 'detail';
    },
    // 编辑
    edit(data) {
      this.notificationShow = true;
      // 编辑栏标题
      this.editTitle = '編輯通知內容模板';
      // 通知内容 model
      this.notificationModel = data;
      // 操作类型
      this.operateType = 'edit';
    },
    // 确定编辑
    enSureEdit() {
      this.notificationShow = false;
      let postData;
      this.$axios.post(window.volConfig.volUrl + 'notification/update', postData).then(res => {
        const data = res.data;
        if (data.success) {
          this.$message.success('編輯成功！');
          this.search();
        }
      })
    },
    // 返回
    backEdit() {
      this.notificationShow = false;
    },
    // 添加成功
    addSuccess() {
      this.search();
      this.notificationShow = false;
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getNotificationContentList();
    },
    // 获取通知内容模板管理列表
    getNotificationContentList() {
      this.$axios.get(window.volConfig.volUrl + 'notification/list/' + this.currentPage + '/' + this.pageSize).then(res => {
        this.currentData = res.data.data;
        this.dataCount = res.data.dataCount;
      });
    },
    // 获取字典项列表
    async getDictPub() {
      this.pubDictList = await StaticDic.getPub();
      this.notificationConditionsList = this.pubDictList.filter(x => x.parentCode === this.notificationConditionsParentCode);
      this.notificationMethodList = this.pubDictList.filter(x => x.parentCode === this.notificationMethodParentCode);
      this.notificationLanguageList = this.pubDictList.filter(x => x.parentCode === this.notificationLanguageParentCode);
    }
  },
  mounted() {
    // 获取公共字典
    this.getDictPub();
    // 查询列表
    this.search();
  }
}

</script>
<style lang="scss" scoped>

/deep/ .el-dialog__header {
  padding: 0;
}

/deep/ .el-dialog__body {
  padding: 0;
}

.notification {
  padding: 10px;
  height: 95%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.notificationContent {
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
  }
}
</style>
