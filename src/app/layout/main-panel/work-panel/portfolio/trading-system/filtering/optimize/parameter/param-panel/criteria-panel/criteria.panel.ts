//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {Router} from "@angular/router";
import {AbstractPanel} from "../../../../../../../../../../component/abstract.panel";
import {LabelService} from "../../../../../../../../../../service/label.service";
import {EventBusService} from "../../../../../../../../../../service/eventbus.service";
import {MatCheckbox} from "@angular/material/checkbox";
import {InputNumber} from "../../../../../../../../../../component/form/input-number/input-number";

//=============================================================================

@Component({
  selector: 'tbody[criteria-panel]',
  templateUrl: 'criteria.panel.html',
  styleUrls: [ 'criteria.panel.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatCheckbox,
    InputNumber
  ]
})

//=============================================================================

export class CriteriaPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() name   : string = ""
  @Input() config : {[key:string]:any} = {}

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router) {

    super(eventBusService, labelService, router, "portfolio.filtering");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------


  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------
}

//=============================================================================
