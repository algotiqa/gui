//=============================================================================
//===
//=== Copyright (C) 2023-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";

import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {RightTitlePanel} from "../../../../../../../component/panel/right-title/right-title.panel";
import {InputTextRequired} from "../../../../../../../component/form/input-text-required/input-text-required";
import {SelectRequired} from "../../../../../../../component/form/select-required/select-required";
import {InputNumber} from "../../../../../../../component/form/input-number/input-number";
import {ChipSetTextComponent} from "../../../../../../../component/form/chip-text-set/chip-set-text";
import {SelectTextRequired} from "../../../../../../../component/form/select-optional/select-optional";
import {AbstractPanel} from "../../../../../../../component/abstract.panel";
import {
  AgentProfile,
  BrokerProduct,
  DataProduct, PorTradingSystem,
  TradingSession,
  TradingSystemSpec
} from "../../../../../../../model/model";
import {EventBusService} from "../../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../../service/label.service";
import {InventoryService} from "../../../../../../../service/inventory.service";
import {AppEvent} from "../../../../../../../model/event";

//=============================================================================

@Component({
    selector: "tradingSystem-ready-edit",
    templateUrl: './edit.panel.html',
    styleUrls: ['./edit.panel.scss'],
    imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule, MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDividerModule, InputTextRequired, SelectRequired, InputNumber, ChipSetTextComponent, SelectTextRequired, MatSlideToggle]
})

//=============================================================================

export class TradingSystemArchiveEditPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  ts = new TradingSystemSpec()
  tsOrig? : TradingSystemSpec

  disabled = false

  data          : DataProduct   [] = []
  brokers       : BrokerProduct [] = []
  sessions      : TradingSession[] = []
  strategyTypes : Object        [] = []
  profiles      : AgentProfile  [] = []
  tagSet        : string        [] = []

  @ViewChild("tsNameCtrl") tsNameCtrl? : InputTextRequired

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private inventoryService : InventoryService) {

    super(eventBusService, labelService, router, "portfolio.tradingSystem.archive", "tradingSystem");
    super.subscribeToApp(AppEvent.TRADINGSYSTEM_ARCHIVE_EDIT_START, (e : AppEvent) => this.onStart(e));

    inventoryService.getAgentProfiles().subscribe(
      result => {
        let empty = new AgentProfile()

        this.profiles = [empty, ...result.result];
    })

    inventoryService.getDataProducts(false).subscribe(
      result => {
        this.data = result.result;
      })

    inventoryService.getBrokerProducts(false).subscribe(
      result => {
        this.brokers = result.result;
      })

    inventoryService.getTradingSessions().subscribe(
      result => {
        this.sessions = result.result;
      })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  private onStart(event : AppEvent) : void {
    console.log("TradingSystemArchivePanel: Starting...");

    this.strategyTypes = this.labelService.getLabel("map.strategyType")

    this.tsOrig = event.params
    this.ts = Object.assign(new TradingSystemSpec(), this.tsOrig)
    let pts : PorTradingSystem = event.params
    this.disabled = (pts.trading || pts.lastTrade != undefined)
  }

  //-------------------------------------------------------------------------

  public saveEnabled() : boolean|undefined {
    return  this.tsNameCtrl?.isValid()
  }

  //-------------------------------------------------------------------------

  public onSave() : void {

    console.log("TradingSystem is : \n"+ JSON.stringify(this.ts));

    this.ts.tags = this.tagSet.join("|")
    let ts = this.ts
    this.inventoryService.updateTradingSystem(ts).subscribe( c => {
      this.onClose();

      if (this.tsOrig) {
        //--- We need let ts=this.ts because this resolves to another object
        this.tsOrig.name         = ts.name
        this.tsOrig.strategyType = ts.strategyType
        this.tsOrig.tags         = ts.tags
        this.tsOrig.overnight    = ts.overnight
      }

      //--- We don't send the event because this data is taken from the portfolio trader but
      //--- modified in the inventory manager. This event is too fast: the message in the queue
      //--- from inventory -> portfolio won't arrive in time

      // this.emitToApp(new AppEvent<any>(AppEvent.TRADINGSYSTEM_ARCHIVE_LIST_RELOAD))
    })
  }

  //-------------------------------------------------------------------------

  public onClose() : void {
    this.ts = new TradingSystemSpec()

    let event = new AppEvent(AppEvent.RIGHT_PANEL_CLOSE);
    super.emitToApp(event);
  }
}

//=============================================================================
