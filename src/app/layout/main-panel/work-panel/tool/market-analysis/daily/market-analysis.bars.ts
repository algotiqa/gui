//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, Input, ViewChild} from '@angular/core';

import {MatCardModule}        from "@angular/material/card";
import {MatIconModule}        from "@angular/material/icon";
import {MatButtonModule}      from "@angular/material/button";
import {Router, RouterModule} from "@angular/router";
import {FlexTablePanel} from "../../../../../../component/panel/flex-table/flex-table.panel";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {FlexTableColumn} from "../../../../../../model/flex-table";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../service/label.service";
import {BarResult} from "../model";
import {
  IsoDateTranscoder,
  ListLabelTranscoder
} from "../../../../../../component/panel/flex-table/transcoders";

//=============================================================================

@Component({
  selector: 'market-analysis-bars',
  templateUrl: './market-analysis.bars.html',
  styleUrls: [ './market-analysis.bars.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterModule, FlexTablePanel]
})

//=============================================================================

export class MarketAnalysisBarsPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  columns : FlexTableColumn[] = [];

  @Input()
  barResults : BarResult[] = [];

  @ViewChild("table") table : FlexTablePanel<BarResult>|null = null;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService  : EventBusService,
              labelService     : LabelService,
              router           : Router) {

    super(eventBusService, labelService, router, "tool.marketAnalysis");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.barResult");

    this.columns = [
      new FlexTableColumn(ts, "time", new IsoDateTranscoder()),
      new FlexTableColumn(ts, "close"),
      new FlexTableColumn(ts, "barChangePerc"),
      new FlexTableColumn(ts, "trueRange"),
      new FlexTableColumn(ts, "sqn100"),
      new FlexTableColumn(ts, "atr"),
      new FlexTableColumn(ts, "atrPerc"),
      new FlexTableColumn(ts, "direction",  new ListLabelTranscoder(this.labelService, "list.direction", 2)),
      new FlexTableColumn(ts, "volatility", new ListLabelTranscoder(this.labelService, "list.volatility")),
    ]
  }
}

//=============================================================================
