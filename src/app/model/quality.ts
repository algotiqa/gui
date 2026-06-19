//=============================================================================
//===
//=== Copyright (C) 2025-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import {PorTradingSystem} from "./model";

//=============================================================================
//===
//=== QualityAnalysisRequest
//===
//=============================================================================

export class QualityAnalysisRequest {
  daysBack?     : number
  timeframeType : string = ""
  atrLength     : number = 20
  fromDate?     : number
  toDate?       : number
}

//=============================================================================
//===
//=== QualityAnalysisResponse
//===
//=============================================================================

export class QualityAnalysisResponse {
  tradingSystem?    : PorTradingSystem
  qualityAllGross   : Metrics[][] = []
  qualityLongGross  : Metrics[][] = []
  qualityShortGross : Metrics[][] = []
  qualityAllNet     : Metrics[][] = []
  qualityLongNet    : Metrics[][] = []
  qualityShortNet   : Metrics[][] = []
}

//=============================================================================

export class Metrics {
  sqn?         : number
  sqn100?      : number
  trades       : number = 0
  tradesPerc?  : number
  maxDrawdown? : number
}

//=============================================================================
