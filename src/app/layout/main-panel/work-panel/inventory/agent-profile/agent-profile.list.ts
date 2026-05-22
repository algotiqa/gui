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
import {AgentProfile}         from "../../../../../model/model";
import {FlexTableColumn, ListResponse, ListService} from "../../../../../model/flex-table";
import {AbstractPanel}        from "../../../../../component/abstract.panel";
import {FlexTablePanel}       from "../../../../../component/panel/flex-table/flex-table.panel";
import {LabelService}         from "../../../../../service/label.service";
import {EventBusService}      from "../../../../../service/eventbus.service";
import {Router, RouterModule} from "@angular/router";
import {AppEvent} from "../../../../../model/event";
import {Observable} from "rxjs";
import {InventoryService} from "../../../../../service/inventory.service";

//=============================================================================

@Component({
  selector: 'inventory-agent-profile',
  templateUrl: './agent-profile.list.html',
  styleUrls: [ './agent-profile.list.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, FlexTablePanel]
})

//=============================================================================

export class AgentProfilePanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  columns  : FlexTableColumn[] = [];
  service  : ListService<AgentProfile>;
  disCreate: boolean = false;
  disView  : boolean = true;
  disEdit  : boolean = true;

  @ViewChild("table") table : FlexTablePanel<AgentProfile>|null = null;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private inventoryService: InventoryService) {

    super(eventBusService, labelService, router, "inventory.agentProfile");

    this.service = this.getAgentProfiles;

    eventBusService.subscribeToApp(AppEvent.AGENTPROFILE_LIST_RELOAD, () => {
      this.table?.reload()
      this.updateButtons([])
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  private getAgentProfiles = (): Observable<ListResponse<AgentProfile>> => {
    return this.inventoryService.getAgentProfiles();
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
  }

  //-------------------------------------------------------------------------

  onRowSelected(selection : AgentProfile[]) {
    this.updateButtons(selection);
  }

  //-------------------------------------------------------------------------

  onCreateClick() {
    // this.openRightPanel(Url.Inventory_DataProducts, Url.Right_DataProduct_Create, AppEvent.DATAPRODUCT_CREATE_START);
  }

  //-------------------------------------------------------------------------

  onViewClick() {
    // @ts-ignore
    // let selection = this.table.getSelection();
    //
    // if (selection.length > 0) {
    //   this.navigateTo([ Url.Inventory_DataProducts, selection[0].id ]);
    // }
  }

  //-------------------------------------------------------------------------

  onEditClick() {
    // @ts-ignore
    // let selection = this.table.getSelection();
    // this.openRightPanel(Url.Inventory_DataProducts, Url.Right_DataProduct_Edit, AppEvent.DATAPRODUCT_EDIT_START, selection[0]);
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.agentProfile");

    this.columns = [
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "remoteUrl"),
      new FlexTableColumn(ts, "scanInterval"),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private updateButtons = (selection : AgentProfile[]) => {
    // this.disView = (selection.length != 1)
    // this.disEdit = (selection.length != 1)
  }
}

//=============================================================================
