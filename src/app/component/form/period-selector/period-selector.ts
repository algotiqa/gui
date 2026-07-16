//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {LabelService} from "../../../service/label.service";
import {DatePicker} from "../date-picker/date-picker";
import {SelectRequired} from "../select-required/select-required";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatIconModule} from "@angular/material/icon";

//=============================================================================

@Component({
  selector: 'period-selector',
  templateUrl: 'period-selector.html',
  styleUrl   : 'period-selector.scss',
  imports: [FormsModule, MatFormFieldModule, ReactiveFormsModule, DatePicker, SelectRequired, MatSlideToggleModule, MatIconModule],
})

//=============================================================================

export class PeriodSelector {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() period = new PeriodSelectorInfo()
  @Input() disabled : boolean = false

  @Output() periodChange = new EventEmitter<PeriodSelectorInfo>();

  //-------------------------------------------------------------------------

  periods : any

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(private labelService : LabelService) {
    this.periods = this.labelService.getLabel("list.period");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  public loc = (code : string) : string => {
    return this.labelService.getLabelString("periodSelector."+ code);
  }

  //-------------------------------------------------------------------------

  onPeriodChange(value: string) {
    this.periodChange.emit(this.period);
  }

  //-------------------------------------------------------------------------

  onFromChange(value: number|undefined) {
    //--- Must be commented. When the slide is activated, both "from" and "to" are made
    //--- visible and initialized (so they trigger events). If we don't comment, we will
    //--- get double events
    // this.periodChange.emit(this.period);
  }

  //-------------------------------------------------------------------------

  onToChange(value: number|undefined) {
    this.periodChange.emit(this.period);
  }
}

//=============================================================================

export class PeriodSelectorInfo {
  custom   : boolean = false
  daysBack : number  = 180
  fromDate?: number
  toDate?  : number

  //---------------------------------------------------------------------------

  public constructor(psi? : PeriodSelectorInfo) {
    if (psi != undefined) {
      this.custom   = psi.custom
      this.daysBack = psi.daysBack
      this.fromDate = psi.fromDate
      this.toDate   = psi.toDate
    }
  }

  //---------------------------------------------------------------------------

  public getSelectedPeriod() : SelectedPeriod {
    let sp = new SelectedPeriod()
    sp.daysBack = this.daysBack
    sp.fromDate = this.fromDate
    sp.toDate   = this.toDate

    if (this.custom) {
      sp.daysBack = undefined
    }

    return sp
  }
}

//=============================================================================

export class SelectedPeriod {
  daysBack? : number
  fromDate? : number
  toDate?   : number
}

//=============================================================================
