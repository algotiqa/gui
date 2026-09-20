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

  portfolio? : Portfolio
  filters    : AllocationFilter[] = []
  logs       : AllocationLog   [] = []
}

//=============================================================================

export class AllocationFilter {
  id?              : number
  allocationId?    : number
  tradingSystemId? : number
  filterPassed?    : boolean
  comment?         : string
  tsName?          : string
  tsDataSymbol?    : string
  tsBrokerSymbol?  : string
  tsMarketType?    : string
  tsStrategyType?  : string
  tsRunning?       : boolean
}

//=============================================================================

export class AllocationLog {
  id?           : number
  allocationId? : number
  level?        : string
  message?      : string
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
