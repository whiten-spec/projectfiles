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
  selector: 'app-buffmedical',
  templateUrl: './buffmedical.component.html',
  // styleUrls: ['./buffmedical.component.css']
})
export class BuffMedicalComponent implements OnInit {

  hidden: boolean = true;
  pointType = true;
  checkedAll = false;
  first = 'A05B04C01';
  second = 'A05B04C02';
  third = 'A05B04C03';
  forth = 'A05B04C04';
  fifth = 'A05B04C99';
  point: any;
  gploygon: GPloygonModel = new GPloygonModel();
  shelters: GPerimeter[] = []; // 周边分析model
  currentTime: Date = new Date();
  incidentPoint: any;
  gaugeTaskId: string;
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
  constructor(private surroundAnalysisService: PerimeterService,    // 事件类型服务
    // private incidentService: IncidentService,
    // private dictionaryService: DictionaryService,
    private locationService: LocationService,
    private tsemapService: MapService,    // gis服务
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
    this.resourceTypeCriteria.parentCode = 'A05B04';
    this.surroundAnalysisService.findType(this.resourceTypeCriteria).then(type => {
      this.resourceTypes = type;
    });
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

  ngOnInit() {
    // this.tsemapService.incidentSearch(this.currentIncident);
  }
  insert() {
    this.resourceTypeCriteria.parentCode = 'A05B04';
    this.surroundAnalysisService.findType(this.resourceTypeCriteria).then(type => {
      this.resourceTypes = type;
    });
    this.tsemapService.createCricle(15, -14, 10000);
  }
  submitCancel() {
    $('.buffermedical').hide();
    // this.hidden = !this.hidden;
    // 删除图层
    // this.mapService.getMap().removeLayer(this.networkLayer);
  }
  hideme = () => {
    $('.buffermedical').hide();
  }
  // 设置事发地点
  siteIncident() {
    this.tsemapService.mapClear();
    this.point = this.locationService.influencePoint('medicalLo', 'medicalLa');
    return this.point;
  }

  getlist(queryModel) {
    this.tsemapService.createCricle(queryModel.x, queryModel.y, queryModel.radiusM);
    this.surroundAnalysisService
      .getInfo(queryModel).then(shelters => {
        this.shelters = shelters;
        // 修改过的
        this.public(shelters);
      });
  }

  // 报表
  report() {
    const r = $('input[name="number"]').val() * 100000;
    // if (this.currentIncident.longitude === undefined || this.currentIncident.latitude === undefined) {
    const p = this.tsemapService.influencePoint();
    this.currentIncident.longitude = p.x;
    this.currentIncident.latitude = p.y;
    // }
    let str1 = '';
    let str2 = '';
    if ($('input[name="check"]:first').is(':checked')) {
      str1 = 'A05B03C01';
    }
    if ($('input[name="check"]:last').is(':checked')) {
      str2 = 'A05B03C02';
    }
    const type = str1 + ',' + str2;
    // window.location.href = "http://172.16.10.45:8090/api/v1/writeCSV" + "?x=" + this.currentIncident.longitude + "&y=" + this.currentIncident.latitude + "&radius=" + r;
    window.location.href = this.surroundAnalysisService.getDomin() + "/surround/writeCSV" + "?x=" + this.currentIncident.longitude + "&y=" + this.currentIncident.latitude + "&radiusM=" + r + "&codes=" + type;
    // this.surroundAnalysisService.writeCSV(this.queryModel);
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
    this.tsemapService.medicalDetail(shelter);
    // this.tsemapService.damnificationEcharts(shelter);
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

  // 级联复选框
  select() {
    if (this.checkedAll) {
      $('input[name="check"]').each(function () {
        $(this).prop('checked', true);
      });
      this.checkedAll = false;
    } else {
      this.checkedAll = true;
      $('input[name="check"]').each(function () {
        $(this).prop('checked', false);
      });
    }
  }

  // 地图截图
  shotMap() {
    this.tsemapService.shotMap();
  }

  // 查询
  radus: number = 1;
  query() {
    // var x=$('.medicalX').text();
    // var y=$('.medicalY').text();
    // this.locationService.LocalbufferQuery(x,y,this.radus*1000,'A05B01');

    this.locationService.locationQuery(this.bufferType, $('.medicalLo').val(), $('.medicalLa').val(), this.radus * 1000, 'A05B04','medical');

    // if (this.pointType) {
    //   this.siteIncident();
    //   this.pointType = false;
    // }
    // const r = $('#numberBeault input').val() * 1000;
    // $('.medicalRadius span:first-child').text(this.point.x);
    // $('.medicalRadius span:last-child').text(this.point.y);
    // $('.ol-viewport')[0].style.cursor = 'default';
    // console.log(this.point.x, this.point.y);
    // this.queryModel.radiusM = 4000;
    // this.queryModel.x = 15.000003;
    // this.queryModel.y = -13.0000003;
    // const types = [];
    // if ($('input[name="check"]:first').is(':checked')) {
    //   types.push(this.first);
    // }
    // if ($('input[name="check"]:eq(1)').is(':checked')) {
    //   types.push(this.second);
    // }
    // if ($('input[name="check"]:eq(2)').is(':checked')) {
    //   types.push(this.third);
    // }
    // if ($('input[name="check"]:eq(3)').is(':checked')) {
    //   types.push(this.forth);
    // }
    // if ($('input[name="check"]:eq(4)').is(':checked')) {
    //   types.push(this.fifth);
    // }
    // this.queryModel.codeList = types;
    // this.surroundAnalysisService
    //   .getInfo(this.queryModel).then(shelter => {
    //   this.shelters = shelter;
    //   if (this.shelters.length > 0) {
    //     for (let i = 0; i < this.shelters.length; i++) {
    //       if (this.shelters[i].resourceCatalogID.substr(0, 9) === 'A05B04C01') {
    //         this.tsemapService.locationPlots(this.shelters[i].longitude, this.shelters[i].latitude);
    //       }
    //       if (this.shelters[i].resourceCatalogID.substr(0, 9) === 'A05B04C02') {
    //         this.tsemapService.disLocationPlot(this.shelters[i].longitude, this.shelters[i].latitude);
    //       }
    //       if (this.shelters[i].resourceCatalogID.substr(0, 9) === 'A05B04C03') {
    //         this.tsemapService.healthLocationPlot(this.shelters[i].longitude, this.shelters[i].latitude);
    //       }
    //       if (this.shelters[i].resourceCatalogID.substr(0, 9) === 'A05B04C04') {
    //         this.tsemapService.studyLocationPlot(this.shelters[i].longitude, this.shelters[i].latitude);
    //       }
    //     }
    //   }
    //   this.tsemapService.incidentlocationPlot(this.point.x, this.point.y);
    //   this.tsemapService.pointMedical(this.shelters);
    //   this.tsemapService.createCricle(this.point.x, this.point.y, r);
    // });
  }

  judge() {
    if (this.currentIncident.longitude === undefined || this.currentIncident.latitude === undefined) {
      const p = this.tsemapService.influencePoint();
      this.currentIncident.longitude = p.x;
      this.currentIncident.latitude = p.y;
    }
  }

}
