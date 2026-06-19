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
//=== Performance Analysis
//===
//=============================================================================

import {PorTradingSystem, Trade} from "./model";

export class PerformanceAnalysisRequest {
  daysBack? : number
  timezone  : string = ""
  fromDate? : number
  toDate?   : number
}

//=============================================================================

export class PerformanceAnalysisResponse {
  general?       : General
  tradingSystem? : PorTradingSystem
  gross?         : Performance
  net?           : Performance
  allEquities?   : PerfEquities
  longEquities?  : PerfEquities
  shortEquities? : PerfEquities
  trades         : Trade[] = []
  aggregates?    : Aggregates
  distributions? : Distributions
  rolling?       : Rolling
  livePeriods    : LivePeriod[] = []
}

//=============================================================================

export class General {
  fromDate?              : number
  toDate?                : number
  lowerTail?             : number
  upperTail?             : number
}

//=============================================================================

export class Performance {
  return?        : Value;
  maxDrawdown?   : Value;
  averageTrade?  : Value;
  percentProfit? : Value;
}

//=============================================================================

export class Value {
  total : number = 0;
  long  : number = 0;
  short : number = 0;
}

//=============================================================================

export class PerfEquities {
  time         : Date[]   = [];
  grossEquity  : number[] = [];
  netEquity    : number[] = [];
  grossDrawdown: number[] = [];
  netDrawdown  : number[] = [];
  trades?      : number;
}

//=============================================================================

export class Aggregates {
  annual : AnnualAggregate[] = []
}

//=============================================================================

export class AnnualAggregate {
  year          : number = 0
  grossReturn   : number = 0
  grossAvgTrade : number = 0
  grossWinPerc  : number = 0
  netReturn     : number = 0
  netAvgTrade   : number = 0
  netWinPerc    : number = 0
  trades        : number = 0
}

//=============================================================================

export class Distributions {
  tradesAllGross?    : Distribution
  tradesAllNet?      : Distribution
  tradesLongGross?   : Distribution
  tradesLongNet?     : Distribution
  tradesShortGross?  : Distribution
  tradesShortNet?    : Distribution
}

//=============================================================================

export class Distribution {
  mean?        : number
  median?      : number
  standardDev? : number
  sharpeRatio? : number
  lowerTail?   : number
  upperTail?   : number
  skewness?    : number
  histogram?   : Histogram
}

//=============================================================================

export class Histogram {
  bars    : number  [] = []
  ranges  : BarRange[] = []
  gaussian: number  [] = []
}

//=============================================================================

export class BarRange {
  minValue : number = 0
  maxValue : number = 0
}

//=============================================================================

export class Rolling {
  daily   : RollingInfo[] = []
  monthly : RollingInfo[] = []
  dayYoY  : YoYRolling[]  = []
  monthYoY: YoYRolling[]  = []
}

//=============================================================================

export class RollingInfo {
  trades       : Value = new Value()
  grossReturns : Value = new Value()
  netReturns   : Value = new Value()
}

//=============================================================================

export class YoYRolling {
  year   : number        = 0
  data   : RollingInfo[] = []
}

//=============================================================================

export class LivePeriod {
    from? : Date
    to?   : Date
}

//=============================================================================
