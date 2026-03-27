//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule}    from "@angular/material/icon";
import {MatButtonModule, MatIconButton} from "@angular/material/button";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AppEvent, ErrorEvent} from "../../../model/event";
import {AbstractPanel} from "../../abstract.panel";


//=============================================================================

@Component({
    selector: 'module-title-panel',
    templateUrl: './module-title.panel.html',
    styleUrls: ['./module-title.panel.scss'],
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatIconButton, MatIconButton]
})

//=============================================================================

export class ModuleTitlePanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() icon?  : string;
  @Input() title? : string;

  //-------------------------------------------------------------------------

  @Output() onClose : EventEmitter<Event> = new EventEmitter<Event>();

  //-------------------------------------------------------------------------

  spinnerHidden = true

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService : EventBusService,
              labelService    : LabelService,
              router          : Router,
              private _snackBar: MatSnackBar) {
    super(eventBusService, labelService, router, "");

    eventBusService.subscribeToError(this.onError)
    eventBusService.subscribeToApp(AppEvent.SUBMIT_START, this.onSubmitStart)
    eventBusService.subscribeToApp(AppEvent.SUBMIT_END,   this.onSubmitEnd)
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  private onError = (event : ErrorEvent) => {
    this._snackBar.open(""+ event.error, "Ok")
  }

  //-------------------------------------------------------------------------

  private onSubmitStart = (event : AppEvent) => {
    this.spinnerHidden = false
  }

  //-------------------------------------------------------------------------

  private onSubmitEnd = (event : AppEvent) => {
    this.spinnerHidden = true
  }
}

//=============================================================================
