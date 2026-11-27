//=============================================================================
//===
//=== Copyright (C) 2025-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Injectable} from '@angular/core';
import {Platform} from "../model/platform";

//=============================================================================

@Injectable()
export class ModuleService {
  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  private helpWindow? : WindowProxy

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor() {}

  //-------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------

  public openDocEditor(tsId:number) {
    let extWindow = window.open('module/doc-editor/'+tsId, '', 'popup,width=1500,height=950,left=100,top=100');

    if (extWindow == null) {
      console.log("DocEditor's window is null")
    }
  }

  //-------------------------------------------------------------------------

  public openPerformanceMetrics(tsId:number) {
    let extWindow = window.open('module/performance-analysis/'+tsId, '', 'popup,width=1500,height=950,left=100,top=100');

    if (extWindow == null) {
      console.log("PerformanceMetrics' window is null")
    }
  }

  //-------------------------------------------------------------------------

  public openQualityAnalyzer(tsId:number) {
    let extWindow = window.open('module/quality-analysis/'+tsId, '', 'popup,width=1500,height=950,left=100,top=100');

    if (extWindow == null) {
      console.log("QualityAnalyzer's window is null")
    }
  }

  //-------------------------------------------------------------------------

  public openSimulator(tsId:number) {
    let extWindow = window.open('module/simulation/'+tsId, '', 'popup,width=1500,height=950,left=100,top=100');

    if (extWindow == null) {
      console.log("Simulator's window is null")
    }
  }

  //-------------------------------------------------------------------------

  public openTradeAnalyzer(tsId:number) {
    let extWindow = window.open('module/trade-analysis/'+tsId, '', 'popup,width=1500,height=950,left=100,top=100');

    if (extWindow == null) {
      console.log("Trade analyzer's window is null")
    }
  }

  //-------------------------------------------------------------------------

  public openCorrelationMatrix(allocId:number) {
    let extWindow = window.open('module/correlation-matrix/'+allocId, '', 'popup,width=1500,height=950,left=100,top=100');

    if (extWindow == null) {
      console.log("Correlation matrix's window is null")
    }
  }

  //-------------------------------------------------------------------------

  public openHelpViewer(topic:string) {
    let url = Platform.HelpBaseUrl + ""

    if (topic != "") {
      url = url  +"/user/"+ topic +".html"
    }

    if (this.helpWindow && !this.helpWindow.closed) {
      this.helpWindow.location = url
    }
    else {
      let w = window.open(url, '', 'popup,width=1200,height=900,left=100,top=100');

      if (w == null) {
        console.log("Help viewer's window is null")
      } else {
        this.helpWindow = w
      }
    }
  }
}

//=============================================================================
