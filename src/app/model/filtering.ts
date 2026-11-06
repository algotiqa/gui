//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {FieldOptimization, Portfolio, TradingSystemSmall} from "./model";
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
  activation   : Config = new Config()
  deactivation : Config = new Config()

  //-----------------------------------------------------

  public equals(f : TradingFilter) : boolean {
    return this.activation  .equals(f.activation) &&
           this.deactivation.equals(f.deactivation)
  }
}

//=============================================================================

export class Config {
  combinationMode   : string                  = "A";
  netReturn         : NetReturnConfig         = new NetReturnConfig()
  averageTrade      : AverageTradeConfig      = new AverageTradeConfig()
  equityVsAverage   : EquityVsAverageConfig   = new EquityVsAverageConfig()
  winningPercentage : WinningPercentageConfig = new WinningPercentageConfig()
  maxDrawdown       : MaxDrawdownConfig       = new MaxDrawdownConfig()
  trendLine         : TrendLineConfig         = new TrendLineConfig()
  profitFactor      : ProfitFactorConfig      = new ProfitFactorConfig()
  sharpeRatio       : SharpeRatioConfig       = new SharpeRatioConfig()
  sqn100            : Sqn100Config            = new Sqn100Config()
  returnMaxDDRatio  : ReturnMaxDDRatioConfig  = new ReturnMaxDDRatioConfig()

  //-----------------------------------------------------

  public equals(c : Config) : boolean {
    return this.combinationMode == c.combinationMode          &&
           this.netReturn        .equals(c.netReturn)         &&
           this.averageTrade     .equals(c.averageTrade)      &&
           this.equityVsAverage  .equals(c.equityVsAverage)   &&
           this.winningPercentage.equals(c.winningPercentage) &&
           this.maxDrawdown      .equals(c.maxDrawdown)       &&
           this.trendLine        .equals(c.trendLine)         &&
           this.profitFactor     .equals(c.profitFactor)      &&
           this.sharpeRatio      .equals(c.sharpeRatio)       &&
           this.sqn100           .equals(c.sqn100)            &&
           this.returnMaxDDRatio .equals(c.returnMaxDDRatio)
  }
}

//=============================================================================

export class BaseConfig {
  enabled : boolean = false;
  length  : number  = 20
  value   : number  = 0

  //-----------------------------------------------------

  public equals(b : BaseConfig) : boolean {
    return (this.enabled == b.enabled) &&
           (this.length  == b.length) &&
           (this.value   == b.value)
  }
}

//=============================================================================

export class NetReturnConfig extends BaseConfig {}

//=============================================================================

export class AverageTradeConfig extends BaseConfig {}

//=============================================================================

export class EquityVsAverageConfig extends BaseConfig {}

//=============================================================================

export class WinningPercentageConfig extends BaseConfig {}

//=============================================================================

export class MaxDrawdownConfig {
  enabled : boolean = false;
  value   : number  = 0

  //-----------------------------------------------------

  public equals(b : MaxDrawdownConfig) : boolean {
    return (this.enabled == b.enabled) &&
           (this.value   == b.value)
  }
}

//=============================================================================

export class TrendLineConfig extends BaseConfig {}

//=============================================================================

export class ProfitFactorConfig extends BaseConfig {}

//=============================================================================

export class SharpeRatioConfig extends BaseConfig {}

//=============================================================================

export class Sqn100Config extends BaseConfig {}

//=============================================================================

export class ReturnMaxDDRatioConfig extends BaseConfig {}

//=============================================================================
//===
//=== FilterAnalysisResponse
//===
//=============================================================================

export class FilterAnalysisResponse {
  tradingSystem : TradingSystemSmall = new TradingSystemSmall()
  filter        : TradingFilter      = new TradingFilter()
  baseline      : TradingFilter      = new TradingFilter()
  summary       : Summary            = new Summary()
  equities      : Equities           = new Equities()
  outcomes      : Outcomes           = new Outcomes()
  portfolio     : Portfolio          = new Portfolio()
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
  time               : Date  [] = []
  unfilteredEquity   : number[] = []
  filteredEquity     : number[] = []
  unfilteredDrawdown : number[] = []
  filteredDrawdown   : number[] = []
}

//=============================================================================

export class Outcomes {
  activations      : Activation[] = []
  deactivations    : Activation[] = []
  combinedActiv    : number    [] = []
  combinedDeact    : number    [] = []
  combinedFinal    : number    [] = []
  sampledFinal     : number    [] = []
  finalActivation? : Activation
}

//=============================================================================

export class Activation {
  name   : string   = ""
  times  : Date  [] = []
  flags  : number[] = []
  metrics: number[] = []
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

