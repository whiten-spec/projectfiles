<template>
  <div class="vol_edit">
    <div class="editTitle">
      <div class="histogram"></div>
      {{ editTitle }}{{ operate === '1' ? '(' + volunteerModel.userName + ')' : '' }}
    </div>
    <div class="outPut">
      <el-form :model="volunteerModel" :rules="rules" ref="ruleForm" class="roleForm">
        <div v-if="operate === '0' ">
          <div class="edit_title">
            <div class="line_text">用戶訊息</div>
          </div>
          <div class="temp_1">
            <div>
              <p class="text_1"><span class="colorSpan">*</span>用戶名</p>
              <p class="putBox_1">
                <el-form-item prop="userName">
                  <el-input :disabled="operate !== '0'" v-model="volunteerModel.userName" maxlength=100 clearable
                            onkeyup="this.value=this.value.replace(/\s+/g,'')"/>
                </el-form-item>
              </p>
            </div>
            <div>
              <p class="text_2"><span class="colorSpan">*</span>密碼</p>
              <p class="putBox_2" style="position:relative;" v-if="operate === '0'">
                <el-form-item prop="tempPassword">
                  <el-input v-model="volunteerModel.tempPassword" maxlength=100 clearable show-password
                            @input="change($event)"/>
                </el-form-item>
              </p>
              <p class="putBox_2" style="position:relative;flex:3.5" v-if="operate !== '0'">
                <el-form-item prop="password">
                  <el-input :disabled="isShowDetail" maxlength=100 v-model="volunteerModel.password" clearable
                            show-password @input="change($event)"/>
                </el-form-item>
              </p>
              <p v-if="operate === '0'">
                <el-tooltip placement="bottom-start" effect="light">
                  <el-button v-if='isDefaultPassword === "true"' @click="setDefaultPwd" size="small"
                             class="el-icon-key showBtn">默認
                  </el-button>
                  <el-button v-else @click="setDefaultPwd" size="small" class="el-icon-key showBtn">隨機</el-button>
                  <span slot="content"><span class="defaultPwd">密碼'{{ this.volunteerModel.tempPassword }}'</span></span>
                </el-tooltip>
              </p>
            </div>
          </div>
        </div>
        <div class="edit_title">
          <div class="line_text">{{ $t('基本訊息') }}</div>
        </div>
        <div class="temp">
          <p class="text"><span class="colorSpan">*</span>姓名</p>
          <p class="putBox">
            <el-form-item prop="name">
              <el-input :disabled="isShowDetail" v-model="volunteerModel.name" maxlength=100 clearable/>
            </el-form-item>
          </p>
          <p class="text"><span class="colorSpan">*</span>性別</p>
          <p class="putBox">
            <el-form-item prop="gender">
              <el-select :disabled="isShowDetail" v-model="volunteerModel.gender" :popper-append-to-body="false"
                         clearable>
                <el-option v-for="item of genders" :key="item.key" :label="item.value" :value="item.key"
                           :title="item.value"></el-option>
              </el-select>
            </el-form-item>
          </p>
        </div>
        <div class="temp" v-if="false">
          <!--  <p class="text"><span class="colorSpan">*</span>證件類別</p>
           <p class="putBox">
               <el-form-item prop="idType">
                   <el-select :disabled="isShowDetail" v-model="volunteerModel.idType" clearable>
                       <el-option v-for="item of idType" :key="item.code" :label="item.name" :value="item.code"></el-option>
                   </el-select>
               </el-form-item>
           </p> -->
          <p class="text"><span class="colorSpan">*</span>證件號碼</p>
          <p class="putBox_line">
            <base-form-item :type="'idCard'" :prop="'idNumber'" :required="true"
                            :disabled="isShowDetail" :idCard.sync="volunteerModel.idNumber"></base-form-item>
          </p>
        </div>
        <div class="temp">
          <p class="text"><span class="colorSpan">*</span>主管機構</p>
          <p class="putBox">
            <el-form-item prop="agencyCode">
              <select-tree @labelModelChange="labelModelChange" ref="selectTree" :disabled="isShowDetail" :options="agencyList" placeholder="請選擇"/>
            </el-form-item>
          </p>
          <p class="text"><span class="colorSpan">*</span>聯絡電話</p>
          <p class="putBox">
            <base-form-item :required="true" :disabled="isShowDetail" :prop="'phone'"
                            :phone.sync="volunteerModel.phone"></base-form-item>
          </p>
        </div>

        <div class="temp">
          <p class="text_1">電子郵箱</p>
          <p class="putBox">
            <base-form-item :type="'email'" :prop="'email'"
                            :disabled="isShowDetail" :email.sync="volunteerModel.email"></base-form-item>
          </p>
        </div>
        <el-row class="btn-row" v-if="!isShowDetail">
          <el-button @click="sureAddVolunteer('ruleForm')" type="primary" icon="el-icon-finished" size="small">確定
          </el-button>
          <el-button @click='backEdit("ruleForm")' icon="el-icon-close" size="small">取消</el-button>
        </el-row>
        <div class="btnBack" v-if="isShowDetail">
          <el-button @click='backEdit("ruleForm")' icon="el-icon-circle-check" size="small">返回</el-button>
        </div>
      </el-form>
    </div>
  </div>

</template>
<script>
import StaticDic from '../../common/static/infoDic'
import SelectTree from '../../common/static/SelectTree.vue';
import BaseFormItem from '../base/base-form-item.vue';

export default {
  name: 'volunteerEdit',
  props: {
    volunteerModel: {
      type: Object,
      default: function () {
        return {
          userName: '',
        }
      }
    },
    isShowDetail: {
      type: Boolean
    },
    operate: {
      type: String
    },
  },
  components: {
    SelectTree,
    BaseFormItem
  },
  data: function () {
    return {
      isDefaultPassword: sessionStorage.getItem('isDefaultPassword'),
      defaultPassword: this.volunteerModel.tempPassword,
      genders: [
        {key: 0, value: '男'},
        {key: 1, value: '女'},
      ],
      // 证件类型
      idType: [],
      isShowAttachMsg: false,
      editTitle: '',
      agencyList: [],
      rules: {
        userName: [
          {required: true, message: '請輸入用戶名', trigger: 'blur'},
        ],
        tempPassword: [
          {required: true, message: '請輸入密碼', trigger: 'blur'},
          {min: 8, message: '密碼長度最小8位', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '請輸入密碼', trigger: 'blur'},
          {min: 8, message: '密碼長度最小8位', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '請輸入姓名', trigger: 'blur'},
        ],
        gender: [
          {required: true, message: '請選擇性別', trigger: 'change'},
        ],
        /* idType: [
           {required: true, message: '請選擇證件類別', trigger: 'blur'},
        ]*/
        agencyCode: [
          {required: true, message: '請輸入主管機構', trigger: 'change'},
        ],
      },

    }
  },
  methods: {
    labelModelChange(data) {
      this.rules.agencyCode[0].required = data === ' ';
    },
    change() {
      this.$forceUpdate();
    },
    backEdit(formName) {
      this.$refs[formName].resetFields();
      this.$emit('backEdit', false);
    },
    sureAddVolunteer(formName) {
      if (this.$refs.selectTree) {
        this.volunteerModel.agencyCode = this.$refs.selectTree.valueModel;
        this.volunteerModel.agencyName = this.$refs.selectTree.labelModel;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sureAddVolunteerRight();
        } else {
          return false;
        }
      })
    },
    sureAddVolunteerRight() {
      if (this.operate === '1') {
        this.volunteerModel.updatorId = this.$store.getters.getVolunteerModel.id;
        this.volunteerModel.updatorName = this.$store.getters.getVolunteerModel.name;
        this.$axios.post(window.volConfig.volUrl + 'volunteer/update', this.volunteerModel).then(res => {
          if (res.data.success) {
            this.$emit('addSuccess', res.data.data);
            this.$emit('backEdit', false);
          } else {
            this.$message({
              type: 'info',
              message: StaticDic.getErrorMessage(res.data.error.code),
            });
          }
        });
      } else if (this.operate === '0') {
        this.volunteerModel.creatorId = this.$store.getters.getVolunteerModel.id;
        this.volunteerModel.creatorName = this.$store.getters.getVolunteerModel.name;
        this.volunteerModel.roleCodes = "2";
        this.volunteerModel.needResetPassword = '1'
        this.volunteerModel.needResetUsername = '1'
        let tempPassword = JSON.parse(JSON.stringify(this.volunteerModel.tempPassword));
        this.volunteerModel.tempPassword = null;
        this.volunteerModel.password = this.$sha3.sha3_256(tempPassword);
        this.$axios.post(window.volConfig.volUrl + 'volunteer/add', this.volunteerModel).then(res => {
          if (res.data.success) {
            this.$emit('addSuccess', res.data.data);
            this.$emit('backEdit', false);
          } else {
            this.$message({
              type: 'info',
              message: StaticDic.getErrorMessage(res.data.error.code),
            });
          }
        });
      } else if (this.operate === '3') {
        // 申请成为志愿者
        this.volunteerModel.updatorId = this.$store.getters.getVolunteerModel.id;
        this.volunteerModel.updatorName = this.$store.getters.getVolunteerModel.name;
        if (this.$refs.selectTree) {
          this.volunteerModel.agencies = [{
            agencyCode: this.$refs.selectTree.valueModel,
            name: this.$refs.selectTree.labelModel
          }];
        }
        this.$axios.post(window.volConfig.volUrl + 'volunteer/apply', this.volunteerModel).then(res => {
          if (res.data.success) {
            this.$emit('addSuccess', res.data.data);
          } else if (res.data.error.code === 40001 || res.data.error.code === 40002 || res.data.error.code === 40003) {
            this.$message({
              type: 'info',
              message: StaticDic.getErrorMessage(res.data.error.code),
            });
          }
        });
      }
    },
    updateStatusOfAngency(list) {
      if (!list) return;
      for (let i = 0; i < list.length; i++) {
        if (list[i].canManagePersonalVolunteer === '0') {
          list[i].disabled = true;
          if (list[i].children) this.updateStatusOfAngency(list[i].children);
        }
      }
    },
    async getDic() {
      this.pubDict = await StaticDic.getPub();
      this.idType = this.pubDict.filter(x => x.parentCode === '10030000');
      this.agencyList = await StaticDic.getAgencyTree();
      //this.updateStatusOfAngency(this.agencyList);
      if (this.operate === '0') {
        this.$set(this.volunteerModel, 'tempPassword', StaticDic.DEFAULT_PASSWORD);
      } else {
        if (this.volunteerModel.agencyCode) {
          this.$refs.selectTree.valueModel = this.volunteerModel.agencyCode;
          this.$refs.selectTree.labelModel = this.volunteerModel.agencyName;
        } else {
          let allAgency = await StaticDic.getAgencyList();
          let root = allAgency.find((x) => {
            return x.type === '1';
          });
          this.$refs.selectTree.valueModel = root.agencyCode;
          this.$refs.selectTree.labelModel = root.name;
        }
      }
    },
    setDefaultPwd() {
      StaticDic.updateDefaultPassword();
      this.volunteerModel.tempPassword = StaticDic.DEFAULT_PASSWORD;
    }
  },
  mounted() {
    switch (this.operate) {
      case '0':
        this.editTitle = '用戶添加訊息'
        break;
      case '1':
        this.editTitle = '用戶編輯訊息'
        break;
      case '2':
        this.editTitle = '用户詳情訊息'
        break;
      case '3':
        this.editTitle = '申請成為志願者'
        break;
      default:
        break;
    }
    this.getDic();
  }
}
</script>
<style lang="scss" scoped>
.vol_edit {
  text-align: center;
  padding-bottom: 10px;
  flex: 1;
  overflow: auto;
  .colorSpan {
    color: #e9232c;
  }
  .edit_title {
    width: 100%;
    overflow: hidden;
    text-align: left;
    height: 30px;
    margin: 0 0 15px 0;
    .line_text {
      font-size: 22px;
    }
    .showBtn {
      border: none;
      background-color: transparent;
      padding: 0;
      &::before {
        font-size: 20px;
      }
    }
  }
  .outPut {
    width: 95%;
    margin: 2% 0 0 3%;
  }
  .temp {
    width: 100%;
    text-align: center;
    display: flex;
    margin: 10px 0;
    & > p.text {
      flex: 1;
      min-width: 100px;
      text-align: right;
      padding-right: 10px;
      line-height: 40px;
    }
    & > p.text_1 {
      flex: .44;
      min-width: 100px;
      text-align: right;
      padding-right: 10px;
      line-height: 40px;
    }
    & > p.putBox {
      flex: 4;
      .defaultPwd {
        position: absolute;
        right: 0;
        bottom: 0;
        color: #aaa;
      }
    }
    & > p.putBox_line {
      flex: 9;
    }
  }
  .temp_1 {
    display: flex;
    width: 100%;
    overflow: hidden;
    & > div {
      flex: 1;
      display: flex;
      & > p.text_1 {
        flex: 1 !important;
        min-width: 100px;
        text-align: right;
        padding-right: 10px;
        line-height: 40px;
      }
      & > p.putBox_1 {
        flex: 4;
      }
      & > p.text_2 {
        flex: .9;
        min-width: 100px;
        text-align: right;
        padding-right: 10px;
        line-height: 40px;
      }
      & > p.putBox_2 {
        flex: 3;
        .defaultPwd {
          position: absolute;
          right: 0;
          bottom: 0;
          color: #aaa;
        }
      }
    }
    //iiiiii
  }
  .editTitle {
    position: inherit;
    width: 100%;
    height: 40px;
    padding: 0 20px;
    border-bottom: 1px solid #f0f0f0;
    letter-spacing: 3px;
    text-align: left;
    .histogram {
      width: 6px;
      height: 23px;
      margin: 1px 7px;
      background: rgb(39, 204, 147);
      float: left;
    }
  }
}
.el-select {
  display: block;
}
/deep/ .el-form-item__error {
  font-size: 16px !important;
}
/deep/ .el-textarea__inner {
  font-size: 20px;
}
/deep/ .el-tabs__nav {
  height: 50px;
}
.dataPicker {
  width: 100%;
}
</style>
