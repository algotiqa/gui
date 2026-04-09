//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

//=============================================================================
//===
//=== DataProductAnalysisResponse
//===
//=============================================================================

export class DataProductAnalysisResponse {
  id?        : number
  symbol?    : string
  from?      : number
  to?        : number
  bars?      : number
  timeframe? : number
  atrLength? : number
  barResults : BarResult[] = []
}

//=============================================================================

export class BarResult {
  time?          : Date
  close?         : number
  barChangePerc? : number
  sqn100?        : number
  trueRange?     : number
  atr?           : number
  atrPerc?       : number
  atrMeanPerc?   : number
  atrStdDevPerc? : number
  direction?     : number
  volatility?    : number
}

//=============================================================================
