<template>
    <div class="equip_edit_box">
        <div class="editTitle">{{editTitle}}</div>
        <div class="equip_edit">
            <el-form v-if="currentRoleCode!=='4' && currentRoleCode!=='6'" :model="equipModel" :rules="rules" ref="editForm" class="roleForm">
                <div class="temp">
                    <p class="text"><span class="colorSpan">*</span>裝備名稱</p>
                    <p class="putBox">
                        <el-form-item prop="name">
                            <el-input v-model="equipModel.name" :disabled="isShowDetail" maxlength=100 clearable/>
                        </el-form-item>
                    </p>
                    <p class="text"><span class="colorSpan">*</span>所屬機構</p>
                    <p class="putBox">
                        <el-form-item prop="agencyCode">
                                <select-tree  ref="selectTree" :disabled="isShowDetail || currentRoleCode !== '1'" :options="agencyList" placeholder="請選擇"/>            
                        </el-form-item>
                    </p>
                </div>
                <div class="temp">
                    <p class="text"><span class="colorSpan">*</span>裝備類型</p>
                    <p class="putBox">
                        <el-form-item prop="typeCode">
                                <el-select :popper-append-to-body="false" :disabled="isShowDetail" style="width:100%;"  v-model="equipModel.typeCode" >
                                    <el-option :title="item.name" v-for="item of equipType" :key="item.code" :label="item.name" :value="item.code"></el-option>
                                </el-select>
                        </el-form-item>
                    </p>
                    <p class="text"><span class="colorSpan">*</span>有效時間</p>
                    <p class="putBox">
                        <el-form-item prop="effectiveTime">
                            <el-date-picker class="dataPicker" type="datetime" :disabled="isShowDetail" v-model="equipModel.effectiveTime"  :editable="false" clearable/>
                        </el-form-item>
                    </p>
                </div>
                <div class="temp" v-if="isShowDetail">
                    <p class="text"><span class="colorSpan">*</span>現存數量</p>
                    <p class="putBox">
                        <el-form-item prop="existNum">
                            <el-input v-model.number="equipModel.existNum" :disabled="true" type="number" clearable/>
                        </el-form-item>
                    </p>
                    <p class="text"></p>
                    <p class="putBox">                   
                    </p>
                </div>
            </el-form>
            <el-form v-if="currentRoleCode==='4' || currentRoleCode==='6'" :model="equipModel" :rules="rules" ref="editForm" class="roleForm">
                <div class="temp">
                    <p class="text"><span class="colorSpan">*</span>裝備名稱</p>
                    <p class="putBox">
                        <el-form-item prop="equipmentName">
                            <el-input v-model="equipModel.equipmentName" :disabled="isShowDetail" maxlength=100 clearable/>
                        </el-form-item>
                    </p>
                    <p class="text"><span class="colorSpan">*</span>所屬機構</p>
                    <p class="putBox">
                        <el-form-item prop="agencyCode">
                                <select-tree  ref="selectTree" :disabled="isShowDetail || currentRoleCode !== '1'" :options="agencyList" placeholder="請選擇"/>            
                        </el-form-item>
                    </p>
                </div>
                <div class="temp">
                    <p class="text"><span class="colorSpan">*</span>裝備類型</p>
                    <p class="putBox">
                        <el-form-item prop="typeCode">
                                <el-select :popper-append-to-body="false" :disabled="isShowDetail" style="width:100%;"  v-model="equipModel.typeCode" >
                                    <el-option :title="item.name" v-for="item of equipType" :key="item.code" :label="item.name" :value="item.code"></el-option>
                                </el-select>
                        </el-form-item>
                    </p>
                    <p class="text"><span class="colorSpan">*</span>發放時間</p>
                    <p class="putBox">
                        <el-form-item prop="assignTime">
                            <el-date-picker class="dataPicker" type="datetime" :disabled="isShowDetail" v-model="equipModel.assignTime"  :editable="false" clearable/>
                        </el-form-item>
                    </p>
                </div>
                <div class="temp" v-if="isShowDetail">
                    <p class="text"><span class="colorSpan">*</span>領取數量</p>
                    <p class="putBox">
                        <el-form-item prop="assignNum">
                            <el-input v-model.number="equipModel.assignNum" :disabled="true" type="number" clearable/>
                        </el-form-item>
                    </p>
                    <p class="text"><span class="colorSpan">*</span>狀態</p>
                    <p class="putBox">
                        <el-form-item prop="status">
                            <el-input v-model="equipModel.status" :disabled="isShowDetail" clearable/>
                        </el-form-item>
                    </p>
                </div>
            </el-form>
            <div class="btnBox">
                <el-row class="btn-row" v-if="!isShowDetail">
                    <el-button @click='sureAddequip("editForm")' type="primary" icon="el-icon-finished" size="small">確定</el-button>
                    <el-button @click='backEdit("editForm")'  icon="el-icon-close" size="small">取消</el-button>
                </el-row>
                <el-row class="btn-row" v-if="isShowDetail">
                    <el-button @click='backEdit("editForm")' icon="el-icon-circle-check" size="small">返回</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>
<script>
import StaticDic from '../../common/static/infoDic'
import SelectTree from '../../common/static/SelectTree.vue'; 
export default {
    name: 'equipEdit',
    props: {
        editTitle: {
            type: String
        },
        equipModel: {
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
        SelectTree,
    },
    data: function() {
        return {
            rules: {
                    name: [
                        {required: true, message: '請輸入裝備名稱', trigger: 'blur'},
                    ],
                    agencyCode: [
                        {required: true, message: '請輸入所屬機構', trigger: 'blur'},
                    ],
                    typeCode: [
                        {required: true, message: '請輸入裝備類型', trigger: 'change'},
                    ],
                    effectiveTime: [
                        {required: true, message: '請輸入有效時間', trigger: 'blur'},
                    ],
            },
            volunteerModel: this.$store.getters.getVolunteerModel,
            agencyList:[],
            equipType:[],
            currentRoleCode: sessionStorage.getItem('vol-userRoleCode'),
        }
    },
    methods: {
        // change(e){
        //     this.$forceUpdate();
        // },
        backEdit(form) {
            this.$refs[form].resetFields();
            this.$emit('backEdit', false);
        },
        sureAddequip(form){
            if(this.$refs.selectTree){
                this.equipModel.agencyCode=this.$refs.selectTree.valueModel;
                this.equipModel.agencyName=this.$refs.selectTree.labelModel;
            }
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.sureAddequipRight();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        sureAddequipRight() {
            if (this.operationType === '2') {
                this.equipModel.updatorId = this.volunteerModel.id;
                this.equipModel.updatorName = this.volunteerModel.name;
                this.$axios.post(window.volConfig.volUrl + 'equip/update', this.equipModel).then(res => {
                    if (res.data.success) {
                        this.$message.info('編輯成功');
                        this.$emit('addSuccess', res.data.data);
                        this.$emit('backEdit', false);
                    }
                });

            }else if(this.operationType === '1') {
                this.equipModel.creatorId = this.volunteerModel.id;
                this.equipModel.creatorName = this.volunteerModel.name;
                this.equipModel.existNum = '0';
                this.$axios.post(window.volConfig.volUrl + 'equip/add', this.equipModel).then(res => {
                    if (res.data.success) {
                        this.$message.info('新增成功');
                        this.$emit('addSuccess', res.data.data);
                        this.$emit('backEdit', false);
                    }
                    
                });
            }
        },
        async getDic() {
            this.agencyList = await StaticDic.getAgencyTree();
            let pub = await StaticDic.getPub();
            this.equipType = pub.filter(x => x.parentCode === '10090000');
            if(this.equipModel.agencyCode){
                this.$refs.selectTree.valueModel = this.equipModel.agencyCode;
                this.$refs.selectTree.labelModel = this.equipModel.agencyName;
            }else{
                this.$refs.selectTree.valueModel = sessionStorage.getItem('userAgencyCode');
                this.$refs.selectTree.labelModel = sessionStorage.getItem('userAgencyName');
            }
        }
     
    },
    mounted() {
        setTimeout(()=>{
            this.getDic();
        },100);
    }
}
</script>
<style lang="scss" scoped>
   .equip_edit_box {
        // height: 74vh;
        margin: 0 1%;
        height: 50%;
        overflow: auto;
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
        .equip_edit{
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


