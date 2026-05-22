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
import {TradingSession} from "../../../../../model/model";
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
  selector: 'inventory-trading-session',
  templateUrl: './trading-session.list.html',
  styleUrls: [ './trading-session.list.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, FlexTablePanel]
})

//=============================================================================

export class TradingSessionPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  columns  : FlexTableColumn[] = [];
  service  : ListService<TradingSession>;
  disCreate: boolean = false;
  disView  : boolean = true;
  disEdit  : boolean = true;

  @ViewChild("table") table : FlexTablePanel<TradingSession>|null = null;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private inventoryService: InventoryService) {

    super(eventBusService, labelService, router, "inventory.tradingSession");

    this.service = this.getTradingSessions

    eventBusService.subscribeToApp(AppEvent.TRADINGSESSION_LIST_RELOAD, () => {
      this.table?.reload()
      this.updateButtons([])
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  private getTradingSessions = (): Observable<ListResponse<TradingSession>> => {
    return this.inventoryService.getTradingSessions();
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
  }

  //-------------------------------------------------------------------------

  onRowSelected(selection : TradingSession[]) {
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
    let ts = this.labelService.getLabel("model.tradingSession");

    this.columns = [
      new FlexTableColumn(ts, "name"),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private updateButtons = (selection : TradingSession[]) => {
    // this.disView = (selection.length != 1)
    // this.disEdit = (selection.length != 1)
  }
}

//=============================================================================
