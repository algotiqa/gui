//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import { FieldOptimization, TradingSystemSmall} from "./model";
import {SelectedPeriod} from "../component/form/period-selector/period-selector";

//=============================================================================
//===
//=== FilterAnalysisRequest
//===
//=============================================================================

export class FilterAnalysisRequest {
  period? : SelectedPeriod
  filter? : TradingFilter
}

//=============================================================================

export class TradingFilter {
  equAvgEnabled : boolean = false
  equAvgLen     : number  = 0

  posProEnabled : boolean = false
  posProLen     : number  = 0

  winPerEnabled : boolean = false
  winPerLen     : number  = 0
  winPerValue   : number  = 0

  oldNewEnabled : boolean = false
  oldNewOldLen  : number  = 0
  oldNewOldPerc : number  = 0
  oldNewNewLen  : number  = 0

  trendlineEnabled : boolean = false
  trendlineLen     : number  = 0
  trendlineValue   : number  = 0

  drawdownEnabled  : boolean = false
  drawdownMin      : number  = 0
  drawdownMax      : number  = 0
}

//=============================================================================
//===
//=== FilterAnalysisResponse
//===
//=============================================================================

export class FilterAnalysisResponse {
  tradingSystem : TradingSystemSmall = new TradingSystemSmall()
  summary       : Summary            = new Summary()
  equities      : Equities           = new Equities()
  filter        : TradingFilter      = new TradingFilter()
  activations   : Activations        = new Activations()
}

//=============================================================================

export class Summary {
  unfProfit       : number = 0
  filProfit       : number = 0
  unfMaxDrawdown  : number = 0
  filMaxDrawdown  : number = 0
  unfWinningPerc  : number = 0
  filWinningPerc  : number = 0
  unfAverageTrade : number = 0
  filAverageTrade : number = 0
}

//=============================================================================

export class Equities {
  time               : string[] = []
  unfilteredEquity   : number[] = []
  filteredEquity     : number[] = []
  unfilteredDrawdown : number[] = []
  filteredDrawdown   : number[] = []
  filterActivation   : number[] = []
  average            : Serie = new Serie()
}

//=============================================================================

export class Serie {
  time   : Date  [] = []
  values : number[] = []
}

//=============================================================================

export class Activations {
  equityVsAverage?   : Serie
  positiveProfit?    : Serie
  winningPercentage? : Serie
  oldVsNew?          : Serie
  trendline?         : Serie
}

//=============================================================================
//===
//=== FilterOptimizationRequest
//===
//=============================================================================

export class FilterOptimizationRequest {
  startDate?      : string
  fieldToOptimize : string  = "netProfit"
  filterConfig    : FilterConfig  = new FilterConfig()
  algorithm       : AlgorithmSpec = new AlgorithmSpec()
  baseline        : TradingFilter = new TradingFilter()
}

//=============================================================================

export class FilterConfig {
  enablePosProfit : boolean = true
  enableOldNew    : boolean = true
  enableWinPerc   : boolean = true
  enableEquAvg    : boolean = true
  enableTrendline : boolean = true
  enableDrawdown  : boolean = true

  posProLen     : FieldOptimization = new FieldOptimization(true, 20, 2, 160, 1)
  oldNewOldLen  : FieldOptimization = new FieldOptimization(true, 20, 2, 160, 1)
  oldNewNewLen  : FieldOptimization = new FieldOptimization(true, 20, 2, 160, 1)
  oldNewOldPerc : FieldOptimization = new FieldOptimization(true, 90, 5, 150, 5)
  winPercLen    : FieldOptimization = new FieldOptimization(true, 20, 2, 160, 1)
  winPercPerc   : FieldOptimization = new FieldOptimization(true, 50, 5, 100, 5)
  equAvgLen     : FieldOptimization = new FieldOptimization(true, 20, 2, 160, 1)
  trendlineLen  : FieldOptimization = new FieldOptimization(true, 20, 2, 160, 1)
  trendlineValue: FieldOptimization = new FieldOptimization(true, 10, 1, 100, 1)
  drawdownMin   : FieldOptimization = new FieldOptimization(true, 500, 100, 5000, 100)
  drawdownMax   : FieldOptimization = new FieldOptimization(true, 100, 100, 5000, 100)
}

//=============================================================================

export class AlgorithmSpec {
  type       : string              = "simple"
  params     : Map<string, string> = new Map()
}

//=============================================================================
//===
//=== FilterOptimizationResponse
//===
//=============================================================================

export class FilterOptimizationResponse {
  currStep?        : number
  maxSteps?        : number
  startTime?       : string
  endTime?         : string
  status?          : string
  runs?            : FilterRun[]
  startDate?       : string
  baseValue?       : number
  bestValue?       : number
  fieldToOptimize? : string
  duration?        : number
  filter?          : SelectedFilters
}

//=============================================================================

export class FilterRun {
  fitnessValue: number = 0
  netProfit   : number = 0
  avgTrade    : number = 0
  maxDrawdown : number = 0
  filter      : TradingFilter = new TradingFilter()
  posProfitDes: string = ""
  equityAvgDes: string = ""
  oldVsNewDes : string = ""
  winPercDes  : string = ""
  trendlineDes: string = ""
  drawdownDes : string = ""
}

//=============================================================================

export class SelectedFilters {
  posProfit? : boolean
  oldVsNew?  : boolean
  winPerc?   : boolean
  equVsAvg?  : boolean
  trendline? : boolean
  drawdown?  : boolean
}

//=============================================================================

