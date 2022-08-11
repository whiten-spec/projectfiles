import { Component, OnInit } from '@angular/core';
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

declare var $: any;
declare let G: any;
declare let plot: any;

@Component({
  selector: 'app-buffemergency',
  templateUrl: './buffemergency.component.html',
  // styleUrls: ['./buffemergency.component.css']
})
export class BuffEmergencyComponent implements OnInit {
  hidden: boolean = true;
  gploygon: GPloygonModel = new GPloygonModel();
  shelters: GPerimeter[] = []; // 周边分析model
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
  // 经纬度
  longitude: string;
  latitude: string;
  point: any;

  plotComponent: any;
  constructor(private surroundAnalysisService: PerimeterService,    // 事件类型服务
    private tsemapService: MapService,   // gis服务
    private locationService: LocationService,
    private translate: TranslateService,
  ) {
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

    //onbufferQuery 此属性没有初始化就使用，导致页面使用onbufferQuery.text 报错。
    //临时解决错误初始化此属性 by:高敬宗
    this.onbufferQuery = {
      text: '',
      type: ''
    }

    this.resourceTypeCriteria.parentCode = 'A05B03';
    this.surroundAnalysisService.findType(this.resourceTypeCriteria).then(type => {
      this.resourceTypes = type;
    });
  }

  ngOnInit() {

  }

  insert() {
    this.resourceTypeCriteria.parentCode = 'A05B03';
    this.surroundAnalysisService.findType(this.resourceTypeCriteria).then(type => {
      this.resourceTypes = type;
    });
  }

  submitCancel() {
    this.hidden = !this.hidden;
    $('.bufferemergenry').hide();
  }

  plotPolyPoint() {
    this.bufferType = '0';
    this.siteIncident();
  }

  bufferType = '0';
  plotPolygon() {
    var opts = { type: {} };
    opts.type = G.plot.TYPES.Polygon;
    plot.plot(opts);
    this.bufferType = '2';
  }
  plotPolyline() {
    var opts: any = { type: {} };
    opts.type = G.plot.TYPES.Polyline;
    plot.plot(opts);
    this.bufferType = '1';
  }
  hideme = () => {
    this.hidden = !this.hidden;
    $('.bufferemergenry').hide();
  }

  getlist(queryModel) {
    this.tsemapService.createCricle(queryModel.x, queryModel.y, queryModel.radiusM);
    this.surroundAnalysisService
      .getInfo(queryModel).then(shelters => {
        this.shelters = shelters;
        this.public(shelters);
      });
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

  // 点击场所列表中的某一条变色,并显示详情
  showDetail(i, shelter) {
    for (let j = 0; j < this.shelters.length; j++) {
      this.shelters[j].navClass = '';
    }
    this.shelters[i].navClass = 'active';
    $('.locationGray').eq(i).attr('src', '../assets/image/LocateBlue.png')
      .parent().parent().siblings().find('img').attr('src', '../assets/image/LocateGray.png');
    // 定位、详情
    this.tsemapService.coordinateSearch(shelter);
  }

  public(shelters) {
    if ($('input[name="check"]:first').is(':checked')) {
      const filterExpert = [];
      shelters.forEach(function (rub) {
        if (rub.typeId.substr(0, 9) === 'A05B03C01') {
          filterExpert.push(rub);
        }
      });
      for (let i = 0; i < filterExpert.length; i++) {
        this.tsemapService.locationPlot(filterExpert[i].longitude, filterExpert[i].latitude);
      }
    }
    if ($('input[name="check"]:last').is(':checked')) {
      const filterExpert = [];
      shelters.forEach(function (rub) {
        if (rub.typeId.substr(0, 9) === 'A05B03C02') {
          filterExpert.push(rub);
        }
      });
      for (let i = 0; i < filterExpert.length; i++) {
        this.tsemapService.locationPlot2(filterExpert[i].longitude, filterExpert[i].latitude);
      }
    }
  }

  change() {
    if ($('input[name="number"]').val() > 5) {
      $('.inp_p').show();
    } else {
      $('.inp_p').hide();
    }
  }

  // 地图截图
  shotMap() {
    this.tsemapService.shotMap();
  }

  siteIncident() {
    this.point = this.locationService.influencePoint('valueLo', 'valueLa');
    return this.point;
  }

  raduw: number = 1;
  // 查询
  query() {
    // this.locationService.LocalbufferQuery('13.248','-9.009',this.raduw*2000,'A05B03');
    this.locationService.locationQuery(this.bufferType, $('.valueLo').val(), $('.valueLa').val(), this.raduw * 1000, 'A05B03','shelter');
  }
  
  judge() {
    if (this.currentIncident.longitude === undefined || this.currentIncident.latitude === undefined) {
      const p = this.tsemapService.influencePoint();
      this.currentIncident.longitude = p.x;
      this.currentIncident.latitude = p.y;
    }
  }
}
