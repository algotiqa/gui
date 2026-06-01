//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component} from '@angular/core';

import {MatInputModule}       from "@angular/material/input";
import {MatIconModule}        from "@angular/material/icon";
import {MatButtonModule}      from "@angular/material/button";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {FlexTablePanel} from "../../../../../../../component/panel/flex-table/flex-table.panel";
import {AbstractPanel} from "../../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../../service/label.service";
import {InventoryService} from "../../../../../../../service/inventory.service";
import {CollectorService} from "../../../../../../../service/collector.service";
import {MatChipsModule} from "@angular/material/chips";
import {MatSelectModule} from "@angular/material/select";
import {DataPoint, DataInstrumentDataResponse} from "../../../../../../../model/model";
import {FlexTableColumn} from "../../../../../../../model/flex-table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {SelectRequired} from "../../../../../../../component/form/select-required/select-required";
import {DatePicker} from "../../../../../../../component/form/date-picker/date-picker";
import {DataPointTimeTranscoder} from "../../../../../../../component/panel/flex-table/transcoders";
import {TimeframeSelector} from "../../../../../../../component/form/timeframe-selector/timeframe-selector";
import {PeriodSelector, PeriodSelectorInfo} from "../../../../../../../component/form/period-selector/period-selector";
import {ConnectButton} from "../../../../../../../component/button/connect/connect.button";
import {CreateButton} from "../../../../../../../component/button/create/create.button";
import {DisconnectButton} from "../../../../../../../component/button/disconnect/disconnect.button";
import {EditButton} from "../../../../../../../component/button/edit/edit.button";
import {ListButtons, ListContent, ListPanel} from "../../../../../../../component/panel/list-panel/list-panel";
import {ViewButton} from "../../../../../../../component/button/view/view.button";
import {BackButton} from "../../../../../../../component/button/back/back.button";
import {NavigationService} from "../../../../../../../service/navigation.service";

//=============================================================================

@Component({
    selector: 'instrumentData-data',
    templateUrl: './instrument-data.data.html',
    styleUrls: ['./instrument-data.data.scss'],
  imports: [MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, RouterModule, FlexTablePanel, MatChipsModule, MatSelectModule, SelectRequired, TimeframeSelector, PeriodSelector, ConnectButton, CreateButton, DisconnectButton, EditButton, ListButtons, ListContent, ListPanel, ViewButton, BackButton]
})

//=============================================================================

export class DataInstrumentDataPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  id : number = 0

  period        : PeriodSelectorInfo = new PeriodSelectorInfo()
  timeframe     : number             = 60
  timezone      : string             = "exchange"

  columns         : FlexTableColumn[] = [];
  dataPoints      : DataPoint[] = []
  serviceResponse?: DataInstrumentDataResponse

  timeframes: any
  timezones : any

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private route            : ActivatedRoute,
              private navigationService: NavigationService,
              private inventoryService : InventoryService,
              private collectorService : CollectorService) {

    super(eventBusService, labelService, router, "inventory.dataProduct.data");
    this.navigationService.push()
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
    this.timeframes = this.labelService.getLabel("map.timeframe");

    this.id = Number(this.route.snapshot.paramMap.get("id"));

    this.inventoryService.getExchanges().subscribe(
      result => {
        let exchange = {
          timezone : "exchange",
          code     : this.loc("exchange")
        }

        this.timezones = [ exchange, ...result.result]
      }
    )
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onPeriodChange(period: PeriodSelectorInfo) {
    this.onReload();
  }

  //-------------------------------------------------------------------------

  onTimeframeChange(value: number) {
    this.timeframe = value;
  }

  //-------------------------------------------------------------------------

  onTimezoneChange(value: string) {
    this.timezone = value;
  }

  //-------------------------------------------------------------------------

  onReload = () => {
    if (this.tooManyDataPoints()) {
      alert(this.loc("tooManyDataPoints"))
      return
    }

    this.collectorService.getDataInstrumentData(this.id, this.period, this.timeframe, this.timezone, 0).subscribe(
      result => {
        this.serviceResponse = result;
        this.dataPoints      = result.dataPoints
      }
    )
  }

  //-------------------------------------------------------------------------
  //---
  //--- Helpers
  //---
  //-------------------------------------------------------------------------

  title() : string {
    let title = this.loc('title')
    if (this.serviceResponse) {
      title = title +" : "+ this.serviceResponse.symbol
    }

    return title
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private setupColumns = () => {
    let instr = this.labelService.getLabel("model.dataPoint");

    this.columns = [
      new FlexTableColumn(instr, "time", new DataPointTimeTranscoder()),
      new FlexTableColumn(instr, "open"),
      new FlexTableColumn(instr, "high"),
      new FlexTableColumn(instr, "low"),
      new FlexTableColumn(instr, "close"),
      new FlexTableColumn(instr, "upVolume"),
      new FlexTableColumn(instr, "downVolume"),
      new FlexTableColumn(instr, "upTicks"),
      new FlexTableColumn(instr, "downTicks"),
      new FlexTableColumn(instr, "openInterest"),
    ]
  }

  //-------------------------------------------------------------------------

  private tooManyDataPoints() : boolean {
    let days         = this.period.daysBack
    let from = this.period.fromDate
    let to   = this.period.toDate

    let pInDay = 1440 / this.timeframe

    if (this.period.custom) {
      if (from == undefined || to == undefined) {
        return true
      }

      let fromY = from / 10000
      let fromM = (from / 100) % 100
      let fromD = (from) % 100

      let toY = to / 10000
      let toM = (to / 100) % 100
      let toD = (to) % 100

      days = (toY - fromY)*365 + (toM - fromM)*12 + (toD - fromD)
    }

    return (days*pInDay > 10000)
  }
}

//=============================================================================
