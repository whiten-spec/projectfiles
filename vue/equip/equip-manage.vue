<template>
  <div class="equip">
    <div class="searchBox">
      <el-select v-if="currentRoleCode==='4' || currentRoleCode==='6'" :popper-append-to-body="false"
                 :placeholder="$t('裝備狀態')" v-model="searchJsonEquip.status" clearable
                 style="width:270px !important;margin-right:10px;display: inline-block;">
        <el-option :title="item.name" v-for="item of statusType" :key="item.value" :label="item.name"
                   :value="item.value"></el-option>
      </el-select>
      <el-date-picker v-if="currentRoleCode==='4' || currentRoleCode==='6'" class="dataPicker" type="date"
                      :placeholder="$t('發放時間')" v-model="searchJsonEquip.startTime" :editable="false" clearable
                      style="width:180px !important;margin-right:10px;display: inline-block;"/>
      <el-button v-if="currentRoleCode==='4' || currentRoleCode==='6'" @click='getEquipData' icon="el-icon-search"
                 type="primary" size="small">{{ $t('搜索') }}
      </el-button>


      <el-input v-if="currentRoleCode!=='4' && currentRoleCode!=='6'" v-model="searchJson.keyword" placeholder="關鍵字..."
                clearable style="width:260px !important;margin-right:10px"/>
      <select-tree v-if="currentRoleCode!=='4' && currentRoleCode!=='6'" :placeholder="placeholder" ref="selectTree"
                   :options="agencyList" :disabled="currentRoleCode !=='1'" :clearable="true"
                   style="width:260px !important;margin-right:10px"/>
      <el-button v-if="currentRoleCode!=='4' && currentRoleCode!=='6'" @click='search' icon="el-icon-search"
                 type="primary" size="small">搜索
      </el-button>
      <el-button v-if="currentRoleCode!=='4' && currentRoleCode!=='6'" @click='reset' icon="el-icon-refresh"
                 type="primary" size="small">重置
      </el-button>
      <el-button @click='add' icon="el-icon-plus" type="success" size="small"
                 v-if="currentRoleCode!=='4' && currentRoleCode!=='6'">添加
      </el-button>

      <!-- currentRoleCode 為4表示志願者，為6表示學員 -->
      <el-button @click='equipOperation2' icon="el-icon-document" type="info" size="small"
                 v-if="currentRoleCode!=='4' && currentRoleCode!=='6'">裝備記錄
      </el-button>
      <el-button @click='equipOperation' icon="el-icon-document" type="info" size="small"
                 v-if="currentRoleCode==='4' || currentRoleCode==='6'">裝備記錄
      </el-button>

    </div>
    <div class="body">
      <el-table height="100%"
                :data="pageEquipData"
                style="width: 100%"
                stripe
                border
                v-if="!(currentRoleCode !== '4' && currentRoleCode !== '5' && currentRoleCode !== '6')">
        <el-table-column prop="typeCode" :label="$t('裝備類型')" width="250"
                         :formatter="formatterEquipType"></el-table-column>
        <el-table-column prop="equipmentName" sortable :label="$t('裝備名稱')"></el-table-column>
        <el-table-column prop="assignTime" sortable :label="$t('發放時間')" :formatter="formatDate"></el-table-column>
        <el-table-column prop="agencyName" sortable :label="$t('所屬機構')" width="280"></el-table-column>
        <el-table-column prop="assignNum" sortable :label="$t('領取數量')" width="200"></el-table-column>
        <el-table-column prop="status" sortable :label="$t('狀態')" width="220"
                         :formatter="formatterEquipStatus"></el-table-column>

        <el-table-column label="操作" width="110" align="center">
          <template slot-scope="scope">
            <el-button v-if="!(currentRoleCode !== '4' && currentRoleCode !== '5' && currentRoleCode !== '6')"
                       @click='detail(scope.row)' type="primary" icon="el-icon-document" size="small"
                       title="詳情"></el-button>
            <el-popover
                placement="bottom"
                width="100"
                trigger="click" v-if="currentRoleCode !== '4' && currentRoleCode !== '5' && currentRoleCode !== '6'">
              <div class="tableBtnBox">
                <el-button @click='detail(scope.row)' type="primary" icon="el-icon-document" size="small">詳情</el-button>
                <el-button @click='edit(scope.row)' type="info" icon="el-icon-edit" size="small">編輯</el-button>
                <el-button @click='showEquip(scope.row)' icon="el-icon-sell" type="success" size="small"
                           :disabled="scope.row.existNum===0">發放
                </el-button>
                <el-button @click='enterHouse(scope.row)' icon="el-icon-sold-out" type="warning" size="small">入庫
                </el-button>
                <el-button @click='enterHouseListHistory(scope.row)' icon="el-icon-document" type="success"
                           size="small">入庫歷史
                </el-button>
                <el-button @click='deleteSingle(scope.row)' type="danger" size="small" icon="el-icon-delete">刪除
                </el-button>
              </div>
              <el-button slot="reference">...</el-button>
            </el-popover>
          </template>

        </el-table-column>
      </el-table>

      <el-table height="100%"
                :data="currentData"
                style="width: 100%"
                stripe
                border
                v-if="(currentRoleCode !== '4' && currentRoleCode !== '5' && currentRoleCode !== '6')">
        <el-table-column prop="name" label="裝備名稱" sortable :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="agencyName" label="所屬機構" sortable width="300"></el-table-column>
        <el-table-column prop="typeCode" label="裝備類型" sortable width="300" :formatter="formatterType"></el-table-column>
        <el-table-column prop="existNum" label="現存數量" sortable width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="effectiveTime" label="有效時間" sortable :formatter="formatDate" width="250"></el-table-column>
        <el-table-column label="操作" width="110" align="center">
          <template slot-scope="scope">
            <el-button v-if="!(currentRoleCode !== '4' && currentRoleCode !== '5' && currentRoleCode !== '6')"
                       @click='detail(scope.row)' type="primary" icon="el-icon-document" size="small"
                       title="详情"></el-button>
            <el-popover
                placement="bottom"
                width="100"
                trigger="click" v-if="currentRoleCode !== '4' && currentRoleCode !== '5' && currentRoleCode !== '6'">
              <div class="tableBtnBox">
                <el-button @click='detail(scope.row)' type="primary" icon="el-icon-document" size="small">詳情</el-button>
                <el-button @click='edit(scope.row)' type="info" icon="el-icon-edit" size="small">編輯</el-button>
                <el-button @click='showEquip(scope.row)' icon="el-icon-sell" type="success" size="small"
                           :disabled="scope.row.existNum===0">發放
                </el-button>
                <el-button @click='enterHouse(scope.row)' icon="el-icon-sold-out" type="warning" size="small">入庫
                </el-button>
                <el-button @click='enterHouseListHistory(scope.row)' icon="el-icon-document" type="success"
                           size="small">入庫歷史
                </el-button>
                <el-button @click='deleteSingle(scope.row)' type="danger" size="small" icon="el-icon-delete">刪除
                </el-button>
              </div>
              <el-button slot="reference">...</el-button>
            </el-popover>
          </template>

        </el-table-column>
      </el-table>

      <div class="foot" v-if="!(currentRoleCode !== '4' && currentRoleCode !== '5' && currentRoleCode !== '6')">
        <rs-page :pageInfo='pageInfoOfEquip' @pageChange="EquipPageChange"></rs-page>
      </div>

      <div class="foot" v-if="currentRoleCode !== '4' && currentRoleCode !== '5' && currentRoleCode !== '6'">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dataCount">
        </el-pagination>
      </div>
    </div>
    <div v-if="showEditComponent">
      <el-dialog :close-on-click-modal="false" :close-on-press-escape="false"
                 :visible.sync="showEditComponent"
                 width="70%"
                 :before-close="getBackEditData">
        <equip-edit v-if="showEditComponent" :equipModel="editData" :editTitle="editComponentTitle"
                    @backEdit="getBackEditData" @addSuccess="addSuccess"
                    :isShowDetail="isShowDetail" :operationType='operationType'></equip-edit>
      </el-dialog>
    </div>

    <div v-if="showVisible">
      <el-dialog title="發放裝備" :close-on-click-modal="false" :close-on-press-escape="false"
                 :visible.sync="showVisible"
                 width="55%"
                 custom-class="issueDialogCls"
                 :show-close="true"
                 @close='issueClose("ruleForm")'>
        <div style="padding:0 20px;height: 600px;overflow-y: auto;">
          <el-form :model="issueModel" :rules="rules" ref="ruleForm" class="roleForm">
            <div class="registerLine">
              <span>裝備名稱</span>
              <span>
                          <el-form-item>
                              <el-input :disabled="true" v-model="issueObject.name" clearable/>
                          </el-form-item>
                      </span>
            </div>
            <div class="registerLine">
              <span>現存數量</span>
              <span>
                          <el-form-item>
                              <el-input :disabled="true" v-model.number="issueObject.existNum" clearable/>
                          </el-form-item>
                      </span>
            </div>
            <div class="registerLine">
              <span><span class="colorSpan">*</span>發放數量</span>
              <span>
                          <el-form-item prop="assignNum">
                              <base-input-number :num.sync="issueModel.assignNum" :max="issueObject.existNum"/>
                          </el-form-item>
                      </span>
            </div>
            <div class="registerLine">
              <span><span class="colorSpan">*</span>發放時間</span>
              <span>
                      <el-form-item prop="assignTime">
                          <el-date-picker class="dataPicker" type="datetime" v-model="issueModel.assignTime" clearable/>
                      </el-form-item>
                  </span>
            </div>
            <div class="registerLine">
              <span><span class="colorSpan">*</span>領取志願者</span>
              <span>
                          <el-form-item prop="assignVolunteerId">
                             <el-transfer
                                 :props="{
                                    key: 'id',
                                    label: 'nameAndDate'
                                }"
                                 v-model="rightVol"
                                 :data="leftAndRightVol"
                                 :titles="titles"
                                 @change="rightListChange">
                                <div class="left-search" slot="left-footer">
                                    <el-date-picker v-model="leftSearch.date" type="month" value-format="yyyy-MM"
                                                    placeholder="選擇月" @change="filterMethod('left')"></el-date-picker>
                                    <el-input v-model="leftSearch.name" @change="filterMethod('left')" style="width:200px;margin-left: 10px;" :placeholder="$t('姓名')" clearable></el-input>
                                </div>
                                <div class="right-search" slot="right-footer">
                                    <el-date-picker v-model="rightSearch.date" type="month" value-format="yyyy-MM"
                                                    placeholder="選擇月" @change="filterMethod('right')"></el-date-picker>
                                    <el-input v-model="rightSearch.name" @change="filterMethod('right')" style="width:200px;margin-left: 10px;" :placeholder="$t('姓名')" clearable></el-input>
                                </div>
                            </el-transfer>
                          </el-form-item>
                          
                      </span>
            </div>
            <div class="registerLine">
              <span>備註</span>
              <span>
                          <el-form-item prop="note">
                              <el-input @input="change($event)" v-model="issueModel.note" type="textarea"
                                        show-word-limit maxlength="1000" :rows="5" clearable/>
                          </el-form-item>
                      </span>
            </div>
            <div class="registerLine" style="display:flex;">
              <span style="flex:1;font-size:15px;">是否需要歸還</span>
              <span style="flex:4.8">
                          <el-form-item style="margin-top: 4px;">
                               <el-checkbox v-model="issueModel.isReturn" true-label="1" false-label="0"></el-checkbox>
                          </el-form-item>
                      </span>
            </div>
          </el-form>
          <div class="registerBtnBox">
            <el-button @click='sureIssue("ruleForm")' type="primary" icon="el-icon-finished" size="small">確定</el-button>
            <el-button @click='issueClose("ruleForm")' icon="el-icon-close" size="small">取消</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <div v-if="operationListVisible">
      <el-dialog :close-on-click-modal="false" :close-on-press-escape="false"
                 :visible.sync="operationListVisible"
                 width="80%"
                 :before-close="backListVisible">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane name="first">
            <div slot="label" class="titleBox">發放記錄</div>
            <div class="bind-all" v-if="isFirst">
              <el-table height="600px"
                        :data="operationList"
                        style="width: 100%"
                        stripe
                        border>
                <el-table-column label="裝備名稱" show-overflow-tooltip>
                  <template slot-scope="scope">
                                <span class="equip-name">
                                      <span style="width: 100%;">{{ scope.row.equipmentName }} </span>
                                      <el-tooltip placement="right-end" effect="light">
                                            <div v-if="scope.row.isReturn === '0'" slot="content">不需要歸還裝備</div>
                                            <div v-if="scope.row.isReturn === '0'"
                                                 style="background-color:#85ce61; width:10px; height:10px; border-radius: 50%;"></div>
                                            <div v-if="scope.row.isReturn === '1'" slot="content">需要歸還裝備</div>
                                            <div v-if="scope.row.isReturn === '1'"
                                                 style="background-color:#409EFF; width:10px; height:10px; border-radius: 50%;"></div>
                                      </el-tooltip>
                                </span>
                  </template>
                </el-table-column>
                <el-table-column sortable prop="agencyName" label="發放機構" :show-overflow-tooltip="true"
                                 width="200"></el-table-column>
                <el-table-column sortable prop="assignNum" label="發放數量" width="200"></el-table-column>
                <el-table-column sortable prop="assignVolunteerName" label="領取人" :show-overflow-tooltip="true"
                                 width="200"></el-table-column>
                <el-table-column sortable prop="assignTime" label="發放時間" :formatter="formatDate" width="200"></el-table-column>
                <el-table-column sortable prop="status" label="狀態" :show-overflow-tooltip="true" :formatter="formatStatus"
                                 width="150"></el-table-column>
                <el-table-column sortable prop="note" label="備註" :show-overflow-tooltip="true" width="150"></el-table-column>
                <!--取消領取步驟 -->
                <!-- <el-table-column label="操作" width="100" align="center">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.status === '0'" @click='receive(scope.row)' type="info" size="small" icon="el-icon-stopwatch" title="領取"></el-button>
                  </template>
                </el-table-column> -->
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane name="second">
            <div slot="label" class="titleBox">待歸還裝備</div>
            <div class="bind-all" v-if="isSecond">
              <el-table
                  :data="returnEquipList"
                  style="width: 100%"
                  stripe
                  height="600px"
                  border>
                <el-table-column sortable prop="equipmentName" label="裝備名稱" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column sortable prop="agencyName" label="發放機構" :show-overflow-tooltip="true"
                                 width="200"></el-table-column>
                <el-table-column sortable prop="assignVolunteerName" label="發放人" :show-overflow-tooltip="true"
                                 width="160"></el-table-column>
                <el-table-column sortable prop="assignNum" label="發放數量" width="200"></el-table-column>
                <el-table-column sortable prop="note" label="備註" :show-overflow-tooltip="true" width="100"></el-table-column>
                <el-table-column v-if="currentRoleCode !== '4' && currentRoleCode !== '6'" label="待歸還數量" width="140">
                  <template slot-scope="scope">
                              <span style="display:flex;cursor: pointer;text-decoration: underline;"
                                    @click="clickNum(scope)">
                                      {{ scope.row.beReturnNum }}
                              </span>
                  </template>
                </el-table-column>
                <el-table-column v-else prop="beReturnNum" label="待歸還數量" width="140"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column sortable prop="assignTime" label="發放時間" :formatter="formatDate" width="180"></el-table-column>
                <el-table-column sortable prop="status" label="狀態" :formatter="formatStatus" width="100"></el-table-column>
                <el-table-column v-if="currentRoleCode !== '4' && currentRoleCode !== '6'" label="歸還" min-width="120"
                                 align="center">
                  <template slot-scope="scope">
                    <div style="display:flex;">
                      <base-input-number :num.sync="scope.row.rNum" :max="scope.row.beReturnNum"/>
                      <el-button @click='returnEquip(scope.row)'
                                 style="padding: 0 2px;margin: 4px 0 0 5px;height: 30px;" type="info" size="mini"
                                 icon="el-icon-success" title="確定"></el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>

          </el-tab-pane>

        </el-tabs>
      </el-dialog>
    </div>
    <div v-if="enterHouseVisible">
      <el-dialog :close-on-click-modal="false" :close-on-press-escape="false"
                 :visible.sync="enterHouseVisible"
                 width="40%"
                 :show-close="false">
        <div style="padding:0 50px;">
          <el-form :model="enterHouseModel" :rules="rules2" ref="ruleForm2" class="roleForm">
            <div class="registerLine">
              <span><span class="colorSpan">*</span>入庫人</span>
              <span>
                         <el-form-item prop="enterHouseVolunteerId">
                            <el-select :popper-append-to-body="false" v-model="enterHouseModel.enterHouseVolunteerId"
                                       clearable>
                                <el-option :title="item.name" v-for="item of volunteeresOfAgency" :key="item.id"
                                           :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                      </span>
            </div>
            <div class="registerLine">
              <span><span class="colorSpan">*</span>入庫數量</span>
              <span>
                        <el-form-item prop="enterHouseNum">
                            <el-input @change.native="change($event)" v-model.number="enterHouseModel.enterHouseNum"
                                      type="number"
                                      oninput="value = value.replace(/\\+|\\-/g,'');if(value.length>15)value=value.slice(0,15)"
                                      clearable/>
                        </el-form-item>
                      </span>
            </div>
            <div class="registerLine">
              <span><span class="colorSpan">*</span>入庫時間</span>
              <span>
                        <el-form-item prop="enterHouseTime">
                            <el-date-picker @change.native="change($event)" class="dataPicker" type="datetime"
                                            v-model="enterHouseModel.enterHouseTime" :editable="false" clearable/>
                        </el-form-item>
                      </span>
            </div>
          </el-form>
          <div class="registerBtnBox">
            <el-button @click='sureEnterHouse("ruleForm2")' type="primary" icon="el-icon-finished" size="small">確定
            </el-button>
            <el-button @click='enterHouseClose("ruleForm2")' icon="el-icon-close" size="small">取消</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <div v-if="enterHouseListVisible">
      <el-dialog :close-on-click-modal="false" :close-on-press-escape="false"
                 :visible.sync="enterHouseListVisible"
                 width="50%"
                 :before-close="backEnterHouseListVisible">
        <div>
          <el-table class="scroll-container"
                    :data="enterHouseList"
                    style="width: 100%"
                    stripe
                    border>
            <el-table-column prop="enterHouseVolunteerName" label="入庫人"></el-table-column>
            <el-table-column prop="enterHouseNum" label="入庫數量" width="200"></el-table-column>
            <el-table-column prop="enterHouseTime" label="入庫時間" :formatter="formatDate" width="250"></el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import equipEdit from './equip-edit.vue';
import StaticDic from '../../common/static/infoDic'
import {getAge, getDateString} from "../../common/dateutil";
import SelectTree from '../../common/static/SelectTree.vue';
import {messageError, messageSuccess, messageWarning} from "../../common/prompt-utils";
import BaseInputNumber from "../base/base-input-number";
import page from '../page/page.vue';
import {sureIssueOne} from "@/common/services/api-service";

export default {
  name: 'equip',
  components: {
    BaseInputNumber,
    'equip-edit': equipEdit,
    'rs-page': page,
    SelectTree,
  },
  props: {
    volunteer: {
      type: Object,
      default: function () {
        return {
          userName: ''
        }
      }
    },
    isApply: {
      type: Boolean,
      default: false
    },
    operate: {
      type: String
    },
    currentRole: {
      type: String,
      default: ''
    },
    oldVolModel: {
      type: Object,
      default: function () {
        return {};
      }
    },

    //是否展示審核的通過拒絕組
    isShowPassOrReject: {
      type: Boolean,
      default: false
    },
    //是否展示修改訊息的確定撤回取消按鈕組
    isShowUpdateSureOrBack: {
      type: Boolean,
      default: false
    },
  },
  data: function () {
    const validateAssignNum = (rule, value, callback) => {
      if (parseInt(value) > parseInt(this.issueObject.existNum)) {
        callback(new Error('發放數量不能大於現存數量'));
      } else {
        callback();
      }
    };
    return {
      activeName: 'first',
      isFirst: true,
      isSecond: false,
      operationListVisible: false,
      operationList: [],
      returnEquipList: [],

      volunteerModel: {
        userName: '',
        languageArr: [],
        isTempVolunteer: '0',
        experienceModels: []
      },
      currentRoleCode: window.sessionStorage.getItem('vol-userRoleCode'),
      showPerson: true,
      currentTab: '0',
      scroll: "",  //存放滾動高度

      type: [{
        code: '0',
        name: '个人保險'
      }, {
        code: '1',
        name: '团体保險'
      }
      ],

      // trainList:[],
      // insuranceList:[],

      genders: [
        {key: 0, value: '男'},
        {key: 1, value: '女'},
      ],

      //裝備相關
      searchJsonEquip: {
        volunteerId: window.sessionStorage.getItem('userId'),
        startTime: '',
        endTime: '',
        status: ''
      },
      statusType: [
        {
          name: '已歸還',
          value: 1
        },
        {
          name: '待歸還',
          value: 2
        }
      ],
      equipList: [],
      pageInfoOfEquip: {
        pagesize: 10, //每页行数
        currentpage: 1,//当前第几页
        datacount: 0,//数据总行数
      },
      pageEquipData: [],
      equipBorrowedCount: '',
      equipNoReturnCount: '',
      returnNum: '',
      data: [],
      showEditComponent: false,
      isShowDetail: Boolean,
      editData: {},
      editComponentTitle: '裝備添加訊息',
      placeholder: '所屬機構...',
      agencyList: [],
      searchJson: {
        name: ''
      },
      dataCount: 0,
      currentPage: 0,
      pageSize: 10,
      currentData: [],

      equipType: [],
      showVisible: false,
      issueObject: {},
      issueModel: {
        equipmentId: '',
        agencyCode: '',
        agencyName: '',
        assignVolunteerId: '',
        assignVolunteerName: '',
        assignNum: '',
        assignTime: '',
        isReturn: '1',
        status: ''
      },
      rules: {
        assignNum: [
          {required: true, message: '請輸入發放數量', trigger: 'blur'},
          {validator: validateAssignNum, trigger: 'blur'}
        ],
        assignTime: [
          {type: 'date', required: true, message: '請輸入發放時間', trigger: 'change'},
        ],
      },
      rules2: {
        enterHouseVolunteerId: [
          {required: true, message: '請輸入入庫人', trigger: 'change'},
        ],
        enterHouseNum: [
          {required: true, message: '請輸入入庫數量', trigger: 'blur'},

        ],
        enterHouseTime: [
          {type: 'date', required: true, message: '請輸入入庫時間', trigger: 'change'},
        ]
      },
      // volunteeres: [],
      volunteeresOfAgency: [], //机构管理员集合
      operationType: '1',

      enterHouseModel: {
        enterHouseVolunteerId: '',
        enterHouseNum: '',
        enterHouseTime: ''
      },
      enterHouseVisible: false,
      enterHouseList: [],
      enterHouseListVisible: false,

      titles: ["待選列表", "已選列表"],
      leftAndRightVol: [],   // 穿梭框左側+右側列表
      rightVol: [],   // 穿梭框右側列表
      allVol: [], // 所有志願者
      rVol: [], // 右側列表志願者
      leftSearch: {},
      rightSearch: {}
    }
  },
  methods: {
    rightListChange(value) { // 監聽右側列表發生變動事件
      this.rVol = value;
    },
    filterMethod(param) {
      if ('left' === param) {
        // 初始化数据集
        this.leftAndRightVol = [];
        // 获取初始左侧列表数据
        let leftArr = this.allVol.filter(element => {
          return !this.rVol.includes( element.id );
        });
        // 根据搜索条件过滤左侧列表数据
        this.leftAndRightVol = leftArr.filter(x => {
          if( this.leftSearch.date && this.leftSearch.name){
            return ( x.nameAndDate.indexOf(this.leftSearch.date) >= 0 &&  x.nameAndDate.indexOf(this.leftSearch.name) >= 0);
          }
          else if(this.leftSearch.date){
            return x.nameAndDate.indexOf(this.leftSearch.date) >= 0;
          }
          else if(this.leftSearch.name){
            return x.nameAndDate.indexOf(this.leftSearch.name) >= 0;
          }
          return true;
        });
      } else {
        // 
        this.leftAndRightVol = this.leftAndRightVol.filter(element => {
            return !this.rVol.includes(element.id) ;
        });
        let that = this;
        this.rightVol = this.rVol.filter(element => {
          let x = that.allVol.find(element2 => element2.id === element);
          if( that.rightSearch.date && that.rightSearch.name){
            return ( x.nameAndDate.indexOf(that.rightSearch.date) >= 0 &&  x.nameAndDate.indexOf(that.rightSearch.name) >= 0);
          }
          else if(that.rightSearch.date){
            return x.nameAndDate.indexOf(that.rightSearch.date) >= 0;
          }
          else if(that.rightSearch.name){
            return x.nameAndDate.indexOf(that.rightSearch.name) >= 0;
          }
          return true;
        });
      }
      // 添加右侧列表数据
      if(this.rightVol && this.rightVol.length > 0){
        this.rightVol.forEach(element => {
          let x = this.allVol.find(element2 => element2.id === element);
          this.leftAndRightVol.push(x);
        });
      }
      this.leftAndRightVol.concat(this.rightVol);
    },
    getEquipData() {
      this.$axios.post(window.volConfig.volUrl + '/equip/volunteer/list', this.searchJsonEquip).then(res => {
        this.equipList = res.data.data.data;
        this.equipBorrowedCount = res.data.data.borrowedCount;
        this.equipNoReturnCount = res.data.data.unreturnCount;
        this.pageInfoOfEquip.currentpage = 1;
        this.pageInfoOfEquip.datacount = this.equipList.length;
        let temp = JSON.parse(JSON.stringify(this.equipList));
        this.pageEquipData = temp.splice(this.pageInfoOfEquip.pagesize * (this.pageInfoOfEquip.currentpage - 1), this.pageInfoOfEquip.pagesize)
      })

    },
    EquipPageChange(param) {
      let tempTotal = JSON.parse(JSON.stringify(this.equipList));
      this.pageEquipData = tempTotal.splice(param.pagesize * (param.currentpage - 1), param.pagesize)
    },
    formatterEquipType(row) {
      let a = this.equipType.find(x => x.code === row.typeCode);
      if (a) {
        return a.name
      }
    },
    formatterEquipStatus(row) {
      if (row.status === '1') {
        return "已歸還";
      } else if (row.status === '2') {
        if (row.isReturn === '1') {
          return "待歸還";
        } else if (row.isReturn === '0') {
          return "無需歸還";
        }

      }
    },
    backEnterHouseListVisible() {
      this.enterHouseListVisible = false;
    },
    enterHouseListHistory(data) {
      this.enterHouseListVisible = true;
      this.$axios.post(window.volConfig.volUrl + 'equip/import/list', {'equipmentId': data.id}).then(res => {
        this.enterHouseList = res.data.data;
      });
    },
    change() {
      this.$forceUpdate();
    },
    sureEnterHouse(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.enterHouseModel.enterHouseVolunteerName = this.volunteeresOfAgency.find(x => x.id === this.enterHouseModel.enterHouseVolunteerId).name;
          this.$axios.post(window.volConfig.volUrl + 'equip/import', this.enterHouseModel).then(res => {
            if (res.data.success) {
              this.$message({
                type: 'success',
                message: '入庫成功',
              });
              this.$refs[formName].resetFields();
              this.enterHouseVisible = false;
              this.search();
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
    enterHouseClose(formName) {
      this.$refs[formName].resetFields();
      this.$message({
        type: 'info',
        message: '入庫操作已取消',
      });
      this.enterHouseVisible = false;
    },
    enterHouse(data) {
      this.getVol();
      this.enterHouseModel.equipmentId = data.id;
      this.enterHouseModel.creatorId = this.$store.getters.getVolunteerModel.id;
      this.enterHouseModel.creatorName = this.$store.getters.getVolunteerModel.name;
      this.enterHouseVisible = true;
    },
    changeRNum(value, scope) {
      if (parseInt(value) > parseInt(scope.row.beReturnNum)) {
        this.clickNum(scope);
      }
    },
    clickNum(scope) {
      scope.row.rNum = scope.row.beReturnNum;
      this.returnEquipList.splice(scope.$index, 1, scope.row);
    },
    receive(data) {
      this.$confirm('是否確定領取?', '領取情況', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(window.volConfig.volUrl + 'equip/receive', data).then(res => {
          if (res.data.success) {
            this.equipOperation();
            this.$message({
              type: 'success',
              message: '已領取',
            });
            if (this.currentRoleCode === '4') {
              this.getReturnEquipList();
              this.getOperationList();
            } else {
              this.getReturnEquipList2();
              this.getOperationList2();
            }
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消',
        });
      });
    },
    returnEquip(data) {
      if (!data || !data.rNum || data.rNum === '0') {
        messageWarning('歸還數量不能為空或0');
        return;
      }
      this.$axios.post(window.volConfig.volUrl + 'equip/returnEquip', data).then(res => {
        if (res.data.success) {
          this.$message({
            type: 'success',
            message: '已歸還',
          });
          // 归还成功不请求接口刷新页面，在页面上直接做简单运算
          data.beReturnNum = res.data.data.beReturnNum - res.data.data.rNum;
          data.rNum = '';
        }
      });
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
    backListVisible() {
      this.operationListVisible = false;
      this.initData();
    },
    equipOperation() {
      this.getOperationList();
      this.getReturnEquipList();
      this.activeName = 'first';
      this.handleClick(null, null);
      this.operationListVisible = true;
    },
    equipOperation2() {
      this.getOperationList2();
      this.getReturnEquipList2();
      this.activeName = 'first';
      this.handleClick(null, null);
      this.operationListVisible = true;
    },
    getOperationList() {
      const _this = this
      this.$axios.post(window.volConfig.volUrl + 'equip/operation/list', {}).then(res => {
        this.operationList = res.data.data;
        _this.operationList = res.data.data.filter(Val => {
          if (Val.assignVolunteerName === window.sessionStorage.getItem('userName')) {
            _this.operationList.push(Val)
            return _this.operationList
          }
        })
      });
    },
    getOperationList2() {
      this.$axios.post(window.volConfig.volUrl + 'equip/operation/list', {}).then(res => {
        this.operationList = res.data.data;
      });
    },
    getReturnEquipList() {
      const _this = this
      this.$axios.post(window.volConfig.volUrl + 'equip/operation/returnlist', {}).then(res => {
        this.returnEquipList = res.data.data;
        _this.returnEquipList = res.data.data.filter(Val => {
          if (Val.assignVolunteerName === window.sessionStorage.getItem('userName')) {
            _this.returnEquipList.push(Val)
            return _this.returnEquipList
          }
        })
      });
    },
    getReturnEquipList2() {
      this.$axios.post(window.volConfig.volUrl + 'equip/operation/returnlist', {}).then(res => {
        this.returnEquipList = res.data.data;
      });
    },
    showEquip(data) {
      this.getVol();
      this.issueObject = data;
      this.showVisible = true;
    },
    sureIssue(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.rightVol || this.rightVol.length === 0) {
            this.$message({
              type: 'danger',
              message: '請選擇領取人'
            });
            return;
          }
          if (this.rightVol.length * this.issueModel.assignNum > this.issueObject.existNum) {
            this.$message({
              type: 'danger',
              message: '現存裝備數量不足'
            });
            return;
          }
          // 需求變更，無需領取功能，則發放后的狀態改為已完成或待歸還
          // this.issueModel.status = '0';
          if (this.issueModel.isReturn === '1') {
            this.issueModel.status = '2';  //待歸還
            this.issueModel.beReturnNum = this.issueModel.assignNum;
          } else {
            this.issueModel.status = '1';  //已完成
          }

          this.issueModel.equipmentId = this.issueObject.id;
          this.issueModel.agencyCode = sessionStorage.getItem('userAgencyCode');
          this.issueModel.agencyName = sessionStorage.getItem('userAgencyName');
          let param = JSON.parse(JSON.stringify(this.issueModel));
          param.assignVolunteerId = this.rightVol.join(',');
          sureIssueOne(param).then((item) => {
            if (!item.data.success) {
              //發放失敗
              this.$message({
                type: 'danger',
                message: '裝備發放失敗'
              });
            } else {
              this.$message({
                type: 'success',
                message: '發放裝備成功',
              });
              this.$refs[formName].resetFields();
              this.resetIssue();
              setTimeout(() => {
                this.initDic();
                this.search();
              }, 100);
              this.getEquipData();
            }
          });

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    issueClose(formName) {
      this.$refs[formName].resetFields();
      this.resetIssue();
      this.$message({
        type: 'info',
        message: '發放裝備已取消',
      });

    },
    resetIssue() {
      this.allVol = [];
      this.rVol = [];
      this.leftAndRightVol = [];
      this.rightVol = [];
      this.leftSearch = {};
      this.rightSearch = {};
      this.showVisible = false;
    },
    getVol() {
      let json = {
        communityCode: sessionStorage.getItem('userAgencyCode'),
        roleCode: '2,4'  // 志願者角色
      }
      this.$axios.post(window.volConfig.volUrl + 'volunteer/list', json).then(res => {
        for (let i = 0; i < res.data.data.length; i++) {
          const e = res.data.data[i];
          let cGender = this.genders.find(x => x.key === e.gender);
          e.age = getAge(e.birthday);
          if (cGender) {
            e.gender_text = cGender.value;
          } else {
            e.gender_text = ''
          }
          if (!e.age) {
            e.age = ''
          }
          if (e.approvalTime) { // 考核通過成為志願者
            this.$set(e, "nameAndDate", e.name + ' - ' + getDateString(e.approvalTime));
          } else { // 管理員直接添加成為志願者
            this.$set(e, "nameAndDate", e.name + ' - ' + getDateString(e.createTime));
          }
        }
        // 發放 志願者角色
        this.leftAndRightVol = res.data.data.filter(x => x.exitStatus !== '2' && x.roleCodes.indexOf('4') >= 0);
        this.allVol = JSON.parse(JSON.stringify(this.leftAndRightVol));
        // 入庫 機構管理員角色
        this.volunteeresOfAgency = res.data.data.filter(x => x.exitStatus !== '2' && x.roleCodes.indexOf('2') >= 0);
      });
    },
    formatDate(row, column) {
      return StaticDic.tableDateDataFormat(row, column);
    },
    formatterType(row) {
      let a = this.equipType.find(x => x.code === row.typeCode);
      if (a) {
        return a.name
      }
    },
    formatStatus(row) {
      switch (row.status) {
        case '0':
          return '未領取';
        case '1':
          return '已完成';
        case '2':
          return '待歸還';
        default:
          return '未領取';
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleCurrentChange(null);
    },
    handleCurrentChange(val) {
      if (val) {
        this.currentPage = val;
      }
      let start = this.pageSize * (this.currentPage - 1);
      this.currentData = this.data.slice(start, start + this.pageSize);
    },
    reset() {
      this.searchJson = {};
      if (this.currentRoleCode === '1') {
        this.$refs.selectTree.valueModel = '';
        this.$refs.selectTree.labelModel = '';
      } else {
        this.$refs.selectTree.valueModel = sessionStorage.getItem('userAgencyCode');
        this.$refs.selectTree.labelModel = sessionStorage.getItem('userAgencyName');
      }
      this.search();
    },
    deleteSingle(data) {
      this.$confirm('是否刪除?', '刪除', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get(window.volConfig.volUrl + 'equip/delete/' + data.id).then(res => {
          if (!res.data.success) {
            messageError('刪除失敗, 請稍後再試');
          }

          if (res.data.data) {
            this.search();
            messageSuccess('刪除成功');
          } else {
            messageWarning('該裝備已發放但未完成處理, 請處理後再刪除');
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '刪除已取消',
        });
      });
    },
    add() {
      this.editComponentTitle = '裝備添加訊息';
      this.operationType = '1';
      this.showEditComponent = true;
      this.isShowDetail = false;
      this.editData = {
        name: '',
        agencyCode: '',
        typeCode: '',
        effectiveTime: ''
      };
    },
    detail(data) {
      this.editComponentTitle = '裝備詳細訊息';
      this.operationType = '3';
      this.showEditComponent = true;
      this.isShowDetail = true;
      this.editData = JSON.parse(JSON.stringify(data));
    },
    edit(data) {
      this.editComponentTitle = '裝備編輯訊息';
      this.operationType = '2';
      this.showEditComponent = true;
      this.isShowDetail = false;
      this.editData = JSON.parse(JSON.stringify(data));
    },
    addSuccess() {
      setTimeout(() => {
        this.search();
      }, 1000);
    },
    getBackEditData() {
      this.showEditComponent = false;
    },
    search() {
      if (this.currentRoleCode !== '1') {
        this.searchJson.agencyCode = sessionStorage.getItem('userAgencyCode');
      } else {
        this.searchJson.agencyCode = this.$refs.selectTree ? this.$refs.selectTree.valueModel : '';
      }
      this.initData();
    },
    async initData() {
      this.$axios.post(window.volConfig.volUrl + 'equip/list', this.searchJson).then(res => {
        this.data = res.data.data;
        this.currentPage = 1;
        this.dataCount = this.data.length;
        this.handleCurrentChange(null);
      });
    },
    async initDic() {
      this.agencyList = await StaticDic.getAgencyTree();
      this.pubDict = await StaticDic.getPub();
      this.equipType = this.pubDict.filter(x => x.parentCode === '10090000');
      if (this.currentRoleCode === '1') {
        this.$refs.selectTree.valueModel = '';
        this.$refs.selectTree.labelModel = '';
      } else {
        this.$refs.selectTree.valueModel = sessionStorage.getItem('userAgencyCode');
        this.$refs.selectTree.labelModel = sessionStorage.getItem('userAgencyName');
      }
    }

  },
  mounted() {
    // if (this.currentRoleCode !== '1') {
    //   this.$refs.selectTree.valueModel = sessionStorage.getItem('userAgencyCode');
    //   this.$refs.selectTree.labelModel = sessionStorage.getItem('userAgencyName');
    // }
    setTimeout(() => {
      this.initDic();
      this.search();

    }, 100);
    this.getEquipData();
  }
}

</script>
<style lang="scss" scoped>
.equip {
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .equip-name {
    display: flex;
    flex-direction: row;
    align-content: space-between;
    align-items: center;

    span {
      flex: 1;
      overflow: hidden;
      @include textOverflow;
    }

    div {
      width: 20px;
    }
  }

  .registerBtnBox {
    height: 50px;
  }

  /deep/ .issueDialogCls {
    overflow-y: auto;
  }

  /deep/ .el-transfer-panel__header {
    padding-top: 10px;
    .el-checkbox__input {
      margin-bottom: 3px;
    }
  }

  /deep/ .is-with-footer {
    margin-top: 40px;
  }
  /deep/ .el-date-editor {
    width: 145px;
  }
  /deep/ .el-transfer-panel .el-transfer-panel__footer {
    height: 20px;
    top: 40px;
    left: 15px;
  }

  /deep/ .el-transfer-panel {
    width: 380px;
  }
}

.searchBox {
  height: 50px;
  padding: 0 0 10px 0;
}

.tableBtnBox {
  text-align: center;

  .el-button {
    margin: 5px 0;
  }

  button {
    width: 137px;
  }
}

.btnBox {
  margin-bottom: 10px;
  text-align: right;
}

.dataPicker {
  width: 100%;
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

.bind-all {
  height: auto;

  /deep/ th .el-checkbox {
    display: none;
  }
}
</style>
