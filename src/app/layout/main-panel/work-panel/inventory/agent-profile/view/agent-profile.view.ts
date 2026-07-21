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
import {AgentProfileExt, BrokerProductExt, DeleteResponse} from "../../../../../../model/model";
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
import {PackageButton} from "../../../../../../component/button/package/package.button";
import {Lib} from "../../../../../../lib/lib";

//=============================================================================

@Component({
  selector: 'agent-profile-view',
  templateUrl: './agent-profile.view.html',
  styleUrls: ['./agent-profile.view.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, ListPanel, ListButtons, ListContent, FlexTablePanel, MatTab, MatTabGroup, BackButton, DeleteButton, PackageButton]
})

//=============================================================================

export class AgentProfileViewPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  id : number          = 0
  ap : AgentProfileExt = new AgentProfileExt()

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
    super(eventBusService, labelService, router, "inventory.agentProfile", "agentProfile");
    this.navigationService.push()
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.id = Number(this.route.snapshot.paramMap.get("id"));
    this.setupColumns()

    this.inventoryService.getAgentProfileById(this.id).subscribe(
      result => {
        this.ap = result
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
      labels: "deleteAgentProfile"
    }

    this.dialog.open(ConfirmationDialog, {data}).afterClosed().subscribe(result => {
      if (!result) {
        return
      }

      this.inventoryService.deleteAgentProfile(this.id).subscribe( status => {
        if (status == DeleteResponse.Ok) {
          this.navigateTo([ Url.Inventory_AgentProfiles ])
        }
        else {
          let message = this.loc("delete."+status)
          this.snackBar.open(message, this.button("ok"))
        }
      })
    })
  }

  //-------------------------------------------------------------------------

  onPackageClick() {
    if (this.ap.id) {
      this.inventoryService.downloadAgentPackage(this.ap.id).subscribe( (data) => {
        Lib.browser.download(data, "agent-package-"+ this.ap.hostType +".zip", "application/zip")
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
