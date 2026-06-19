//=============================================================================
//===
//=== Copyright (C) 2025-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, HostBinding, Input} from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

//=============================================================================

@Component({
  selector: 'flat-button',
  templateUrl: './flat-button.html',
  styleUrls  :['./flat-button.scss'],
  imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule]
})

//=============================================================================

export class FlatButton {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() icon     : string = ""
  @Input() label?   : string
  @Input() disabled : boolean = false

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor() {}

  //-------------------------------------------------------------------------
  //--- Disabled click prevention
  //--- This adds 'pointer-events: none' to the <flat-button> tag when disabled is true

  @HostBinding('style.pointer-events')
  get pointerEvents() {
    return this.disabled ? 'none' : 'auto';
  }
}

//=============================================================================
