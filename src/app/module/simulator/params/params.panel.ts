//=============================================================================
//===
//=== Copyright (C) 2025-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {SelectRequired} from "../../../component/form/select-required/select-required";
import {AbstractPanel} from "../../../component/abstract.panel";
import {SimulationRequest} from "../../../model/simulation";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {FlatButton} from "../../../component/form/flat-button/flat-button";
import {InputNumber} from "../../../component/form/input-number/input-number";
import {MatCardModule} from "@angular/material/card";
import {PorTradingSystem} from "../../../model/model";
import {PeriodSelector, PeriodSelectorInfo} from "../../../component/form/period-selector/period-selector";
import {PerformanceAnalysisRequest} from "../../../model/performance";

//=============================================================================

@Component({
  selector: "simulation-params",
  templateUrl: './params.panel.html',
  styleUrls : ['./params.panel.scss'],
  imports: [MatFormFieldModule, MatOptionModule, MatSelectModule,
    MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule,
    MatDividerModule, MatButtonToggleModule, MatIconModule, FlatButton, InputNumber, MatCardModule, PeriodSelector]
})

//=============================================================================

export class SimulationParamsPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  period : PeriodSelectorInfo = new PeriodSelectorInfo()

  @Input() ts? : PorTradingSystem
  @Input() req : SimulationRequest = new SimulationRequest()

  @Output() runChange = new EventEmitter<SimulationRequest>();

  @ViewChild("tsRunsCtrl") tsRunsCtrl? : InputNumber

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService  : EventBusService,
              labelService     : LabelService,
              router           : Router) {

    super(eventBusService, labelService, router, "module.simulation.params");

    //--- Set last 5 years of trades
    this.period.daysBack = 365 * 5
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    console.log("SimulationParamsPanel: Initializing...")
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onRunClick() : void {
    this.req.daysBack = this.period.daysBack
    this.req.fromDate = this.period.fromDate
    this.req.toDate   = this.period.toDate

    if (this.period.custom) {
      this.req.daysBack = undefined
    }

    this.runChange.emit(this.req);
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  runEnabled() : boolean {
    let result = this.tsRunsCtrl?.isValid()

    return result == undefined ? false : result
  }
}

//=============================================================================
