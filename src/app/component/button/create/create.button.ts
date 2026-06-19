//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, HostBinding, Input} from "@angular/core";
import {FlatButton} from "../../form/flat-button/flat-button";
import {LabelService} from "../../../service/label.service";

//=============================================================================

@Component({
  selector: 'create-button',
  templateUrl: './create.button.html',
  styleUrls  :['./create.button.scss'],
  imports: [FlatButton]
})

//=============================================================================

export class CreateButton {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() disabled : boolean = false

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(private labelService : LabelService) {
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  public button = (code : string) : string => {
    return this.labelService.getLabelString("button."+code);
  }

  //-------------------------------------------------------------------------
  //--- Disabled click prevention
  //--- This adds 'pointer-events: none' to the <flat-button> tag when disabled is true

  @HostBinding('style.pointer-events')
  get pointerEvents() {
    return this.disabled ? 'none' : 'auto';
  }
}

//=============================================================================
