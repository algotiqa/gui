//=============================================================================
//===
//=== Copyright (C) 2025-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
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
