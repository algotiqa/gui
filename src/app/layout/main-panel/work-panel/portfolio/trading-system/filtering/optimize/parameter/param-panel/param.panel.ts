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
import {InputNumber} from "../../../../../../../../../component/form/input-number/input-number";
import {FlatButton} from "../../../../../../../../../component/form/flat-button/flat-button";

//=============================================================================

@Component({
  selector: 'param-panel',
  templateUrl: 'param.panel.html',
  styleUrls: ['param.panel.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatChipOption,
    CriteriaPanel,
    InputNumber,
    FlatButton
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

  maxValue = 160
  step     = 8

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
  //--- Event methods
  //---
  //-------------------------------------------------------------------------

  onCriterionChange(config : { enabled : boolean }, checked : boolean) {
    config.enabled = checked
  }

  //-------------------------------------------------------------------------

  onSetLengthForAll() {
    let max  = this.maxValue
    let step = this.step
    let c    = this.config

    c.netReturn        .length.setIfEnabled(max, step)
    c.averageTrade     .length.setIfEnabled(max, step)
    c.equityVsAverage  .length.setIfEnabled(max, step)
    c.winningPercentage.length.setIfEnabled(max, step)
    c.maxDrawdown      .length.setIfEnabled(max, step)
    c.trendLine        .length.setIfEnabled(max, step)
    c.profitFactor     .length.setIfEnabled(max, step)
    c.sharpeRatio      .length.setIfEnabled(max, step)
    c.sqn100           .length.setIfEnabled(max, step)
    c.returnMaxDDRatio .length.setIfEnabled(max, step)
  }

  //-------------------------------------------------------------------------

  onDisableAll() {
    this.config.disable()
  }
}

//=============================================================================
