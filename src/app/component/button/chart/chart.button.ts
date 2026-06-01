//=============================================================================
//===
//=== Copyright (C) 2026 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, HostBinding, Input} from "@angular/core";
import {FlatButton} from "../../form/flat-button/flat-button";
import {LabelService} from "../../../service/label.service";

//=============================================================================

@Component({
  selector: 'chart-button',
  templateUrl: './chart.button.html',
  styleUrls  :['./chart.button.scss'],
  imports: [FlatButton]
})

//=============================================================================

export class ChartButton {

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
