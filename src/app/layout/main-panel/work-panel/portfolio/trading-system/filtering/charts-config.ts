//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {ApexAnnotations, ApexAxisChartSeries, ApexChart, ApexStroke, ApexTitleSubtitle, ApexXAxis} from "ng-apexcharts";
import {ChartOptions} from "../../../../../../lib/chart-lib";
import {Lib} from "../../../../../../lib/lib";

//=============================================================================
//===
//=== Equity chart
//===
//=============================================================================

export function buildEquityChartOptions(title : string, clickFunction: any) : ChartOptions {
  return Lib.chart.buildLineOptions({
    chart: {
      type: "line",
      height: 500,
      events: {
        click: clickFunction,
      }
    },

    stroke: {
      dashArray: [ 0, 0, 0, 0, 4]
    },

    title: {
      text: title
    },

    xaxis: {
      type: "datetime"
    },
  })
}

//=============================================================================
//===
//=== Activation chart
//===
//=============================================================================

export function buildActivationChartOptions(title : string) : ChartOptions {
  return Lib.chart.buildLineOptions({
    chart: {
      type: "line",
      height: 300,
      id: "activ",
    },

     title: {
      text: title
    },

    xaxis: <ApexXAxis>{
      type: "datetime"
    }
  })
}

//=============================================================================
