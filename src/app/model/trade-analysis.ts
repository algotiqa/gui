//=============================================================================
//===
//=== Copyright (C) 2026 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {PorTradingSystem, Trade} from "./model";
import {TradeEquityPanel} from "../module/trade-analyzer/equity/equity.panel";

//=============================================================================
//===
//=== TradeAnalysisRequest
//===
//=============================================================================

export class TradeAnalysisRequest {
  daysBack? : number
  fromDate? : number
  toDate?   : number
}

//=============================================================================
//===
//=== TradeAnalysisResponse
//===
//=============================================================================

export class TradeAnalysisResponse {
  tradingSystem? : PorTradingSystem
  trades         : TradeEntry[] = []
}

//=============================================================================

export class TradeEntry {
  tradeType?    : string
  entryDate?    : Date
  entryLabel?   : string
  exitDate?     : Date
  exitLabel?    : string
  grossReturn   : number = 0
  maxContracts? : number
  grossEquity?  : TradeEquity
  netEquity?    : TradeEquity
  contracts     : number[] = []
}

//=============================================================================

export class TradeEquity {
  equity   : number[] = []
  return   : number = 0
  runUp    : number = 0
  drawdown : number = 0
}

//=============================================================================
