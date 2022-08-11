<template>
  <div class="civilDefence">
    <div style="display: flex; justify-content: flex-end;">
      <el-select v-model="selectValue" style="margin: 0 10px 0 0; width: 130px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>

      <el-upload
          :data="updateData"
          :action="mongoServiceUrl"
          :file-list="fileList"
          :on-error="handleError"
          :on-success="onSuccess"
          :before-upload="beforeUpload"
          :limit="1"
          :show-file-list="false"
          accept=".pdf"
      >
        <el-button size="small" type="primary">上傳文件</el-button>
      </el-upload>
    </div>

    <div class="civilDefenceContent">
      <el-table
          :data="currentData"
          style="width: 100%"
          stripe
          border>
        <el-table-column prop="fileName" sortable label="文件名稱" width="500px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="updatorName" sortable label="上傳人" width="200px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="updateTime" sortable label="上傳時間" width="300px" :formatter="formatDate"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="language" sortable label="對應語言" :formatter="formatLanguage" width="200px"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="releaseTime" sortable label="發佈時間" :formatter="formatDate"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="tableBtnBox">
              <el-button v-if="scope.row.isRelease === '0'" @click='release(scope.row)' type="text"
                         icon="el-icon-upload2" size="small"
                         style="color: #00a59e">發佈
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
      <div v-if="civilDefenceShow">
        <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="civilDefenceShow"
                   width="50%"
                   height="90%">
          <div style="margin-top: -40px;padding: 0 0 10px 0">
            <el-button @click='downloadPdf()' type="primary" size="small">{{ $t('下載') }}</el-button>
          </div>
          <div style="overflow-y: auto;height: 80%">
            <pdf ref="pdf" :src="pdfSrc" v-for="i in numPages" :key="i" :page="i" style="width: 100%; height: auto"
                 @num-pages="pageCount=$event"></pdf>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import StaticDic from '../../common/static/infoDic';
import pdf from 'vue-pdf-signature';
import CMapReaderFactory from "vue-pdf-signature/src/CMapReaderFactory";

export default {
  name: 'civilDefence-manage',
  props: {},
  components: {
    pdf,
    CMapReaderFactory
  },
  data: function () {
    return {
      openData: {},
      civilDefenceShow: false,
      pdfSrc: '',
      pdfUrl: '',
      numPages: 0,
      pageCount: 0,
      dataCount: 0,
      // 从 1开始
      currentPage: 1,
      // 默认为 10
      pageSize: 10,
      currentData: [],
      mongoServiceUrl: window.volConfig.mongoServiceUrl,
      fileList: [],
      businessId: '',
      updateData: {
        metadata: '{"system":"vol","module":"civilDefence","businessId":' + this.businessId + '}'
      },
      currentUserId: sessionStorage.getItem('userId'),
      currentUserName: sessionStorage.getItem('userName'),
      options: [{
        value: 'zh-MO',
        label: '中文'
      }, {
        value: 'pt-PT',
        label: '葡文'
      }],
      selectValue: 'zh-MO'
    }
  },
  methods: {

    // 对上传文件做限制
    beforeUpload(file) {
      const isPdf = file.type === 'application/pdf';
      if (!isPdf) {
        this.$message.error('上传文件只能是 PDF 格式!');
      }
      return isPdf;
    },

    // 文件上传失败时的钩子
    handleError() {
      this.$message.error("文件上傳失敗！");
    },

    // 文件上传成功时的钩子
    onSuccess(res) {
      this.fileList = [];
      let postData = {
        fileId: res[0].fileId,
        fileName: res[0].fileName,
        size: res[0].size,
        isRelease: '0',
        updateTime: res[0].uploadDate,
        updatorId: this.currentUserId,
        updatorName: this.currentUserName,
        language: this.selectValue
      };
      this.$axios.post(window.volConfig.volUrl + 'civilDefence/content/upload', postData).then(resp => {
        const data = resp.data;
        if (data.success) {
          this.$message.success(data.data.fileName + " 文件上傳成功！");
          this.search();
        }
      })
    },
    // 日期格式转换
    formatDate(row, column) {
      return StaticDic.tableDateDataFormatFull(row, column);
    },
    // 语言格式转换
    formatLanguage(row, column) {
      // 获取单元格数据
      const data = row[column.property];
      if (data === 'zh-MO') {
        return '中文';
      }
      if (data === 'pt-PT') {
        return '葡文';
      }
    },
    // 页码变化(10項/頁)
    handleSizeChange(val) {
      this.pageSize = val;
      this.getCivilDefenceContentList();
    },
    // 页面变化(1)
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCivilDefenceContentList();
    },
    // 删除按钮
    deleteSingle(data) {
      this.$confirm('是否刪除?', '刪除', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(window.volConfig.volUrl + 'civilDefence/content/delete', data).then(res => {
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
    // 发布
    release(data) {
      this.$axios.post(window.volConfig.volUrl + 'civilDefence/content/release', data).then(res => {
        const data = res.data;
        if (data.success) {
          this.$message.success(data.data.fileName + ' 發佈成功');
          this.search();
        }
      })
    },
    // 详情
    detail(data) {
      this.openData = data;
      // 防跨域 getWithoutHeaderAndCredentials
      this.$axios.getWithoutHeaderAndCredentials(this.mongoServiceUrl + '/' + this.openData.fileId).then(resp => {
        const blob = new Blob([resp.data], {type: 'application/pdf'});
        this.pdfSrc = window.URL.createObjectURL(blob);
        this.pdfUrl = pdf.createLoadingTask(this.pdfSrc);
        this.pdfUrl.promise.then(pdf => this.numPages = pdf.numPages);
        this.civilDefenceShow = true;
      });
    },

    downloadPdf() {
      document.location.href = this.mongoServiceUrl + '/' + this.openData.fileId;
      this.$message.success(this.openData.fileName + "下載成功！");
    },

    // 搜索
    search() {
      this.currentPage = 1;
      this.getCivilDefenceContentList();
    },
    // 获取奖励内容管理列表
    getCivilDefenceContentList() {
      this.$axios.get(window.volConfig.volUrl + 'civilDefence/content/list/' + this.currentPage + '/' + this.pageSize).then(res => {
        this.currentData = res.data.data;
        this.dataCount = res.data.dataCount;
      });
    }
  },
  mounted() {
    this.search();
  }
}

</script>
<style lang="scss" scoped>
/deep/ .el-upload__input {
  display: none;
}

/deep/ .el-upload {
  float: right;
}

.civilDefence {
  padding: 10px;
  height: 95%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.civilDefenceContent {
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
