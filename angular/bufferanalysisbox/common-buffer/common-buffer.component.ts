import { Component, OnInit, ViewChild } from '@angular/core';
import { GPerimeter } from '../../services/service/model/g-perimeter'; // 周边分析model
import { PerimeterService } from '../../services/service/perimeter.service';
import { QueryModel } from '../../services/service/model/query';
import { ResourceTypeCriteriaModel } from '../../services/service/model/ResourceTypeCriteria';
import { ResourceCatalogModel } from '../../services/service/model/ResourceCatalog';
import { IncidentModel } from '../../services/service/model/incident.model';
import { GPloygonModel } from '../../services/service/model/g-ploygon';
import { MapService } from '../../services/service/map.service';
import { LocationService } from '../../services/service/location.service';
import { TranslateService } from 'ng2-translate';
// import { VideoShowComponent } from './videoShow.component';
// import { CameraHistoryComponent } from '../cameraHistory/cameralistbox.component';
// 综合会商集成
// import { EventAggregatorConsult } from "../../consult-common/common/eventaggregator.service";
import { pushLoudSpeakerComponent } from "../../push-loudSpeaker/push-loudspeaker.component";
import { videPlayService } from "../../../gis-module-append/services/videoplay/videoplay.service";
import { Alert } from '../../confirm/alert';

// 综合会商集成
declare var $: any;
declare let G: any;
declare let plot: any;
declare let bufferData: any;
declare let FreeFloatStart: any;

@Component({
  selector: 'app-common-buffer',
  templateUrl: './common-buffer.component.html',
  // styleUrls: ['./common-buffer.component.css']
})
export class CommonBufferComponent implements OnInit {
  hidden: boolean = true;
  gploygon: GPloygonModel = new GPloygonModel();
  shelters: GPerimeter[] = [];
  currentTime: Date = new Date();
  incidentPoint: any;
  gaugeTaskId: string;
  pointType = true;
  okButtonOptions: any;
  Query: any;
  Insert: any;
  SiteIncident: any;
  okExport: any;
  onbufferQuery: any;
  queryModel: QueryModel = new QueryModel();
  resourceTypeCriteria: ResourceTypeCriteriaModel = new ResourceTypeCriteriaModel();
  resourceTypes: ResourceCatalogModel[] = [];
  currentIncident: IncidentModel = new IncidentModel();
  checkedAll = false;
  alert: any;
  // 经纬度
  longitude: string;
  latitude: string;
  point: any;
  isVideo = false;

  isLoudSpeaker = false;
  accountModel;
  role =[];
  plotType: any = {
    search:true,point: true, line: true, round: true, rectangle: true, sector: true,
    freeArea: true, polygon: true
  };

  // @ViewChild(VideoShowComponent) public videoShowComponent: VideoShowComponent;
  // @ViewChild(CameraHistoryComponent) public cameraHistoryComponent: CameraHistoryComponent;
  @ViewChild(pushLoudSpeakerComponent) public pushLoudSpeakerCo: pushLoudSpeakerComponent;

  keyWord = '';
  funName: string = '';
  plotComponent: any;
  showDetailJson = [];
  tipType = '';
  NumberOfCameras: any = [];
  onCloseMethod: any;
  constructor(private surroundAnalysisService: PerimeterService,    // 事件类型服务
    private tsemapService: MapService,   // gis服务
    private locationService: LocationService,
    private translate: TranslateService,private videPlayService: videPlayService
  ) {
     this.alert = new Alert(this.translate);
    // // 综合会商集成
    // let eventAggregatorConsult: EventAggregatorConsult = new EventAggregatorConsult();
    // eventAggregatorConsult.subscribe('OpneRealVideoListenter', '', (res) => {
    //   this.videoPlay(res);
    // });
    // 综合会商集成
    this.translate.get([
      'FacilityAnaly.locationAccident',
      'FacilityAnaly.exportReport',
      'FacilityAnaly.exportimg',
      'FacilityAnaly.checkType',
      'FacilityAnaly.query'
    ]).toPromise().then((result) => {
      this.SiteIncident.text = result['FacilityAnaly.locationAccident'];
      this.okButtonOptions.text = result['FacilityAnaly.exportReport'];
      this.okExport.text = result['FacilityAnaly.exportimg'];
      this.Insert.text = result['FacilityAnaly.checkType'];
      this.Query.text = result['FacilityAnaly.query'];
    })

    this.SiteIncident = {
      text: String,
      type: 'normal'
    };
    this.okButtonOptions = {
      text: String,
      type: 'normal'
    };
    this.okExport = {
      text: String,
      type: 'normal'
    };
    this.Insert = {
      text: String,
      type: 'normal'
    };
    this.Query = {
      text: String,
      type: 'normal'
    };
    this.onbufferQuery = {
      text: '',
      type: ''
    }



  }

  ngOnInit() {

  }

  submitCancel() {
    this.hidden = !this.hidden;
    // $('.bufferemergenry').hide();
  }

  setDeafaultXY() {
    //初始化 經緯度 默認 值 為 中線點  by lihuazhang
    let center = this.tsemapService.getMap().getCenter();
    var longitude = Number.parseFloat(center[0]).toFixed(6);
    var latitude = Number.parseFloat(center[1]).toFixed(6);
    $('.valueLo').val(longitude);
    $('.valueLa').val(latitude);
  }

  histryVideo(data) {
    // var code = data.rescode.value;
    // this.cameraHistoryComponent.hidden = false;
    // this.cameraHistoryComponent.GetCameraInfo(code);
    FreeFloatStart('.history_video_popup', true);
  }

  videoPlay(data) {
    this.accountModel = JSON.parse(window.localStorage.getItem('eds_loginUserObject'));
    if(this.accountModel){
    this.role = this.accountModel.accountModel.roleModels;
    this.role = this.role.filter(x=>x.code == '11')
    }
    if(this.role&&this.role.length==0){
        console.log('只有賦予視頻調閱員角色的用戶可以查看視頻畫面');
        this.alert.alertWindowOpenAndClose('只有賦予視頻調閱員角色的用戶可以查看視頻畫面');
        return;
    }

    this.videPlayService.videoPlayRequest(data.rescode.value);
    // this.videoShowComponent.hidden = false;
    // this.videoShowComponent.isShowHistory = false;
    // var code = data.rescode.value;
    // this.videoShowComponent.GetVideo(code);
    // FreeFloatStart('#buffShowViedePopup', true);
  }
  plotPolySearch(event){
    $('.XYPnl').hide();
    $('.radiusD').hide();
    bufferData = undefined;
    this.locationService.clearBuffer();
    this.bufferType = '8C';
    this.siteIncident();
    $('.bufferTypePnl div i').removeClass('blueColor');
    $('.bufferTypePnl div').removeClass('blueColor');
    $(event.target).addClass('blueColor')
  }
  plotPolyPoint(event) {
    $('.radiusD').show();
    $('.XYPnl').show();
    bufferData = undefined;
    this.locationService.clearBuffer();
    this.bufferType = '0';
    this.siteIncident();
    $('.bufferTypePnl div i').removeClass('blueColor');
    $('.bufferTypePnl div').removeClass('blueColor');
    $(event.target).addClass('blueColor')
  }

  plotRound(event) {
    $('.radiusD').show();
    $('.XYPnl').hide();
    bufferData = undefined;
    this.locationService.clearBuffer();
    var opts = { type: {} };
    opts.type = G.plot.TYPES.Circle;
    plot.plot(opts);
    this.bufferType = '3';
    $('.bufferTypePnl div i').removeClass('blueColor');
    $('.bufferTypePnl div').removeClass('blueColor');
    $(event.target).addClass('blueColor')
  }

  plotRectangle(event) {
    $('.radiusD').show();
    $('.XYPnl').hide();
    bufferData = undefined;
    this.locationService.clearBuffer();
    var opts = { type: {} };
    opts.type = G.plot.TYPES.Rectangle;
    plot.plot(opts);
    this.bufferType = '4';
    $('.bufferTypePnl div i').removeClass('blueColor');
    $('.bufferTypePnl div').removeClass('blueColor');
    $(event.target).addClass('blueColor')
  }

  bufferType = '0';
  plotPolygon(event) {
    $('.radiusD').show();
    $('.XYPnl').hide();
    bufferData = undefined;
    this.locationService.clearBuffer();
    var opts = { type: {} };
    opts.type = G.plot.TYPES.Polygon;
    plot.plot(opts);
    this.bufferType = '2';
    $('.bufferTypePnl div i').removeClass('blueColor');
    $('.bufferTypePnl div').removeClass('blueColor');
    $(event.target).addClass('blueColor')
  }

  plotSector(event) {
    $('.radiusD').show();
    $('.XYPnl').hide();
    bufferData = undefined;
    this.locationService.clearBuffer();
    var opts: any = { type: {} };
    opts.type = G.plot.TYPES.Sector;
    plot.plot(opts);
    this.bufferType = '5';
    $('.bufferTypePnl div i').removeClass('blueColor');
    $('.bufferTypePnl div').removeClass('blueColor');
    $(event.target).addClass('blueColor')
  }

  plotFreeArea(event) {
    $('.radiusD').show();
    $('.XYPnl').hide();
    bufferData = undefined;
    this.locationService.clearBuffer();
    var opts: any = { type: {} };
    opts.type = G.plot.TYPES.FreePolygon;
    plot.plot(opts);
    this.bufferType = '6';
    $('.bufferTypePnl div i').removeClass('blueColor');
    $('.bufferTypePnl div').removeClass('blueColor');
    $(event.target).addClass('blueColor')
  }

  plotPolyline(event) {
    $('.radiusD').show();
    $('.XYPnl').hide();
    bufferData = undefined;
    this.locationService.clearBuffer();
    var opts: any = { type: {} };
    opts.type = G.plot.TYPES.Polyline;
    plot.plot(opts);
    this.bufferType = '1';
    $('.bufferTypePnl div i').removeClass('blueColor');
    $('.bufferTypePnl div').removeClass('blueColor');
    $(event.target).addClass('blueColor')
  }

  Location(data) {
    var code = data.rescode.value;
    this.locationService.buggerDetailShow(code, this.isVideo, this.tipType);
  }

  InitData() {
    $('#mainnav-container').show();
    $('.bufferDataPnl').hide();
    this.dataResult = [];
    this.resourceTypes = [];
  }
  changeIcon(name) {
    $('.videoIcon').hide();
    $('.titleIcon').show();
    $('.titleIcon').removeClass('icon-Emergency-shelter-img');
    $('.titleIcon').removeClass('icon-Medical-institutions');
    $('.titleIcon').removeClass('icon-Protection-goal');
    $('.titleIcon').removeClass('icon-Source-of-risk');
    $('.titleIcon').removeClass('icon-Hotel');
    $('.titleIcon').removeClass('icon-Assembly-point-img');
    $('.titleIcon').removeClass('icon-Parking');
    $('.titleIcon').removeClass('icon-Elderly-Center');
    $('.titleIcon').removeClass('icon-Big-horn');
    $('.titleIcon').removeClass('icon-Display');
    $('.titleIcon').removeClass('icon-Monitoring');
    $('.titleIcon').removeClass('icon-Evacuation');
    $('.titleIcon').addClass(name);

  }
  hideme = () => {
    this.hidden = true;
    this.dataResult = [];
    this.resourceTypes = [];
    $('.listAll li').removeClass('addactive');
    if (this.onCloseMethod) {
      this.onCloseMethod();
    }
  }

  // 报表
  report() {
    const r = $('input[name="number"]').val() * 100000;
    const p = this.tsemapService.influencePoint();
    this.currentIncident.longitude = p.x;
    this.currentIncident.latitude = p.y;
    let str1 = '';
    let str2 = '';
    if ($('input[name="check"]:first').is(':checked')) {
      str1 = 'A05B03C01';
    }
    if ($('input[name="check"]:last').is(':checked')) {
      str2 = 'A05B03C02';
    }
    const type = str1 + ',' + str2;
    window.location.href = this.surroundAnalysisService.getDomin() + "/surround/writeCSV" + "?x=" + this.queryModel.x + "&y=" + this.queryModel.y + "&radiusM=" + r + "&codes=" + type;
  }

  siteIncident() {
    this.point = this.locationService.influencePoint('valueLo', 'valueLa');
    return this.point;
  }

  raduw: number = 1;
  dataResult: any;
  severity: string = '';
  // 查询
  async query() {
    this.dataResult = [];
    this.locationService.clearBuffer();
    if (this.resourceTypes.filter(r => r.selectItem == true).length == 0) {
      return;
    }
    $('.navAndBuf').css('left', '-500px');
    if (!this.raduw) {
      this.raduw = 0;
    }
    if (this.raduw && this.raduw >= 0) {

      await this.locationService.locationQuery(this.bufferType, $('.valueLo').val(), $('.valueLa').val(), this.raduw * 1, this.resourceTypeCriteria.parentCode, this.severity, this.keyWord, this.resourceTypes.filter(r => r.selectItem == true), this.isVideo, this.showDetailJson, this.tipType)
        .then((result) => {
          this.dataResult = result;
          let arr = [];
          this.dataResult.forEach((t, i) => {
            let temp:string = this.dataResult[i].resname.value;
            if(!temp.includes('input')){
              arr.push(this.dataResult[i])
            }
          })
          this.dataResult=arr;
          if(this.isVideo){
            this.NumberOfCameras = this.dataResult.length;
          }
          // this.dataResult.forEach((t, i) => {
          //   this.dataResult[i].x.vlaue=parseFloat(this.dataResult[i].x.vlaue).toFixed(6);
          //   this.dataResult[i].y.vlaue=parseFloat(this.dataResult[i].y.vlaue).toFixed(6);
          // });
        });
    } else {
      console.log(this.raduw);
    }

  }

  // playHistoryVideo_clk(data) {
    // this.videoShowComponent.isShowHistory = true;
    // this.videoShowComponent.hidden = false;
    // this.videoShowComponent.GetVideo(data);
  // }

  return_clk() {
    $('.navAndBuf').css('left', '0');
    this.dataResult = [];
  }
  //综合会商集成
  shareRunTimeVideo(data) {
    // let eventAggregatorConsult: EventAggregatorConsult = new EventAggregatorConsult();
    // let options = {
    //   camera_url: data.rescode.value,
    //   camera_name: data.resname.value,
    //   data: JSON.stringify(data)
    // }
    // eventAggregatorConsult.publish('SendRealTimevideoListenter', options);
  }

  pushLoudSpeaker() {
    this.pushLoudSpeakerCo.show();
    this.pushLoudSpeakerCo.dataResult = this.dataResult;
  }

  enterKeyMethod(event) {
    if (event.keyCode === 13) {
      this.query();
    }
  }
}
