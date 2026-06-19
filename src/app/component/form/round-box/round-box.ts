//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, Input} from "@angular/core";
import {MatButtonModule} from "@angular/material/button";

//=============================================================================

@Component({
  selector: 'round-box',
  templateUrl: './round-box.html',
  styleUrls  :['./round-box.scss'],
  imports: [MatButtonModule]
})

//=============================================================================

export class RoundBox {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() text : any

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor() {}
}

//=============================================================================
