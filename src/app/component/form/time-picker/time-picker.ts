//=============================================================================
//===
//=== Copyright (C) 2026 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {AbstractControl, FormControl, FormControlStatus, ReactiveFormsModule, ValidationErrors} from '@angular/forms';
import {LabelService} from "../../../service/label.service";
import {CustomErrorStateMatcher} from "../error-state-matcher";

//=============================================================================

@Component({
  selector: 'time-picker',
  templateUrl: 'time-picker.html',
  styleUrls: ['time-picker.scss'],
  imports: [MatFormFieldModule, MatInputModule, MatTimepickerModule, ReactiveFormsModule],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})

//=============================================================================

export class TimePicker {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() label    : string  = ""
  @Input() required : boolean = false

  @Output() valueChange = new EventEmitter<number|null>();

  //-------------------------------------------------------------------------

  formControl = new FormControl<Date|null>(null)
  matcher = new CustomErrorStateMatcher();

  private _valid : boolean = false
  private prevValue : any

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

  get value() : number|null {
    let date = this.formControl.value

    if (date == null) {
      return null
    }

    return date.getHours() * 100 + date.getMinutes()
  }

  //-------------------------------------------------------------------------

  @Input()
  set value(v : number|null) {
    if (v == null) {
      this.formControl.setValue(null)
    }
    else {
      let hh = v / 100
      let mm = v % 100
      let date = new Date(2000, 0, 1, hh, mm, 0)
      this.formControl.setValue(date)
    }
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

    if (value != this.prevValue) {
      this.prevValue = value

      if (value == null) {
        this.valueChange.emit(null)
      }
      else {
        this.valueChange.emit(value.getHours() * 100 + value.getMinutes())
      }
    }
  }

  //-------------------------------------------------------------------------

  private validator = (control: AbstractControl<Date|null>): ValidationErrors | null => {
    let value = control.value

    if (this.required && !value) {
      return { "required": "-" }
    }

    if (value instanceof Date && isNaN(value.getTime())) {
      return { "matTimepickerParse": true };
    }

    return null
  }
  protected readonly JSON = JSON;
}

//=============================================================================
