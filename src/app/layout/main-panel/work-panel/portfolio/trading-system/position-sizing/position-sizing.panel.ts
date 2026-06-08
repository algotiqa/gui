//=============================================================================
//===
//=== Copyright (C) 2026 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';

import {MatInputModule}       from "@angular/material/input";
import {MatCardModule}        from "@angular/material/card";
import {MatIconModule}        from "@angular/material/icon";
import {MatButtonModule}      from "@angular/material/button";
import {Router, RouterModule} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ListButtons, ListContent, ListPanel} from "../../../../../../component/panel/list-panel/list-panel";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../service/label.service";
import {InventoryService} from "../../../../../../service/inventory.service";
import {NavigationService} from "../../../../../../service/navigation.service";

//=============================================================================

@Component({
  selector: 'position-sizing',
  templateUrl: './position-sizing.panel.html',
  styleUrls: [ './position-sizing.panel.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, ListPanel, ListButtons, ListContent]
})

//=============================================================================

export class PositionSizingPanel extends AbstractPanel {

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

  constructor(eventBusService              : EventBusService,
              labelService                 : LabelService,
              router                       : Router,
              inventoryService             : InventoryService,
              private navigationService    : NavigationService,
              public  dialog               : MatDialog
  ) {

    super(eventBusService, labelService, router, "admin.connection");

    this.navigationService.set()
  }

  //-------------------------------------------------------------------------


  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------


  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------


  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

}

//=============================================================================
