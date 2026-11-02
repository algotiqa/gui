//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {EquityVsAverageConfig, NetReturnConfig} from "../../../../../../../../model/filtering";
import {Router} from "@angular/router";
import {LabelService} from "../../../../../../../../service/label.service";
import {EventBusService} from "../../../../../../../../service/eventbus.service";
import {AbstractPanel} from "../../../../../../../../component/abstract.panel";
import {MatExpansionModule, MatExpansionPanel} from "@angular/material/expansion";
import {MatIcon} from "@angular/material/icon";
import {InputNumber} from "../../../../../../../../component/form/input-number/input-number";
import {CriteriaCard} from "../../criteria-card/criteria.card";

//=============================================================================

@Component({
  selector: 'equity-vs-average-card',
  templateUrl: './equity-vs-average.card.html',
  styleUrls: [ './equity-vs-average.card.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatExpansionModule,
    MatIcon,
    InputNumber,
    CriteriaCard
  ]
})

//=============================================================================

export class EquityVsAverageCard extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() config = new EquityVsAverageConfig()

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
