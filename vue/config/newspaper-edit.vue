<template>
  <div class="display_edit_box">
    <div class="editTitle">{{ editTitle }}</div>
    <div class="display_edit">
      <el-form :model="displayModel" :rules="rules" ref="editForm" class="roleForm" style="height: 100%">
        <div class="temp">
          <p class="text"><span class="colorSpan">*</span>標題</p>
          <p class="putBox">
            <el-form-item prop="title">
              <el-input v-model="displayModel.title" :disabled="isShowDetail" maxlength=512 clearable/>
            </el-form-item>
          </p>
        </div>
        <div class="temp">
          <p class="text"><span class="colorSpan">*</span>上傳時間</p>
          <p class="putBox">
            <el-form-item prop="uploadTime">
              <el-date-picker class="dataPicker" type="datetime" :disabled="isShowDetail"
                              v-model="displayModel.uploadTime" :editable="false" clearable/>
            </el-form-item>
          </p>
          <p class="text"><span class="colorSpan">*</span>主題圖</p>
          <p class="putBox">
            <el-form-item v-if="operateType === 'add' || (operateType === 'edit' && showUploader)" prop="leftImage">
              <el-upload
                  ref='upload'
                  :action="mongoServiceUrl"
                  :data="updateData"
                  :on-preview="handlePreview"
                  :file-list="fileList"
                  :auto-upload="true"
                  :on-change="handleChange"
                  :on-error="handleError"
                  :on-success="handleSuccess"
                  :on-exceed="handleExeed"
                  :before-remove="handleRemove"
                  :before-upload="handleBeforeUpload"
                  :disabled="isShowDetail"
                  :limit="1"
                  accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
              >
                <el-button size="small" type="primary" class="el-upload_button"
                           :disabled="isShowDetail">{{ $t('點擊上傳') }}
                </el-button>
                <span slot="tip"><span :class="uploadTipCls">{{ uploadTip }}</span></span>
              </el-upload>
            </el-form-item>
            <span v-if="operateType === 'edit' && !showUploader || operateType === 'detail'">
              <img style="height: 50px;"
                   :src="mongoServiceUrl+'/'+displayModel.leftImage"
                   @click="detailImgPreview"
                   alt=""/>
            </span>
          </p>
          <el-button v-if="operateType === 'edit' && !showUploader"
                     icon="el-icon-delete"
                     type="danger"
                     @click="deleteLeftImage()"></el-button>
        </div>
        <div class="temp">
          <p class="text">主題內容</p>
          <p class="putBox">
            <el-form-item prop="section">
              <el-input v-model="displayModel.section" :disabled="isShowDetail" maxlength=512 clearable/>
            </el-form-item>
          </p>
        </div>
        <div class="temp" style="height: calc(100% - 270px);">
          <p class="text">新聞</p>
          <p class="putBox">
            <editor ref="editor" :toolbarKeys="toolbarKeys" :editorClass="editorClass" :operationType="operateType"
                    v-model:value="displayModel.content" :parentType="parentType"></editor>
          </p>
        </div>
        <div class="btnBox">
          <el-row class="btn-row" v-if="!isShowDetail">
            <el-button @click='sureAddDisplay("editForm")' type="primary" icon="el-icon-finished" size="small">確定
            </el-button>
            <el-button @click='backEdit("editForm")' icon="el-icon-close" size="small">取消</el-button>
          </el-row>
          <el-row class="btn-row" v-if="isShowDetail">
            <el-button @click='backEdit("editForm")' icon="el-icon-circle-check" size="small">返回</el-button>
          </el-row>
        </div>
      </el-form>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img :src="dialogImgUrl" width="100%" alt=""/>
    </el-dialog>
  </div>
</template>
<script>
import StaticDic from '../../common/static/infoDic';
import editor from '../editor/editor';

export default {
  name: 'newspaperEdit',
  props: {
    editTitle: {
      type: String
    },
    displayModel: {
      type: Object,
    },
    isShowDetail: {
      type: Boolean,
    },
    operateType: {
      type: String
    }
  },
  components: {
    editor
  },
  data: function () {
    return {
      rules: {
        title: [
          {required: true, message: '請輸入標題', trigger: 'blur'},
        ],
        uploadTime: [
          {required: true, message: '請輸入上傳時間', trigger: 'blur'},
        ],
      },
      volunteerModel: this.$store.getters.getVolunteerModel,
      mongoServiceUrl: window.volConfig.mongoServiceUrl,
      // 用於上傳本地的attach表
      updateFileList: [],
      businessId: '',
      updateData: {
        metadata: '{"system":"vol","module":"laws","businessId":' + this.businessId + '}'
      },
      uploadTip: '文件大小不能超過 ' + StaticDic.MAX_UPLOAD_DOCUMENT_SIZE_MB + 'MB',
      uploadTipCls: 'el-upload_cls',
      // 上傳附件服務
      fileList: [],

      // 图片预览显隐
      dialogVisible: false,
      // 图片预览地址
      dialogImgUrl: '',
      // 富文本编辑器样式
      editorClass: '',
      // 富文本编辑器工具栏配置
      toolbarKeys: [
        "headerSelect", "|",
        "blockquote", "bold", "underline", "italic", "through", "sub", "sup",
        "color", "bgColor", "fontSize", "fontFamily", "lineHeight", "clearStyle", "|",
        "delIndent", "indent", "justifyLeft", "justifyRight", "justifyCenter", "justifyJustify", "divider", "|",
        "bulletedList", "numberedList", "|",
        "uploadImage", "editImage", "deleteImage", "|",
        "todo", "redo", "undo", "|",
        "insertTable", "insertLink"
      ],
      // 对于子组件的类型
      parentType: 'newspaper',

      showUploader: false
    }
  },
  methods: {
    // 删除主题图
    deleteLeftImage() {
      this.showUploader = true;
    },
    // 图片预览
    detailImgPreview() {
      this.dialogVisible = true;
      this.dialogImgUrl = this.mongoServiceUrl + '/' + this.displayModel.leftImage;
    },
    // 文件格式、文件大小验证
    handleBeforeUpload(file) {
      if (!file.type.match(/.jpg|.jpeg|.png|.gif|.bmp|.JPG|.JPEG|.PBG|.GIF|.BMP/i)) {
        this.uploadTip = this.$i18n.t('文件格式不正確') + '，' + this.$i18n.t('請重新選擇');
        this.uploadTipCls = 'el-upload_tip';
        return false;
      }
      const filesize = file.size / 1024 / 1024;
      if (filesize > StaticDic.MAX_UPLOAD_DOCUMENT_SIZE_MB) {
        this.uploadTip = '文件大小不超過 ' + StaticDic.MAX_UPLOAD_DOCUMENT_SIZE_MB + 'MB!';
        this.uploadTipCls = 'el-upload_tip';
        return false;
      }
    },
    // 文件数量超出
    handleExeed() {
      this.uploadTip = '上傳文件數量超出!';
      this.uploadTipCls = 'el-upload_tip';
    },
    // 预览
    handlePreview(file) {
      if (file.id) {
        document.location.href = file.url;
      }
      if (file.response[0].fileId) {
        document.location.href = this.mongoServiceUrl + '/' + file.response[0].fileId;
      }
    },
    // 文件状态发生改变
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    // 上传失败
    handleError(res, file) {
    },
    // 点击删除
    handleRemove(file, fileList) {
      this.fileList = fileList;
      if (file.id) {
        this.updateFileList = this.updateFileList.filter(x => x.fileId !== file.fileId);
        this.$axios.post(window.volConfig.volUrl + 'attach/delete', {'id': file.id}).then();
        this.$axios.deleteWithoutCredentials(window.volConfig.mongoServiceUrl + '/' + file.fileId).then();
      }
      if (file.response) {
        this.updateFileList = this.updateFileList.filter(x => x.fileId !== file.response[0].fileId);
        this.$axios.post(window.volConfig.volUrl + 'attach/delete', {'id': file.response[0].fileId}).then();
        this.$axios.deleteWithoutCredentials(window.volConfig.mongoServiceUrl + '/' + file.response[0].fileId).then();
      }
    },
    // 上传成功
    handleSuccess(res) {
      let updateFileObj = {};
      updateFileObj.fileId = res[0].fileId;
      updateFileObj.fileName = res[0].fileName;
      this.updateFileList.push(updateFileObj);
      this.uploadTip = '文件大小不能超過 ' + StaticDic.MAX_UPLOAD_DOCUMENT_SIZE_MB + 'MB';
      this.uploadTipCls = 'el-upload_cls';
    },
    enableEditorE() {
      this.$refs.editor.enableEditor();
    },
    disableEditorE() {
      this.$refs.editor.disableEditor();
    },
    backEdit(form) {
      this.$refs[form].resetFields();
      this.$emit('backEdit', false);
    },
    sureAddDisplay(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.sureAddDisplayRight();
        } else {
          return false;
        }
      })
    },
    sureAddDisplayRight() {
      if (this.operateType === 'add' || (this.operateType === 'edit' && this.showUploader)) {
        if (!this.updateFileList || this.updateFileList.length === 0) {
          this.$message.error('請上傳主題圖片');
          return;
        }
        this.displayModel.updatorId = this.volunteerModel.id;
        this.displayModel.updatorName = this.volunteerModel.name;
        this.displayModel.leftImage = this.updateFileList[0].fileId;
        this.displayModel.content = this.$refs.editor.html;
      } else if (this.operateType === 'edit' && !this.showUploader) {
        this.displayModel.updatorId = this.volunteerModel.id;
        this.displayModel.updatorName = this.volunteerModel.name;
        this.displayModel.content = this.$refs.editor.html;
      }

      const that = this;
      this.$axios.post(window.volConfig.volUrl + 'display/update', this.displayModel).then(res => {
        if (res.data.success) {
          that.$message.success('操作成功!');
          that.$emit('addSuccess', res.data.data);
        } else {
          that.$message.error('操作失敗!');
        }
      });
    },
    pushFileList() {
      // 编辑时，传入 fileList
      if (this.displayModel !== null && this.displayModel.alienAttachModels.length !== 0) {
        for (let i = 0; i < this.displayModel.alienAttachModels.length; i++) {
          let o = {
            'id': this.displayModel.alienAttachModels[i].id,
            'name': this.displayModel.alienAttachModels[i].fileName,
            'fileId': this.displayModel.alienAttachModels[i].fileId,
            'url': window.volConfig.mongoServiceUrl + '/' + this.displayModel.alienAttachModels[i].fileId
          };
          this.fileList.push(o);
          this.updateFileList.push(o);
        }
      } else {
        let o = {
          'id': '',
          'name': '主題圖',
          'fileId': this.displayModel.leftImage,
          'url': window.volConfig.mongoServiceUrl + '/' + this.displayModel.leftImage
        };
        this.fileList.push(o);
        this.updateFileList.push(o);
      }
    },
    changeEditorClass() {
      // 根据操作类型，给编辑器传入样式
      switch (this.operateType) {
        case 'add':
          this.editorClass = 'editorNewspaperAdd';
          this.enableEditorE();
          break;
        case 'edit':
          this.editorClass = 'editorNewspaperEdit';
          this.enableEditorE();
          // 编辑时，传入 fileList
          // this.pushFileList();
          break;
        case 'detail':
          this.editorClass = 'editorNewspaperDetail';
          this.disableEditorE();
          break;
      }
    }
  },
  mounted() {
    // 根据操作类型，给编辑器传入样式
    this.changeEditorClass();
  }
}
</script>
<style lang="scss" scoped>

/deep/ .el-form-item__error {
  font-size: 16px !important;
}

/deep/ .el-form-item {
  margin: 0;
}

/deep/ .el-textarea__inner {
  font-size: 20px;
}

/deep/ .el-upload__input {
  display: none;
}

/deep/ .el-upload {
  float: left;
  padding-right: 10px;
}

.display_edit_box {
  height: 100%;
  margin: 0 1%;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;

  .editTitle {
    position: inherit;
    width: 100%;
    padding: 10px 20px;
    border-bottom: 1px solid #f0f0f0;
    letter-spacing: 3px;
  }

  .display_edit {
    margin: 0 100px;
    height: calc(100% - 55px);

    .colorSpan {
      color: #e9232c;
    }
  }

  .temp {
    display: flex;
    padding: 10px 0 0 0;

    .text_oneLine {
      flex: .44;
      min-width: 100px;
      text-align: right;
      padding-right: 10px;
      line-height: 40px;
      margin-left: 9.2%;
    }

    .putBox_oneLine {
      flex: 4;
    }

    & > p.text {
      flex: 1;
      min-width: 100px;
      text-align: right;
      padding-right: 10px;
      line-height: 40px;
    }

    & > p.putBox {
      width: 100%;
    }
  }

  .el-select {
    display: block;
  }

  .btnBox {
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dataPicker {
    width: 100%;
  }

  .el-upload_tip {
    color: red;
    font-size: medium;
    height: 35px;
  }
}
</style>



