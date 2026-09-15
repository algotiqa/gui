//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, ViewChild} from '@angular/core';

import {MatInputModule}       from "@angular/material/input";
import {MatCardModule}        from "@angular/material/card";
import {MatIconModule}        from "@angular/material/icon";
import {MatButtonModule}      from "@angular/material/button";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../service/label.service";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {InventoryService} from "../../../../../../service/inventory.service";
import {ListButtons, ListContent, ListPanel} from "../../../../../../component/panel/list-panel/list-panel";
import {
  BrokerProductExt, DataProductFull,
  DeleteResponse,
  InvTradingSystemFull,
  PortfolioExt, PorTradingSystem,
  TradingSystemAssignable
} from "../../../../../../model/model";
import {FlexTablePanel} from "../../../../../../component/panel/flex-table/flex-table.panel";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {FlexTableColumn, ListResponse} from "../../../../../../model/flex-table";
import {Url} from "../../../../../../model/urls";
import {BackButton} from "../../../../../../component/button/back/back.button";
import {DeleteButton} from "../../../../../../component/button/delete/delete.button";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmationDialogData} from "../../../../../../component/form/confirmation-dialog/confirmation.data";
import {ConfirmationDialog} from "../../../../../../component/form/confirmation-dialog/confirmation-dialog.component";
import {MapTranscoder} from "../../../../../../component/panel/flex-table/transcoders";
import {NavigationService} from "../../../../../../service/navigation.service";
import {InstrumentUploadDialog} from "../../data-product/view/instrument-upload.dialog";
import {SystemsSelectorDialog} from "./systems-selector.dialog";
import {PortfolioService} from "../../../../../../service/portfolio.service";
import {Observable} from "rxjs";
import {BiasAnalysisFull} from "../../../tool/bias-analysis/model";

//=============================================================================

@Component({
  selector: 'portfolio-view',
  templateUrl: './portfolio.view.html',
  styleUrls:  ['./portfolio.view.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, ListPanel, ListButtons, ListContent, FlexTablePanel, MatTab, MatTabGroup, BackButton, DeleteButton]
})

//=============================================================================

export class PortfolioViewPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  id : number       = 0
  pe : PortfolioExt = new PortfolioExt()

  tradingSystemCols : FlexTableColumn [] = []
  selection         : PorTradingSystem[] = []

  @ViewChild("table") table : FlexTablePanel<PorTradingSystem>|null = null;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private route            : ActivatedRoute,
              private dialog           : MatDialog,
              private snackBar         : MatSnackBar,
              private inventoryService : InventoryService,
              private portfolioService : PortfolioService,
              private navigationService: NavigationService,
  ) {
    super(eventBusService, labelService, router, "inventory.portfolio", "portfolio");
    this.navigationService.push()
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.id = Number(this.route.snapshot.paramMap.get("id"));
    this.setupColumns()

    this.inventoryService.getPortfolioById(this.id).subscribe(
      result => {
        this.pe = result
      }
    )
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onDeleteClick() {
    let data : ConfirmationDialogData = {
      labels: "deletePortfolio"
    }

    this.dialog.open(ConfirmationDialog, {data}).afterClosed().subscribe(result => {
      if (!result) {
        return
      }

      this.inventoryService.deletePortfolio(this.id).subscribe( status => {
        if (status == DeleteResponse.Ok) {
          this.navigateTo([ Url.Inventory_Portfolios ])
        }
        else {
          let message = this.loc("delete."+status)
          this.snackBar.open(message, this.button("ok"))
        }
      })
    })
  }

  //-------------------------------------------------------------------------

  onRowSelected(selection : PorTradingSystem[]) {
    this.selection = selection
  }

  //-------------------------------------------------------------------------

  onSystemsAdd() {
    const dialogRef = this.dialog.open(SystemsSelectorDialog, {
      minWidth: "1400px",
      data: {
        portfolio : this.pe
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selection = []
        this.table?.reload()
      }
    })
  }

  //-------------------------------------------------------------------------

  onSystemsRemove() {
    let list : number[] = []
    this.selection.forEach( (ts:PorTradingSystem) => {
        if (ts.id) {
          list.push(ts.id)}
      }
    )

    this.portfolioService.unassignTradingSystemsFromPortfolio(this.pe.id, list).subscribe(
      result => {
        this.selection = []
        this.table?.reload()
      }
    )
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.tradingSystem");

    this.tradingSystemCols = [
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "dataSymbol"),
      new FlexTableColumn(ts, "brokerSymbol"),
      new FlexTableColumn(ts, "timeframe"),
      new FlexTableColumn(ts, "strategyType", new MapTranscoder(this.labelService, "strategyType")),
      new FlexTableColumn(ts, "engineCode"),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  getTradingSystems = (): Observable<ListResponse<PorTradingSystem>> => {
    return this.portfolioService.getAssignedTradingSystemsToPortfolio(this.id);
  }

  //-------------------------------------------------------------------------

  protected readonly Url = Url;
}

//=============================================================================
