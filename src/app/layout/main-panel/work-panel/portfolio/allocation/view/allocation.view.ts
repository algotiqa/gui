//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component} from '@angular/core';

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
import { PorTradingSystem,
} from "../../../../../../model/model";
import {FlexTablePanel} from "../../../../../../component/panel/flex-table/flex-table.panel";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {FlexTableColumn} from "../../../../../../model/flex-table";
import {Url} from "../../../../../../model/urls";
import {BackButton} from "../../../../../../component/button/back/back.button";
import {DeleteButton} from "../../../../../../component/button/delete/delete.button";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LabelTranscoder} from "../../../../../../component/panel/flex-table/transcoders";
import {NavigationService} from "../../../../../../service/navigation.service";
import {PortfolioService} from "../../../../../../service/portfolio.service";
import {Allocation} from "../../../../../../model/allocation";
import {RedBooleanStyler} from "../../../../../../component/panel/flex-table/icon-sylers";

//=============================================================================

@Component({
  selector: 'allocation-view',
  templateUrl: './allocation.view.html',
  styleUrls:  ['./allocation.view.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, ListPanel, ListButtons, ListContent, FlexTablePanel, MatTab, MatTabGroup, BackButton, DeleteButton]
})

//=============================================================================

export class AllocationViewPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  id : number     = 0
  ae : Allocation = new Allocation()

  filterCols : FlexTableColumn [] = []

  markets : Object[] = []
  runType : {[index:string]:any} = {}
  status  : {[index:string]:any} = {}

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
    super(eventBusService, labelService, router, "portfolio.allocation", "allocation");
    this.navigationService.push()
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.id = Number(this.route.snapshot.paramMap.get("id"));
    this.setupColumns()

    this.markets  = this.labelService.getLabel("map.market")
    this.runType  = this.labelService.getLabel("map.allocationRunType")
    this.status   = this.labelService.getLabel("map.allocationStatus")

    this.portfolioService.getAllocation(this.id).subscribe(
      result => {
        this.ae = result
      }
    )
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onDeleteClick() {
    // let data : ConfirmationDialogData = {
    //   labels: "deletePortfolio"
    // }
    //
    // this.dialog.open(ConfirmationDialog, {data}).afterClosed().subscribe(result => {
    //   if (!result) {
    //     return
    //   }
    //
    //   this.inventoryService.deletePortfolio(this.id).subscribe( status => {
    //     if (status == DeleteResponse.Ok) {
    //       this.navigateTo([ Url.Inventory_Portfolios ])
    //     }
    //     else {
    //       let message = this.loc("delete."+status)
    //       this.snackBar.open(message, this.button("ok"))
    //     }
    //   })
    // })
  }

  //-------------------------------------------------------------------------

  onRowSelected(selection : PorTradingSystem[]) {
    // this.selection = selection
  }

  //-------------------------------------------------------------------------

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let c = this.labelService.getLabel("model.allocationFilter");

    this.filterCols = [
      new FlexTableColumn(c, "tsMarketType", new LabelTranscoder(this.labelService, "map.market")),
      new FlexTableColumn(c, "tsBrokerSymbol"),
      new FlexTableColumn(c, "tsName"),
      new FlexTableColumn(c, "tsRunning",      undefined, new RedBooleanStyler()),
      new FlexTableColumn(c, "tsStrategyType", new LabelTranscoder(this.labelService, "map.strategyType")),
      new FlexTableColumn(c, "filterPassed",   undefined, new RedBooleanStyler()),
      new FlexTableColumn(c, "comment"),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------


  //-------------------------------------------------------------------------

  protected readonly Url = Url;
}

//=============================================================================
