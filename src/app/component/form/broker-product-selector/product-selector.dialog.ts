//=============================================================================
//===
//=== Copyright (C) 2025-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Component, } from "@angular/core";
import {Router} from "@angular/router";
import {AbstractPanel} from "../../abstract.panel";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {FlexTablePanel} from "../../panel/flex-table/flex-table.panel";
import {FlexTableColumn, ListResponse, ListService} from "../../../model/flex-table";
import {BrokerProductFull} from "../../../model/model";
import {InventoryService} from "../../../service/inventory.service";
import {Observable} from "rxjs";

//=============================================================================

@Component({
    selector: 'broker-product-selector-dialog',
    templateUrl: 'product-selector.dialog.html',
    styleUrls:  ['product-selector.dialog.scss'],
    imports: [MatDialogModule, MatButtonModule, FlexTablePanel]
})

//=============================================================================

export class BrokerProductSelectorDialog extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  disSelect: boolean = true
  columns  : FlexTableColumn[] = [];
  service  : ListService<BrokerProductFull>;

  currProduct? : BrokerProductFull

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private inventoryService: InventoryService,
              private dialogRef       : MatDialogRef<BrokerProductSelectorDialog>) {

    super(eventBusService, labelService, router, "dialog.brokerProductSelector");

    this.service = this.getBrokerProducts;
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  private getBrokerProducts = (): Observable<ListResponse<BrokerProductFull>> => {
    return this.inventoryService.getBrokerProducts(true);
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
  }

  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.brokerProduct");

    this.columns = [
      new FlexTableColumn(ts, "symbol"),
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "connectionName"),
      new FlexTableColumn(ts, "systemCode"),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Event methods
  //---
  //-------------------------------------------------------------------------

  onRowSelected(selection : BrokerProductFull[]) {
    this.disSelect   = (selection.length != 1)
    this.currProduct = selection[0]
  }

  //-------------------------------------------------------------------------

  onSelect() {
    this.dialogRef.close(this.currProduct)
  }

  //-------------------------------------------------------------------------

  onCancel() {
    this.dialogRef.close(undefined)
  }
}

//=============================================================================
