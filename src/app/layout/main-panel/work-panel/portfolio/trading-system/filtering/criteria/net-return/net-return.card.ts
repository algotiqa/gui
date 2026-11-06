//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {NetReturnConfig} from "../../../../../../../../model/filtering";
import {Router} from "@angular/router";
import {LabelService} from "../../../../../../../../service/label.service";
import {EventBusService} from "../../../../../../../../service/eventbus.service";
import {AbstractPanel} from "../../../../../../../../component/abstract.panel";
import {InputNumber} from "../../../../../../../../component/form/input-number/input-number";
import {CriteriaCard} from "../../criteria-card/criteria.card";

//=============================================================================

@Component({
  selector: 'net-return-card',
  templateUrl: './net-return.card.html',
  styleUrls:  ['./net-return.card.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    InputNumber,
    CriteriaCard
  ]
})

//=============================================================================

export class NetReturnCard extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() config = new NetReturnConfig()
  @Input() base   = new NetReturnConfig()

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
