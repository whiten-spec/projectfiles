<template>
  <div class="volunteer">

    <div class="searchbox">
      <div style="width:380px;float: left; margin-right: 10px;">
        <el-tabs v-model="activeTabIndex" @tab-click="handleTabClick">
          <el-tab-pane label="全部" name="all"></el-tab-pane>
          <el-tab-pane label="系統用户" name="sys"></el-tab-pane>
          <el-tab-pane label="志願者" name="vol"></el-tab-pane>
          <el-tab-pane label="學員" name="stu"></el-tab-pane>
        </el-tabs>
      </div>
      <el-input v-model="searchJson.keyword" placeholder="關鍵字..." @keyup.enter.native="search" clearable
                style="width:360px !important;margin-right:10px"/>
      <el-button @click='handleSearch' icon="el-icon-search" type="primary" size="small" style="margin-right:10px">搜索
      </el-button>
      <el-popover
          placement="bottom"
          width="620"
          v-model="advanceSearchVisible"
          trigger="click">
        <div v-if="showMoreBtns">
          <div style="margin-bottom: 10px">
            <select-tree :placeholder="placeholder" ref="selectTree" :options="agencyList"
                         style="width: 49% !important; margin-right: 2%" :disabled="currentRoleCode !== '1'"
                         :clearable="true"/>
            <el-select placeholder="角色..." style="width: 49% !important;" v-model="searchJson.roleCode"
                       :popper-append-to-body="false" clearable>
              <el-option v-for="item of roleList" :key="item.code" :label="item.name" :value="item.code"
                         :titile="item.name"></el-option>
            </el-select>
            <el-select placeholder="狀態..." style="width: 49% !important; margin: 10px 0 0 0" v-model="searchJson.exitStatus"
                       :popper-append-to-body="false" clearable>
              <el-option v-for="item of exitStatusList" :key="item.code" :label="item.name" :value="item.code"
                         :titile="item.name"></el-option>
            </el-select>
          </div>
          <div style="text-align: right;">
            <el-button @click='search' icon="el-icon-finished" type="primary" size="small">確定</el-button>
          </div>
        </div>
        <el-button slot="reference" @click='moreSearch' icon="el-icon-caret-right" type="primary" size="small">高級搜索
        </el-button>
        <el-button slot="reference" @click='reset' icon="el-icon-refresh" type="primary" size="small">重置</el-button>
      </el-popover>
      <div class="rightbox" style="float:right">
        <el-button @click='batchDelete' icon="el-icon-delete" type="danger" size="small">批量刪除</el-button>
        <el-button @click='add' icon="el-icon-plus" type="success" size="small">添加</el-button>
        <el-button @click='importECP' icon="el-icon-s-fold" type="success" size="small">導入</el-button>
      </div>
    </div>
    <div class="body">
      <el-table
          :data="tableData"
          style="width: 100%"
          height="100%"
          stripe
          border
          @selection-change="handleCurrentChanage">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="userName" label="用戶名" width="200" sortable
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="name" label="姓名" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="idNumber" label="身份證編號" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="gender_text" label="性別" width="100" sortable></el-table-column>
        <el-table-column prop="age" label="年齡" width="100" sortable
                         v-if="this.activeTabIndex!=='sys'"></el-table-column>
        <el-table-column prop="phone" label="電話" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="email" label="郵箱" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="agencyName" label="主管機構" width="200" :show-overflow-tooltip="true"
                         sortable></el-table-column>
        <el-table-column prop="roleNames" label="角色" :show-overflow-tooltip="true" sortable></el-table-column>
        <el-table-column prop="exitStatus" :label="$t('狀態')" :formatter="formatExitStatus" :show-overflow-tooltip="true"
                         width="120" sortable></el-table-column>
        <el-table-column label="操作" width="350" align="center">
          <template slot-scope="scope">
            <el-button @click='detail(scope.row)' type="info" size="small" icon="el-icon-document"
                       title="詳情"></el-button>
            <el-button @click='edit(scope.row)'
                       v-if="scope.row.roleCodes.indexOf('1') !==-1 || scope.row.roleCodes.indexOf('2') !==-1 || scope.row.roleCodes.indexOf('3') !==-1 || scope.row.roleCodes.indexOf('7') !==-1"
                       type="primary" size="small" icon="el-icon-edit" title="編輯"></el-button>
            <el-button v-if="scope.row.exitStatus==='2' && currentRoleCode==='1'" @click='reduction(scope.row)' type="success"
                       icon="el-icon-refresh-left" size="small" :title="$t('還原')">
            </el-button>
            <el-button v-if="scope.row.roleCodes.indexOf('1')<0" @click='deleteSingle(scope.row)' type="danger"
                       size="small" icon="el-icon-delete" title="刪除"></el-button>
            <el-button v-if="scope.row.exitStatus!=='2' && activeTabIndex!=='stu' && scope.row.roleNames!== '學員'"
                       @click='bindRole(scope.row)' type="success" size="small" icon="el-icon-s-fold"
                       title="綁定角色"></el-button>
            <el-button @click='resetPwd(scope.row)' v-if="currentRoleCode === '1' && scope.row.exitStatus!=='2'"
                       type="warning" icon="el-icon-key" size="small" title="重置密碼"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="foot">
      <BasePagination :page.sync="currentPage" :size.sync="pageSize" :total="volunteerDataCount"
                      :callback="handleCurrentChange"/>
    </div>
    <div v-if="showEditComponent">
      <el-dialog :close-on-click-modal="false" :close-on-press-escape="false"
                 :visible.sync="showEditComponent"
                 width="75%"
                 :before-close="getBackEditData">
        <account-edit :volunteerModel="editData" :operate="operateFlag"
                      @backEdit="getBackEditData" @addSuccess="addSuccess" :isShowDetail="isShowDetail">
        </account-edit>
      </el-dialog>
    </div>
    <div v-if="dialogVisible">
      <el-dialog :close-on-click-modal="false" :close-on-press-escape="false"
                 title="綁定角色"
                 :visible.sync="dialogVisible"
                 width="50%"
                 :before-close="handleClose">
        <div class="bind-all">
          <el-table
              :data="dialogRoleDict"
              style="width: 100%"
              stripe
              border
              @selection-change="bindRoleChanage">
            <el-table-column prop="name" label="名稱" width=200></el-table-column>
            <el-table-column prop="note" label="說明"></el-table-column>
            <el-table-column label="選擇" width="65">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isCheck" @change.native="bindRoleChanage(scope.row)"></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>

    <div v-if="resetPwdVisible">
      <el-dialog :close-on-click-modal="false" :close-on-press-escape="false"
                 :visible.sync="resetPwdVisible"
                 width="40%"
                 title="重置密碼">
        <div class="registTotal">
          <el-form :model="TempchangePwdModel" :rules="rules" ref="ruleForm" class="roleForm">
            <div class="registerLine">
              <span>用戶名</span>
              <span>
                          <el-form-item prop="userName">
                              <el-input :disabled="true" v-model="TempchangePwdModel.userName" clearable/>
                          </el-form-item>
                      </span>
            </div>
            <div class="registerLine">
              <span><span class="colorSpan">*</span>新密碼</span>
              <span>
                      <el-form-item prop="newPassword">
                          <el-input v-model="TempchangePwdModel.newPassword" clearable show-password/>
                      </el-form-item>
                  </span>
            </div>
            <div class="registerLine">
              <span><span class="colorSpan">*</span>確認新密碼</span>
              <span>
                          <el-form-item prop="newPasswordSure">
                              <el-input v-model="TempchangePwdModel.newPasswordSure" clearable show-password/>
                          </el-form-item>
                      </span>
            </div>
          </el-form>
          <div class="registerBtnBox">
            <el-button @click='sureChangePwd("ruleForm")' type="primary" icon="el-icon-finished" size="small">確定
            </el-button>
            <el-button @click='changePwdClose("ruleForm")' icon="el-icon-close" size="small">取消</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <div v-if="showImportComponent">
      <el-dialog title="導入用戶"
                 :visible.sync="showImportComponent"
                 :close-on-click-modal="false"
                 :close-on-press-escape="false"
                 width="75%"
                 :before-close="getBackImportData">
        <account-imp :importModel="importData"></account-imp>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import accountEdit from './account-edit.vue';
import accountImport from './account-imp.vue';
import StaticDic from '../../common/static/infoDic'
import SelectTree from '../../common/static/SelectTree.vue';
import {getAge} from "../../common/dateutil";
import BasePagination from '@/components/base/base-pagination.vue';

export default {
  name: 'volunter',
  components: {
    'account-edit': accountEdit,
    'account-imp': accountImport,
    SelectTree,
    BasePagination
  },
  props: {
    // msg: String
  },
  data: function () {
    const validatePass = (rule, value, callback) => {
      const reg = StaticDic.REGEXP_PASS;
      if (value === '') {
        callback(new Error('請輸入新密碼'));
      } else if (value.length < 8) {
        callback(new Error('密碼長度最小8位'))
      } else if (!reg.test(value)) {
        callback(new Error(this.$i18n.t('密碼應爲字母加數字組合且至少有一位大寫字母')));
      } else {
        if (this.TempchangePwdModel.newPasswordSure !== '') {
          this.$refs.ruleForm.validateField('newPasswordSure');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      const reg = StaticDic.REGEXP_PASS;
      if (value === '') {
        callback(new Error('請再次輸入密碼'));
      } else if (value.length < 8) {
        callback(new Error('密碼長度最小8位'))
      } else if (!reg.test(value)) {
        callback(new Error(this.$i18n.t('密碼應爲字母加數字組合且至少有一位大寫字母')));
      } else if (value !== this.TempchangePwdModel.newPassword) {
        callback(new Error('兩次輸入的密碼不一致'));
      } else {
        callback();
      }
    };
    return {
      activeName: 'first',
      isFirst: true,
      isSecond: false,
      tableData: [],
      selectionChangeList: [],
      showEditComponent: false,
      showImportComponent: false,
      editData: Object,
      importData: Object,
      isShowDetail: Boolean,
      advanceSearchVisible: false,
      genders: [
        {key: 0, value: '男'},
        {key: 1, value: '女'},
      ],
      operateFlag: '0', // 0添加 1编辑 2详情 3申請成為志願者
      placeholder: '主管機構...',
      searchJson: {
        type: '', //所有志愿者
        keyword: '',
        agencyCode: '',
        roleCode: '',
        exitStatus: ''
      },
      roleDict: null,
      dialogRoleDict: [],
      bindRoleVolunter: null,
      dialogVisible: false,
      radio: '',
      showMoreBtns: false,
      agencyList: [],
      level: [],
      pubDict: [],
      education: [],
      applyDataList: [],
      volUpdateAppleList: [],

      applySingleData: {},
      oldVolData: {},
      roleList: [],
      exitStatusList: [
        {
          code: '0',
          name: '正常'
        },
        {
          code: '2',
          name: '已註銷'
        }
      ],
      currentRoleCode: sessionStorage.getItem('vol-userRoleCode'),
      resetPwdVisible: false,
      changePwdModel: {
        userName: '',
        newPassword: '',
        newPasswordSure: '',
        id: ''
      },
      TempchangePwdModel: {
        userName: '',
        newPassword: '',
        newPasswordSure: '',
        id: ''
      },
      rules: {
        userName: [],
        oldPassword: [],
        newPassword: [
          {validator: validatePass, trigger: 'blur'}
        ],
        newPasswordSure: [
          {validator: validatePass2, trigger: 'blur'}
        ]
      },
      volunteerDataCount: 0,
      currentPage: 1,
      pageSize: 10,
      refuseVisible: false,
      refuseModel: {
        id: '',
        agencyCode: '',
        updatorId: '',
        updatorName: '',
        note: ''
      },
      activeTabIndex: 'all',

    }
  },
  methods: {
    formatExitStatus(row) {
      return row.exitStatus === '2' ? this.$t('已注銷').toString() : this.$t('正常').toString();
    },
    handleClick() {
      if (this.activeName === 'first') {
        this.isFirst = true;
        this.isSecond = false;
      } else if (this.activeName === 'second') {
        this.isFirst = false;
        this.isSecond = true;
      }
    },

    change() {
      this.$forceUpdate();
    },
    reset() {
      this.currentPage = 1;
      this.searchJson = {
        type: '',
        keyword: '',
        agencyCode: '',
        roleCode: ''
      };
      if (this.$refs.selectTree) {
        this.$refs.selectTree.valueModel = '';
        this.$refs.selectTree.labelModel = '';
      }
      this.search();
    },
    handleSearch() {
      this.currentPage = 1;
      this.search();
    },
    search() {
      // if (this.currentRoleCode !== '1') {
      //   this.searchJson.agencyCode = sessionStorage.getItem('userAgencyCode');
      // }else{
      if (this.$refs.selectTree) {
        this.searchJson.agencyCode = this.$refs.selectTree.valueModel;
      }
      // }
      let p = JSON.parse(JSON.stringify(this.searchJson));
      if (!p.roleCode || p.roleCode.length === 0) {
        if (this.activeTabIndex === 'sys') {
          p.roleCode = "1,2,7";
        } else if (this.activeTabIndex === "vol") {
          p.roleCode = "4";
        } else if (this.activeTabIndex === "stu") {
          p.roleCode = "6";
        } else {
          p.roleCode = '';
        }
      }

      p.page = this.currentPage;
      p.size = this.pageSize;

      this.tableData = [];

      this.$axios.post(window.volConfig.volUrl + 'volunteer/list', p).then(res => {

        this.advanceSearchVisible = false;
        res.data.data.forEach(e => {
          let cGender = this.genders.find(x => x.key === e.gender);
          e.age = getAge(e.birthday);
          if (cGender) {
            e.gender_text = cGender.value;
          }
        });
        this.tableData = res.data.data;
        this.volunteerDataCount = res.data.dataCount;
      });
    },
    batchDelete() {
      if (this.selectionChangeList.length === 0) {
        this.$message({
          type: 'error',
          message: '請選擇要刪除的用戶訊息',
        });
        return;
      }
      this.$confirm('是否批量刪除用戶訊息?', '批量刪除', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let tempIdsArr = [];
        this.selectionChangeList.forEach(e => {
          tempIdsArr.push(e.id);
        });
        let idsStr = tempIdsArr.join(',');
        let idsObj = {
          ids: idsStr
        };
        this.$axios.post(window.volConfig.volUrl + 'volunteer/batchDelete', idsObj).then(res => {
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
    compareVolObject(a, b) {
      //let aProps = Object.getOwnPropertyNames(a);
      let props = ['name', 'gender', 'agencyName', 'birthday', 'idType', 'idNumber', 'phone', 'email', 'addr',
        'education', 'graduateInstitution', 'degree', 'major', 'careerType', 'careerStatus', 'healthStatus',
        'language', 'level', 'status', 'speciality', 'resume', 'experience', 'intention'];
      let compare = {};
      for (let i = 0; i < props.length; i++) {
        let propName = props[i];
        if (a[propName] !== b[propName]) {
          compare[props[i]] = (a[propName] ? a[propName] : ' ')
        }
      }
      return compare;
    },
    add() {
      this.operateFlag = '0';
      this.showEditComponent = true;
      this.isShowDetail = false;
      this.editData = {};
    },
    handleCurrentChanage(data) {
      this.selectionChangeList = data;
    },
    detail(data) {
      this.$axios.get(window.volConfig.volUrl + 'volunteer/get/' + data.id).then(res => {
        this.operateFlag = '2';
        this.editData = res.data.data;
        this.isShowDetail = true;
        this.showEditComponent = true;
        // let xy = '';
        // if(this.editData.addr_x)
        // xy = this.editData.addr_x + ',' +this.editData.addr_y ;
        // this.$set(this.editData,'xy',xy);
      });
    },
    edit(data) {
      this.$axios.get(window.volConfig.volUrl + 'volunteer/get/' + data.id).then(res => {
        this.operateFlag = '1';
        this.editData = res.data.data;
        this.isShowDetail = false;
        this.showEditComponent = true;

        // let xy = '';
        // if(this.editData.addr_x)
        // xy = this.editData.addr_x + ',' +this.editData.addr_y ;
        // this.$set(this.editData,'xy',xy);
      });
    },
    // 还原
    reduction(data) {
      this.$confirm(this.$i18n.t('是否確定還原該用戶?'), this.$i18n.t('確定'), {
        confirmButtonText: this.$i18n.t('確定'),
        cancelButtonText: this.$i18n.t('取消'),
        type: 'warning'
      }).then(() => {
        this.$axios.post(window.volConfig.volUrl + 'volunteer/exit/cancel', data).then(res => {
          if (res.data.success) {
            this.search();
            this.$message({
              type: 'success',
              message: this.$i18n.t('已還原'),
            });
          } else {
            this.$message({
              type: 'danger',
              message: this.$i18n.t('還原失敗'),
            });
          }
        }).catch(() => {
          this.$message({
            type: 'danger',
            message: this.$i18n.t('還原失敗'),
          });
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$i18n.t('已取消'),
        });
      });
    },
    deleteSingle(data) {
      this.$confirm('是否刪除?', '刪除', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get(window.volConfig.volUrl + 'volunteer/delete/' + data.id).then(res => {
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
    getBackEditData() {
      this.showEditComponent = false;
    },
    getBackImportData() {
      this.showImportComponent = false;
    },
    addSuccess() {
      this.search();
    },
    async getRoleDict() {
      let tempRoleDict = await StaticDic.getRole();
      tempRoleDict.forEach(e => {
        e.isCheck = false;
      });
      this.roleDict = tempRoleDict;
      // this.roleDict.forEach(e => {
      //   if(e.code!=='4'&&e.code!=='5'&&e.code!=='6'){
      //      this.dialogRoleDict.push(e);
      //   }
      // });
      console.log(this.dialogRoleDict);
      this.agencyList = await StaticDic.getAgencyTree();
      this.pubDict = await StaticDic.getPub();
      this.level = this.pubDict.filter(x => x.parentCode === '10040000');
      this.education = this.pubDict.filter(x => x.parentCode === '10010000');
    },
    bindRole(data) {
      this.bindRoleVolunter = data;
      this.$axios.get(window.volConfig.volUrl + 'volunteer/get/' + data.id).then(res => {
        let tempVolModel = res.data.data;
        this.roleDict.forEach(e => {
          let temp = tempVolModel.roles.find(x => x.code === e.code);
          e.isCheck = !!temp;
        });
        let excludeRole = '4,5,6';
        if (data.roleCodes && data.roleCodes.includes('4')) {
          excludeRole = '5,6';
        }
        this.dialogRoleDict = this.roleDict.filter(x => excludeRole.indexOf(x.code) < 0);
        this.dialogVisible = true;
      });
    },
    bindRoleChanage(data) {
      if (data.code === '4' && data.isCheck === true) {
        data.isCheck = false;
        this.$message({
          type: 'info',
          message: '不允許手動關聯用戶角色！',
        });
        return;
      }
      let addRoleJson = {
        userId: this.bindRoleVolunter.accountId,
        roleId: data.id,
        roleCode: data.code,
        deptCode: sessionStorage.getItem('userAgencyCode'),
        deptNmae: sessionStorage.getItem('userAgencyName')
      };
      if (data.isCheck) {
        this.$axios.post(window.volConfig.volUrl + '/sys/userRole/add', addRoleJson).then(res => {
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '添加角色成功',
            });
          }
        });
      } else {
        this.$axios.post(window.volConfig.volUrl + '/sys/userRole/delete', addRoleJson).then(res => {
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '删除角色成功',
            });
          }
        });
      }

    },
    backBindRole() {
      this.dialogVisible = false;
    },
    handleClose() {
      this.dialogVisible = false;
      this.search();
    },
    moreSearch() {
      this.showMoreBtns = true;
      // for (let i = 0; i < this.agencyList.length; i++) {
      //   const element = this.agencyList[i];
      //   element.myCode = element.agencyCode;
      // }
    },
    resetPwd(data) {
      this.changePwdModel.userName = data.userName;
      this.changePwdModel.id = data.accountId;
      this.TempchangePwdModel.userName = data.userName;
      this.TempchangePwdModel.id = data.accountId;
      this.resetPwdVisible = true;
    },
    sureChangePwd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.changePwdModel.newPassword = this.$sha3.sha3_256(this.TempchangePwdModel.newPassword);
          this.changePwdModel.newPasswordSure = this.$sha3.sha3_256(this.TempchangePwdModel.newPasswordSure);
          this.$axios.post(window.volConfig.volUrl + 'sys/resetPassword', this.changePwdModel).then(res => {
            if (res.data.success) {
              this.$message({
                type: 'success',
                message: '重置密碼成功',
              });
              this.$refs[formName].resetFields();
              this.resetPwdVisible = false;
            } else {
              this.$message({
                type: 'danger',
                message: StaticDic.getErrorMessage(res.data.error.code),
              });
            }
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    changePwdClose(formName) {
      this.$refs[formName].resetFields();
      this.$message({
        type: 'info',
        message: '重置密碼已取消',
      });
      this.resetPwdVisible = false;
    },
    handleCurrentChange() {
      this.search();
    },
    importECP() {
      this.importData = {};
      this.showImportComponent = true;
    },
    handleTabClick() {
      this.search();
    }
  },
  mounted() {
    this.refuseModel.agencyCode = window.sessionStorage.getItem('userAgencyCode');
    this.refuseModel.updatorId = window.sessionStorage.getItem('userId');
    this.refuseModel.updatorName = window.sessionStorage.getItem('userName');
    this.roleList = this.$store.getters.getRoleList;
    setTimeout(() => {
      this.search();
      this.getRoleDict();
    }, 100);
  }
}
</script>
<style scoped lang="scss">
.volunteer {
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 95%;
  overflow: hidden;
  background-color: #fff;

  .searchbox {
    height: 70px;

    .innerRow_1 {
      .el-col {
        margin-right: 10px;
      }

      .el-input {
        width: 200px;
      }
    }

    .innerRow_2 {
      .el-col {
        margin-right: 10px;

        &:last-child {
          margin-right: 0;
          margin-left: 20px;
        }
      }

    }

    .lLine {
      float: left;
    }

    .rLine {
      float: right;
    }
  }

  .body {
    flex: 1;
    overflow: hidden;
  }

  .bind-all {
    height: auto;

    /deep/ th .el-checkbox {
      display: none;
    }
  }

  .roleForm {
    margin-top: -2%;

    .temp {
      width: 96%;
      text-align: center;
      display: flex;
      margin: 10px 0;

      .text_oneLine {
        flex: .44;
        min-width: 100px;
        text-align: right;
        padding-right: 10px;
        line-height: 40px;
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
        flex: 4;
      }
    }

    .el-select {
      // left:-23px;
      width: 100%;
    }

    .el-date-editor {
      width: 100%;
    }

    .btnBox {
      text-align: center;
    }
  }
}

.titleBox {
  letter-spacing: 2px;

  .histogram {
    width: 6px;
    height: 23px;
    margin: 8px 7px;
    background: rgb(39, 204, 147);
    float: left;
  }
}

/deep/ .el-tabs__nav .el-tabs__item.is-top {
  font-size: 20px !important;
}

/deep/ .el-table {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  /deep/ .el-table__header-wrapper {
    height: 49.33px;
  }

  /deep/ .el-table__body-wrapper {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
