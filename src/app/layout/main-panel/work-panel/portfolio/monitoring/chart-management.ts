//=============================================================================
//===
//=== Copyright (C) 2023-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import {PortfolioMonitoringResponse, TradingSystemMonitoring} from "../../../../../model/model";
import {ChartOptions} from "./model";
import {Lib} from "../../../../../lib/lib";
import {ApexAxisChartSeries, ApexChart, ApexStroke, ApexTitleSubtitle, ApexXAxis} from "ng-apexcharts";

//=============================================================================

export function buildEquityChartOptions(title : string) : {} {
  return {
    chart: <ApexChart>{
      type: "line",
      height: 500,
    },

    series: <ApexAxisChartSeries>[],

    plotOptions: {},

    stroke: <ApexStroke>{
      curve: "straight",
      width: 2,
    },

    dataLabels: {
      // enabled: true,
    },

    title: <ApexTitleSubtitle>{
      text: title
    },

    xaxis: <ApexXAxis>{
      type: "datetime"
    }
  }
}

//=============================================================================

export function createChart(options : ChartOptions, result : PortfolioMonitoringResponse) : any[] {
  let datasets : any[] = [];

  if (options.showTotals) {
    datasets = [...datasets,
      Lib.chart.buildDataset(options.labelTotGrossProfit, result.time, result.grossProfit),
      Lib.chart.buildDataset(options.labelTotNetProfit,   result.time, result.netProfit),
      Lib.chart.buildDataset(options.labelTotGrossDrawdown, result.time, result.grossDrawdown, true),
      Lib.chart.buildDataset(options.labelTotNetDrawdown, result.time, result.netDrawdown, true),
    ]
  }

  result.tradingSystems.forEach(function (tsm) {
    datasets = [...datasets, ...buildTSMDataSet(options, tsm)];
  });

  return datasets;
}

//=============================================================================
//===
//=== Other functions
//===
//=============================================================================

function buildTSMDataSet(options : ChartOptions, tsa : TradingSystemMonitoring) : any {

  let res : any[]    = []

  if (options.showGrossProfit) {
    res = [...res, Lib.chart.buildDataset(tsa.name +" (Raw Profit)", tsa.time, tsa.grossProfit)];
  }

  if (options.showNetProfit) {
    res = [...res, Lib.chart.buildDataset(tsa.name +" (Net Profit)", tsa.time, tsa.netProfit)];
  }

  if (options.showGrossDrawdown) {
    res = [...res, Lib.chart.buildDataset(tsa.name + " (Raw DD)", tsa.time, tsa.grossDrawdown, true)];
  }

  if (options.showNetDrawdown) {
    res = [...res, Lib.chart.buildDataset(tsa.name + " (Net DD)", tsa.time, tsa.netDrawdown, true)];
  }

  return res
}

//=============================================================================
