<template>
    <div class="systemconfig_edit_box">
        <div class="editTitle">{{editTitle}}</div>
        <div class="systemconfig_edit">
             <el-form :model="systemconfigModel" :rules="rules" ref="editForm" class="roleForm">
                <div class="temp">
                    <p class="text"><span class="colorSpan">*</span>配置編碼</p>
                    <p class="putBox">
                        <el-form-item prop="code">
                            <el-input v-model="systemconfigModel.code" :disabled="true" maxlength=512 clearable/>
                        </el-form-item>
                    </p>
                </div>
                <div class="temp">
                     <p class="text"><span class="colorSpan">*</span>配置描述</p>
                    <p class="putBox">
                        <el-form-item prop="content">
                            <el-input v-model="systemconfigModel.content" :disabled="true" maxlength=4000 clearable/>
                        </el-form-item>
                    </p>
                </div>
                <div class="temp">
                    <p class="text"><span class="colorSpan">*</span>配置值</p>
                    <p class="putBox">
                        <el-form-item prop="value">
                            <el-input v-model="systemconfigModel.value" :disabled="isShowDetail" maxlength=512 clearable/>
                        </el-form-item>
                    </p>
                </div>
                <div class="temp">
                    <p class="text">配置單位</p>
                    <p class="putBox">
                        <el-form-item prop="unit">
                            <el-input v-model="systemconfigModel.unit"  maxlength=256 clearable/>
                        </el-form-item>
                    </p>
                </div>
                <div class="btnBox">
                    <el-row class="btn-row" v-if="!isShowDetail">
                        <el-button @click='sureAddsystemconfig("editForm")' type="primary" icon="el-icon-finished" size="small">確定</el-button>
                        <el-button @click='backEdit("editForm")'  icon="el-icon-close" size="small">取消</el-button>
                    </el-row>
                    <el-row class="btn-row" v-if="isShowDetail">
                        <el-button @click='backEdit("editForm")'   icon="el-icon-circle-check" size="small">返回</el-button>
                    </el-row>
                </div>
             </el-form>
        </div>
    </div>
</template>
<script>
import StaticDic from '../../common/static/infoDic'
export default {
    name: 'systemconfigEdit',
    props: {
        editTitle: {
            type: String
        },
        systemconfigModel: {
            type: Object,
        },
        isShowDetail: {
            type: Boolean,
        },
        operationType: {
            type: String
        }
    },
    components:{
    },
    data: function() {
        return {
            rules: {
                    code: [
                        {required: true, message: '請輸入配置編碼', trigger: 'blur'},
                    ],
                    value: [
                        {required: true, message: '請輸入配置值', trigger: 'blur'},
                    ],
            },
            volunteerModel: this.$store.getters.getVolunteerModel,
        }
    },
    methods: {
        backEdit(form) {
            this.$refs[form].resetFields();
            this.$emit('backEdit', false);
        },
        sureAddsystemconfig(form){
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.sureAddsystemconfigRight();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        sureAddsystemconfigRight() {
                this.systemconfigModel.updatorId = this.volunteerModel.id;
                this.systemconfigModel.updatorName = this.volunteerModel.name;
                const that = this
                this.$axios.post(window.volConfig.volUrl + 'sys/config/update', this.systemconfigModel).then(res => {
                    if (res.data.success) {
                        if ( that.systemconfigModel.code === "volunteer.default.password.enable" || that.systemconfigModel.code === "volunteer.default.password" ){
                            StaticDic.updateDefaultPassword();
                        }
                        that.$emit('addSuccess', res.data.data);
                    }
                });
            
        },
     
    },
    mounted() {

    }
}
</script>
<style lang="scss" scoped>
   .systemconfig_edit_box {
        // height: 74vh;
        margin: 0 1%;
        height: 500px;
        overflow: hidden;
        background-color: white;
        border: 1px solid #f0f0f0;
        display: flex;
        flex-direction: column;
        .editTitle{
            position: inherit;
            width: 100%;
            height: 40px;
            padding: 10px 20px;
            border-bottom: 1px solid #f0f0f0;
            letter-spacing: 3px;

        }
        .systemconfig_edit{
            padding: 2% 0;
            flex: 1;
            overflow: auto;
            .colorSpan{
                color: #e9232c;
            }
        }
        .temp {
            display: flex;
            width: 90%;
            padding-left: 5%;
            padding-top: 1%; 
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
            &>p.text {
                flex: 2;
                min-width: 100px;
                text-align: right;
                padding-right: 10px;
                line-height: 40px;
                margin-left: 10%;
            }
            &>p.putBox {
                flex: 8;
            }

        }
        /deep/ .el-form-item__error {
            font-size: 16px !important;
        }
        /deep/ .el-textarea__inner {
            font-size: 20px;
        }
        .el-select {
            display: block;
        }
        .btnBox {
            text-align: center;
            height: 70px;
            padding-top: 4%;
        }
        .dataPicker {
            width: 100%;
        }
        /deep/ .el-upload__input{
            display: none;
        }
        .el-upload_tip{
            color: red;
            font-size: medium;
            height: 35px;
        }
        /deep/ .el-upload{
            float: left;
            padding-right: 10px;
        }
    }
</style>



