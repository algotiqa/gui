//=============================================================================
//===
//=== Copyright (C) 2026 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, HostBinding, Input} from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FlatButton} from "../../form/flat-button/flat-button";
import {FlexTablePanel} from "../flex-table/flex-table.panel";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";

//=============================================================================

@Component({
  selector: 'list-buttons',
  template: `<ng-content></ng-content>`,
})
export class ListButtons {}

//=============================================================================

@Component({
  selector: 'list-content',
  template: `<ng-content></ng-content>`,
})
export class ListContent {}

//=============================================================================

@Component({
  selector: 'list-panel',
  templateUrl: './list-panel.html',
  styleUrls  :['./list-panel.scss'],
  imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardActions]
})

//=============================================================================

export class ListPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() title: string ="";

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor() {}
}

//=============================================================================
