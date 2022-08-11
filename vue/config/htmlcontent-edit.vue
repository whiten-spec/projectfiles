<template>
    <div class="htmlcontent_edit_box">
        <div class="editTitle">{{editTitle}}</div>
        <div class="htmlcontent_edit">
             <el-form :model="html_contentModel" :rules="rules" ref="editForm" class="roleForm">
                <div class="temp">
                    <p class="text"><span class="colorSpan">*</span>名稱</p>
                    <p class="putBox">
                        <el-form-item prop="name">
                            <el-input v-model="htmlcontentModel.name" :disabled="isShowDetail" maxlength = 512 clearable /> 
                        </el-form-item>
                    </p>
                    <p class="text"><span class="colorSpan">*</span>語言</p>
                    <p class="putBox">
                        <el-form-item prop="language">
                            <el-input v-model="htmlcontentModel.language" :disabled="isShowDetail" maxlength = 512 clearable /> 
                        </el-form-item>
                    </p>
                </div>
                <div class="temp">
                    <p class="text"><span class="colorSpan">*</span>內容</p>
                    <p class="putBox">
                        <el-form-item prop="content">
                            <el-input v-model="htmlcontentModel.content" :disabled="isShowDetail" maxlength = 4000 clearable /> 
                        </el-form-item>
                    </p>
                </div>
                <div class="btnBox">
                    <el-row class="btn-row" v-if="!isShowDetail">
                        <el-button @click='sureAddhtmlcontent("editForm")' type="primary" icon="el-icon-finished" size="small">確定</el-button>
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
export default {
    name: 'htmlcontentEdit',
    props: {
        editTitle: {
            type: String
        },
        htmlcontentModel: {
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
                        {required: true, message: '請輸入編碼', trigger: 'blur'},
                    ],
                    name: [
                        {required: true, message: '請輸入名稱', trigger: 'blur'},
                    ],
                    language: [
                        {required: true, message: '請輸入語言', trigger: 'blur'},
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
        sureAddhtmlcontent(form){
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.sureAddhtmlcontentRight();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        sureAddhtmlcontentRight() {
            if (this.operationType === '2') {
                this.htmlcontentModel.updatorId = this.volunteerModel.id;
                this.htmlcontentModel.updatorName = this.volunteerModel.name;
                this.$axios.post(window.volConfig.volUrl + 'htmlcontent/update', this.htmlcontentModel).then(res => {
                    if (res.data.success) {
                        this.$emit('addSuccess', res.data.data);
                        this.$emit('backEdit', false);
                    }
                });

            }else if(this.operationType === '1') {
                this.htmlcontentModel.creatorId = this.volunteerModel.id;
                this.htmlcontentModel.creatorName = this.volunteerModel.name;
                this.$axios.post(window.volConfig.volUrl + 'htmlcontent/add', this.htmlcontentModel).then(res => {
                    if (res.data.success) {
                        this.$emit('addSuccess', res.data.data);
                        this.$emit('backEdit', false);
                    }
                    
                });
            }
            
        },
     
    },
    mounted() {
    //   console.log("html content edit initial")
    }
}
</script>
<style lang="scss" scoped>
   .htmlcontent_edit_box {
        // height: 74vh;
        margin: 0 1%;
        height: 100%;
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
        .htmlcontent_edit{
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
                flex: 1.5;
                min-width: 100px;
                text-align: right;
                padding-right: 10px;
                line-height: 40px;
                margin-left: 10%;
            }
            &>p.putBox {
                flex: 4;
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



