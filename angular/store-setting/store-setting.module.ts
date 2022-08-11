import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StoreSettingComponent } from './store-setting.component';
import { SharedModule } from '../../../shared/shared.module';
import { NgbModule,NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from 'ng2-translate';
import { DxPieChartModule,DxChartModule,DxScrollViewModule,DxTextBoxModule,DxNumberBoxModule,DxSelectBoxModule,DxFormModule, DxDataGridModule,DxCheckBoxModule,DxPopupModule,DxButtonModule,DxTemplateModule,DxTagBoxModule, DxValidatorModule, DxValidationGroupModule, DxTextAreaModule } from 'devextreme-angular';
import { routes } from './store-setting.router';
import { StoreAreaComponent } from './store-area/store-area.component'
import { MaterialTypeComponent } from './material-type/material-type.component'
import { OutTComponent } from './out-type/out-type.component'
import { ValidModule } from '../../../shared/commonValid/Valid.module';
/**
 * 业务模块
 */
@NgModule({
    imports: [
       FormsModule,CommonModule,RouterModule.forChild(routes),SharedModule,NgbModule.forRoot(),
       TranslateModule.forRoot(),DxDataGridModule,DxCheckBoxModule,DxPopupModule
      ,DxButtonModule,DxTemplateModule,DxFormModule,DxSelectBoxModule
      ,DxNumberBoxModule,DxTextBoxModule,DxScrollViewModule
      ,DxChartModule,DxPieChartModule,DxTagBoxModule,
      DxValidatorModule, DxValidationGroupModule, DxTextAreaModule,
      ValidModule
    ],
    declarations: [
        StoreSettingComponent,
        StoreAreaComponent,
        MaterialTypeComponent,
        OutTComponent
    ],
    exports: [StoreSettingComponent, StoreAreaComponent, MaterialTypeComponent, OutTComponent]
})

export class StoreSettingModule {
   
}