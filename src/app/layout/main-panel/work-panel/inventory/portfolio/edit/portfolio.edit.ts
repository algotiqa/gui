//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
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
import {
  Account, AccountFull, AccountSpec, PortfolioFull, PortfolioSpec,
} from "../../../../../../model/model";
import {SelectRequired} from "../../../../../../component/form/select-required/select-required";
import {InventoryService} from "../../../../../../service/inventory.service";
import {InputNumber} from "../../../../../../component/form/input-number/input-number";
import {MatDialog} from "@angular/material/dialog";

//=============================================================================

@Component({
    selector: "portfolio-edit",
    templateUrl: './portfolio.edit.html',
    styleUrls: [ './portfolio.edit.scss'],
    imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule, MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDividerModule, InputTextRequired, SelectRequired, InputNumber]
})

//=============================================================================

export class PortfolioEditPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  ps = new PortfolioSpec()

  accounts    : Account[] = []
  managements : Object[] = []

  @ViewChild("pNameCtrl")    pNameCtrl?    : InputTextRequired
  @ViewChild("pManagCtrl")   pManagCtrl?   : SelectRequired
  @ViewChild("pAccountCtrl") pAccountCtrl? : SelectRequired
  @ViewChild("pAccPercCtrl") pAccPercCtrl? : InputNumber
  @ViewChild("pMaxPercCtrl") pMaxPercCtrl? : InputNumber

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              public  dialog           : MatDialog,
              private inventoryService : InventoryService) {

    super(eventBusService, labelService, router, "inventory.portfolio", "portfolio");
    super.subscribeToApp(AppEvent.PORTFOLIO_EDIT_START, (e : AppEvent) => this.onStart(e));

    inventoryService.getAccounts(false).subscribe(
      result => {
        this.accounts = result.result
      })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  private onStart(event : AppEvent) : void {
    console.log("PortfolioEditPanel: Starting...");

    let pf : PortfolioFull = event.params;
    this.ps = Object.assign(new PortfolioSpec(), pf)

    this.managements = this.labelService.getLabel("map.management")
  }

  //-------------------------------------------------------------------------

  public saveEnabled() : boolean|undefined {
    return  this.pNameCtrl   ?.isValid() &&
            this.pManagCtrl  ?.isValid() &&
            this.pAccountCtrl?.isValid() &&
            this.pAccPercCtrl?.isValid() &&
            this.pMaxPercCtrl?.isValid()
  }

  //-------------------------------------------------------------------------

  public onSave() : void {
    console.log("Portfolio is : \n"+ JSON.stringify(this.ps));

    this.inventoryService.updatePortfolio(this.ps).subscribe( c => {
      this.onClose();
      this.emitToApp(new AppEvent<any>(AppEvent.PORTFOLIO_LIST_RELOAD))
    })
  }

  //-------------------------------------------------------------------------

  public onClose() : void {
    let event = new AppEvent(AppEvent.RIGHT_PANEL_CLOSE);
    super.emitToApp(event);
  }
}

//=============================================================================
