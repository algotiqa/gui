//=============================================================================
//===
//=== Copyright (C) 2026 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, Inject} from '@angular/core';
import {Router} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {AbstractPanel} from "../../abstract.panel";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {ConfirmationDialogData} from "./confirmation.data";
import {FlatButton} from "../flat-button/flat-button";

//=============================================================================

@Component({
    selector: 'confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls:  ['./confirmation-dialog.component.scss'],
  imports: [MatDialogModule, MatButtonModule, FlatButton]
})

//=============================================================================

export class ConfirmationDialog extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService : EventBusService,
              labelService    : LabelService,
              router          : Router,
              private dialogRef : MatDialogRef<ConfirmationDialog>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) {
    super(eventBusService, labelService, router, "dialog."+ data.labels);
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onConfirm() {
    this.dialogRef.close(true)
  }

  //-------------------------------------------------------------------------

  onCancel() {
    this.dialogRef.close(false)
  }
}

//=============================================================================
