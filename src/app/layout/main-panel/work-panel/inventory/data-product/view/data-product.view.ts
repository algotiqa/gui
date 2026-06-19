//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';

import {MatInputModule}       from "@angular/material/input";
import {MatCardModule}        from "@angular/material/card";
import {MatIconModule}        from "@angular/material/icon";
import {MatButtonModule}      from "@angular/material/button";
import {DeleteResponse, DataInstrumentExt, DataProductExt, DIEStatus} from "../../../../../../model/model";
import {FlexTableColumn, ListService} from "../../../../../../model/flex-table";
import {AbstractPanel}        from "../../../../../../component/abstract.panel";
import {FlexTablePanel}       from "../../../../../../component/panel/flex-table/flex-table.panel";
import {LabelService}         from "../../../../../../service/label.service";
import {EventBusService}      from "../../../../../../service/eventbus.service";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {AppEvent} from "../../../../../../model/event";
import {InventoryService} from "../../../../../../service/inventory.service";
import {MatTabsModule} from "@angular/material/tabs";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {InstrumentUploadDialog} from "./instrument-upload.dialog";
import {
  IntDateTranscoder, IsoDateTranscoder
} from "../../../../../../component/panel/flex-table/transcoders";
import {CollectorService} from "../../../../../../service/collector.service";
import {Url} from "../../../../../../model/urls";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {Setting} from "../../../../../../model/setting";
import {LocalService} from "../../../../../../service/local.service";
import {ChartComponent} from "ng-apexcharts";
import {ChartOptions} from "../../../../../../lib/chart-lib";
import {MatSnackBar} from "@angular/material/snack-bar";
import {interval, Subscription} from "rxjs";
import {ToggleButton} from "../../../../../../component/form/toggle-button/toggle-button";
import {
  FlagStyler,
  InstrumentStatusStyler,
  RolloverStatusStyler
} from "../../../../../../component/panel/flex-table/icon-sylers";
import {BackButton} from "../../../../../../component/button/back/back.button";
import {DeleteButton} from "../../../../../../component/button/delete/delete.button";
import {ListButtons, ListContent, ListPanel} from "../../../../../../component/panel/list-panel/list-panel";
import {ConfirmationDialogData} from "../../../../../../component/form/confirmation-dialog/confirmation.data";
import {ConfirmationDialog} from "../../../../../../component/form/confirmation-dialog/confirmation-dialog.component";
import {NavigationService} from "../../../../../../service/navigation.service";
import {ChartButton} from "../../../../../../component/button/chart/chart.button";
import {DataButton} from "../../../../../../component/button/data/data.button";
import {UploadButton} from "../../../../../../component/button/upload/upload.button";
import {ReloadButton} from "../../../../../../component/button/reload/reload.button";

//=============================================================================

@Component({
    selector: 'data-product-view',
    templateUrl: './data-product.view.html',
    styleUrls: ['./data-product.view.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, FlexTablePanel, MatTabsModule, MatDialogModule, MatButtonToggleModule, ReactiveFormsModule, ChartComponent, ToggleButton, BackButton, DeleteButton, ListButtons, ListContent, ListPanel, ChartButton, DataButton, UploadButton, ReloadButton]
})

//=============================================================================

export class DataProductView extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  id : number         = 0
  dp : DataProductExt = new DataProductExt()

  market     : string = ""
  product    : string = ""
  service?   : ListService<DataInstrumentExt>;
  disChart   : boolean = false;
  disData    : boolean = true;
  disReload  : boolean = true;
  autoRefresh: boolean = false;

  selInstr?: number

  columnsStandard : FlexTableColumn[]   = [];
  dataStandard    : DataInstrumentExt[] = []
  columnsRollover : FlexTableColumn[]   = [];
  dataRollover    : DataInstrumentExt[] = []
  columnsDownload : FlexTableColumn[]   = [];
  dataDownload    : DataInstrumentExt[] = []
  columnsIngestion: FlexTableColumn[]   = [];
  dataIngestion   : DataInstrumentExt[] = []

  selContractType = new FormControl("*")
  selStatusType   = new FormControl("*")

  @ViewChild("table") table : FlexTablePanel<DataInstrumentExt>|null = null;

  options         : ChartOptions;
  reloadInterval? : Subscription;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private snackBar         : MatSnackBar,
              private route            : ActivatedRoute,
              private navigationService: NavigationService,
              private inventoryService : InventoryService,
              private collectorService : CollectorService,
              private localService     : LocalService,
              public  dialog           : MatDialog) {

    super(eventBusService, labelService, router, "inventory.dataProduct", "dataProduct");

    this.navigationService.push()
    this.options = this.buildInitialChartOptions();

    eventBusService.subscribeToApp(AppEvent.DATAINSTRUMENT_LIST_RELOAD, () => {
      this.table?.reload()
    })
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
    this.id = Number(this.route.snapshot.paramMap.get("id"));

    this.selStatusType.setValue(this.localService.getStringItem(Setting.Inventory_DataProd_Status, "*"))

    this.inventoryService.getDataProductById(this.id).subscribe(
      result => {
        this.dp      = result
        this.market  = this.labelService.getLabelString("map.market." +this.dp.marketType)
        this.product = this.labelService.getLabelString("map.product."+this.dp.productType)
      }
    )

    this.reload()

    this.reloadInterval = interval(5000).subscribe(
      result => {
        if (this.autoRefresh) {
          this.reload()
        }
      }
    )
  }

  //-------------------------------------------------------------------------

  override destroy = () : void => {
    this.reloadInterval?.unsubscribe()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onRowSelected(selection : DataInstrumentExt[]) {
    if (selection.length == 1) {
      let die = selection[0];
      this.selInstr = die.id
      this.disData  = false
      this.disReload= (die.status != DIEStatus.Ready) && (die.status != DIEStatus.Empty)
    }
    else {
      this.selInstr = undefined
      this.disData  = true
      this.disReload= true;
    }

    //--- In case of a local connection, we cannot enable the reload button

    if (this.dp.connection?.supportsMultipleData) {
      this.disReload = true
    }
  }

  //-------------------------------------------------------------------------

  onUploadClick() {
    const dialogRef = this.dialog.open(InstrumentUploadDialog, {
      minWidth: "1024px",
      data: {
        dataProduct : this.dp
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.table?.reload()
      }
    })
  }

  //-------------------------------------------------------------------------

  onChartClick() {
    this.navigateTo([ Url.Inventory_DataProducts, this.id, Url.Sub_Chart ]);
  }

  //-------------------------------------------------------------------------

  onDataClick() {
    this.navigateTo([ Url.Inventory_DataInstruments, this.selInstr, Url.Sub_Data ]);
  }

  //-------------------------------------------------------------------------

  onFilterChange() {
    let value = this.selStatusType.value
    this.localService.setStringItem(Setting.Inventory_DataProd_Status, value)
    this.table?.applyFilter()
  }

  //-------------------------------------------------------------------------

  onReloadClick() {
    if (this.selInstr) {
      this.collectorService.reloadDataInstrumentData(this.selInstr).subscribe(
        result => {
          this.reload()
          let message = this.loc("reloaded")
          this.snackBar.open(message, "", { duration:3000 } )
        }
      )
    }
  }

  //-------------------------------------------------------------------------

  onDeleteClick() {
    let data : ConfirmationDialogData = {
      labels: "deleteDataProduct"
    }

    this.dialog.open(ConfirmationDialog, {data}).afterClosed().subscribe(result => {
      if (!result) {
        return
      }

      this.inventoryService.deleteDataProduct(this.id).subscribe( status => {
        if (status == DeleteResponse.Ok) {
          this.navigateTo([ Url.Inventory_DataProducts ])
        }
        else {
          let message = this.loc("delete."+status)
          this.snackBar.open(message, this.button("ok"))
        }
      })
    })
  }

  //-------------------------------------------------------------------------
  //--- Filter
  //-------------------------------------------------------------------------

  tableFilter = (row : DataInstrumentExt, filter : string) : boolean => {
      // @ts-ignore
    return this.typeFilter(row) && this.statusFilter(row) && this.table?.defaultFilter(row, filter)
  }

  //-------------------------------------------------------------------------

  private typeFilter(row : DataInstrumentExt) : boolean {
    let type = this.selContractType.value

    if (type=="*") {
      return true
    }

    if (type == "reg" && !row.continuous) {
      return true
    }

    if (type == "cont" && row.continuous) {
      return true
    }

    return false
  }

  //-------------------------------------------------------------------------

  private statusFilter(row : DataInstrumentExt) : boolean {
    let type = this.selStatusType.value

    if (type=="*") {
      return true
    }

    if (type == "stor") {
      return (row.status != undefined) || row.virtualInstrument
    }

    if (type == "bad") {
      return row.status == DIEStatus.Empty || row.status == DIEStatus.Error
    }

    return false
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.dataInstrument");

    this.columnsStandard = [
      new FlexTableColumn(ts, "symbol"),
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "expirationDate", new IsoDateTranscoder()),
      new FlexTableColumn(ts, "continuous", undefined, new FlagStyler()),
      new FlexTableColumn(ts, "dataFrom", new IntDateTranscoder()),
      new FlexTableColumn(ts, "dataTo", new IntDateTranscoder()),
      new FlexTableColumn(ts, "status", undefined, new InstrumentStatusStyler()),
      new FlexTableColumn(ts, "progress"),
    ]

    this.columnsRollover = [
      new FlexTableColumn(ts, "symbol"),
      new FlexTableColumn(ts, "expirationDate", new IsoDateTranscoder()),
      new FlexTableColumn(ts, "month"),
      new FlexTableColumn(ts, "rolloverDate",   new IsoDateTranscoder()),
      new FlexTableColumn(ts, "rolloverDelta"),
      new FlexTableColumn(ts, "rolloverStatus", undefined, new RolloverStatusStyler()),
      new FlexTableColumn(ts, "status", undefined, new InstrumentStatusStyler()),
    ]

    this.columnsDownload = [
      new FlexTableColumn(ts, "symbol"),
      new FlexTableColumn(ts, "djLoadFrom", new IntDateTranscoder()),
      new FlexTableColumn(ts, "djLoadTo",   new IntDateTranscoder()),
      new FlexTableColumn(ts, "djPriority"),
      new FlexTableColumn(ts, "djCurrDay"),
      new FlexTableColumn(ts, "djTotDays"),
      new FlexTableColumn(ts, "djError"),
    ]

    this.columnsIngestion = [
      new FlexTableColumn(ts, "symbol"),
      new FlexTableColumn(ts, "ijFilename"),
      new FlexTableColumn(ts, "ijRecords"),
      new FlexTableColumn(ts, "ijBytes"),
      new FlexTableColumn(ts, "ijTimezone"),
      new FlexTableColumn(ts, "ijParser"),
      new FlexTableColumn(ts, "ijError"),
    ]
  }

  //-------------------------------------------------------------------------

  reload() {
    this.collectorService.getDataInstrumentsByProductId(this.id, false).subscribe( result => {
      this.dataStandard = result.result
      this.rebuildLists()
    })
  }

  //-------------------------------------------------------------------------

  private rebuildLists() {
    this.dataRollover = this.buildRolloverData (this.dataStandard)
    this.dataDownload = this.buildDownloadData (this.dataStandard)
    this.dataIngestion= this.buildIngestionData(this.dataStandard)

    this.rebuildChartOptions()
  }

  //-------------------------------------------------------------------------

  private buildRolloverData (data: DataInstrumentExt[]) : DataInstrumentExt[] {
    let res : DataInstrumentExt[] = []

    data.forEach(item => {
      if (item.status != undefined) {
        res = [...res, item]
      }
    })

    return res
  }

  //-------------------------------------------------------------------------

  private buildDownloadData (data: DataInstrumentExt[]) : DataInstrumentExt[] {
    let res : DataInstrumentExt[] = []

    data.forEach(item => {
      if (item.djStatus != undefined) {
        res = [...res, item]
      }
    })

    return res
  }

  //-------------------------------------------------------------------------

  private buildIngestionData (data: DataInstrumentExt[]) : DataInstrumentExt[] {
    let res : DataInstrumentExt[] = []

    data.forEach(item => {
      if (item.ijFilename != undefined) {
        res = [...res, item]
      }
    })

    return res
  }

  //-------------------------------------------------------------------------

  private rebuildChartOptions() {
    // @ts-ignore
    this.options.series = this.buildDonutSerie()
  }

  //-------------------------------------------------------------------------

  private buildDonutLabels () : string[] {
    let map = this.labelService.getLabel("map.dataInstrumentStatus")
    return [
      map["waiting"], map["loading"], map["processing"], map["sleeping"],
      map["empty"],   map["ready"],   map["error"]
    ]
  }

  //-------------------------------------------------------------------------

  private buildDonutSerie() : number[] {
    let list = [
      0, //--- Waiting
      0, //--- Loading
      0, //--- Processing
      0, //--- Sleeping
      0, //--- Empty
      0, //--- Ready
      0, //--- Error
    ]

    this.dataStandard.forEach(i => {
      if (i.status != undefined) {
        switch (i.status) {
          case DIEStatus.Waiting   : list[0]++; break;
          case DIEStatus.Loading   : list[1]++; break;
          case DIEStatus.Processing: list[2]++; break;
          case DIEStatus.Sleeping  : list[3]++; break;
          case DIEStatus.Empty     : list[4]++; break;
          case DIEStatus.Ready     : list[5]++; break;
          case DIEStatus.Error     : list[6]++; break;
        }
      }
    })
    return list
  }

  //-------------------------------------------------------------------------

  private buildInitialChartOptions() : ChartOptions {
    return {
      title: {},
      series: [{
        data: []
      }
      ],
      chart: {
        type: "donut",
      },
      labels: this.buildDonutLabels(),
      legend: {
        height: 200,
      },
      plotOptions: {
        pie: {
          customScale: 1.1,
          donut: {
            size: "50%"
          },
        }
      },
      dataLabels: {},
      stroke: {},
      xaxis: {},
      yaxis: {},
      colors: ['#A0A0A0', '#0080FF', '#A040A0', '#A0A000', '#C04010', '#00A000','#A00000'],
      annotations: {},
      grid: {},
      tooltip: {},
      subtitle: {},
      fill: {},
      markers: {},
      states: {},
      theme: {}
    };
  }

  protected readonly Url = Url;
}

//=============================================================================
