<template>
  <div class="insurance_constraints">
      <div class="insurance_constraints_table">
          <el-table 
            :data="constraintsData"
            style="width: 100%"
            stripe
            border>
                <el-table-column prop="name" label="約束名稱" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="status" label="狀態" :show-overflow-tooltip="true" width="200" :formatter="formatStatus"></el-table-column>
                <el-table-column prop="typeCode" label="保險類型"  :show-overflow-tooltip="true" :formatter="formatType"></el-table-column>
                <el-table-column label="操作"  align="center" width="150">
                    <template slot-scope="scope" >
                        <!-- <el-button @click='detail(scope.row)' type="primary" icon="el-icon-document" size="small">詳情</el-button> -->
                        <el-button @click='edit(scope.row)' type="info" icon="el-icon-edit" size="small">編輯</el-button>
                  </template>
                </el-table-column>
            </el-table>
      </div>
      <div v-if="showVisible">
      <el-dialog :close-on-click-modal="false" :close-on-press-escape="false"
          :visible.sync="showVisible"
          width="40%"
          :show-close="false"
          title="编辑">
          <div style="padding:0 50px;">
              <el-form :model="constraintsModel" :rules="rules" ref="ruleForm" class="roleForm">
                  <div class="registerLine">
                      <span><span style="color: #e9232c" class="colorSpan">*</span>約束名稱</span>
                      <span>
                          <el-form-item prop="name">
                              <el-input :disabled="true" v-model="constraintsModel.name" clearable/>
                          </el-form-item>
                      </span>
                  </div>
                  <div class="registerLine">
                      <span><span style="color: #e9232c" class="colorSpan">*</span>狀態</span>
                      <span>
                          <el-form-item prop="status">
                              <el-select style="width:100%;"  v-model="constraintsModel.status"
                                         :popper-append-to-body="false">
                                   <el-option v-for="item of contraintsStatus" :key="item.code" :label="item.name" :value="item.code" :title="item.name"></el-option>
                                </el-select>
                          </el-form-item>
                      </span>
                  </div>
                  <div class="registerLine">
                      <span>保險類型</span>
                      <span>
                          <el-form-item prop="typeArr">
                               <el-select style="width:100%;"  v-model="constraintsModel.typeArr" multiple @input="change($event)"
                                          :popper-append-to-body="false">
                                   <el-option v-for="item of insuranceType" :key="item.code" :label="item.name" :value="item.code" :title="item.name"></el-option>
                                </el-select>
                          </el-form-item>
                      </span>
                  </div>
              </el-form>
              <div class="registerBtnBox">
                  <el-button @click='sureEdit("ruleForm")' type="primary" icon="el-icon-finished" size="small">確定</el-button>
                  <el-button @click='closeEdit("ruleForm")'  icon="el-icon-close" size="small">取消</el-button>
              </div>
          </div>
      </el-dialog>
      </div>
  </div>
</template>
<script>
import StaticDic from '../../common/static/infoDic'

export default {
  name: 'insuranceconstraintsmanage',
  components:{
  },
  props: {
  },
  data: function() {
    return {
      rules: {
          name: [
              {required: true, message: '請輸入約束名稱', trigger: 'blur'},
          ],
          status: [
              {required: true, message: '請選擇狀態', trigger: 'blur'},
          ],
      },
      constraintsData:[],
      insuranceType:[],
      showVisible:false,
      constraintsModel:{},
      contraintsStatus:[
        {code:'0',name:'未開啟'},
        {code:'1',name:'已開啟'}
      ]
    }
  },
  methods: {
    change(e){
        this.$forceUpdate();
    },
    edit(data){
      this.constraintsModel = JSON.parse(JSON.stringify(data));
      if(data.typeCode) this.constraintsModel.typeArr = data.typeCode.split(',')
      this.showVisible = true;
    },
    sureEdit(formName){
        this.$refs[formName].validate((valid) => {
            if (valid) {
              if(this.constraintsModel.typeArr && this.constraintsModel.typeArr.length > 0 ){
                this.constraintsModel.typeCode = this.constraintsModel.typeArr.join(',')
              }else{
                this.constraintsModel.typeCode = ''
              }

              this.$axios.post(window.volConfig.volUrl + 'dict/insuranceConstraints/update', this.constraintsModel).then(res => {
                  if (res.data.success) {
                      this.$refs[formName].resetFields();
                      this.$message.success('編輯成功');
                      this.showVisible = false;
                      this.initData();
                  }
              });
            }else {
              console.log('error submit!!');
              return false;
            }
        })
    },
    closeEdit(formName){
      this.constraintsModel = {};
      this.showVisible = false;
    },
    formatStatus(row, column){
      if(row.status === '1') {
        return '已開啟'
      }else{
        return '未開啟'
      }
    },
    formatType(row, column){
      if(!row.typeCode) {
        return '';
      }
      let nameArr = [];
      let codeArr = row.typeCode.split(',');
      codeArr.forEach(e => {
        let a = this.insuranceType.find(x => x.code === e);
        if(a) nameArr.push(a.name);
      });
      return nameArr.join(',')
    },
    async initData(){
        this.$axios.post(window.volConfig.volUrl + 'dict/insuranceConstraints/list', {}).then(res => {
          if(res.data.success){
              this.constraintsData = res.data.data;
          }
        });
    },
    async initDict(){
      this.pubDict = await StaticDic.getPub();
      this.insuranceType = this.pubDict.filter(x => x.parentCode === '10070000');
    }
  },
  mounted() {
    setTimeout(()=>{
      this.initData();
      this.initDict();
    },100);
  },
  create(){

  }
}

</script>
<style lang="scss" scoped>
 .insurance_constraints {
    padding: 10px;
    height: 95%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background-color: #fff;
 }
 .insurance_constraints_table {
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
  /deep/ .el-dialog {
      overflow: visible;
  }
</style>

