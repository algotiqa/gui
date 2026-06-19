//=============================================================================
//===
//=== Copyright (C) 2023-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule}    from "@angular/material/icon";
import {MatButtonModule, MatIconButton} from "@angular/material/button";


//=============================================================================

@Component({
    selector: 'right-title-panel',
    templateUrl: './right-title.panel.html',
    styleUrls: ['./right-title.panel.scss'],
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatIconButton, MatIconButton]
})

//=============================================================================

export class RightTitlePanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() icon?  : string;
  @Input() title? : string;

  //-------------------------------------------------------------------------

  @Output() onClose : EventEmitter<Event> = new EventEmitter<Event>();

  //-------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------
}

//=============================================================================
