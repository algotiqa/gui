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

//=============================================================================

enum Status {
  Selecting = 0,
  AccountNo = 1,
  AccountYes= 2
}

//=============================================================================

@Component({
    selector: "account-create",
    templateUrl: './account.create.html',
    styleUrls: [ './account.create.scss'],
    imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule, MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDividerModule, InputTextRequired, SelectRequired, InputNumber]
})

//=============================================================================

export class AccountCreatePanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  acs    = new AccountSpec()
  status = Status.Selecting
  currConn? : Connection

  connections : Connection    [] = []
  currencies  : Currency      [] = []
  codes       : AdapterAccount[] = []

  @ViewChild("aConnCtrl")   aConnCtrl?  : SelectRequired
  @ViewChild("aCodeICtrl")  aCodeICtrl? : InputTextRequired
  @ViewChild("aCodeSCtrl")  aConnSCtrl? : SelectRequired
  @ViewChild("aNameCtrl")   aNameCtrl?  : InputTextRequired
  @ViewChild("aCapitCtrl")  aCapitCtrl? : InputNumber
  @ViewChild("aCurrCtrl")   aCurrCtrl?  : SelectRequired

  private connMap = new Map<number, Connection>()

  //-------------------------------------------------------------------------

  readonly Status = Status

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              public  dialog           : MatDialog,
              private snackBar         : MatSnackBar,
              private inventoryService : InventoryService,
              private systemService    : SystemAdapterService) {

    super(eventBusService, labelService, router, "inventory.account", "account");
    super.subscribeToApp(AppEvent.ACCOUNT_CREATE_START, (e : AppEvent) => this.onStart(e));

    inventoryService.getConnections().subscribe(
      result => {
        this.connections = [];
        this.connMap     = new Map<number, Connection>()

        result.result.forEach( (c, i, a) => {
          if (c.id != null) {
            if (c.supportsBroker) {
              if (c.connected) {
                this.connections = [ ...this.connections, c]
                this.connMap.set(c.id, c)
              }
              else {
                this.snackBar.open(this.loc("notConnected")+ c.name, this.button("ok"))
              }
            }
          }
        })
      })

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
    console.log("AccountCreatePanel: Starting...");

    this.acs    = new AccountSpec()
    this.status = Status.Selecting
  }

  //-------------------------------------------------------------------------

  onConnectionChange(key: any) {
    let conn = this.connMap.get(key)

    if (conn) {
      if (conn.supportsAccounting) {
        this.status = Status.AccountYes
        this.retrieveAccountCodes(conn)
      }
      else {
        this.status = Status.AccountNo
      }
    }
    else {
      this.status = Status.Selecting
    }

    this.currConn = conn
  }

  //-------------------------------------------------------------------------

  onAccountChange(key: any) {
    let acc = this.getAccount(key)
    if (acc) {
      this.acs.currentCapital = acc.equity
      this.acs.currencyId     = this.findCurrency(acc.currencyCode)
    }
  }

  //-------------------------------------------------------------------------

  public saveEnabled() : boolean|undefined {
    let codeValid = false

    if (this.aCodeICtrl) {
      //--- Code is defined when the connection doesn't have accounts
      codeValid = this.aCodeICtrl.isValid()
    }

    if (this.aConnSCtrl) {
      //--- Code is undefined when the connection has accounts
      if (this.acs.code) {
        codeValid = this.acs.code.length > 0
      }
    }

    return  this.aConnCtrl  ?.isValid() &&
            codeValid                   &&
            this.aNameCtrl  ?.isValid() &&
           (this.aCapitCtrl ?.isValid() || this.aCapitCtrl?.disabled) &&
           (this.aCurrCtrl  ?.isValid() || this.aCurrCtrl?.disabled)
  }

  //-------------------------------------------------------------------------

  public onSave() : void {
    console.log("Account is : \n"+ JSON.stringify(this.acs));

    this.inventoryService.addAccount(this.acs).subscribe( c => {
      this.onClose();
      this.emitToApp(new AppEvent<any>(AppEvent.ACCOUNT_LIST_RELOAD))
    })
  }

  //-------------------------------------------------------------------------

  public onClose() : void {
    let event = new AppEvent(AppEvent.RIGHT_PANEL_CLOSE);
    super.emitToApp(event);
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private retrieveAccountCodes(conn : Connection) : void {
    this.systemService.getAccounts(conn.code).subscribe(
      result => {
        this.codes = result.result
      }
    )
  }

  //-------------------------------------------------------------------------

  private getAccount(code : string) : AdapterAccount|undefined {
    for (let i = 0; i < this.codes.length; i++) {
      if (this.codes[i].code == code) {
        return this.codes[i]
      }
    }

    return undefined
  }

  //-------------------------------------------------------------------------

  private findCurrency(code : string|undefined) : number|undefined {
    for (let i = 0; i < this.currencies.length; i++) {
      let curr = this.currencies[i]
      if (curr.code == code) {
        return curr.id
      }
    }

    //--- Not found
    return 0
  }
}

//=============================================================================
