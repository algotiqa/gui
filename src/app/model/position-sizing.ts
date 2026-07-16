//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {SelectedPeriod} from "../component/form/period-selector/period-selector";
import {FieldOptimization, ParamSpec} from "./model";

//=============================================================================

export class Model {
  name   : string               = ""
  config : {[index:string]:any} = {}
}

//=============================================================================

export class TradingPosition {
  params? : PositionParameters
  model?  : Model
}

//=============================================================================
//===
//=== PositionAnalysisRequest
//===
//=============================================================================

export class PositionAnalysisRequest {
  params? : PositionParameters
  model?  : Model
  period? : SelectedPeriod
}

//=============================================================================

export class PositionParameters {
  initialCapital  : number = 0
  maxTolDrawdPerc : number = 0
  marginOverride? : number
  maxUnits        : number = 0
  riskPerUnit     : string = ""
  riskValue       : number = 0
}

//=============================================================================
//===
//=== PositionAnalysisResponse
//===
//=============================================================================

export class PositionAnalysisResponse {
  tradingSystem   : TradingSystemInfo = new TradingSystemInfo()
  params          : PositionParameters= new PositionParameters()
  baseline        : AnalysisResult    = new AnalysisResult()
  current         : AnalysisResult    = new AnalysisResult()
  selected        : AnalysisResult    = new AnalysisResult()
  time            : Date[]            = []
  paramSpecs      : { [name:string]:ParamSpec } = {}
  modelSpecs      : { [name:string]:ParamSpec } = {}
  usedMargin      : number = 0
  grossRisk       : number = 0
  netRisk         : number = 0
  noLosses        : boolean= false
  ruinCapital     : number = 0
  costPerOperation: number = 0
}

//=============================================================================

export class TradingSystemInfo {
  id   : number = 0
  name : string = ""
}

//=============================================================================

export class AnalysisResult {
  model  : Model            = new Model()
  gross  : ModelPerformance = new ModelPerformance()
  net    : ModelPerformance = new ModelPerformance()
}

//=============================================================================

export class ModelPerformance {
  equity          : number[] = []
  drawdownPerc    : number[] = []
  positions       : number[] = []
  return          : number = 0
  maxDrawdown     : number = 0
  maxDrawdownPerc : number = 0
  returnDrawdRatio: number = 0
  returnOnAccount : number = 0
  ruined          : boolean = false
}

//=============================================================================
//===
//=== PositionOptimizationRequest
//===
//=============================================================================

export class PositionOptimizationRequest {
  params      = new PositionParameters()
  runConfig   = new RunConfig()
  targets     = new PositionTargets()
  modelConfig = new ModelConfig()
}

//=============================================================================

export class RunConfig {
  period          : SelectedPeriod = new SelectedPeriod()
  runsPerSimul    : number = 5000
  projectionYears : number = 1
  tradesPerYear?  : number
}

//=============================================================================

export class PositionTargets {
  desReturnOnAccount  : number = 30
  minRetMaxDrawdRatio : number = 2.0
}

//=============================================================================

export class ModelConfig {
  enableFixedUnit   : boolean = true
  enablePercentRisk : boolean = true
  enablePercentVol  : boolean = true
  enableMarketMoney : boolean = true

  units               = new FieldOptimization(true,   1,   1, 100,  1)
  riskPerTrade        = new FieldOptimization(true, 1.5, 0.5,  10,  0.5)
  averageLength       = new FieldOptimization(true,  20,   2,  40,  1)
  maxVolatility       = new FieldOptimization(true, 1.5, 0.5,  20,  0.5)
  riskPerTradeOnCap   = new FieldOptimization(true, 1.5, 0.5,  10,  0.5)
  riskPerTradeOnEarn  = new FieldOptimization(true, 4.0, 0.5,  10,  0.5)
  percentageOnCapital = new FieldOptimization(true, 100,   5, 100,  5)
}

//=============================================================================
//===
//=== PositionOptimizationResponse
//===
//=============================================================================

export class PositionOptimizationResponse {
  currStep?   : number
  totalSteps? : number
  duration?   : number
  startTime?  : string
  endTime?    : string
  status?     : string
  models?     : OptimizedModels
  targets?    : OptimizationTargets
  results?    : ExecutionResult[]
  bestRun?    : ExecutionResult
}

//=============================================================================

export class OptimizedModels {
  fixedUnit?   : boolean
  percentRisk? : boolean
  percentVol?  : boolean
  marketMoney? : boolean
}

//=============================================================================

export class OptimizationTargets {
  desReturnOnAccount?  : number
  maxTolDrawdPerc?     : number
  minRetMaxDrawdRatio? : number
}

//=============================================================================

export class ExecutionResult {
  initialCapital?        : number
  medianFinalCapital?    : number
  medianReturn?          : number
  medianReturnOnAcc?     : number
  medianMaxDrawdownPerc? : number
  medianRetDrawdRatio?   : number
  probOfSuccess?         : number
  probOfFailure?         : number
  model                  : string = ""
  config                 : {[key:string]:any} = {}
  params?                : string
  modelName?             : string
}

//=============================================================================
