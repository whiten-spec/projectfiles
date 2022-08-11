<template>
  <div class="notification_edit_box">
    <div class="editTitle">
      <div style="width: 8px;height: 100%;background: #15c1a1;margin: 0 10px 0 0;"></div>
      <div>{{ editTitle }}</div>
    </div>
    <div class="notification_edit">
      <el-form :model="notificationModel" ref="editForm" class="roleForm">
        <div class="temp">
          <p class="text">通知條件</p>
          <p class="putBox">
            <el-select @change="notificationConditionsChange" v-model="notificationConditions" :disabled="operateType === 'detail'">
              <el-option v-for="item in notificationConditionsList" :key="item.code" :label="item.name"
                         :value="item.code"></el-option>
            </el-select>
          </p>
        </div>
        <div class="temp">
          <p class="text">通知方式</p>
          <p class="putBox">
            <el-select @change="notificationMethodChange" v-model="notificationMethod" :disabled="operateType === 'detail'">
              <el-option v-for="item in notificationMethodList" :key="item.code" :label="item.name"
                         :value="item.code"></el-option>
            </el-select>
          </p>
        </div>
        <div class="temp">
          <p class="text">通知語言</p>
          <p class="putBox">
            <el-select v-model="notificationLanguage" :disabled="operateType === 'detail'">
              <el-option v-for="item in notificationLanguageList" :key="item.code" :label="item.name"
                         :value="item.code"></el-option>
            </el-select>
          </p>
        </div>
        <div class="temp">
          <p class="text">通知內容</p>
          <p class="putBox">
            <editor ref="editor"
                    :toolbarKeys="toolbarKeys"
                    :operationType="operateType"
                    :editorClass="editorClass"
                    :parentType="parentType"
                    :notificationConditions="notificationConditions"
                    :notificationMethod="notificationMethod"
                    v-model:value="notificationModel.notificationContent"
            >
            </editor>
          </p>
        </div>
        <div class="btnBox">
          <el-row class="btn-row" v-if="operateType !== 'detail'">
            <el-button @click='sureAddNotification("editForm")' type="primary" icon="el-icon-finished" size="small">確定
            </el-button>
            <el-button @click='backEdit("editForm")' icon="el-icon-close" size="small">取消</el-button>
          </el-row>
          <el-row class="btn-row" v-if="operateType === 'detail'">
            <el-button @click='backEdit("editForm")' icon="el-icon-circle-check" size="small">返回</el-button>
          </el-row>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import editor from '../editor/editor';

export default {
  name: 'notificationEdit',
  props: {
    // 标题
    editTitle: {
      type: String
    },
    // 通知内容model
    notificationModel: {
      type: Object,
    },
    // 操作类型
    operateType: {
      type: String
    },
    // 通知条件列表
    notificationConditionsList: {
      type: Array
    },
    // 通知方式列表
    notificationMethodList: {
      type: Array
    },
    // 通知语言列表
    notificationLanguageList: {
      type: Array
    }
  },
  components: {
    editor
  },
  data: function () {
    return {
      // 当前用户 id
      currentUserId: sessionStorage.getItem('userId'),
      // 当前用户名称
      currentUserName: sessionStorage.getItem('userName'),
      // 编辑器样式
      editorClass: '',
      // 富文本编辑器工具栏配置
      toolbarKeys: [
        "headerSelect", "blockquote", "bold", "underline", "italic", "through",
        "color", "bgColor", "fontSize", "fontFamily", "lineHeight", "clearStyle", "delIndent", "indent",
        "justifyLeft", "justifyRight", "justifyCenter", "justifyJustify", "todo", "redo", "undo", "insertTable", "insertLink"
      ],
      // 通知条件
      notificationConditions: '10200100',
      // 通知方式
      notificationMethod: '10210100',
      // 通知语言
      notificationLanguage: '10220100',
      // 对于子组件的类型
      parentType: 'notification'
    }
  },
  methods: {
    // 启用富文本编辑器
    enableEditorE() {
      this.$refs.editor.enableEditor();
    },
    // 禁用富文本编辑器
    disableEditorE() {
      this.$refs.editor.disableEditor();
    },
    // 返回 或 取消
    backEdit(form) {
      this.$refs[form].resetFields();
      this.$emit('backEdit', false);
    },
    // 确认添加通知内容模板
    sureAddNotification(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.sureAddNotificationRight();
        } else {
          return false;
        }
      })
    },
    // 确认表单验证无误后添加通知内容模板
    sureAddNotificationRight() {
      // 通知条件、通知方式、通知语言
      this.notificationModel.notificationConditions = this.notificationConditions;
      this.notificationModel.notificationMethod = this.notificationMethod;
      this.notificationModel.notificationLanguage = this.notificationLanguage;
      // 获取 html
      this.notificationModel.notificationContent = this.$refs.editor.editor.getHtml();
      // 获取 text
      this.notificationModel.notificationText = this.$refs.editor.editor.getText();

      const that = this;

      switch (this.operateType) {
        case 'add':
          this.notificationModel.creatorId = this.currentUserId;
          this.notificationModel.creatorName = this.currentUserName;
          this.$axios.post2(window.volConfig.volUrl + 'notification/add', this.notificationModel).then(res => {
            if (res.data.success) {
              that.$emit('addSuccess', res.data.data);
              that.$message.success('添加成功！');
            } else {
              if (res.data.error.code === 505) {
                that.$message.error('已存在相同通知條件、相同通知方式、相同通知語言的通知內容！');
              } else {
                that.$message.error('添加失敗！');
              }
            }
          });
          break;
        case 'edit':
          this.notificationModel.updatorId = this.currentUserId;
          this.notificationModel.updatorName = this.currentUserName;
          this.$axios.post2(window.volConfig.volUrl + 'notification/update', this.notificationModel).then(res => {
            if (res.data.success) {
              that.$emit('addSuccess', res.data.data);
              that.$message.success('編輯成功！');
            } else {
              if (res.data.error.code === 505) {
                that.$message.error('已存在相同通知條件、相同通知方式、相同通知語言的通知內容！');
              } else {
                that.$message.error('編輯失敗！');
              }
            }
          });
          break;
      }
    },
    // 当通知条件下拉框选项变化时，设置不同的 $ list
    notificationConditionsChange() {
      if (this.notificationConditions === '10200100') {
        // 如果是 递交志愿者申请
        this.$refs.editor.list = [
          {id: 'nothing', name: '$'},
          {id: 'name', name: '${name}'},
          {id: 'number', name: '${number}'}
        ];
      } else if (this.notificationConditions === '10200200') {
        // 如果是 成为学员
        this.$refs.editor.list = [
          {id: 'nothing', name: '$'},
          {id: 'name', name: '${name}'},
          {id: 'username', name: '${username}'},
          {id: 'password', name: '${password}'},
          {id: 'time', name: '${time}'}
        ];
      }
    },
    // 当通知方式下拉框选项变化时，控制工具栏显隐
    notificationMethodChange() {
      if (this.notificationMethod === '10210100') {
        // 如果是 短信
        this.$refs.editor.showToolbar = false;
      } else if (this.notificationMethod === '10210200') {
        // 如果是 邮件
        this.$refs.editor.showToolbar = true;
      }
    }
  },
  mounted() {
    switch (this.operateType) {
      case 'add':
        this.editorClass = 'editorNotificationAdd';
        this.enableEditorE();
        break;
      case 'edit':
        // 通知条件、通知方式、通知语言
        this.notificationConditions = this.notificationModel.notificationConditions;
        this.notificationMethod = this.notificationModel.notificationMethod;
        this.notificationLanguage = this.notificationModel.notificationLanguage;
        this.editorClass = 'editorNotificationEdit';
        this.enableEditorE();
        break;
      case 'detail':
        // 通知条件、通知方式、通知语言
        this.notificationConditions = this.notificationModel.notificationConditions;
        this.notificationMethod = this.notificationModel.notificationMethod;
        this.notificationLanguage = this.notificationModel.notificationLanguage;
        this.editorClass = 'editorNotificationDetail';
        this.disableEditorE();
        break;
    }
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

.notification_edit_box {
  overflow-y: auto;
  background-color: white;
  display: flex;
  flex-direction: column;

  .editTitle {
    position: inherit;
    width: 100%;
    padding: 15px 20px;
    border-bottom: 1px solid #f0f0f0;
    letter-spacing: 3px;
    display: flex;
  }

  .notification_edit {
    margin: 0 100px;

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
    height: 60px;
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



