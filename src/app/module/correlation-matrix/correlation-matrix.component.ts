//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, OnInit} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StorageService} from "../../service/storage.service";
import {BroadcastEvent, BroadcastService, EventType} from "../../service/broadcast.service";
import {ModuleTitlePanel} from "../../component/panel/module-title/module-title.panel";
import {RightTitlePanel} from "../../component/panel/right-title/right-title.panel";
import {PortfolioService} from "../../service/portfolio.service";
import {Allocation} from "../../model/allocation";
import {LabelService} from "../../service/label.service";
import {EventBusService} from "../../service/eventbus.service";
import {AbstractPanel} from "../../component/abstract.panel";

//=============================================================================

@Component({
  selector   : 'correlation-matrix',
  templateUrl: './correlation-matrix.component.html',
  styleUrl   : './correlation-matrix.component.scss',
  imports: [MatToolbarModule, MatButtonModule, ModuleTitlePanel],
  standalone : true
})

//=============================================================================

export class CorrelationMatrixPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  ae : Allocation = new Allocation()

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private route            : ActivatedRoute,
              private portfolioService : PortfolioService,
              private broadcastService : BroadcastService) {

    super(eventBusService, labelService, router, "module.allocationCorrelation");

    // broadcastService.onEvent((e : BroadcastEvent)=>{
      // if (e.type == EventType.TradingsSystem_Deleted && e.id == this.tsId) {
      //   window.close()
      // }
    // })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    let id = Number(this.route.snapshot.paramMap.get("id"));

    this.portfolioService.getAllocation(id).subscribe(
      result => {
        this.ae = result
      }
    )
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onCloseClick() {
    window.close()
  }
}

//=============================================================================
