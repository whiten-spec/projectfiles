import { Component, OnInit } from '@angular/core';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalOptions, NgbActiveModal, NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { ResourceType } from "../../../shared/enum/ResourceType";
import { SessionStorageService, SessionEnum } from '../../../shared/sessionstorage.service';
@Component({
  selector: 'store-setting',
  templateUrl: './store-setting.component.html',
  styleUrls: ['./store-setting.component.css']
})
export class StoreSettingComponent implements OnInit {
  curType = '1';
  
  constructor(private modalService: NgbModal, ) {
    
  }
  ngOnInit() {
  }
  titleClick(flag) {
   // console.log(flag);
    let tempClassName = '.title_span_' + flag;
    $(tempClassName).addClass('has_bottom_border').siblings().removeClass('has_bottom_border');
    this.curType = flag;
  }
}
