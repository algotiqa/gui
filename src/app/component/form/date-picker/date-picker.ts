//=============================================================================
//===
//=== Copyright (C) 2024-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {
  AbstractControl,
  FormControl,
  FormControlStatus,
  ReactiveFormsModule,
  ValidationErrors,
} from "@angular/forms";
import {CustomErrorStateMatcher} from "../error-state-matcher";
import {LabelService} from "../../../service/label.service";
import {DateAdapter, MatNativeDateModule} from "@angular/material/core";
import {IntDateAdapter} from "./int-date-adapter";

//=============================================================================

@Component({
    selector: 'date-picker',
    templateUrl: 'date-picker.html',
    styleUrls: ['date-picker.scss'],
    imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, MatNativeDateModule],
    providers: [{ provide: DateAdapter, useClass: IntDateAdapter }]
})

//=============================================================================

export class DatePicker {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() label     : string  = ""

  @Output() valueChange = new EventEmitter<number|undefined>();

  //-------------------------------------------------------------------------

  formControl = new FormControl<number|undefined>(undefined)
  matcher = new CustomErrorStateMatcher();

  private _required = false
  private _valid : boolean = false
  private prevValue : number|undefined

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(private labelService : LabelService) {
    this.formControl.setValidators(this.validator)
    this.formControl.statusChanges.subscribe(this.valueChanged)
  }

  //-------------------------------------------------------------------------
  //---
  //--- Properties
  //---
  //-------------------------------------------------------------------------

  get required(): boolean {
    return this._required
  }

  //-------------------------------------------------------------------------

  @Input()
  set required(value: boolean) {
    this._required = value
    this.formControl.updateValueAndValidity()
  }

  //-------------------------------------------------------------------------

  get value() : number|undefined {
    let value = this.formControl.value
    if (value == null) {
      return undefined
    }

    return value
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
  set disabled(value : boolean) {
    if (value)  this.formControl.disable()
      else      this.formControl.enable()
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
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private valueChanged = (s : FormControlStatus) => {
    this._valid = (s == "VALID")
    let value = this.formControl.value
    if (value == null) {
      value = undefined
    }

    if (value != this.prevValue) {
      this.prevValue = value
      this.valueChange.emit(value)
    }
  }

  //-------------------------------------------------------------------------

  private validator = (control: AbstractControl<number|null>): ValidationErrors | null => {
    if (this._required && control.value == null) {
      return { "required": "-" }
    }

    return null
  }
}

//=============================================================================
