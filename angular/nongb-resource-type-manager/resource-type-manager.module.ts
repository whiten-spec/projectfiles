import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from 'ng2-translate';
import { routes } from "./resource-type-manager.router";
import { ResourceTypeManagerComponent } from "./resource-type-manager.component";
import {
  DxSelectBoxModule, DxDataGridModule,
  DxPopupModule, DxCheckBoxModule, DxDropDownBoxModule, DxTreeListModule, DxTreeViewModule
} from 'devextreme-angular';
import {OrganizationTreeModule} from '../../shared/organization-tree/organization-tree.module';
import {ResourceTypeTreeModule} from '../../shared/resource-type-tree/resource-type-tree.module';
import {NgxLoadingModule} from "ngx-loading";


/**
 * 业务模块
 */
@NgModule({
    imports: [
        FormsModule, CommonModule, RouterModule.forChild(routes), SharedModule, NgbModule.forRoot(),
        TranslateModule.forRoot(),
        DxSelectBoxModule,
        DxDataGridModule,
        DxPopupModule,
        DxCheckBoxModule, OrganizationTreeModule, ResourceTypeTreeModule, DxDropDownBoxModule, DxTreeListModule, DxTreeViewModule, NgxLoadingModule
    ],
    declarations: [
        ResourceTypeManagerComponent
    ],
    exports: [ResourceTypeManagerComponent]
})

export class ResourceTypeManagerModule {

}
