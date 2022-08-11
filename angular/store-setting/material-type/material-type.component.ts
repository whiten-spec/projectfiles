import { Component, OnInit } from '@angular/core';
import { HttpServer } from '../../../../shared/HttpServer';
import { SessionStorageService, SessionEnum } from '../../../../shared/sessionstorage.service';
@Component({
    selector: 'material-type',
    templateUrl: './material-type.component.html'
})
export class MaterialTypeComponent implements OnInit {
    tableData = []
    addVisiable: boolean = false;
    addModel = {
        typeCode: '',
        typeName: '',
        note: '',
        creatorId: '',
        parentCode: '',
        unitName: '',
        creatorName: '',
    }
    addOrEditTitle = '添加'
    user: any;
    session: SessionStorageService = new SessionStorageService();
    disabledFlag = '1'
    curData = null;
    deleteVisiable: boolean = false;
    canManageStore = false;
    storeDeptCodes = '100000B007031,100000B007012';
    constructor(private httpServer: HttpServer,) {
    }
    ngOnInit() {
        this.user = this.session.readObject(SessionEnum.user);
        this.addModel.creatorId = this.user.id;
        this.addModel.creatorName = this.user.userName;
        this.storeManageAccess();
        this.getData()
    }
    storeManageAccess() {
        let codes = localStorage.getItem('storeDeptCodes');
        if (codes && codes != 'undefined') this.storeDeptCodes = codes;
        let codeArr = this.storeDeptCodes.split(',');
        let userDept = this.user.organizationId;
        let deptCan = userDept && codeArr.includes(userDept);
        let roleCan = this.user.mapList && this.user.mapList.some(x=>x.code.toLowerCase()==='superadmin');
        this.canManageStore = deptCan || roleCan; // 属于总局或治安警察局的账户，或者用户中心管理员的账户可以管理临时仓
    }
    getData() {
        this.httpServer.post('/rms/store/setting/type/list', {}).then((res: any) => {
           // console.log(res);
            if (res.success) {
                this.tableData = res.data;
            }
        });
    }
    addClick(flag, item) {
        this.addVisiable= true;
        this.disabledFlag = flag;
        if (flag === '1') {
            this.addOrEditTitle = '添加';
            // this.addModel.typeCode = '';
            // this.addModel.typeName = '';
            // this.addModel.note = '';
            // this.addModel.parentCode = '';
            // this.addModel.unitName = '';
            this.addModel = {
                typeCode: '',
                typeName: '',
                note: '',
                creatorId: '',
                parentCode: '',
                unitName: '',
                creatorName: '',
            }
        }else if (flag === '2') {
            this.addModel = JSON.parse(JSON.stringify(item));
            this.addOrEditTitle = '編輯';
        }else if (flag === '3') {
            this.addModel = JSON.parse(JSON.stringify(item));
            this.addOrEditTitle = '詳情';
        }
    }
    save() {
     //   console.log(this.addModel);
        if (!this.addModel.typeCode || (this.addModel.typeCode && this.addModel.typeCode.length === 0)) {
            return false;
        }
        if (!this.addModel.typeName || (this.addModel.typeName && this.addModel.typeName.length === 0)) {
            return false;
        }
        if (this.disabledFlag === '1') {
            this.httpServer.post('/rms/store/setting/type/add', this.addModel).then((res: any) => {
             //   console.log(res);
                if (res.success) {
                    this.getData();
                    this.addVisiable= false;
                }
            });
        }else if (this.disabledFlag === '2') {
            this.httpServer.post('/rms/store/setting/type/update', this.addModel).then((res: any) => {
             //   console.log(res);
                if (res.success) {
                    this.getData();
                    this.addVisiable= false;
                }
            });
        }
        
    }
    clk_del(item) {
        this.curData = item;
        this.deleteVisiable = true;
    }
    // 刪除操作
    confirm_click() {
        this.httpServer.post('/rms/store/setting/type/deleteById', this.curData)
        .then((result) => {
            if (result.success === true) {
                this.getData();
                this.cancel_click();
            }
        });
    }
    cancel_click() {
        this.deleteVisiable = false;
    }
    back() {
        this.addVisiable= false;
    }
}