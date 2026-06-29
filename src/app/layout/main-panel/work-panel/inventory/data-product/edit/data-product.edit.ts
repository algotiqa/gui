//=============================================================================
//===
//=== Copyright (C) 2024-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import {Component, ViewChild} from '@angular/core';
import {RightTitlePanel} from "../../../../../../component/panel/right-title/right-title.panel";
import {AbstractPanel}   from "../../../../../../component/abstract.panel";
import {AppEvent} from "../../../../../../model/event";
import {LabelService} from "../../../../../../service/label.service";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {Router} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";

import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {InputTextRequired} from "../../../../../../component/form/input-text-required/input-text-required";
import {SelectRequired} from "../../../../../../component/form/select-required/select-required";
import {InventoryService} from "../../../../../../service/inventory.service";
import {InputNumber} from "../../../../../../component/form/input-number/input-number";
import {DataProductSpec} from "../../../../../../model/model";

//=============================================================================

@Component({
    selector: "data-product-edit",
    templateUrl: './data-product.edit.html',
    styleUrls: ['./data-product.edit.scss'],
    imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule, MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDividerModule, InputTextRequired, SelectRequired, InputNumber]
})

//=============================================================================

export class ProductDataEditPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  pd = new DataProductSpec()
  markets     : Object[]   = []
  products    : Object[]   = []

  //--- The symbol and exchanges cannot be changed because
  //---  - symbol  : is the root used to retrieve instruments from the datasource
  //---  - exchange: its timezone is used to convert the timestamp of tool

  @ViewChild("pdNameCtrl")     pdNameCtrl?     : InputTextRequired
  @ViewChild("pdMarketCtrl")   pdMarketCtrl?   : SelectRequired
  // @ViewChild("pdProductCtrl")  pdProductCtrl?  : SelectRequired

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private inventoryService : InventoryService) {

    super(eventBusService, labelService, router, "inventory.dataProduct", "dataProduct");
    super.subscribeToApp(AppEvent.DATAPRODUCT_EDIT_START, (e : AppEvent) => this.onStart(e));
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  private onStart(event : AppEvent) : void {
    console.log("ProductDataEditPanel: Starting...");

    this.pd       = Object.assign(new DataProductSpec(), event.params)
    this.markets  = this.labelService.getLabel("map.market")
    this.products = this.labelService.getLabel("map.product")
  }

  //-------------------------------------------------------------------------

  public saveEnabled() : boolean|undefined {
    return  this.pdNameCtrl    ?.isValid() &&
            this.pdMarketCtrl  ?.isValid()
            // this.pdProductCtrl ?.isValid()
  }

  //-------------------------------------------------------------------------

  public onSave() : void {

    console.log("Product for tool is : \n"+ JSON.stringify(this.pd));

    this.inventoryService.updateDataProduct(this.pd).subscribe( c => {
      this.onClose();
      this.emitToApp(new AppEvent<any>(AppEvent.DATAPRODUCT_LIST_RELOAD))
    })
  }

  //-------------------------------------------------------------------------

  public onClose() : void {
    let event = new AppEvent(AppEvent.RIGHT_PANEL_CLOSE);
    super.emitToApp(event);
  }
}

//=============================================================================
