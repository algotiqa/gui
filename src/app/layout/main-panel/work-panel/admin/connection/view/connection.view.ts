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
import {DeleteResponse, ConnectionExt} from "../../../../../../model/model";
import {FlexTablePanel} from "../../../../../../component/panel/flex-table/flex-table.panel";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {Flag} from "../../../../../../component/form/flag/flag";
import {FlexTableColumn} from "../../../../../../model/flex-table";
import {LabelTranscoder} from "../../../../../../component/panel/flex-table/transcoders";
import {Url} from "../../../../../../model/urls";
import {BackButton} from "../../../../../../component/button/back/back.button";
import {DeleteButton} from "../../../../../../component/button/delete/delete.button";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmationDialogData} from "../../../../../../component/form/confirmation-dialog/confirmation.data";
import {ConfirmationDialog} from "../../../../../../component/form/confirmation-dialog/confirmation-dialog.component";
import {NavigationService} from "../../../../../../service/navigation.service";

//=============================================================================

@Component({
  selector: 'connection-view',
  templateUrl: './connection.view.html',
  styleUrls: ['./connection.view.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, ListPanel, ListButtons, ListContent, FlexTablePanel, MatTab, MatTabGroup, Flag, BackButton, DeleteButton]
})

//=============================================================================

export class ConnectionView extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  connId : number        = 0
  conn   : ConnectionExt = new ConnectionExt()

  dataProductCols   : FlexTableColumn[] = []
  brokerProductCols : FlexTableColumn[] = []

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
    super(eventBusService, labelService, router, "admin.connection", "connection");
    this.navigationService.push()
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.connId = Number(this.route.snapshot.paramMap.get("id"));
    this.setupColumns()

    this.inventoryService.getConnectionById(this.connId).subscribe(
      result => {
        this.conn = result
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
      labels: "deleteConnection"
    }

    this.dialog.open(ConfirmationDialog, {data}).afterClosed().subscribe(result => {
      if (!result) {
        return
      }

      this.inventoryService.deleteConnection(this.connId).subscribe( status => {
        if (status == DeleteResponse.Ok) {
          this.navigateTo([ Url.Admin_Connections ])
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
    let dp = this.labelService.getLabel("model.dataProduct");

    this.dataProductCols = [
      new FlexTableColumn(dp, "symbol"),
      new FlexTableColumn(dp, "name"),
      new FlexTableColumn(dp, "marketType", new LabelTranscoder(this.labelService, "map.market")),
      new FlexTableColumn(dp, "exchangeCode"),
    ]

    let bp = this.labelService.getLabel("model.brokerProduct");

    this.brokerProductCols = [
      new FlexTableColumn(dp, "symbol"),
      new FlexTableColumn(dp, "name"),
      new FlexTableColumn(dp, "marketType", new LabelTranscoder(this.labelService, "map.market")),
      new FlexTableColumn(dp, "exchangeCode"),
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
