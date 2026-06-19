//=============================================================================
//===
//=== Copyright (C) 2024-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
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
