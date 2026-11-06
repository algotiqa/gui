//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {Router} from "@angular/router";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {AbstractPanel} from "../../../../../../../component/abstract.panel";
import {LabelService} from "../../../../../../../service/label.service";
import {EventBusService} from "../../../../../../../service/eventbus.service";

//=============================================================================

@Component({
  selector: 'criteria-card',
  templateUrl: './criteria.card.html',
  styleUrls:  ['./criteria.card.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatExpansionModule,
    MatIcon,
    MatIconButton,
  ]
})

//=============================================================================

export class CriteriaCard extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() icon   : string  = ""
  @Input() title  : string  = ""
  @Input() changed: boolean = false

  //-------------------------------------------------------------------------

  @Output() onRemove : EventEmitter<void> = new EventEmitter<void>();

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

  onDelete(event : Event) {
    event.stopPropagation()

    this.onRemove.emit()
  }

  //-------------------------------------------------------------------------

  backColor() : string {
    return this.changed ? "#FFF0F0" : "#FFFFFF"
  }}

//=============================================================================
