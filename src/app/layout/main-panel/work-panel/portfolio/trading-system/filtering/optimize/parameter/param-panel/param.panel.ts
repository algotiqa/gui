//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {AbstractPanel} from "../../../../../../../../../component/abstract.panel";
import {OptimizationConfig} from "../../../../../../../../../model/filtering";
import {Router} from "@angular/router";
import {LabelService} from "../../../../../../../../../service/label.service";
import {EventBusService} from "../../../../../../../../../service/eventbus.service";
import {MatChipOption} from "@angular/material/chips";
import {CriteriaPanel} from "./criteria-panel/criteria.panel";

//=============================================================================

@Component({
  selector: 'param-panel',
  templateUrl: 'param.panel.html',
  styleUrls: ['param.panel.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatChipOption,
    CriteriaPanel
  ]
})

//=============================================================================

export class ParamPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() config : OptimizationConfig = new OptimizationConfig()

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

  onCriterionChange(config : { enabled : boolean }, checked : boolean) {
    config.enabled = checked
  }
}

//=============================================================================
