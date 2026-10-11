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
import {ModuleService} from "../../../service/module.service";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

//=============================================================================

@Component({
  selector: 'help-button',
  templateUrl: './help.button.html',
  styleUrls  :['./help.button.scss'],
  imports: [FlatButton, MatButton, MatIcon, MatIconButton]
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

  constructor(private labelService : LabelService,
              private moduleService: ModuleService) {
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onClick() {
    this.moduleService.openHelpViewer(this.help)
  }

  //-------------------------------------------------------------------------

  public button = (code : string) : string => {
    return this.labelService.getLabelString("button."+code);
  }
}

//=============================================================================
