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
import {SystemAdapterService} from "../../../../../../service/system-adapter.service";
import {
  Adapter, Connection,
  ConnectionSpec, Currency, Exchange,
  Portfolio,
  BrokerProduct, BrokerProductSpec, DataProduct, DataProductSpec,
  TradingSession,
  TradingSystemSpec, AgentProfileSpec
} from "../../../../../../model/model";
import {SelectRequired} from "../../../../../../component/form/select-required/select-required";
import {Url} from "../../../../../../model/urls";
import {PortfolioService} from "../../../../../../service/portfolio.service";
import {InventoryService} from "../../../../../../service/inventory.service";
import {InputNumber} from "../../../../../../component/form/input-number/input-number";
import {MatDialog} from "@angular/material/dialog";

//=============================================================================

@Component({
    selector: "agent-profile-edit",
    templateUrl: './agent-profile.edit.html',
    styleUrls: ['./agent-profile.edit.scss'],
    imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule, MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDividerModule, InputTextRequired, SelectRequired, InputNumber]
})

//=============================================================================

export class AgentProfileEditPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  ap = new AgentProfileSpec()
  hostTypes : Object[] = []

  @ViewChild("apNameCtrl")     apNameCtrl?     : InputTextRequired
  @ViewChild("apHostCtrl")     apHostCtrl?     : InputTextRequired
  @ViewChild("apPortCtrl")     apPortCtrl?     : InputNumber
  @ViewChild("apScanIntCtrl")  apScanIntCtrl?  : InputNumber
  @ViewChild("apScanFolCtrl")  apScanFolCtrl?  : InputTextRequired
  @ViewChild("apFileExtCtrl")  apFileExtCtrl?  : InputTextRequired
  @ViewChild("apHostTypeCtrl") apHostTypeCtrl? : SelectRequired

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

    super(eventBusService, labelService, router, "inventory.agentProfile", "agentProfile");
    super.subscribeToApp(AppEvent.AGENTPROFILE_EDIT_START, (e : AppEvent) => this.onStart(e));
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  private onStart(event : AppEvent) : void {
    console.log("AgentProfileCreatePanel: Starting...");

    this.ap        = Object.assign(new AgentProfileSpec(), event.params)
    this.hostTypes = this.labelService.getLabel("map.hostType")
  }

  //-------------------------------------------------------------------------

  public saveEnabled() : boolean|undefined {
    return  this.apNameCtrl    ?.isValid() &&
            this.apHostCtrl    ?.isValid() &&
            this.apPortCtrl    ?.isValid() &&
            this.apScanIntCtrl ?.isValid() &&
            this.apScanFolCtrl ?.isValid() &&
            this.apFileExtCtrl ?.isValid()
  }

  //-------------------------------------------------------------------------

  public onSave() : void {
    console.log("Agent Profile is : \n"+ JSON.stringify(this.ap));

    this.inventoryService.updateAgentProfile(this.ap).subscribe( res => {
      this.onClose();
      this.emitToApp(new AppEvent<any>(AppEvent.AGENTPROFILE_LIST_RELOAD))
    })
  }

  //-------------------------------------------------------------------------

  public onClose() : void {
    let event = new AppEvent(AppEvent.RIGHT_PANEL_CLOSE);
    super.emitToApp(event);
  }
}

//=============================================================================
