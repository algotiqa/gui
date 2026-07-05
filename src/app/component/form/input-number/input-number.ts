//=============================================================================
//===
//=== Copyright (C) 2024-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {ErrorStateMatcher, MatOptionModule} from "@angular/material/core";
import {MatInputModule}     from "@angular/material/input";
import {MatIconModule}      from "@angular/material/icon";
import {MatButtonModule}    from "@angular/material/button";
import {
  FormControl,
  FormControlStatus,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule, ValidatorFn,
  Validators
} from "@angular/forms";
import {AbstractSubscriber} from "../../../service/abstract-subscriber";
import {EventBusService}    from "../../../service/eventbus.service";
import {LabelService}       from "../../../service/label.service";
import {CustomErrorStateMatcher} from "../error-state-matcher";

//=============================================================================

@Component({
    selector: 'input-number',
    templateUrl: './input-number.html',
    styleUrls: ['./input-number.scss'],
    imports: [MatFormFieldModule, MatOptionModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule]
})

//=============================================================================

export class InputNumber extends AbstractSubscriber {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() label : string  = ""

  @Output() valueChange = new EventEmitter<number|undefined>();

  //-------------------------------------------------------------------------

  formControl = new FormControl<number|undefined>(undefined, [Validators.required])
  matcher     = new CustomErrorStateMatcher();

  private _min?     : number
  private _max?     : number
  private _valid    : boolean = false
  private _optional : boolean = false;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService : EventBusService, private labelService : LabelService) {
    super(eventBusService)
    this.formControl.statusChanges.subscribe(this.valueChanged)
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
    if (v == null) {
      v = undefined
    }

    this.formControl.setValue(v)
  }

  //-------------------------------------------------------------------------

  get min() : number|undefined {
    return this._min
  }

  //-------------------------------------------------------------------------

  @Input()
  set min(m:number|undefined) {
    this._min = m
    this.updateValidators()
  }

  //-------------------------------------------------------------------------

  get max() : number|undefined {
    return this._max
  }

  //-------------------------------------------------------------------------

  @Input()
  set max(m:number|undefined) {
    this._max = m
    this.updateValidators()
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

  get optional() : boolean {
    return this.formControl.disabled
  }

  //-------------------------------------------------------------------------

  @Input()
  set optional(v : boolean) {
    this._optional = v;
    this.updateValidators()
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

  onClear() {
    this.formControl.setValue(undefined)
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

    this.valueChange.emit(value)
  }

  //-------------------------------------------------------------------------

  private updateValidators() {
    let validators = [ ]

    if (!this._optional) {
      validators.push(Validators.required)
    }

    if (this._min !== undefined && this._min !== null) {
      validators.push(Validators.min(this._min))
    }

    if (this._max !== undefined && this._max !== null) {
      validators.push(Validators.max(this._max))
    }

    this.formControl.setValidators(validators)
    this.formControl.updateValueAndValidity()
  }
}

//=============================================================================
