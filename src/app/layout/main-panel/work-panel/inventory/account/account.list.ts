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
import {FlexTableColumn, ListResponse, ListService} from "../../../../../model/flex-table";
import {AbstractPanel}        from "../../../../../component/abstract.panel";
import {FlexTablePanel}       from "../../../../../component/panel/flex-table/flex-table.panel";
import {LabelService}         from "../../../../../service/label.service";
import {EventBusService}      from "../../../../../service/eventbus.service";
import {Router, RouterModule} from "@angular/router";
import {Url} from "../../../../../model/urls";
import {AppEvent} from "../../../../../model/event";
import {Observable} from "rxjs";
import {InventoryService} from "../../../../../service/inventory.service";
import {LabelTranscoder} from "../../../../../component/panel/flex-table/transcoders";
import {AccountFull, BrokerProductFull} from "../../../../../model/model";
import {CreateButton} from "../../../../../component/button/create/create.button";
import {EditButton} from "../../../../../component/button/edit/edit.button";
import {ListButtons, ListContent, ListPanel} from "../../../../../component/panel/list-panel/list-panel";
import {ViewButton} from "../../../../../component/button/view/view.button";
import {NavigationService} from "../../../../../service/navigation.service";
import {AccountStatusStyler} from "../../../../../component/panel/flex-table/icon-sylers";

//=============================================================================

@Component({
    selector: 'account-list',
    templateUrl: './account.list.html',
    styleUrls: ['./account.list.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, FlexTablePanel, CreateButton, EditButton, ListButtons, ListContent, ListPanel, ViewButton]
})

//=============================================================================

export class AccountListPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  columns  : FlexTableColumn[] = [];
  service  : ListService<AccountFull>;
  disCreate: boolean = false;
  disView  : boolean = true;
  disEdit  : boolean = true;

  @ViewChild("table") table : FlexTablePanel<AccountFull>|null = null;

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

    super(eventBusService, labelService, router, "inventory.account", "account");

    this.navigationService.set()
    this.service = this.getAccounts;

    eventBusService.subscribeToApp(AppEvent.ACCOUNT_LIST_RELOAD, () => {
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

  onRowSelected(selection : AccountFull[]) {
    this.updateButtons(selection);
  }

  //-------------------------------------------------------------------------

  onCreateClick() {
    this.openRightPanel(Url.Inventory_Accounts, Url.Right_Account_Create, AppEvent.ACCOUNT_CREATE_START);
  }

  //-------------------------------------------------------------------------

  onViewClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    if (selection.length > 0) {
      this.navigateTo([ Url.Inventory_Accounts, selection[0].id ]);
    }
  }

  //-------------------------------------------------------------------------

  onEditClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    if (selection.length > 0) {
      this.openRightPanel(Url.Inventory_Accounts, Url.Right_Account_Edit, AppEvent.ACCOUNT_EDIT_START, selection[0]);
    }
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let bp = this.labelService.getLabel("model.account");

    this.columns = [
      new FlexTableColumn(bp, "code"),
      new FlexTableColumn(bp, "name"),
      new FlexTableColumn(bp, "currentCapital"),
      new FlexTableColumn(bp, "currencyCode"),
      new FlexTableColumn(bp, "connectionCode"),
      new FlexTableColumn(bp, "systemCode"),
      new FlexTableColumn(bp, "statusMessage", undefined, new AccountStatusStyler()),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private getAccounts = (): Observable<ListResponse<AccountFull>> => {
    return this.inventoryService.getAccounts(true);
  }

  //-------------------------------------------------------------------------

  private updateButtons = (selection : AccountFull[]) => {
    this.disView = (selection.length != 1)
    this.disEdit = (selection.length != 1)
  }
}

//=============================================================================
