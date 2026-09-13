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
import {LabelTranscoder, MapTranscoder} from "../../../../../component/panel/flex-table/transcoders";
import {AccountFull, BrokerProductFull, PortfolioFull} from "../../../../../model/model";
import {CreateButton} from "../../../../../component/button/create/create.button";
import {EditButton} from "../../../../../component/button/edit/edit.button";
import {ListButtons, ListContent, ListPanel} from "../../../../../component/panel/list-panel/list-panel";
import {ViewButton} from "../../../../../component/button/view/view.button";
import {NavigationService} from "../../../../../service/navigation.service";
import {AccountStatusStyler, BooleanStyler, FlagStyler} from "../../../../../component/panel/flex-table/icon-sylers";

//=============================================================================

@Component({
    selector: 'portfolio-list',
    templateUrl: './portfolio.list.html',
    styleUrls:  ['./portfolio.list.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, FlexTablePanel, CreateButton, EditButton, ListButtons, ListContent, ListPanel, ViewButton]
})

//=============================================================================

export class PortfolioListPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  columns  : FlexTableColumn[] = [];
  service  : ListService<PortfolioFull>;
  disCreate: boolean = false;
  disView  : boolean = true;
  disEdit  : boolean = true;

  @ViewChild("table") table : FlexTablePanel<PortfolioFull>|null = null;

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

    super(eventBusService, labelService, router, "inventory.portfolio", "portfolio");

    this.navigationService.set()
    this.service = this.getPortfolios;

    eventBusService.subscribeToApp(AppEvent.PORTFOLIO_LIST_RELOAD, () => {
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

  onRowSelected(selection : PortfolioFull[]) {
    this.updateButtons(selection);
  }

  //-------------------------------------------------------------------------

  onCreateClick() {
    this.openRightPanel(Url.Inventory_Portfolios, Url.Right_Portfolio_Create, AppEvent.PORTFOLIO_CREATE_START);
  }

  //-------------------------------------------------------------------------

  onViewClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    if (selection.length > 0) {
      this.navigateTo([ Url.Inventory_Portfolios, selection[0].id ]);
    }
  }

  //-------------------------------------------------------------------------

  onEditClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    if (selection.length > 0) {
      this.openRightPanel(Url.Inventory_Portfolios, Url.Right_Portfolio_Edit, AppEvent.PORTFOLIO_EDIT_START, selection[0]);
    }
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let p = this.labelService.getLabel("model.portfolio");

    this.columns = [
      new FlexTableColumn(p, "name"),
      new FlexTableColumn(p, "accountPerc"),
      new FlexTableColumn(p, "maxMarginPerc"),
      new FlexTableColumn(p, "accountName"),
      new FlexTableColumn(p, "currencyCode"),
      new FlexTableColumn(p, "supportsAccounting", undefined, new BooleanStyler()),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private getPortfolios = (): Observable<ListResponse<PortfolioFull>> => {
    return this.inventoryService.getPortfolios(true);
  }

  //-------------------------------------------------------------------------

  private updateButtons = (selection : PortfolioFull[]) => {
    this.disView = (selection.length != 1)
    this.disEdit = (selection.length != 1)
  }
}

//=============================================================================
