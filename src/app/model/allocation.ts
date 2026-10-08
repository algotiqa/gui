//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Portfolio} from "./model";

export class AllocationSpec {
  portfolioId? : number
}

//=============================================================================

export enum AllocationStatus {
  Waiting  = "W",
  Running  = "R",
  Done     = "D",
  Warnings = "A",
  Errors   = "E",
}

//-----------------------------------------------------------------------------

export class Allocation {
  id?                : number
  portfolioId?       : number
  runDate?           : Date
  runType            : string = ""
  status             : string = ""
  accountPerc?       : number
  maxMarginPerc?     : number
  correlationPeriod? : number
  accountCapital?    : number
  portfolio?         : Portfolio
  report             : AllocationReport = new AllocationReport()
}

//=============================================================================

export class AllocationReport {
  tradingSystems     : AllocTradingSystem[] = []
  filterOutcomes     : FilterOutcome     [] = []
  logs               : AllocationLog     [] = []
  correlations       : SystemCorrelation [] = []
  correlationMatrix? : CorrelationMatrix
}

//=============================================================================

export class AllocTradingSystem {
  id?           : number
  name?         : string
  dataSymbol?   : string
  brokerSymbol? : string
  marketType?   : string
  strategyType? : string
  healthLevel?  : string
  message?      : string
}

//=============================================================================

export class FilterOutcome {
  tsId?           : number
  tsName?         : string
  tsDataSymbol?   : string
  tsBrokerSymbol? : string
  tsMarketType?   : string
  tsStrategyType? : string
  tsRunning?      : boolean
  filterPassed?   : boolean
  action?         : string
  comment?        : string
}

//=============================================================================

export class AllocationLog {
  level?   : string
  message? : string
}

//=============================================================================

export class AllocationFull extends Allocation {
  portfolioName?       : string
  accountId?           : number
  accountCode?         : string
  accountName?         : string
  accountCurrencyCode? : string
}

//=============================================================================

export class SystemCorrelation {
  ts1Id?       : number
  ts2Id?       : number
  ts1Name?     : string
  ts2Name?     : string
  correlation? : number
  error?       : string
}

//=============================================================================

export class CorrelationMatrix {
  names : string[]   = []
  cells : number[][] = []
}

//=============================================================================
