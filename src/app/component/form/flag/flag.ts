//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, Input} from '@angular/core';

//=============================================================================

@Component({
  selector: 'flag',
  templateUrl: './flag.html',
  styleUrls: [ './flag.scss'],
  imports: []
})

//=============================================================================

export class Flag {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() value? : boolean

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor() {
  }

  //-------------------------------------------------------------------------
  //---
  //--- Helpers
  //---
  //-------------------------------------------------------------------------

  icon() : string {
    if (this.value == undefined) {
      return "question_mark"
    }

    return this.value ? "check" : "close";
  }

  //-------------------------------------------------------------------------

  style() : string {
    if (this.value == undefined) {
      return "#B09000"
    }

    return this.value ? "#00C000" : "#C00000"
  }
}

//=============================================================================
