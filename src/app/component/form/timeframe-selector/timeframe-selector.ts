//=============================================================================
//===
//=== Copyright (C) 2026 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormControlStatus, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CustomErrorStateMatcher} from "../error-state-matcher";
import {LabelService} from "../../../service/label.service";

//=============================================================================

@Component({
  selector: 'timeframe-selector',
  templateUrl: 'timeframe-selector.html',
  styleUrl   : 'timeframe-selector.scss',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule ],
})

//=============================================================================

export class TimeframeSelector {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() label : string = ""

  @Output() valueChange = new EventEmitter<any>();

  timeframes: any

  //-------------------------------------------------------------------------

  formControl = new FormControl<number|undefined>(undefined, [
      Validators.required, Validators.min(1), Validators.max(1440)
  ])

  matcher = new CustomErrorStateMatcher();

  private _valid : boolean= false

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(private labelService : LabelService) {
    this.formControl.statusChanges.subscribe(this.valueChanged)
    this.timeframes = this.labelService.getLabel("map.timeframe");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Properties
  //---
  //-------------------------------------------------------------------------

  get value() : number|undefined {
    if (this.formControl.value == null) {
      return undefined
    }

    return this.formControl.value
  }

  //-------------------------------------------------------------------------

  @Input()
  set value(v : number|undefined) {
    this.formControl.setValue(v)
  }

  //-------------------------------------------------------------------------

  get disabled() : boolean {
    return this.formControl.disabled
  }

  //-------------------------------------------------------------------------

  @Input()
  set disabled(v : boolean) {
    if (v) {
      this.formControl.disable()
    }
    else {
      this.formControl.enable()
    }
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  public loc = (code : string) : string => {
    return this.labelService.getLabelString("errors."+ code);
  }

  //-------------------------------------------------------------------------

  public isValid = () : boolean => {
    return this._valid
  }

  //-------------------------------------------------------------------------

  public mapKeys() {
    return Object.keys(this.timeframes);
  }

  //-------------------------------------------------------------------------

  public mapValue(key : string) : string {
    return this.timeframes[key];
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private valueChanged = (s : FormControlStatus) => {
    this._valid = (s == "VALID")
    this.valueChange.emit(this.formControl.value)
  }
  protected readonly JSON = JSON;
}

//=============================================================================
