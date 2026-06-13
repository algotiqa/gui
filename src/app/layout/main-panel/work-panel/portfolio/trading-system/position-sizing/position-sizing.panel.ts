//=============================================================================
//===
//=== Copyright (C) 2026 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';

import {MatInputModule}       from "@angular/material/input";
import {MatCardModule}        from "@angular/material/card";
import {MatIconModule}        from "@angular/material/icon";
import {MatButtonModule}      from "@angular/material/button";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ListButtons, ListContent, ListLeft, ListPanel} from "../../../../../../component/panel/list-panel/list-panel";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../service/label.service";
import {InventoryService} from "../../../../../../service/inventory.service";
import {NavigationService} from "../../../../../../service/navigation.service";
import {BackButton} from "../../../../../../component/button/back/back.button";
import {OptimizeButton} from "../../../../../../component/button/optimize/optimize.button";
import {PeriodSelector, PeriodSelectorInfo} from "../../../../../../component/form/period-selector/period-selector";
import {ReloadButton} from "../../../../../../component/button/reload/reload.button";
import {RunButton} from "../../../../../../component/button/run/run.button";
import {SaveButton} from "../../../../../../component/button/save/save.button";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {InputNumberRequired} from "../../../../../../component/form/input-integer-required/input-number-required";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FilterAnalysisRequest, PorTradingSystem} from "../../../../../../model/model";
import {PortfolioService} from "../../../../../../service/portfolio.service";

//=============================================================================

@Component({
  selector: 'position-sizing',
  templateUrl: './position-sizing.panel.html',
  styleUrls: [ './position-sizing.panel.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, ListPanel, ListButtons, ListContent, BackButton, OptimizeButton, PeriodSelector, ReloadButton, RunButton, SaveButton, ListLeft, MatAccordion, InputNumberRequired, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatSlideToggle]
})

//=============================================================================

export class PositionSizingPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  period : PeriodSelectorInfo = new PeriodSelectorInfo()

  ts : PorTradingSystem = new PorTradingSystem()

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService              : EventBusService,
              labelService                 : LabelService,
              router                       : Router,
              private route                : ActivatedRoute,
              private portfolioService     : PortfolioService,
              private navigationService    : NavigationService,
              public  dialog               : MatDialog
  ) {

    super(eventBusService, labelService, router, "portfolio.positionSizing");
    this.navigationService.push()
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    // this.tsId = Number(this.route.snapshot.paramMap.get("id"));
    // this.callService(new FilterAnalysisRequest())
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onPeriodChange(period : PeriodSelectorInfo) {
    console.log("On period change")
  }

  //-------------------------------------------------------------------------
  onRunClick() {
    // this.callService(this.buildRequest(this.filter))
  }

  //-------------------------------------------------------------------------

  onOptimizeClick() {
    // this.portfolioService.getFilterOptimizationInfo(this.tsId).subscribe(
    //   result => {
    //     if (result.status == "idle") {
    //       this.openParametersDialog()
    //     }
    //     else if (result.status == "running"){
    //       this.openProgressDialog()
    //     }
    //     else {
    //       this.openResultDialog()
    //     }
    //   }
    // )
  }

  //-------------------------------------------------------------------------

  onSaveClick() {
    // this.portfolioService.setTradingFilters(this.tsId, this.filter).subscribe(
    //   result => {
    //     this.snackBar.open(this.loc("filterSaved"), undefined, { duration: 3000 })
    //   }
    // )
  }

  //-------------------------------------------------------------------------

  onReloadClick() {
    // this.period = new PeriodSelectorInfo()
    // this.callService(this.buildRequest())
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------


  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

}

//=============================================================================
