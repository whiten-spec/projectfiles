import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonBufferComponent } from './common-buffer/common-buffer.component';
import { PerimeterService } from '../services/service/perimeter.service';

declare var $: any;
declare var baseLocal: any;
declare var FreeFloatStart: any;

@Component({
  selector: 'app-bufferanalysisbox',
  templateUrl: './bufferanalysisbox.component.html',
  // styleUrls: ['./bufferanalysisbox.component.css']
})
export class BufferanalysisboxComponent implements OnInit {

  hidden: boolean = true;
  @ViewChild(CommonBufferComponent) public commonBufferComponent: CommonBufferComponent;

  currentPage: string = '';
  i: number;
  onCloseMethod: any;
  constructor(private surroundAnalysisService: PerimeterService) { }

  ngOnInit() {
    $('.listAll').on('click', 'li', function () {
      $('.listAll li').eq($(this).index()).addClass('addactive').siblings().removeClass('addactive');
    });
  }

  hideme() {
    this.hidden = true;
    if (this.onCloseMethod) {
      this.onCloseMethod();
    }
  }

  show() {
    this.hidden = false;
    this.commonBufferComponent.onCloseMethod = () => {
      this.hideme();
    }
  }

  emergency() {
    this.commonBufferComponent.InitData();
    this.commonBufferComponent.setDeafaultXY();
    // $('.XYPnl').hide();
    $('.btnReturnAna').click();
    this.commonBufferComponent.hidden = false;
    this.commonBufferComponent.isVideo = false;
    this.commonBufferComponent.isLoudSpeaker = false;
    this.commonBufferComponent.tipType = 'buffer';
    this.commonBufferComponent.severity = 'shelter';
    this.commonBufferComponent.funName = baseLocal.tsemap_local.Bufferanalysisbox.emergencyShelter;
    this.commonBufferComponent.resourceTypeCriteria.parentCode = 'A05B03';
     this.commonBufferComponent.showDetailJson = [
      { showName: baseLocal.tsemap_local.Common.name, firstAttr: 'placeModel', secondAttr: 'name' },
      { showName: baseLocal.tsemap_local.Common.type, firstAttr: 'placeModel', secondAttr: 'resourceCatalogName' },
      { showName: baseLocal.tsemap_local.Common.address, firstAttr: 'placeModel', secondAttr: 'address' },
      { showName: baseLocal.tsemap_local.Common.capacity, firstAttr: "capacity", secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.placeNumber, firstAttr: "placedNumber", secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.availableBedsNumber, firstAttr: "availableBedsNumber", secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.placedBedsNumber, firstAttr: "placedBedsNumber", secondAttr: '' },      
      { showName: baseLocal.tsemap_local.Common.availableSeatsNumber, firstAttr: "availableSeatsNumber", secondAttr: '' },      
      { showName: baseLocal.tsemap_local.Common.placedSeatsNumber, firstAttr: "placedSeatsNumber", secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.shelterSatus, firstAttr: "openFlag", secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.longitude, firstAttr: 'placeModel', secondAttr: 'longitude' },
      { showName: baseLocal.tsemap_local.Common.latitude, firstAttr: 'placeModel', secondAttr: 'latitude' }
    ];
    // this.commonBufferComponent.showDetailJson = [
    //   { showName: baseLocal.tsemap_local.Common.name, firstAttr: 'name', secondAttr: '' },
    //   { showName: baseLocal.tsemap_local.Common.type, firstAttr: 'resourceCatalogName', secondAttr: '' },
    //   { showName: baseLocal.tsemap_local.Common.address, firstAttr: 'address', secondAttr: '' },

    //   { showName: baseLocal.tsemap_local.Common.capacity, firstAttr: "capacity", secondAttr: '' },
    //   { showName: baseLocal.tsemap_local.Common.placeNumber, firstAttr: "placedNumber", secondAttr: '' },
    //   { showName: baseLocal.tsemap_local.Common.placedBedsNumber, firstAttr: "placedBedsNumber", secondAttr: '' },
    //   { showName: baseLocal.tsemap_local.Common.availableBedsNumber, firstAttr: "availableBedsNumber", secondAttr: '' },
    //   { showName: baseLocal.tsemap_local.Common.placedSeatsNumber, firstAttr: "placedSeatsNumber", secondAttr: '' },
    //   { showName: baseLocal.tsemap_local.Common.availableSeatsNumber, firstAttr: "availableSeatsNumber", secondAttr: '' },

    //   { showName: baseLocal.tsemap_local.Common.longitude, firstAttr: 'longitude', secondAttr: '' },
    //   { showName: baseLocal.tsemap_local.Common.latitude, firstAttr: 'latitude', secondAttr: '' }
    // ];
    this.getType();
    this.commonBufferComponent.changeIcon('icon-Emergency-shelter-img');
    FreeFloatStart('.bufferCommonPnl #buffemergenryPeriAnalysisPopup', true);
  }

  getType() {
    this.surroundAnalysisService.findType(this.commonBufferComponent.resourceTypeCriteria).then(type => {
      this.commonBufferComponent.resourceTypes = type;
      this.commonBufferComponent.resourceTypes.forEach(r => r.selectItem = true);
    });
  }

  medical() {
    this.commonBufferComponent.InitData();
    this.commonBufferComponent.setDeafaultXY();
    // $('.XYPnl').hide();
    $('.btnReturnAna').click();
    this.commonBufferComponent.hidden = false;
    this.commonBufferComponent.isVideo = false;
    this.commonBufferComponent.isLoudSpeaker = false;
    this.commonBufferComponent.severity = 'medical';
    this.commonBufferComponent.tipType = 'buffer';
    this.commonBufferComponent.funName = baseLocal.tsemap_local.Bufferanalysisbox.medicalAnalysis;
    this.commonBufferComponent.resourceTypeCriteria.parentCode = 'A05B04';
    this.commonBufferComponent.showDetailJson = [
      { showName: baseLocal.tsemap_local.Common.name, firstAttr: 'name', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.type, firstAttr: 'resourceCatalogName', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.address, firstAttr: 'address', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.longitude, firstAttr: 'longitude', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.latitude, firstAttr: 'latitude', secondAttr: '' }
    ];
    this.getType();
    this.commonBufferComponent.changeIcon('icon-Medical-institutions');
    FreeFloatStart('.bufferCommonPnl #buffemergenryPeriAnalysisPopup', true);
  }

  video() {
    // $(".bufferTypePnl div").eq(0).click();
    this.commonBufferComponent.plotPolySearch('');
    this.commonBufferComponent.resourceTypeCriteria.parentCode = 'A06B05';
    this.commonBufferComponent.InitData();
    this.commonBufferComponent.setDeafaultXY();
    $('.XYPnl').hide();
    $('.radiusD').hide();
    $('.btnReturnAna').click();
    this.commonBufferComponent.hidden = false;
    this.commonBufferComponent.isLoudSpeaker = false;
    this.commonBufferComponent.tipType = 'buffer';
    this.commonBufferComponent.severity = 'camera';
    this.commonBufferComponent.isVideo = true;
    this.commonBufferComponent.funName = baseLocal.tsemap_local.Bufferanalysisbox.vedioMonitor;
    this.commonBufferComponent.showDetailJson = [
      { showName: baseLocal.tsemap_local.Common.name, firstAttr: 'equipmentModel', secondAttr: 'name' },
      { showName: baseLocal.tsemap_local.Common.type, firstAttr: 'equipmentModel', secondAttr: 'resourceCatalogName' },
      { showName: baseLocal.tsemap_local.Common.address, firstAttr: 'installationLocation', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.longitude, firstAttr: 'equipmentModel', secondAttr: 'longitude' },
      { showName: baseLocal.tsemap_local.Common.latitude, firstAttr: 'equipmentModel', secondAttr: 'latitude' }
    ];
    this.getType();
    this.commonBufferComponent.changeIcon('icon-Monitoring');

    FreeFloatStart('.bufferCommonPnl #buffemergenryPeriAnalysisPopup', true);
  }

  protectionTarget() {
    this.commonBufferComponent.InitData();
    this.commonBufferComponent.setDeafaultXY();
    // $('.XYPnl').hide();
    $('.btnReturnAna').click();
    this.commonBufferComponent.hidden = false;
    this.commonBufferComponent.isVideo = false;
    this.commonBufferComponent.isLoudSpeaker = false;
    this.commonBufferComponent.tipType = 'buffer';
    this.commonBufferComponent.severity = 'defenceobj';
    this.commonBufferComponent.funName = baseLocal.tsemap_local.Bufferanalysisbox.protectionTargetAnalysis;
    this.commonBufferComponent.resourceTypeCriteria.parentCode = 'A05B02';
    this.commonBufferComponent.showDetailJson = [
      { showName: baseLocal.tsemap_local.Common.name, firstAttr: 'name', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.type, firstAttr: 'resourceCatalogName', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.address, firstAttr: 'address', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.longitude, firstAttr: 'longitude', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.latitude, firstAttr: 'latitude', secondAttr: '' }
    ];
    this.getType();
    this.commonBufferComponent.changeIcon('icon-Protection-goal');
    FreeFloatStart('.bufferCommonPnl #buffemergenryPeriAnalysisPopup', true);
    // $('.bufferemergenry').hide();
    // $('.buffermedical').hide();
    // $('.bufferprotectionTarget').show();
    // $('.bufferhazards').hide();
  }

  hazards() {
    $('.btnReturnAna').click();
    this.commonBufferComponent.setDeafaultXY();
    // $('.XYPnl').hide();
    this.commonBufferComponent.InitData();
    this.commonBufferComponent.hidden = false;
    this.commonBufferComponent.isVideo = false;
    this.commonBufferComponent.isLoudSpeaker = false;
    this.commonBufferComponent.tipType = 'buffer';
    this.commonBufferComponent.severity = 'danger';
    this.commonBufferComponent.funName = baseLocal.tsemap_local.Bufferanalysisbox.hazardAnalysis;
    this.commonBufferComponent.resourceTypeCriteria.parentCode = 'A05B01';
    this.commonBufferComponent.showDetailJson = [
      { showName: baseLocal.tsemap_local.Common.name, firstAttr: 'name', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.type, firstAttr: 'resourceCatalogName', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.address, firstAttr: 'address', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.longitude, firstAttr: 'longitude', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.latitude, firstAttr: 'latitude', secondAttr: '' }
    ];
    this.getType();
    this.commonBufferComponent.changeIcon('icon-Source-of-risk');
    FreeFloatStart('.bufferCommonPnl #buffemergenryPeriAnalysisPopup', true);
  }

  rallypoint() {
    this.commonBufferComponent.InitData();
    this.commonBufferComponent.setDeafaultXY();
    $('.btnReturnAna').click();
    // $('.XYPnl').hide();
    this.commonBufferComponent.hidden = false;
    this.commonBufferComponent.isVideo = false;
    this.commonBufferComponent.isLoudSpeaker = false;
    this.commonBufferComponent.tipType = 'buffer';
    this.commonBufferComponent.severity = 'rallypoint';
    this.commonBufferComponent.funName = baseLocal.tsemap_local.Bufferanalysisbox.rallypointAnalysis;
    this.commonBufferComponent.resourceTypeCriteria.parentCode = 'A05B11';
    this.commonBufferComponent.showDetailJson = [
      { showName: baseLocal.tsemap_local.Common.name, firstAttr: 'name', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.type, firstAttr: 'resourceCatalogName', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.address, firstAttr: 'address', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.longitude, firstAttr: 'longitude', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.latitude, firstAttr: 'latitude', secondAttr: '' }
    ];
    this.getType();
    this.commonBufferComponent.changeIcon('icon-Assembly-point-img');
    FreeFloatStart('.bufferCommonPnl #buffemergenryPeriAnalysisPopup', true);
  }

  depot() {
    this.commonBufferComponent.InitData();
    this.commonBufferComponent.setDeafaultXY();
    $('.btnReturnAna').click();
    // $('.XYPnl').hide();
    this.commonBufferComponent.hidden = false;
    this.commonBufferComponent.isVideo = false;
    this.commonBufferComponent.isLoudSpeaker = false;
    this.commonBufferComponent.tipType = 'buffer';
    this.commonBufferComponent.severity = 'depot';
    this.commonBufferComponent.funName = baseLocal.tsemap_local.Bufferanalysisbox.depotAnalysis;
    this.commonBufferComponent.resourceTypeCriteria.parentCode = 'A05B12';
    this.commonBufferComponent.showDetailJson = [
      { showName: baseLocal.tsemap_local.Common.name, firstAttr: 'name', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.type, firstAttr: 'resourceCatalogName', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.address, firstAttr: 'address', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.longitude, firstAttr: 'longitude', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.latitude, firstAttr: 'latitude', secondAttr: '' }
    ];
    this.getType();
    this.commonBufferComponent.changeIcon('icon-Parking');
    FreeFloatStart('.bufferCommonPnl #buffemergenryPeriAnalysisPopup', true);
  }

  elderlycenter() {
    this.commonBufferComponent.InitData();
    this.commonBufferComponent.setDeafaultXY();
    $('.btnReturnAna').click();
    // $('.XYPnl').hide();
    this.commonBufferComponent.hidden = false;
    this.commonBufferComponent.isVideo = false;
    this.commonBufferComponent.isLoudSpeaker = false;
    this.commonBufferComponent.tipType = 'buffer';
    this.commonBufferComponent.severity = 'elderlycenter';
    this.commonBufferComponent.funName = baseLocal.tsemap_local.Bufferanalysisbox.elderlycenterAnalysis;
    this.commonBufferComponent.resourceTypeCriteria.parentCode = 'A05B15';
    this.commonBufferComponent.showDetailJson = [
      { showName: baseLocal.tsemap_local.Common.name, firstAttr: 'name', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.type, firstAttr: 'resourceCatalogName', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.address, firstAttr: 'address', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.longitude, firstAttr: 'longitude', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.latitude, firstAttr: 'latitude', secondAttr: '' }
    ];
    this.getType();
    this.commonBufferComponent.changeIcon('icon-Elderly-Center');
    FreeFloatStart('.bufferCommonPnl #buffemergenryPeriAnalysisPopup', true);
  }

  loudspeaker() {
    this.commonBufferComponent.InitData();
    this.commonBufferComponent.setDeafaultXY();
    $('.btnReturnAna').click();
    // $('.XYPnl').hide();
    this.commonBufferComponent.hidden = false;
    this.commonBufferComponent.isVideo = false;
    this.commonBufferComponent.isLoudSpeaker = true;
    this.commonBufferComponent.tipType = 'buffer';
    this.commonBufferComponent.severity = 'loudspeaker';
    this.commonBufferComponent.funName = baseLocal.tsemap_local.Bufferanalysisbox.loudspeakerAnalysis;
    this.commonBufferComponent.resourceTypeCriteria.parentCode = 'A06B10';
    this.commonBufferComponent.showDetailJson = [

      { showName: baseLocal.tsemap_local.Common.name, firstAttr: 'equipmentModel', secondAttr: 'name' },
      { showName: baseLocal.tsemap_local.Common.type, firstAttr: 'equipmentModel', secondAttr: 'resourceCatalogName' },
      { showName: baseLocal.tsemap_local.Common.equipmentStatusName, firstAttr: 'equipmentModel', secondAttr: 'equipmentStatus' },

      { showName: baseLocal.tsemap_local.Common.address, firstAttr: 'installationLocation', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.longitude, firstAttr: 'equipmentModel', secondAttr: 'longitude' },
      { showName: baseLocal.tsemap_local.Common.latitude, firstAttr: 'equipmentModel', secondAttr: 'latitude' }
    ];
    this.commonBufferComponent.changeIcon('icon-Big-horn');
    this.getType();
    FreeFloatStart('.perimeBufferPnl #buffemergenryPeriAnalysisPopup', true);
  }

  screen() {
    this.commonBufferComponent.InitData();
    this.commonBufferComponent.setDeafaultXY();
    $('.btnReturnAna').click();
    // $('.XYPnl').hide();
    this.commonBufferComponent.hidden = false;
    this.commonBufferComponent.isVideo = false;
    this.commonBufferComponent.isLoudSpeaker = false;
    this.commonBufferComponent.tipType = 'buffer';
    this.commonBufferComponent.severity = 'screen';
    this.commonBufferComponent.funName = baseLocal.tsemap_local.Bufferanalysisbox.screenAnalysis;
    this.commonBufferComponent.resourceTypeCriteria.parentCode = 'A06B09';
    this.commonBufferComponent.showDetailJson = [
      { showName: baseLocal.tsemap_local.Common.name, firstAttr: 'name', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.type, firstAttr: 'resourceCatalogName', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.equipmentStatusName, firstAttr: 'statusName', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.address, firstAttr: 'eEquipmentInstitution', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.longitude, firstAttr: 'longitude', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.latitude, firstAttr: 'latitude', secondAttr: '' }
    ];
    this.commonBufferComponent.changeIcon('icon-Display');
    this.getType();
    FreeFloatStart('.perimeBufferPnl #buffemergenryPeriAnalysisPopup', true);
  }

  evacuation() {
    this.commonBufferComponent.InitData();
    this.commonBufferComponent.setDeafaultXY();
    $('.btnReturnAna').click();
    // $('.XYPnl').hide();
    this.commonBufferComponent.hidden = false;
    this.commonBufferComponent.isVideo = false;
    this.commonBufferComponent.isLoudSpeaker = false;
    this.commonBufferComponent.tipType = 'buffer';
    this.commonBufferComponent.severity = 'evacuate';
    this.commonBufferComponent.funName = baseLocal.tsemap_local.Bufferanalysisbox.evacueeAnalysis;
    this.commonBufferComponent.resourceTypeCriteria.parentCode = 'A01B04';
    this.commonBufferComponent.showDetailJson = [
      { showName: baseLocal.tsemap_local.Common.name, firstAttr: 'firstName', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.type, firstAttr: 'resourceCatalogName', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.address, firstAttr: 'address', secondAttr: '' },
      { showName: baseLocal.tsemap_local.personEvacute.mobile, firstAttr: 'mobile', secondAttr: '' },
      { showName: baseLocal.tsemap_local.personEvacute.status, firstAttr: 'statusName', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.longitude, firstAttr: 'longitude', secondAttr: '' },
      { showName: baseLocal.tsemap_local.Common.latitude, firstAttr: 'latitude', secondAttr: '' }
    ];
    this.commonBufferComponent.changeIcon('icon-Evacuation');
    this.getType();
    FreeFloatStart('.perimeBufferPnl #buffemergenryPeriAnalysisPopup', true);
  }

  submitOk = () => {

  }

  submitCancel = () => {
    this.hidden = true;
    console.log('submitCancel');
  }
}
