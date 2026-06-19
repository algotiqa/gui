//=============================================================================
//===
//=== Copyright (C) 2025-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {AbstractPanel} from "../../../component/abstract.panel";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {PerformanceAnalysisResponse} from "../../../model/performance";

//=============================================================================

@Component({
  selector: 'performance-summary-panel',
  templateUrl: './summary.panel.html',
  styleUrls: ['./summary.panel.scss'],
  imports: [
  ]
})

//=============================================================================

export class PerformanceSummaryPanel extends AbstractPanel {

  //---------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //---------------------------------------------------------------------------

  @Input()
  set par(par : PerformanceAnalysisResponse) {
    this._par = par
    this.buildSummary(par)
  }

  get par() : PerformanceAnalysisResponse|undefined {
    return this._par
  }

  _par? : PerformanceAnalysisResponse

  summary : SummaryRow[] = []

  //---------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //---------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router) {
    super(eventBusService, labelService, router, "module.performance.summary", "")
  }

  //---------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //---------------------------------------------------------------------------

  //---------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //---------------------------------------------------------------------------

  private buildSummary(par : PerformanceAnalysisResponse) {
    this.summary = <SummaryRow[]>[
      new SummaryRow( this.loc('return'),
                      par.gross?.return?.total, par.gross?.return?.long, par.gross?.return?.short,
                      par.net  ?.return?.total, par.net  ?.return?.long, par.net  ?.return?.short),

      new SummaryRow( this.loc('maxDD'),
                      par.gross?.maxDrawdown?.total, par.gross?.maxDrawdown?.long, par.gross?.maxDrawdown?.short,
                      par.net  ?.maxDrawdown?.total, par.net  ?.maxDrawdown?.long, par.net  ?.maxDrawdown?.short),

      new SummaryRow( this.loc('avgTrade'),
                      par.gross?.averageTrade?.total, par.gross?.averageTrade?.long, par.gross?.averageTrade?.short,
                      par.net  ?.averageTrade?.total, par.net  ?.averageTrade?.long, par.net  ?.averageTrade?.short),
    ]
  }
}

//=============================================================================

class SummaryRow {
  constructor(public text?       : string,
              public grossTotal? : number,
              public grossLong?  : number,
              public grossShort? : number,
              public netTotal?   : number,
              public netLong?    : number,
              public netShort?   : number) {
  }
  //---------------------------------------------------------------------------

  grossTotStyle = () : string => { return this.isNeg(this.grossTotal) ? "red-style" : "" }
  grossLonStyle = () : string => { return this.isNeg(this.grossLong)  ? "red-style" : "" }
  grossShoStyle = () : string => { return this.isNeg(this.grossShort) ? "red-style" : "" }
  netTotStyle   = () : string => { return this.isNeg(this.netTotal)   ? "red-style" : "" }
  netLonStyle   = () : string => { return this.isNeg(this.netLong)    ? "red-style" : "" }
  netShoStyle   = () : string => { return this.isNeg(this.netShort)   ? "red-style" : "" }

  private isNeg = (value? :number) : boolean => {
    return !(value == undefined || value >= 0);
  }
}

//=============================================================================
