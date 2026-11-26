//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, Input, ChangeDetectionStrategy} from "@angular/core";
import {ModuleService} from "../../../service/module.service";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

//=============================================================================

@Component({
  selector: 'help-button',
  templateUrl: './help.button.html',
  styleUrls  :['./help.button.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ MatIcon, MatIconButton]
})

//=============================================================================

export class HelpButton {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() help: string = "";

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(private moduleService: ModuleService) {}

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onClick() {
    this.moduleService.openHelpViewer(this.help);
  }
}

//=============================================================================
