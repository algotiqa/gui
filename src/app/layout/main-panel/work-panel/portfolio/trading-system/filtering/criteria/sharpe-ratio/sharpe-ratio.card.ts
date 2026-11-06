//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {NetReturnConfig, SharpeRatioConfig} from "../../../../../../../../model/filtering";
import {Router} from "@angular/router";
import {LabelService} from "../../../../../../../../service/label.service";
import {EventBusService} from "../../../../../../../../service/eventbus.service";
import {AbstractPanel} from "../../../../../../../../component/abstract.panel";
import {CriteriaCard} from "../../criteria-card/criteria.card";
import {InputNumber} from "../../../../../../../../component/form/input-number/input-number";

//=============================================================================

@Component({
  selector: 'sharpe-ratio-card',
  templateUrl: './sharpe-ratio.card.html',
  styleUrls: [ './sharpe-ratio.card.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CriteriaCard,
    InputNumber
  ]
})

//=============================================================================

export class SharpeRatioCard extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() config = new SharpeRatioConfig()
  @Input() base   = new SharpeRatioConfig()

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService : EventBusService,
              labelService    : LabelService,
              router          : Router) {

    super(eventBusService, labelService, router, "portfolio.filtering.card");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onRemove() {
    this.config.enabled = false
  }
}

//=============================================================================
