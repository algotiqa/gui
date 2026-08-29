//=============================================================================
//===
//=== Copyright (C) 2024-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


//=============================================================================
//===
//=== Bias analysis
//===
//=============================================================================

import {BrokerProduct, DataPoint} from "../../../../../model/model";
import {PeriodSelectorInfo} from "../../../../../component/form/period-selector/period-selector";

export class BiasAnalysis {
  id?               : number
  username?         : string
  dataInstrumentId? : number
  brokerProductId?  : number
  name?             : string
  notes?            : string
  createdAt?        : string
  updatedAt?        : string
}

//=============================================================================

export class BiasAnalysisFull extends BiasAnalysis {
  dataSymbol?   : string
  dataName?     : string
  brokerSymbol? : string
  brokerName?   : string
}

//=============================================================================

export class BiasConfig {
  id?         : number
  startDay?   : number
  startSlot?  : number
  endDay?     : number
  endSlot?    : number
  months?     : boolean[]
  excludes?   : string[]
  operation?  : number
  grossProfit?: number
  netProfit?  : number
}

//=============================================================================
//===
//=== BiasSummaryResponse
//===
//=============================================================================

export class BiasSummaryResponse {
  biasAnalysis  : BiasAnalysis       = new BiasAnalysis()
  brokerProduct : BrokerProduct      = new BrokerProduct()
  result        : DataPointDowList[] = []
}

//=============================================================================

export class DataPointDowList {
  slots : DataPointSlotList[] = []
}

//=============================================================================

export class DataPointSlotList {
  list : DataPointEntry[] = []
}

//=============================================================================

export class DataPointEntry {
  year : number = 0
  month: number = 0
  day  : number = 0
  delta: number = 0
}

//=============================================================================
//===
//=== BiasBacktestRequest
//===
//=============================================================================

export class BiasBacktestRequest {
  period     : PeriodSelectorInfo = new PeriodSelectorInfo()
  stopLoss   : number = 0
  takeProfit : number = 0
  session    : string = ""
}

//=============================================================================
//===
//=== BiasBacktestResponse
//===
//=============================================================================

export class BiasBacktestResponse {
  biasAnalysis?    : BiasAnalysis
  brokerProduct?   : BrokerProduct
  backtestedConfigs: BacktestedConfig[] = []
  spec?            : BiasBacktestSpec
}

//=============================================================================

export class BacktestedConfig {
  biasConfig?    : BiasConfig
  grossProfit?   : number
  netProfit?     : number
  grossAvgTrade? : number
  netAvgTrade?   : number
  biasTrades     : BiasTrade[] = []
  sequences      : TriggeringSequence[] = []
  equity?        : Equity
  profitDistrib? : ProfitDistribution
}

//=============================================================================

export class BiasTrade {
  entryTime   : string = ""
  entryValue  : number = 0
  exitTime    : string = ""
  exitValue   : number = 0
  operation   : number = 0
  grossProfit : number = 0
  netProfit   : number = 0
}

//=============================================================================

export class TriggeringSequence {
  dataPoints : DataPoint[] = []
}

//=============================================================================

export class Equity {
  time : Date  [] = []
  gross: number[] = []
  net  : number[] = []
}

//=============================================================================

export class ProfitDistribution {
  netProfits : number[] = []
  numTrades  : number[] = []
  avgTrades  : number[] = []
}

//=============================================================================

export class BiasBacktestSpec {
  stopLoss   : number = 0
  takeProfit : number = 0
}

//=============================================================================
