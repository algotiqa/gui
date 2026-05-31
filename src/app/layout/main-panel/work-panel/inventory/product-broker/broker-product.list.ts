//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
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
import {BrokerProductFull} from "../../../../../model/model";
import {CreateButton} from "../../../../../component/button/create-button/create-button";
import {EditButton} from "../../../../../component/button/edit-button/edit-button";
import {ListButtons, ListContent, ListPanel} from "../../../../../component/panel/list-panel/list-panel";
import {ViewButton} from "../../../../../component/button/view-button/view-button";

//=============================================================================

@Component({
    selector: 'broker-product-list',
    templateUrl: './broker-product.list.html',
    styleUrls: ['./broker-product.list.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, FlexTablePanel, CreateButton, EditButton, ListButtons, ListContent, ListPanel, ViewButton]
})

//=============================================================================

export class BrokerProductList extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  columns  : FlexTableColumn[] = [];
  service  : ListService<BrokerProductFull>;
  disCreate: boolean = false;
  disView  : boolean = true;
  disEdit  : boolean = true;

  @ViewChild("table") table : FlexTablePanel<BrokerProductFull>|null = null;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private inventoryService: InventoryService) {

    super(eventBusService, labelService, router, "inventory.brokerProduct", "brokerProduct");

    this.service = this.getProductBrokers;

    eventBusService.subscribeToApp(AppEvent.BROKERPRODUCT_LIST_RELOAD, () => {
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

  onRowSelected(selection : BrokerProductFull[]) {
    this.updateButtons(selection);
  }

  //-------------------------------------------------------------------------

  onCreateClick() {
    this.openRightPanel(Url.Inventory_BrokerProducts, Url.Right_BrokerProduct_Create, AppEvent.BROKERPRODUCT_CREATE_START);
  }

  //-------------------------------------------------------------------------

  onViewClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    if (selection.length > 0) {
      this.navigateTo([ Url.Inventory_BrokerProducts, selection[0].id ]);
    }
  }

  //-------------------------------------------------------------------------

  onEditClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    if (selection.length > 0) {
      this.openRightPanel(Url.Inventory_BrokerProducts, Url.Right_BrokerProduct_Edit, AppEvent.BROKERPRODUCT_EDIT_START, selection[0]);
    }
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.brokerProduct");

    this.columns = [
      new FlexTableColumn(ts, "symbol"),
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "marketType", new LabelTranscoder(this.labelService, "map.market")),
      new FlexTableColumn(ts, "exchangeCode"),
      new FlexTableColumn(ts, "connectionCode"),
      new FlexTableColumn(ts, "currencyCode"),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private getProductBrokers = (): Observable<ListResponse<BrokerProductFull>> => {
    return this.inventoryService.getBrokerProducts(true);
  }

  //-------------------------------------------------------------------------

  private updateButtons = (selection : BrokerProductFull[]) => {
    this.disView = (selection.length != 1)
    this.disEdit = (selection.length != 1)
  }
}

//=============================================================================
