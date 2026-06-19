//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
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
