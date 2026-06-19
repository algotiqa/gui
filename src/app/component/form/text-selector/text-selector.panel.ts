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
import {FormControl, FormControlStatus, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {AbstractSubscriber} from "../../../service/abstract-subscriber";
import {CustomErrorStateMatcher} from "../error-state-matcher";

//=============================================================================

@Component({
    selector: 'text-selector',
    templateUrl: './text-selector.panel.html',
    styleUrls: [ './text-selector.panel.scss'],
  imports: [MatFormFieldModule, MatInput, FormsModule, MatIconButton, MatIcon, ReactiveFormsModule]
})

//=============================================================================

export class TextSelectorPanel extends AbstractSubscriber {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() label? : string

  text? : string

  @Output() valueChange : EventEmitter<string|null> = new EventEmitter<string|null>();

  //-------------------------------------------------------------------------

  formControl = new FormControl('', [Validators.required])
  matcher = new CustomErrorStateMatcher();

  private _valid    = false
  private _disabled = false

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService : EventBusService, private labelService : LabelService) {
    super(eventBusService);
    this.formControl.statusChanges.subscribe(this.valueChanged)
    this.formControl.disable()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Properties
  //---
  //-------------------------------------------------------------------------

  get value() : string|undefined {
    let val = this.formControl.value

    return (val==null) ? undefined : val
  }

  //-------------------------------------------------------------------------

  @Input()
  set value(v : string|undefined) {
    if (v == undefined) {
      this.formControl.setValue(null)
    }
    else {
      this.formControl.setValue(v)
    }
  }

  //-------------------------------------------------------------------------

  get disabled() : boolean {
    return this._disabled
  }

  //-------------------------------------------------------------------------

  @Input()
  set disabled(v : boolean) {
    this._disabled = v
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

  onSearch() {
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
