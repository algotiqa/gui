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

  static fromJson(fc : FilterConfig) : FilterConfig {
    let res = new FilterConfig()
    res.activation   = OptimizationConfig.fromJson(fc.activation)
    res.deactivation = OptimizationConfig.fromJson(fc.deactivation)

    return res
  }
}

//=============================================================================

export class OptimizationConfig {
  netReturn          = new BaseOptimiz()
  averageTrade       = new BaseOptimiz()
  equityVsAverage    = new BaseOptimiz()
  winningPercentage  = new BaseOptimiz()
  maxDrawdown        = new BaseOptimiz()
  trendLine          = new BaseOptimiz()
  profitFactor       = new BaseOptimiz()
  sharpeRatio        = new BaseOptimiz()
  sqn100             = new BaseOptimiz()
  returnMaxDDRatio   = new BaseOptimiz()

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

  static fromJson(oc : OptimizationConfig) : OptimizationConfig {
    let res = new OptimizationConfig()
    res.netReturn         = BaseOptimiz.fromJson(oc.netReturn)
    res.averageTrade      = BaseOptimiz.fromJson(oc.averageTrade)
    res.equityVsAverage   = BaseOptimiz.fromJson(oc.equityVsAverage)
    res.winningPercentage = BaseOptimiz.fromJson(oc.winningPercentage)
    res.maxDrawdown       = BaseOptimiz.fromJson(oc.maxDrawdown)
    res.trendLine         = BaseOptimiz.fromJson(oc.trendLine)
    res.profitFactor      = BaseOptimiz.fromJson(oc.profitFactor)
    res.sharpeRatio       = BaseOptimiz.fromJson(oc.sharpeRatio)
    res.sqn100            = BaseOptimiz.fromJson(oc.sqn100)
    res.returnMaxDDRatio  = BaseOptimiz.fromJson(oc.returnMaxDDRatio)

    return res
  }
}

//=============================================================================

export class BaseOptimiz {
  enabled : boolean           = false;
  length  : FieldOptimization = new FieldOptimization(true, 8, 4, 48, 4)
  value   : FieldOptimization = new FieldOptimization(true, 0, 0,  0, 1)

  enable(e : boolean) {
    this.enabled = !e;
    this.length.enabled = !e;
    this.value.enabled  = !e;
  }

  static fromJson(bo : BaseOptimiz) : BaseOptimiz {
    let res = new BaseOptimiz()
    res.enabled = bo.enabled
    res.length  = FieldOptimization.fromJson(bo.length)
    res.value   = FieldOptimization.fromJson(bo.value)

    return res
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
