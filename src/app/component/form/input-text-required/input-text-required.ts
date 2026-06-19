//=============================================================================
//===
//=== Copyright (C) 2023-present Andrea Carboni
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
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {AbstractSubscriber} from "../../../service/abstract-subscriber";
import {EventBusService}    from "../../../service/eventbus.service";
import {LabelService}       from "../../../service/label.service";
import {CustomErrorStateMatcher} from "../error-state-matcher";

//=============================================================================

@Component({
    selector: 'input-text-required',
    templateUrl: './input-text-required.html',
    styleUrls: ['./input-text-required.scss'],
    imports: [MatFormFieldModule, MatOptionModule, MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule]
})

//=============================================================================

export class InputTextRequired extends AbstractSubscriber {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() label : string = ""
  @Input() type  : string = "text"

  @Output() valueChange = new EventEmitter<any>();

  //-------------------------------------------------------------------------

  formControl = new FormControl('', [Validators.required])
  matcher = new CustomErrorStateMatcher();

  private _len   : number  = 1
  private _valid : boolean = false

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

  get value() : any {
    return this.formControl.value
  }

  //-------------------------------------------------------------------------

  @Input()
  set value(v : any) {
    this.formControl.setValue(v)
  }

  //-------------------------------------------------------------------------

  get len() : number {
    return this._len
  }

  //-------------------------------------------------------------------------

  @Input()
  set len(l:number) {
    this._len = l
    this.formControl.setValidators([ Validators.required, Validators.maxLength(l) ])
    this.formControl.updateValueAndValidity()
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

  onClear() {
    this.formControl.setValue('')
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
    this.valueChange.emit(this.formControl.value)
  }
}

//=============================================================================
