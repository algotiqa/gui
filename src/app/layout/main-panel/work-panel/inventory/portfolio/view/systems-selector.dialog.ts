//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Component, Inject} from "@angular/core";
import {Router} from "@angular/router";
import {DialogData} from "./dialog-data";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../service/label.service";
import {
  InvTradingSystemFull, PortfolioExt,
  PortfolioFull, TradingSystemAssignable
} from "../../../../../../model/model";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatChipsModule} from "@angular/material/chips";
import {FlatButton} from "../../../../../../component/form/flat-button/flat-button";
import {FlexTablePanel} from "../../../../../../component/panel/flex-table/flex-table.panel";
import {FlexTableColumn, ListResponse, ListService} from "../../../../../../model/flex-table";
import {Observable} from "rxjs";
import {InventoryService} from "../../../../../../service/inventory.service";
import {PortfolioService} from "../../../../../../service/portfolio.service";
import {MapTranscoder} from "../../../../../../component/panel/flex-table/transcoders";
import {FlagStyler} from "../../../../../../component/panel/flex-table/icon-sylers";

//=============================================================================

@Component({
  selector: 'systems-selector-dialog',
  templateUrl: 'systems-selector.dialog.html',
  styleUrls:  ['systems-selector.dialog.scss'],
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule, MatGridListModule,
    MatIconModule, MatProgressBarModule, MatChipsModule, FlatButton, FlexTablePanel]
})

//=============================================================================

export class SystemsSelectorDialog extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  portfolio : PortfolioExt = new PortfolioExt()
  columns   : FlexTableColumn[] = []
  service   : ListService<TradingSystemAssignable>
  selection : TradingSystemAssignable[] = []

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private dialogRef       : MatDialogRef<SystemsSelectorDialog>,
              private portfolioService: PortfolioService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    super(eventBusService, labelService, router, "inventory.portfolio.assign");

    this.portfolio = data.portfolio
    this.service   = this.getAssignableTradingSystems
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
  }

  //-------------------------------------------------------------------------
  //---
  //--- Event methods
  //---
  //-------------------------------------------------------------------------

  onRowSelected(selection : TradingSystemAssignable[]) {
    this.selection = selection
  }

  //-------------------------------------------------------------------------

  onSelect() {
    let list : number[] = []
    this.selection.forEach( (ts:TradingSystemAssignable) => {
      if (ts.id) {
        list.push(ts.id)}
      }
    )

    this.portfolioService.assignTradingSystemsToPortfolio(this.portfolio.id, list).subscribe(
      result => {
        this.dialogRef.close(true)
      }
    )
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private
  //---
  //-------------------------------------------------------------------------

  private setupColumns = () => {
    let ts = this.labelService.getLabel("model.tradingSystem");

    this.columns = [
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "dataSymbol"),
      new FlexTableColumn(ts, "brokerSymbol"),
      new FlexTableColumn(ts, "marketType", new MapTranscoder(this.labelService, "market")),
      new FlexTableColumn(ts, "timeframe"),
      new FlexTableColumn(ts, "strategyType", new MapTranscoder(this.labelService, "strategyType")),
      new FlexTableColumn(ts, "portfolioName"),
      new FlexTableColumn(ts, "accountCode"),
    ]
  }

  //-------------------------------------------------------------------------

  private getAssignableTradingSystems = (): Observable<ListResponse<TradingSystemAssignable>> => {
    return this.portfolioService.getAssignableTradingSystemsToPortfolio(this.portfolio.id);
  }
}

//=============================================================================
