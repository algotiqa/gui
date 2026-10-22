//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

export class MetricsResponse {
  tradingSystems : TradingSystemMetrics[] = []
}

//=============================================================================

export class TradingSystemMetrics {
  name      : string  = ""
  running   : boolean = false
  metrics3m : Metrics = new Metrics()
  metrics4m : Metrics = new Metrics()
  metrics6m : Metrics = new Metrics()
  metrics9m : Metrics = new Metrics()
  metrics1y : Metrics = new Metrics()
  metrics5y : Metrics = new Metrics()
}

//=============================================================================

export class Metrics {
  netReturn     : number = 0
  trades        : number = 0
  averageTrade  : number = 0
  profitFactor  : number = 0
  winningPerc   : number = 0
  maxDrawdown   : number = 0
  sharpeRatio   : number = 0
  sqn100        : number = 0
  returnDDRatio : number = 0
}

//=============================================================================
