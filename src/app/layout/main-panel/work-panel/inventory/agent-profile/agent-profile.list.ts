//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
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
import {ConnectButton} from "../../../../../component/button/connect/connect.button";
import {CreateButton} from "../../../../../component/button/create/create.button";
import {DisconnectButton} from "../../../../../component/button/disconnect/disconnect.button";
import {EditButton} from "../../../../../component/button/edit/edit.button";
import {ListButtons, ListContent, ListPanel} from "../../../../../component/panel/list-panel/list-panel";
import {ViewButton} from "../../../../../component/button/view/view.button";
import {NavigationService} from "../../../../../service/navigation.service";

//=============================================================================

@Component({
  selector: 'inventory-agent-profile',
  templateUrl: './agent-profile.list.html',
  styleUrls: [ './agent-profile.list.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, FlexTablePanel, ConnectButton, CreateButton, DisconnectButton, EditButton, ListButtons, ListContent, ListPanel, ViewButton]
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

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private navigationService: NavigationService,
              private inventoryService : InventoryService) {

    super(eventBusService, labelService, router, "inventory.agentProfile");

    this.navigationService.set();
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
