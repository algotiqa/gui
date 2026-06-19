//=============================================================================
//===
//=== Copyright (C) 2025-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
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
