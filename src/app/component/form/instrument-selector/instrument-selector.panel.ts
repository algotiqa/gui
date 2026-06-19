//=============================================================================
//===
//=== Copyright (C) 2024-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, EventEmitter, Input, Output} from '@angular/core';

import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {AbstractSubscriber} from "../../../service/abstract-subscriber";
import {MatDialog} from "@angular/material/dialog";
import {InstrumentSelectorDialog} from "./instrument-selector.dialog";
import {DataInstrumentFull} from "../../../model/model";
import {CollectorService} from "../../../service/collector.service";

//=============================================================================

@Component({
    selector: 'instrument-selector',
    templateUrl: './instrument-selector.panel.html',
    styleUrls: ['./instrument-selector.panel.scss'],
    imports: [MatFormFieldModule, MatInput, FormsModule, MatIconButton, MatIcon]
})

//=============================================================================

export class InstrumentSelectorPanel extends AbstractSubscriber {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  instrId : number|undefined
  text    : any

  @Output() valueChange : EventEmitter<number|undefined> = new EventEmitter<number|undefined>();

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              private labelService     : LabelService,
              private collectorService : CollectorService,
              public  dialog           : MatDialog) {

    super(eventBusService);
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  get value() : number|undefined {
    return this.instrId
  }

  //-------------------------------------------------------------------------

  @Input()
  set value(v : number|undefined) {
    this.instrId = v
    this.text    = undefined

    if (v != undefined) {
      this.collectorService.getDataInstrumentById(v, false).subscribe( die => {
        this.text = die.name
      })
    }
  }

  //-------------------------------------------------------------------------

  public loc = (code : string) : string => {
    return this.labelService.getLabelString("page.dialog.instrumentSelector."+ code);
  }

  //---------------------------------------------------------------------------

  onSearch() {
    const dialogRef = this.dialog.open(InstrumentSelectorDialog, {
      minWidth: "1024px",
      data: {
      }
    })

    dialogRef.afterClosed().subscribe((idf : DataInstrumentFull) => {
      if (idf) {
        this.instrId = idf.id
        this.text    = idf.name

        this.valueChange.emit(idf.id)
      }
    })
  }
}

//=============================================================================
