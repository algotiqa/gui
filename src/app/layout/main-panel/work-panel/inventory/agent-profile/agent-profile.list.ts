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
import {Url} from "../../../../../model/urls";

//=============================================================================

@Component({
  selector: 'inventory-agent-profile',
  templateUrl: './agent-profile.list.html',
  styleUrls: [ './agent-profile.list.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, FlexTablePanel, CreateButton, EditButton, ListButtons, ListContent, ListPanel, ViewButton]
})

//=============================================================================

export class AgentProfileListPanel extends AbstractPanel {

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

    super(eventBusService, labelService, router, "inventory.agentProfile", "agentProfile");

    this.navigationService.set();
    this.service = this.getAgentProfiles;

    eventBusService.subscribeToApp(AppEvent.AGENTPROFILE_LIST_RELOAD, () => {
      this.table?.reload()
      this.updateButtons([])
    })
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onRowSelected(selection : AgentProfile[]) {
    this.updateButtons(selection);
  }

  //-------------------------------------------------------------------------

  onCreateClick() {
    this.openRightPanel(Url.Inventory_AgentProfiles, Url.Right_AgentProfile_Create, AppEvent.AGENTPROFILE_CREATE_START);
  }

  //-------------------------------------------------------------------------

  onViewClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    if (selection.length > 0) {
      this.navigateTo([ Url.Inventory_AgentProfiles, selection[0].id ]);
    }
  }

  //-------------------------------------------------------------------------

  onEditClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    if (selection.length > 0) {
      this.openRightPanel(Url.Inventory_AgentProfiles, Url.Right_AgentProfile_Edit, AppEvent.AGENTPROFILE_EDIT_START, selection[0]);
    }
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ap = this.labelService.getLabel("model.agentProfile");

    this.columns = [
      new FlexTableColumn(ap, "name"),
      new FlexTableColumn(ap, "host"),
      new FlexTableColumn(ap, "port"),
      new FlexTableColumn(ap, "scanInterval"),
      new FlexTableColumn(ap, "scanFolder"),
      new FlexTableColumn(ap, "fileExtension"),
      new FlexTableColumn(ap, "hostType"),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private getAgentProfiles = (): Observable<ListResponse<AgentProfile>> => {
    return this.inventoryService.getAgentProfiles();
  }

  //-------------------------------------------------------------------------

  private updateButtons = (selection : AgentProfile[]) => {
    this.disView = (selection.length != 1)
    this.disEdit = (selection.length != 1)
  }
}

//=============================================================================
