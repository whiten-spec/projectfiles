<template>
    <!-- <div class="dicthonorlevel_edit_box"> -->
        <div class="dicthonorlevel_edit">
             <el-form :model="dicthonorlevelModel" :rules="rules" ref="editForm" class="roleForm">
                <div class="temp">
                    <p class="text"><span class="colorSpan">*</span>活動類型</p>
                    <p class="putBox_long">
                        <el-form-item prop="name">
                            <el-input v-model="dicthonorlevelModel.name" :disabled="true" maxlength=100 clearable />
                        </el-form-item>
                    </p>
                </div>
                <div class="temp">
                    <p class="text"><span class="colorSpan">*</span>係數</p>
                    <p class="putBox_long">
                        <el-form-item prop="score">
                            <!-- <el-input v-model="dicthonorlevelModel.score" :disabled="isShowDetail" maxlength=8 clearable /> -->
                            <el-input-number v-model="dicthonorlevelModel.score" :disabled="isShowDetail" :precusuib="1" :step="0.1" :max="5" :min="0.0"></el-input-number>
                        </el-form-item>
                    </p>
                </div>
                <div class="temp">
                    <p class="text"><span class="colorSpan">*</span>備註</p>
                    <p class="putBox_long">
                        <el-form-item prop="note">
                            <el-input maxlength="1000" show-word-limit :rows="3" type="textarea" v-model="dicthonorlevelModel.note" :disabled="isShowDetail"  clearable />
                        </el-form-item>
                    </p>
                </div>
             </el-form>
            <div class="btnBox">
                <el-row class="btn-row" v-if="!isShowDetail">
                    <el-button @click='sureAdddicthonorlevel("editForm")' type="primary" icon="el-icon-finished" size="small">確定</el-button>
                    <el-button @click='backEdit("editForm")'  icon="el-icon-close" size="small">取消</el-button>
                </el-row>
                <el-row class="btn-row" v-if="isShowDetail">
                    <el-button @click='backEdit2("editForm")'   icon="el-icon-circle-check" size="small">返回</el-button>
                </el-row>
            </div>
        </div>
    <!-- </div> -->
</template>
<script>
    import {messageError, messageSuccess, messageWarning} from "../../common/prompt-utils";

export default {
    name: 'honorleveledit',
    props: {
        dicthonorlevelModel: {
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
                score: [
                    {required: true, message: '請輸入時長', trigger: 'blur'},
                ],
                note: [
                    {required: true, message: '請輸入備註', trigger: 'blur'},
                ],
            },
        }
    },
    methods: {
        backEdit(form) {
            messageWarning('操作已取消');
            this.$refs[form].resetFields();
            this.$emit('backEdit', false);
        },
        backEdit2(form) {
            this.$refs[form].resetFields();
            this.$emit('backEdit', false);
        },
        sureAdddicthonorlevel(form){
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.sureAdddicthonorlevelRight();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        sureAdddicthonorlevelRight() {
                this.dicthonorlevelModel.updatorId = window.sessionStorage.getItem('userId');
                this.dicthonorlevelModel.updatorName = window.sessionStorage.getItem('userName');
                this.dicthonorlevelModel.updateTime = new Date().getTime();
                this.$axios.post(window.volConfig.volUrl + 'dict/updateVolunteerLevel', this.dicthonorlevelModel).then(res => {
                    if (!res.data.success) {
                        messageError('操作失敗, 請稍後再試');
                    }

                    if (res.data.success) {
                        messageSuccess('操作成功');
                        this.$emit('onSuccess', res.data.data);
                        this.$emit('backEdit', false);
                    }
                }).catch(() => messageError('操作失敗, 請稍後再試'));
        },
     
    },
    mounted() {
    }
}
</script>
<style lang="scss" scoped>
    .dicthonorlevel_edit{
            padding: 2% 0;
            flex: 1;
            overflow: auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .colorSpan{
                color: #e9232c;
            }
        }
        .temp {
            display: flex;
            width: 95%;
            padding-top: 1%; 
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
            &>p.text {
                flex: 2;
                min-width: 100px;
                text-align: right;
                padding-right: 10px;
                line-height: 40px;
            }
            &>p.putBox {
                flex: 4;
            }

            &>p.putBox_long
            {
                flex: 8;
            }

        }
        /deep/ .el-form-item__error {
            font-size: 16px !important;
        }
        /deep/ .el-textarea__inner {
            font-size: 20px;
        }
        /deep/ .el-input-number {
            width: 100%;
        }
        /deep/ .el-input-number__decrease , /deep/ .el-input-number__increase {
            height: 38px;
            padding-top: 8px;
        }
        .el-select {
            display: block;
        }
        .btnBox {
            text-align: center;
            height: 70px;
            padding-top: 2%;
        }
        .dataPicker {
            width: 100%;
        }
</style>



