//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {
  FilterConfig,
} from "../../../../../../../../model/filtering";
import {FieldOptimization} from "../../../../../../../../model/model";

//=============================================================================

const LEN_MAX  = 48
const LEN_STEP = 4

//=============================================================================

function field(curr: number, min:number, max:number, step:number) : FieldOptimization {
  return new FieldOptimization(true, curr, min, max, step)
}

//=============================================================================

export function symmetricFilter() : FilterConfig {
  return <FilterConfig>{
    activation : {
      netReturn        : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,  -200, 200,  100) },
      averageTrade     : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,   -20,  20,   10) },
      equityVsAverage  : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,   -50,  50,   25) },
      winningPercentage: { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,    15,  65,   10) },
      maxDrawdown      : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0, -2400,   0,  400) },
      trendLine        : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,    -1,   1,  0.2) },
      profitFactor     : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     0,   2, 0.25) },
      sharpeRatio      : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,  -0.5, 0.5,  0.2) },
      sqn100           : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,  -0.5,   2, 0.25) },
      returnMaxDDRatio : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     0,   2, 0.25) }
    },
    deactivation:{
      netReturn        : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,  -200, 200,  100) },
      averageTrade     : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,   -20,  20,   10) },
      equityVsAverage  : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,   -50,  50,   25) },
      winningPercentage: { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,    15,  65,   10) },
      maxDrawdown      : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0, -2400,   0,  400) },
      trendLine        : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,    -1,   1,  0.2) },
      profitFactor     : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     0,   2, 0.25) },
      sharpeRatio      : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,  -0.5, 0.5,  0.2) },
      sqn100           : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,  -0.5,   2, 0.25) },
      returnMaxDDRatio : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     0,   2, 0.25) }
    }
  }
}

//=============================================================================

export function standardFilter() : FilterConfig {
  return <FilterConfig>{
    activation : {
      netReturn        : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     0, 200,   50) },
      averageTrade     : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     0,  20,    5) },
      equityVsAverage  : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     0,  50,   25) },
      winningPercentage: { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,    25,  65,   10) },
      maxDrawdown      : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,  -400,   0,  200) },
      trendLine        : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     0, 0.5,  0.1) },
      profitFactor     : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     1, 1.5,  0.1) },
      sharpeRatio      : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     0, 0.5,  0.1) },
      sqn100           : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     0, 1.6,  0.2) },
      returnMaxDDRatio : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     1,   2, 0.20) }
    },
    deactivation:{
      netReturn        : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,  -200,    0,   50) },
      averageTrade     : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,   -20,    0,    5) },
      equityVsAverage  : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     0,   50,   25) },
      winningPercentage: { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     5,   55,   10) },
      maxDrawdown      : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0, -2400,-1200,  400) },
      trendLine        : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,  -0.5,    0,  0.1) },
      profitFactor     : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,   0.4,    1, 0.20) },
      sharpeRatio      : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,  -0.5,    0, 0.10) },
      sqn100           : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,  -0.4,    0, 0.10) },
      returnMaxDDRatio : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     0,    1, 0.20) }
    }
  }
}

//=============================================================================

export function aggressiveFilter() : FilterConfig {
  return <FilterConfig>{
    activation : {
      netReturn        : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,    50, 200,   50) },
      averageTrade     : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     5,  20,    5) },
      equityVsAverage  : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,    25,  75,   25) },
      winningPercentage: { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,    35,  65,   10) },
      maxDrawdown      : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,  -400,   0,  200) },
      trendLine        : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,   0.1, 0.6,  0.1) },
      profitFactor     : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,   1.5,   2,  0.1) },
      sharpeRatio      : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,   0.1, 0.5,  0.1) },
      sqn100           : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     1,   2,  0.1) },
      returnMaxDDRatio : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,   1.5,   2,  0.10) }
    },
    deactivation:{
      netReturn        : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     0,  100,    20) },
      averageTrade     : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     0,   10,     2) },
      equityVsAverage  : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     0,   50,    25) },
      winningPercentage: { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,    15,   55,    10) },
      maxDrawdown      : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0, -2000,-1200,   400) },
      trendLine        : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     0,  0.3,  0.05) },
      profitFactor     : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     1,  1.5,  0.10) },
      sharpeRatio      : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     0,  0.2,  0.05) },
      sqn100           : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,   0.7,  1.5,  0.20) },
      returnMaxDDRatio : { enabled: true, length: field(8, 4, LEN_MAX, LEN_STEP), value : field(0,     1,  1.5,  0.10) }
    }
  }
}

//=============================================================================
