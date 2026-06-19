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
import {Component, Inject,} from "@angular/core";
import {Router} from "@angular/router";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {FlexTableColumn, ListResponse, ListService} from "../../../model/flex-table";
import {BrokerProductFull} from "../../../model/model";
import {InventoryService} from "../../../service/inventory.service";
import {Observable} from "rxjs";
import {AbstractPanel} from "../../../component/abstract.panel";
import {SimulationResult} from "../../../model/simulation";
import {IntDateTranscoder} from "../../../component/panel/flex-table/transcoders";

//=============================================================================

@Component({
  selector: 'simulation-info-dialog',
  templateUrl: 'info.dialog.html',
  styleUrls:  ['info.dialog.scss'],
  imports: [MatDialogModule, MatButtonModule]
})

//=============================================================================

export class SimulationInfoDialog extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private dialogRef       : MatDialogRef<SimulationInfoDialog>,
              @Inject(MAT_DIALOG_DATA) public res: SimulationResult) {

    super(eventBusService, labelService, router, "dialog.simulationInfo");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  firstTrade() {
    return new IntDateTranscoder().transcode(this.res.firstTradeDate)
  }

  //-------------------------------------------------------------------------

  lastTrade() {
    return new IntDateTranscoder().transcode(this.res.lastTradeDate)
  }

  //-------------------------------------------------------------------------
  //---
  //--- Event methods
  //---
  //-------------------------------------------------------------------------

  onClose() {
    this.dialogRef.close(undefined)
  }
}

//=============================================================================
