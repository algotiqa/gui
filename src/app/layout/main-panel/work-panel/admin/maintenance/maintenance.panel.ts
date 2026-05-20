//=============================================================================
//===
//=== Copyright (C) 2026 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component} from '@angular/core';

import {MatButtonModule}      from "@angular/material/button";
import {AbstractPanel}        from "../../../../../component/abstract.panel";
import {LabelService}         from "../../../../../service/label.service";
import {EventBusService}      from "../../../../../service/eventbus.service";
import {Router, RouterModule} from "@angular/router";
import {InventoryService} from "../../../../../service/inventory.service";
import {MatDialog} from "@angular/material/dialog";
import {FlexTablePanel} from "../../../../../component/panel/flex-table/flex-table.panel";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {TradingSystemPanel} from "./trading-system/trading-system.panel";
import {AdapterTestPanel} from "./adapter/adapter-test.panel";

//=============================================================================

@Component({
  selector: 'maintenance',
  templateUrl: './maintenance.panel.html',
  styleUrls : ['./maintenance.panel.scss'],
  imports: [MatButtonModule, FlexTablePanel, MatButtonToggle, MatButtonToggleGroup, MatTab, MatTabGroup, TradingSystemPanel, AdapterTestPanel]
})

//=============================================================================

export class MaintenancePanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------


  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService : EventBusService,
              labelService    : LabelService,
              router          : Router) {

    super(eventBusService, labelService, router, "admin.maintenance");
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------


  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

}

//=============================================================================
