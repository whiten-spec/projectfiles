import { OnInit, Component, ViewChild } from '@angular/core';
import {SessionStorageService, SessionEnum} from '../../shared/sessionstorage.service';
import { TranslateService } from "ng2-translate";
import { LocalStorageService, LocalEnum } from "../../shared/localstorage.service";
import { HttpServer } from "../../shared/HttpServer";
import { Alert } from "../../shared/confirm/alert";
import { Confirm } from "../../shared/confirm/confirm";
import { ResourceType } from "../../shared/enum/ResourceType";
import { Page } from "../../shared/pager/page";
import { pageItem } from "../../shared/pager/pageitem";
import { ResourceTypeModel } from "./resource-type.model";
import { Router, ActivatedRoute, Params } from "@angular/router";
import {menuitemModel} from '../menuitem/menuitemModel';
import { EventAggregator } from './../../shared/eventaggregator.service';
import {Common} from "../../shared/common";
import {ConfirmNew} from "../../shared/confirm/confirm-new";
import {DxTreeListComponent, DxTreeViewComponent} from "devextreme-angular";

@Component({
    selector: 'app-resource-type-manager',
    templateUrl: './resource-type-manager.component.html'
})
export class ResourceTypeManagerComponent implements OnInit {
  resourceTypeList: any
  menus: any;
  tabDataTop: any;
  firstType: any;
  alert: Alert;
  secondType: any;
  resourceType: ResourceType = new ResourceType();
  secondTypeVisible = false;
  @ViewChild(Page) private page: Page;
  totalCount: number;
  pageItem: pageItem;
  pubUrl: string;
  dataList: any;
  popAddVisible = false;
  typeModel: ResourceTypeModel;
  currentParentCode = '';
  currentParentName: any;
  //确认框之后的操作函数
  private operateFun: Function = new Function();
  //準備刪除的項目
  delItem:any
  //彈窗組件
  @ViewChild(ConfirmNew) private confirmNew: ConfirmNew;
  //條件選中資源類型
  selectTypeList: any
  //未處理的資源類型數組（處理後變成樹形結構）
  resourceArr: any
  loading: boolean = true
  @ViewChild(DxTreeViewComponent) treeView;
  @ViewChild(DxTreeListComponent) treeList;


  constructor(private session: SessionStorageService, private translate: TranslateService, private eventAggregator: EventAggregator,
              private local: LocalStorageService, private httpServer: HttpServer,
              private router: Router, private route: ActivatedRoute,) {
    this.alert = new Alert(translate);
    this.pageItem = new Page();
    this.typeModel = new ResourceTypeModel();
    this.alert.setLang();
    this.totalCount = 0;
  }

  ngOnInit(): void {
    this.search();
  }

  search() {
    //查詢當前所有物資類型數據
    this.httpServer.post('/rms/suppliesMaterialType/findAll',{}).then(res => {
      this.resourceArr = JSON.parse(JSON.stringify(res.data));
      let parents = res.data.filter(t => {
          return t.parentCode === '0';
        }),
        childrens = res.data.filter(t => {
          return t.parentCode !== '0';
        })
      //將數據結構轉換成樹結構
      this.dataToTree(parents, childrens)
      // console.log('resourceArr',resourceArr)
      this.loading = false
      this.resourceTypeList = parents;
    });
  }

  dataToTree(parent, children) {
    parent.map(p => {
      p.text = p.typeName;
      children.map((c, i) => {
        if (c.parentCode === p.typeCode) {
          c.text = c.typeName;
          let _children = JSON.parse(JSON.stringify(children));
          _children.splice(i, 1);
          this.dataToTree([c], _children);
          if (p.items) {
            p.items.push(c);
          } else {
            p.items = [c];
          }
        }
      })
    })
  }

  //新增資源類型
  clk_submit() {
    this.loading = true;
    this.initTypeMode()
    this.httpServer.post('/rms/suppliesMaterialType/add',this.typeModel).then(res => {
      if(res.success === true){
        this.popAddVisible = false;
        this.eventAggregator.publish('updateMenu',this.typeModel)
        this.typeModel = new ResourceTypeModel()
        this.search()
        this.loading = false
      }
    });
  }

  //初始化添加資源信息
  private initTypeMode() {
    this.typeModel.creatorId = Common.UserId
    this.typeModel.creatorName = Common.UserName
    this.typeModel.createTime = new Date();
    this.typeModel.parentCode = this.currentParentCode
  }

  //關閉添加編輯頁面
  close() {
    this.popAddVisible = false
  }

  async addResourceType(item: any) {
    //打開新增資源類型頁面
    this.popAddVisible = true
    //當前添加類型的父類型信息
    this.currentParentName = item.data.typeName
    this.currentParentCode = item.data.typeCode
    let res = await this.httpServer.post('/basic/resource/page', {resourceCode: item.data.typeCode, page: 1, rows: 1});
    if (res.success && res.data.data.length > 0) {
      this.alert.alertWindowOpenAndClose('该类型正在使用中，不可再进行操作')
      return;
    }
    //生成typeCode
    let codeArray = item.data.typeCode.split('')
    let count = 0;
    let addNum = 0;
    let exist = true
    //typecode尾部0的個數
    for (let i = codeArray.length - 1; i >= 0; i--) {
      if (codeArray[i] === '0') {
        count++
      } else {
        break
      }
    }
    if (count >= 6) {
      addNum = 10000
    } else if (count >= 4) {
      addNum = 100
    } else if (count >= 2) {
      addNum = 1
    }
    let code = Number(item.data.typeCode)
    let items = item.row.node.children
    while (exist) {
      code = code + addNum
      //獲取所有的子節點，查看code是否存在
      let findItem = items.find(i => {
        return Number(i.key) === code
      })
      if (!findItem || findItem.length === 0) {
        exist = false
      }
    }
    this.typeModel.typeCode = code.toString()
  //  console.log('this.typeModel.typeCode', this.typeModel.typeCode)
  }

  async updateResourceType(item: any) {
    //打開新增資源類型頁面
    this.popAddVisible = true
    //當前添加類型的父類型信息
    this.typeModel = item.data
    let res = await this.httpServer.post('/basic/resource/page', {resourceCode: item.data.typeCode, page: 1, rows: 1});
    if (res.success && res.data.data.length > 0) {
      this.alert.alertWindowOpenAndClose('该类型正在使用中，不可再进行操作')
      return;
    }
    this.currentParentCode = item.data.parentCode
    this.currentParentName = this.resourceArr.find(a => {
      return a.typeCode === this.currentParentCode
    }).typeName
  }

  async clk_del(item: any) {
    this.delItem = item;
    this.operateFun = this.delResourceType;
    if (item.row.node.children && item.row.node.children.length > 0) {
      this.alert.alertWindowOpenAndClose('請先刪除當前類型的子類型 ');
      return;
    } else {
      let res = await this.httpServer.post('/basic/resource/page', {resourceCode: item.data.typeCode, page: 1, rows: 1});
      if (res.success && res.data.data.length > 0) {
        this.alert.alertWindowOpenAndClose('该类型正在使用中，不可進行刪除')
        return;
      }
      this.confirmNew.confirmWindowOpen("確認刪除類型：" + item.data.typeName);
    }
  }

  delResourceType() {
    this.httpServer.get('/rms/suppliesMaterialType/deleteById/' + this.delItem.data.id).then(res => {
      if(res.success === true){
        this.popAddVisible = false;
        this.typeModel = new ResourceTypeModel()
        this.search()
      }
    });
  }

  /**
   * @name chose_clk
   * @description chose_clk
   * @author zhouwei_b
   * @time 2021-12-27 16:55:51
   * */
  chose_clk(result) {
    if (result) {
      this.operateFun();
    }
  }

  checkCanAdd(item: any) {
    //校驗是否可以顯示添加按鈕
    let codeLast = item.data.typeCode.substr(5)
    if (item.data.typeCode.charAt(0) > '3' && codeLast === '00') {
      return true
    }
  }

  checkCanEditOrDel(item: any) {
    return item.data.typeCode.charAt(0) > '3' && item.data.typeCode != '4000000'
  }

  onTreeViewSelectionChanged(e: any) {
    this.selectTypeList = e.component.getSelectedNodesKeys()
  }

  onTreeViewReady(e: any) {
    this.updateSelection(e.component)
  }

  onDropDownBoxValueChanged(e: any) {
    this.updateSelection(this.treeView && this.treeView.instance)
  }

  updateSelection(treeView) {
    if(!treeView) {
      return
    }
    if(!this.selectTypeList){
      treeView.unselectAll()
    }
    if(this.selectTypeList) {
      this.selectTypeList.forEach(val => {
        treeView.selectItem(val)
      })
    }
  }

  filter(e: any) {
   // console.log('e',e)
    this.treeList.instance.searchByText(e)
  }
}
