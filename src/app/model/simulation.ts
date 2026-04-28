//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {PorTradingSystem} from "./model";
import {IntDateAdapter} from "../component/form/date-picker/int-date-adapter";
import {IntDateTranscoder} from "../component/panel/flex-table/transcoders";

//=============================================================================
//===
//=== QualityAnalysisRequest
//===
//=============================================================================

export class SimulationRequest {
  daysBack? : number
  fromDate? : number
  toDate?   : number
  runs      : number = 5000
  width     : number = 0
  height    : number = 0
}

//=============================================================================
//===
//=== QualityAnalysisResponse
//===
//=============================================================================

export class SimulationResult {
  firstTradeDate? : number
  lastTradeDate?  : number
  runs?           : number
  costPerOper?    : number
  currencyCode?   : string
  status?         : string
  startTime?      : Date
  endTime?        : Date
  step?           : number
  grossAll?       : Details
  grossLong?      : Details
  grossShort?     : Details
  netAll?         : Details
  netLong?        : Details
  netShort?       : Details
}

//=============================================================================

export class Details {
  detectedRisk?        : number
  numberOfTrades?      : number
  equitiesImage        : string   = ""
  maxDrawdownDistr?    : Distribution
  maxDrawdownProb?     : Distribution
  equityReturn?        : number
  equityMaxDD?         : number
  equityReturnDDRatio? : number
  equityAverageTrade?  : number
  medianReturn?        : number
  medianMaxDD?         : number
  medianReturnDDRatio? : number
  medianAverageTrade?  : number
}

//=============================================================================

export class Distribution {
  xAxis : string[] = []
  yAxis : number[] = []
}

//=============================================================================
