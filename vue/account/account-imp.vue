<template>
  <div class="vol_import">
    <div class="searchbox" style="height:60px">
      <el-input v-model="keyword" placeholder="關鍵字..." @keyup.enter.native="search" clearable
                style="width:260px !important;margin-right:10px"/>
      <!-- <el-select  placeholder="所屬機構..." style="width: 300px !important; margin-right: 10px" v-model="agencyCode" clearable>
          <el-option v-for="item of agencyList" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select> -->
      <el-button @click='search' icon="el-icon-search" type="primary" size="small" style="margin-right:10px">搜索
      </el-button>
      <el-button @click='reset' icon="el-icon-refresh" type="primary" size="small">重置</el-button>
    </div>
    <div class="body">
      <el-table
          :data="userList"
          style="width: 100%"
          stripe
          border>
        <el-table-column prop="userName" label="用戶名" width="200" sortable
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="name" label="姓名" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="phone" label="電話"></el-table-column>
        <el-table-column prop="roleNames" label="角色" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="deptName" label="主管機構" width="300" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template slot-scope="scope">
            <el-button @click='importRow(scope.row)' type="info" size="small" icon="el-icon-s-unfold" title="導入"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="foot">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
      </el-pagination>
    </div>
  </div>

</template>
<script>
import StaticDic from '../../common/static/infoDic'
import SelectTree from '../../common/static/SelectTree.vue';

export default {
  name: 'account-imp',
  props: {
    importModel: {
      hasImported: false
    },
  },
  components: {
    SelectTree,
  },
  data: function () {
    return {
      keyword: "",
      agencyCode: "",
      agencyList: [],
      userList: [],
      userListAll: [],
      currentUser: Object,

      totalCount: 0,
      currentPage: 0,
      pageSize: 10,
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleCurrentChange(null);
    },
    handleCurrentChange(val) {
      if (val) {
        this.currentPage = val;
      }
      let start = this.pageSize * (this.currentPage - 1);
      this.userList = this.userListAll.slice(start, start + this.pageSize);
    },
    importRow(data) {
      let volModel = {};
      volModel.userName = data.userName;
      volModel.name = data.name;
      volModel.userName = data.userName;
      volModel.gender = data.gender;
      volModel.agencyCode = "SPU";
      volModel.phone = data.phone;
      volModel.email = data.email;

      volModel.creatorId = this.$store.getters.getVolunteerModel.id;
      volModel.creatorName = this.$store.getters.getVolunteerModel.name;
      volModel.roleCodes = "2";
      volModel.password = StaticDic.DEFAULT_PASSWORD;
      volModel.tempPassword = StaticDic.DEFAULT_PASSWORD;
      if (volModel.password === StaticDic.DEFAULT_PASSWORD) {
        volModel.needResetPassword = '1'
      } else {
        volModel.needResetPassword = null;
      }
      let tempPassword = JSON.parse(JSON.stringify(volModel.tempPassword));
      volModel.tempPassword = null;
      volModel.password = this.$sha3.sha3_256(tempPassword);
      this.$axios.post2(window.volConfig.volUrl + 'volunteer/add', volModel).then(res => {
        if (res.data.success) {
          this.importModel.hasImported = true;
          this.$message({
            type: 'success',
            message: '導入成功',
          });
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '導入出錯',
        });
      })
    },
    search() {
      this.currentPage = 1;
      this.userList = [];
      this.totalCount = 0;
      let url = window.volConfig.volUrl + "sys/ecms/account";
      let param = {
        userName: this.keyword,
        // name: this.searchForm.value.name,
        // phone: this.searchForm.value.phone,
        // email: this.searchForm.value.email,
        // address: this.searchForm.value.address,
        // clientId: this.searchForm.value.clientId,
        // status: this.searchForm.value.status,
        // resourceName: this.searchForm.value.resourceName,
        deptId: this.agencyCode,
        // roles: this.searchForm.value.roles,
        // seats: this.searchForm.value.seats,
      }
      this.$axios.post(url, param).then(res => {
        this.userListAll = res.data.data;
        this.totalCount = this.userListAll.length;
        this.handleCurrentChange(null);
      });
    },
    reset() {
      this.keyword = '';
      this.search();
    },
    getDic() {
      this.agencyList = StaticDic.getAgencyTree();
      setTimeout(() => {
        this.search()
      }, 300);
    },
  },
  mounted() {
    this.getDic();
  },
}
</script>
<style lang="scss" scoped>
</style>


