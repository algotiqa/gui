//=============================================================================
//===
//=== Copyright (C) 2025-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {ErrorStateMatcher, MatOptionModule} from "@angular/material/core";
import { KeyValuePipe } from "@angular/common";
import {MatIconModule}      from "@angular/material/icon";
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
import {MatSelectModule} from "@angular/material/select";

//=============================================================================

@Component({
    selector: 'select-optional',
    templateUrl: './select-optional.html',
    styleUrls: ['./select-optional.scss'],
    imports: [MatFormFieldModule, MatOptionModule, MatSelectModule, MatIconModule, FormsModule, ReactiveFormsModule]
})

//=============================================================================

export class SelectTextRequired extends AbstractSubscriber {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() label     : string = ""
  @Input() keyField  : string = ""
  @Input() valueField: string = ""
  @Input() list      : any[]  = []
  @Input() map       : Object = {}

  @Output() keyChange = new EventEmitter<any>();

  //-------------------------------------------------------------------------

  formControl = new FormControl<any>(undefined)
  private prevValue : any

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

  get key() : any {
    return this.formControl.value
  }

  //-------------------------------------------------------------------------

  @Input()
  set key(v : any) {
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

  public mapKeys() {
    return Object.keys(this.map);
  }

  //-------------------------------------------------------------------------

  public mapValue(key : string) : string {
    // @ts-ignore
    return this.map[key];
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private valueChanged = (s : FormControlStatus) => {
    let value = this.formControl.value

    if (value != this.prevValue) {
      this.prevValue = value
      this.keyChange.emit(value)
    }
  }
}

//=============================================================================

