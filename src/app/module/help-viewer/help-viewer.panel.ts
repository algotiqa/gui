//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute, Router} from '@angular/router';
import {BroadcastEvent, BroadcastService, EventType} from "../../service/broadcast.service";
import {ModuleTitlePanel} from "../../component/panel/module-title/module-title.panel";
import {PortfolioService} from "../../service/portfolio.service";
import {Allocation, CorrelationMatrix} from "../../model/allocation";
import {LabelService} from "../../service/label.service";
import {EventBusService} from "../../service/eventbus.service";
import {AbstractPanel} from "../../component/abstract.panel";
import {NgApexchartsModule} from "ng-apexcharts";

//=============================================================================

@Component({
  selector   : 'help-viewer',
  templateUrl: './help-viewer.panel.html',
  styleUrl   : './help-viewer.panel.scss',
  imports: [MatToolbarModule, MatButtonModule, ModuleTitlePanel, NgApexchartsModule],
  standalone : true
})

//=============================================================================

export class HelpViewerPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  title : string = ""

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private route            : ActivatedRoute) {

    super(eventBusService, labelService, router, "module.help");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    let topic    = Number(this.route.snapshot.paramMap.get("topic"));
    let subTopic = Number(this.route.snapshot.paramMap.get("subtopic"));

  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onCloseClick() {
    window.close()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

}

//=============================================================================
