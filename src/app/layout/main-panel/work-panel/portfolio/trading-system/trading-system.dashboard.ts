//=============================================================================
//===
//=== Copyright (C) 2025-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import {Component, ViewChild} from '@angular/core';
import {AbstractPanel} from "../../../../../component/abstract.panel";
import {LabelService} from "../../../../../service/label.service";
import {EventBusService} from "../../../../../service/eventbus.service";
import {Router} from "@angular/router";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {LocalService} from "../../../../../service/local.service";
import { MatButtonToggleModule} from "@angular/material/button-toggle";
import {Setting} from "../../../../../model/setting";
import {TradingPanel} from "./trading/trading.panel";
import {DevelopmentPanel} from "./development/development.panel";
import {ArchivePanel} from "./archive/archive.panel";
import {NavigationService} from "../../../../../service/navigation.service";

//=============================================================================

@Component({
    selector: 'portfolio-trading-system-db',
    templateUrl: './trading-system.dashboard.html',
    styleUrls: ['./trading-system.dashboard.scss'],
    imports: [MatButtonToggleModule, ReactiveFormsModule, TradingPanel, ArchivePanel, DevelopmentPanel]
})

//=============================================================================

export class TradingSystemDashboard extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  selMode = new FormControl("DV")

  @ViewChild("developPanel") developPanel? : DevelopmentPanel
  @ViewChild("tradingPanel") tradingPanel? : TradingPanel
  @ViewChild("archivePanel") archivePanel? : ArchivePanel

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService : EventBusService,
              labelService    : LabelService,
              router          : Router,
              private navigationService: NavigationService,
              private storageService   : LocalService) {

    super(eventBusService, labelService, router, "portfolio.tradingSystem");
    this.navigationService.set()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.selMode.setValue(this.storageService.getStringItem(Setting.Portfolio_TradSys_Mode, "TR"))
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  public mode(code : string) : string {
    return this.map("mode", code)
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onModeSet() {
    let value = this.selMode.value
    this.storageService.setStringItem(Setting.Portfolio_TradSys_Mode, value)
  }
}

//=============================================================================
