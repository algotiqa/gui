//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

export class DashboardSummary {
  tradingSystemCount : number = 0
  totalNetProfit     : number = 0
  totalTrades        : number = 0
  allSystems         : DashboardItem     [] = []
  byMarket           : DashboardItem     [] = []
  byStatus           : DashboardItem     [] = []
  byCurrency         : DashboardItem     [] = []
  topSystemsByProfit : DashboardTopSystem[] = []
  topSystemsByTrades : DashboardTopSystem[] = []
}

//=============================================================================

export class DashboardItem {
  name  : string = ''
  value : number = 0
}

//=============================================================================

export class DashboardTopSystem {
  id    : number  = 0
  name  : string  = ''
  value : number  = 0
}

//=============================================================================
