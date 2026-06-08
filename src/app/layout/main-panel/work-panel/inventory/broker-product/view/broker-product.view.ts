//=============================================================================
//===
//=== Copyright (C) 2026 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
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
import {BrokerProductExt, DeleteResponse} from "../../../../../../model/model";
import {FlexTablePanel} from "../../../../../../component/panel/flex-table/flex-table.panel";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {FlexTableColumn} from "../../../../../../model/flex-table";
import {Url} from "../../../../../../model/urls";
import {BackButton} from "../../../../../../component/button/back/back.button";
import {DeleteButton} from "../../../../../../component/button/delete/delete.button";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmationDialogData} from "../../../../../../component/form/confirmation-dialog/confirmation.data";
import {ConfirmationDialog} from "../../../../../../component/form/confirmation-dialog/confirmation-dialog.component";
import {MapTranscoder} from "../../../../../../component/panel/flex-table/transcoders";
import {NavigationService} from "../../../../../../service/navigation.service";

//=============================================================================

@Component({
  selector: 'broker-product-view',
  templateUrl: './broker-product.view.html',
  styleUrls: ['./broker-product.view.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, ListPanel, ListButtons, ListContent, FlexTablePanel, MatTab, MatTabGroup, BackButton, DeleteButton]
})

//=============================================================================

export class BrokerProductView extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  id : number           = 0
  bp : BrokerProductExt = new BrokerProductExt()

  tradingSystemCols : FlexTableColumn[] = []

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
              private navigationService: NavigationService,
  ) {
    super(eventBusService, labelService, router, "inventory.brokerProduct", "brokerProduct");
    this.navigationService.push()
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.id = Number(this.route.snapshot.paramMap.get("id"));
    this.setupColumns()

    this.inventoryService.getBrokerProductById(this.id).subscribe(
      result => {
        this.bp = result
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
      labels: "deleteBrokerProduct"
    }

    this.dialog.open(ConfirmationDialog, {data}).afterClosed().subscribe(result => {
      if (!result) {
        return
      }

      this.inventoryService.deleteBrokerProduct(this.id).subscribe( status => {
        if (status == DeleteResponse.Ok) {
          this.navigateTo([ Url.Inventory_BrokerProducts ])
        }
        else {
          let message = this.loc("delete."+status)
          this.snackBar.open(message, this.button("ok"))
        }
      })
    })
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
      new FlexTableColumn(ts, "strategyType", new MapTranscoder(this.labelService, "strategyType")),
      new FlexTableColumn(ts, "timeframe"),
      new FlexTableColumn(ts, "engineCode"),
      new FlexTableColumn(ts, "dataSymbol"),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  protected readonly Url = Url;
}

//=============================================================================
