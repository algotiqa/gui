//=============================================================================
//===
//=== Copyright (C) 2023-present Andrea Carboni
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
import {DataProductFull} from "../../../../../model/model";
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
import {
  LabelTranscoder
} from "../../../../../component/panel/flex-table/transcoders";
import {ListButtons, ListContent, ListPanel} from "../../../../../component/panel/list-panel/list-panel";
import {CreateButton} from "../../../../../component/button/create/create.button";
import {ViewButton} from "../../../../../component/button/view/view.button";
import {EditButton} from "../../../../../component/button/edit/edit.button";
import {NavigationService} from "../../../../../service/navigation.service";

//=============================================================================

@Component({
    selector: 'data-product-list',
    templateUrl: './data-product.list.html',
    styleUrls: ['./data-product.list.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, FlexTablePanel, ListPanel, ListButtons, CreateButton, ViewButton, EditButton, ListContent]
})

//=============================================================================

export class DataProductList extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  columns  : FlexTableColumn[] = [];
  service  : ListService<DataProductFull>;
  disCreate: boolean = false;
  disView  : boolean = true;
  disEdit  : boolean = true;

  @ViewChild("table") table : FlexTablePanel<DataProductFull>|null = null;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService           : EventBusService,
              labelService              : LabelService,
              router                    : Router,
              private navigationService : NavigationService,
              private inventoryService  : InventoryService) {

    super(eventBusService, labelService, router, "inventory.dataProduct", "dataProduct");

    this.navigationService.set()
    this.service = this.getDataProducts;

    eventBusService.subscribeToApp(AppEvent.DATAPRODUCT_LIST_RELOAD, () => {
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

  onRowSelected(selection : DataProductFull[]) {
    this.updateButtons(selection);
  }

  //-------------------------------------------------------------------------

  onCreateClick() {
    this.openRightPanel(Url.Inventory_DataProducts, Url.Right_DataProduct_Create, AppEvent.DATAPRODUCT_CREATE_START);
  }

  //-------------------------------------------------------------------------

  onViewClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    if (selection.length > 0) {
      this.navigateTo([ Url.Inventory_DataProducts, selection[0].id ]);
    }
  }

  //-------------------------------------------------------------------------

  onEditClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    if (selection.length > 0) {
      this.openRightPanel(Url.Inventory_DataProducts, Url.Right_DataProduct_Edit, AppEvent.DATAPRODUCT_EDIT_START, selection[0]);
    }
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let dp = this.labelService.getLabel("model.dataProduct");

    this.columns = [
      new FlexTableColumn(dp, "symbol"),
      new FlexTableColumn(dp, "name"),
      new FlexTableColumn(dp, "marketType", new LabelTranscoder(this.labelService, "map.market")),
      new FlexTableColumn(dp, "exchangeCode"),
      new FlexTableColumn(dp, "connectionCode"),
      new FlexTableColumn(dp, "systemCode"),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private getDataProducts = (): Observable<ListResponse<DataProductFull>> => {
    return this.inventoryService.getDataProducts(true);
  }

  //-------------------------------------------------------------------------

  private updateButtons = (selection : DataProductFull[]) => {
    this.disView = (selection.length != 1)
    this.disEdit = (selection.length != 1)
  }
}

//=============================================================================
