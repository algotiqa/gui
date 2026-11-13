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

  //-----------------------------------------------------

  public static fromJson(j? : Partial<TradingFilter>) : TradingFilter {
    let f          = Object.assign(new TradingFilter(), j)
    f.activation   = Config.fromJson(j?.activation)
    f.deactivation = Config.fromJson(j?.deactivation)
    return f
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

  //-----------------------------------------------------

  public static fromJson(j? : Partial<Config>) : Config {
    let c               = Object.assign(new Config(), j)
    c.netReturn         = Object.assign(new NetReturnConfig(),         j?.netReturn)
    c.averageTrade      = Object.assign(new AverageTradeConfig(),      j?.averageTrade)
    c.equityVsAverage   = Object.assign(new EquityVsAverageConfig(),   j?.equityVsAverage)
    c.winningPercentage = Object.assign(new WinningPercentageConfig(), j?.winningPercentage)
    c.maxDrawdown       = Object.assign(new MaxDrawdownConfig(),       j?.maxDrawdown)
    c.trendLine         = Object.assign(new TrendLineConfig(),         j?.trendLine)
    c.profitFactor      = Object.assign(new ProfitFactorConfig(),      j?.profitFactor)
    c.sharpeRatio       = Object.assign(new SharpeRatioConfig(),       j?.sharpeRatio)
    c.sqn100            = Object.assign(new Sqn100Config(),            j?.sqn100)
    c.returnMaxDDRatio  = Object.assign(new ReturnMaxDDRatioConfig(),  j?.returnMaxDDRatio)
    return c
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

export class MaxDrawdownConfig extends BaseConfig {}

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
  period          : SelectedPeriod = new SelectedPeriod()
  fieldToOptimize : string         = "netReturn"
  filterConfig    : FilterConfig   = new FilterConfig()
  algorithm       : AlgorithmSpec  = new AlgorithmSpec()
  baseline        : TradingFilter  = new TradingFilter()
}

//=============================================================================

export class FilterConfig {
  activation   : OptimizationConfig = new OptimizationConfig()
  deactivation : OptimizationConfig = new OptimizationConfig()

  enable(f : TradingFilter) {
    this.activation  .enable(f.activation)
    this.deactivation.enable(f.deactivation)
  }
}

//=============================================================================

export class OptimizationConfig {
  netReturn         : NetReturnOptimiz         = new NetReturnOptimiz()
  averageTrade      : AverageTradeOptimiz      = new AverageTradeOptimiz()
  equityVsAverage   : EquityVsAverageOptimiz   = new EquityVsAverageOptimiz()
  winningPercentage : WinningPercentageOptimiz = new WinningPercentageOptimiz()
  maxDrawdown       : MaxDrawdownOptimiz       = new MaxDrawdownOptimiz()
  trendLine         : TrendLineOptimiz         = new TrendLineOptimiz()
  profitFactor      : ProfitFactorOptimiz      = new ProfitFactorOptimiz()
  sharpeRatio       : SharpeRatioOptimiz       = new SharpeRatioOptimiz()
  sqn100            : Sqn100Optimiz            = new Sqn100Optimiz()
  returnMaxDDRatio  : ReturnMaxDDRatioOptimiz  = new ReturnMaxDDRatioOptimiz()

  enable(c : Config) {
    this.netReturn        .enable(c.netReturn.enabled)
    this.averageTrade     .enable(c.averageTrade.enabled)
    this.equityVsAverage  .enable(c.equityVsAverage.enabled)
    this.winningPercentage.enable(c.winningPercentage.enabled)
    this.maxDrawdown      .enable(c.maxDrawdown.enabled)
    this.trendLine        .enable(c.trendLine.enabled)
    this.profitFactor     .enable(c.profitFactor.enabled)
    this.sharpeRatio      .enable(c.sharpeRatio.enabled)
    this.sqn100           .enable(c.sqn100.enabled)
    this.returnMaxDDRatio .enable(c.returnMaxDDRatio.enabled)
  }

  disable() {
    this.netReturn        .enabled = false
    this.averageTrade     .enabled = false
    this.equityVsAverage  .enabled = false
    this.winningPercentage.enabled = false
    this.maxDrawdown      .enabled = false
    this.trendLine        .enabled = false
    this.profitFactor     .enabled = false
    this.sharpeRatio      .enabled = false
    this.sqn100           .enabled = false
    this.returnMaxDDRatio .enabled = false
  }
}

//=============================================================================

export class BaseOptimiz {
  enabled : boolean = false;

  enable(e : boolean) {
    this.enabled = !e;
  }
}

//=============================================================================

export class NetReturnOptimiz extends BaseOptimiz {
  length  : FieldOptimization = new FieldOptimization(true, 8, 4, 48, 4)
  value   : FieldOptimization = new FieldOptimization(true, 0, -200, 200, 100)

  override enable(e : boolean) {
    super.enable(e)
    this.length.enabled = !e;
    this.value.enabled  = !e;
  }
}

//=============================================================================

export class AverageTradeOptimiz extends BaseOptimiz {
  length  : FieldOptimization = new FieldOptimization(true, 8, 4, 48, 4)
  value   : FieldOptimization = new FieldOptimization(true, 0, -20, 20, 10)

  override enable(e : boolean) {
    super.enable(e)
    this.length.enabled = !e;
    this.value.enabled  = !e;
  }
}

//=============================================================================

export class EquityVsAverageOptimiz extends BaseOptimiz {
  length  : FieldOptimization = new FieldOptimization(true, 8, 4, 48, 4)
  value   : FieldOptimization = new FieldOptimization(true, 0, -50, 50, 25)

  override enable(e : boolean) {
    super.enable(e)
    this.length.enabled = !e;
    this.value.enabled  = !e;
  }
}

//=============================================================================

export class WinningPercentageOptimiz extends BaseOptimiz {
  length  : FieldOptimization = new FieldOptimization(true, 8, 4, 48, 4)
  value   : FieldOptimization = new FieldOptimization(true, 50, 5, 75, 10)

  override enable(e : boolean) {
    super.enable(e)
    this.length.enabled = !e;
    this.value.enabled  = !e;
  }
}

//=============================================================================

export class MaxDrawdownOptimiz extends BaseOptimiz {
  length  : FieldOptimization = new FieldOptimization(true, 8, 4, 48, 4)
  value   : FieldOptimization = new FieldOptimization(true, 0, -3200, 0, 400)

  override enable(e : boolean) {
    super.enable(e)
    this.length.enabled = !e;
    this.value.enabled  = !e;
  }
}

//=============================================================================

export class TrendLineOptimiz extends BaseOptimiz {
  length  : FieldOptimization = new FieldOptimization(true, 8, 4, 48, 4)
  value   : FieldOptimization = new FieldOptimization(true, 0, -1, 1, 0.2)

  override enable(e : boolean) {
    super.enable(e)
    this.length.enabled = !e;
    this.value.enabled  = !e;
  }
}

//=============================================================================

export class ProfitFactorOptimiz extends BaseOptimiz {
  length  : FieldOptimization = new FieldOptimization(true, 8, 4, 48, 4)
  value   : FieldOptimization = new FieldOptimization(true, 1, 0, 2, 0.25)

  override enable(e : boolean) {
    super.enable(e)
    this.length.enabled = !e;
    this.value.enabled  = !e;
  }
}

//=============================================================================

export class SharpeRatioOptimiz extends BaseOptimiz {
  length  : FieldOptimization = new FieldOptimization(true, 8, 4, 48, 4)
  value   : FieldOptimization = new FieldOptimization(true, 0, -0.5, 0.5, 0.1)

  override enable(e : boolean) {
    super.enable(e)
    this.length.enabled = !e;
    this.value.enabled  = !e;
  }
}

//=============================================================================

export class Sqn100Optimiz extends BaseOptimiz {
  length  : FieldOptimization = new FieldOptimization(true, 8, 4, 48, 4)
  value   : FieldOptimization = new FieldOptimization(true, 1, -0.5, 2, 0.25)

  override enable(e : boolean) {
    super.enable(e)
    this.length.enabled = !e;
    this.value.enabled  = !e;
  }
}

//=============================================================================

export class ReturnMaxDDRatioOptimiz extends BaseOptimiz {
  length  : FieldOptimization = new FieldOptimization(true, 8, 4, 48, 4)
  value   : FieldOptimization = new FieldOptimization(true, 1, 0, 2, 0.25)

  override enable(e : boolean) {
    super.enable(e)
    this.length.enabled = !e;
    this.value.enabled  = !e;
  }
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
  startDate?       : string
  currStep?        : number
  maxSteps?        : number
  startTime?       : string
  endTime?         : string
  status?          : string
  error?           : string
  runs?            : FilterRun[]
  baseValue?       : number
  bestValue?       : number
  fieldToOptimize? : string
  duration?        : string
  remaining?       : string
  filter           : Flags = new Flags()
}

//=============================================================================

export class FilterRun {
  fitnessValue: number = 0
  netReturn   : number = 0
  avgTrade    : number = 0
  maxDrawdown : number = 0
  filter      : TradingFilter = new TradingFilter()
  activation  : string = ""
  deactivation: string = ""
}

//=============================================================================

export class Flags {
  activation   : EnableSet = new EnableSet()
  deactivation : EnableSet = new EnableSet()
}

//=============================================================================

export class EnableSet {
  netReturn         : boolean = false
  averageTrade      : boolean = false
  equityVsAverage   : boolean = false
  winningPercentage : boolean = false
  maxDrawdown       : boolean = false
  trendLine         : boolean = false
  profitFactor      : boolean = false
  sharpeRatio       : boolean = false
  sqn100            : boolean = false
  returnMaxDDRatio  : boolean = false
}

//=============================================================================
