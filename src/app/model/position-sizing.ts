//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {SelectedPeriod} from "../component/form/period-selector/period-selector";
import {ParamSpec} from "./model";

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
  ruinPercentage  : number = 0
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
  drawdown        : number[] = []
  positions       : number[] = []
  return          : number = 0
  maxDrawdown     : number = 0
  returnDrawdRatio: number = 0
  ruined          : boolean = false
}

//=============================================================================
