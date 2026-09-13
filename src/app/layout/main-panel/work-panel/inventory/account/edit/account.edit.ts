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
  Account, AccountExt, AccountFull,
  AccountSpec, AdapterAccount,
  BrokerProductSpec,
  Connection,
  Currency,
  Exchange,
  RootSymbol
} from "../../../../../../model/model";
import {SelectRequired} from "../../../../../../component/form/select-required/select-required";
import {InventoryService} from "../../../../../../service/inventory.service";
import {InputNumber} from "../../../../../../component/form/input-number/input-number";
import {PresetProduct, PresetsService} from "../../../../../../service/presets.service";
import {MatDialog} from "@angular/material/dialog";
import {TextSelectorPanel} from "../../../../../../component/form/text-selector/text-selector.panel";
import {SystemAdapterService} from "../../../../../../service/system-adapter.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {InputTextOptional} from "../../../../../../component/form/input-text-optional/input-text-optional";

//=============================================================================

@Component({
    selector: "account-edit",
    templateUrl: './account.edit.html',
    styleUrls: [ './account.edit.scss'],
  imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule, MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDividerModule, InputTextRequired, SelectRequired, InputNumber, InputTextOptional]
})

//=============================================================================

export class AccountEditPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  acs          = new AccountSpec()
  connCode?    = ""
  suppAccount? = false
  currencies : Currency[] = []

  @ViewChild("aCodeCtrl")   aCodeCtrl?  : InputTextRequired
  @ViewChild("aNameCtrl")   aNameCtrl?  : InputTextRequired
  @ViewChild("aCapitCtrl")  aCapitCtrl? : InputNumber
  @ViewChild("aCurrCtrl")   aCurrCtrl?  : SelectRequired

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private inventoryService : InventoryService) {

    super(eventBusService, labelService, router, "inventory.account", "account");
    super.subscribeToApp(AppEvent.ACCOUNT_EDIT_START, (e : AppEvent) => this.onStart(e));

    inventoryService.getCurrencies().subscribe(
      result => {
        this.currencies = result.result
      }
    )
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  private onStart(event : AppEvent) : void {
    console.log("AccountEditPanel: Starting...");

    let acf : AccountFull = event.params;
    this.acs         = Object.assign(new AccountSpec(), acf)
    this.connCode    = acf.connectionCode
    this.suppAccount = acf.supportsAccounting;
  }

  //-------------------------------------------------------------------------

  public saveEnabled() : boolean|undefined {
    if (this.suppAccount) {
      return this.aNameCtrl?.isValid()
    }

    return this.aCodeCtrl  ?.isValid() &&
           this.aNameCtrl  ?.isValid() &&
           this.aCapitCtrl ?.isValid() &&
           this.aCurrCtrl  ?.isValid()
  }

  //-------------------------------------------------------------------------

  public onSave() : void {
    console.log("Account is : \n"+ JSON.stringify(this.acs));

    this.inventoryService.updateAccount(this.acs).subscribe( c => {
      this.onClose();
      this.emitToApp(new AppEvent<any>(AppEvent.ACCOUNT_LIST_RELOAD))
    })
  }

  //-------------------------------------------------------------------------

  public onClose() : void {
    let event = new AppEvent(AppEvent.RIGHT_PANEL_CLOSE);
    super.emitToApp(event);
  }
}

//=============================================================================
