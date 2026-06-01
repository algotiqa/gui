//=============================================================================
//===
//=== Copyright (C) 2026 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from "@angular/core";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {LabelService} from "../../../../../../service/label.service";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {Router} from "@angular/router";
import {PorTradingSystem} from "../../../../../../model/model";
import {FlatButton} from "../../../../../../component/form/flat-button/flat-button";
import {FlexTablePanel} from "../../../../../../component/panel/flex-table/flex-table.panel";
import {FlexTableColumn, ListResponse, ListService} from "../../../../../../model/flex-table";
import {InventoryService} from "../../../../../../service/inventory.service";
import {FlagStyler} from "../../../../../../component/panel/flex-table/icon-sylers";
import {MapTranscoder} from "../../../../../../component/panel/flex-table/transcoders";
import {Observable} from "rxjs";
import {PortfolioService} from "../../../../../../service/portfolio.service";
import {map} from "rxjs/operators";
import {Lib} from "../../../../../../lib/lib";
import {MatDialog} from "@angular/material/dialog";
import {TradingSystemImporterDialog} from "./importer/importer.dialog";

//=============================================================================

@Component({
  selector: 'trading-system-maintenance',
  templateUrl: './trading-system.panel.html',
  styleUrls:  ['./trading-system.panel.scss'],
  imports: [
    FlatButton,
    FlexTablePanel
  ]
})

//=============================================================================

export class TradingSystemPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  columns   : FlexTableColumn[] = [];
  service   : ListService<PorTradingSystem>;
  disExport : boolean = true
  selection : PorTradingSystem[] = []

  @ViewChild("table") table : FlexTablePanel<PorTradingSystem>|null = null;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              public  dialog          : MatDialog,
              private inventoryService: InventoryService,
              private portfolioService: PortfolioService) {

    super(eventBusService, labelService, router, "admin.maintenance.tradingSystem");
    this.service = this.getTradingSystems
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
  }

  //-------------------------------------------------------------------------

  private getTradingSystems = (): Observable<ListResponse<PorTradingSystem>> => {
    return this.portfolioService.getTradingSystems().pipe(
      map((response: ListResponse<PorTradingSystem>) => {
        response.result.forEach((ts : PorTradingSystem) => {
          let mode = "DV"
          if (ts.finalized) {
            mode = (ts.trading) ? "TR" : "AR";
          }
          (ts as any).mode = this.map("mode", mode)
        })

        return response
      })
    );
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onRowSelected(selection : PorTradingSystem[]) {
    this.selection = selection
    this.updateButtons(selection)
  }

  //-------------------------------------------------------------------------

  onImportClick() {
    const dialogRef = this.dialog.open(TradingSystemImporterDialog, {
      minWidth : "1536px",
      minHeight: "640px",
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.table?.reload()
      }
    })
  }

  //-------------------------------------------------------------------------

  onExportClick() {
    let ids : number[] = []

    this.selection.forEach( (ts:PorTradingSystem) => {
      ids = [...ids, ts.id]
    })

    if (ids.length > 0) {
      this.inventoryService.exportTradingSystems(ids).subscribe( (data) => {
        Lib.browser.download(data, "trading-systems-export.asp", "application/asp")
      })
    }
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.tradingSystem");

    this.columns = [
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "dataSymbol"),
      new FlexTableColumn(ts, "brokerSymbol"),
      new FlexTableColumn(ts, "marketType", new MapTranscoder(this.labelService, "market")),
      new FlexTableColumn(ts, "timeframe"),
      new FlexTableColumn(ts, "currencyCode"),
      new FlexTableColumn(ts, "mode"),
      new FlexTableColumn(ts, "running", undefined, new FlagStyler()),
      new FlexTableColumn(ts, "active",  undefined, new FlagStyler()),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private updateButtons = (selection : PorTradingSystem[]) => {
    this.disExport = (selection.length == 0)
  }
}

//=============================================================================
