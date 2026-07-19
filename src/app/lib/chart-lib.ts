//=============================================================================
//===
//=== Copyright (C) 2022-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import {
  ApexAnnotations,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels, ApexLegend,
  ApexPlotOptions,
  ApexStroke, ApexTitleSubtitle,
  ApexXAxis,
  ApexYAxis,
  ApexTooltip, ApexGrid,
  ApexNonAxisChartSeries,
  ApexFill,
  ApexMarkers,
  ApexResponsive,
  ApexStates,
  ApexTheme
} from "ng-apexcharts";
import {MinMax} from "./min-max";

import { deepmerge } from "deepmerge-ts"

//=============================================================================

export type ChartOptions = {
  series      : ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart       : ApexChart;
  xaxis       : ApexXAxis;
  yaxis       : ApexYAxis | ApexYAxis[];
  title       : ApexTitleSubtitle;
  subtitle    : ApexTitleSubtitle;
  dataLabels  : ApexDataLabels;
  stroke      : ApexStroke;
  fill        : ApexFill;
  legend      : ApexLegend;
  tooltip     : ApexTooltip;
  markers     : ApexMarkers;
  plotOptions : ApexPlotOptions;
  grid        : ApexGrid;
  annotations : ApexAnnotations;
  states      : ApexStates;
  theme       : ApexTheme;
  colors      : string[];
  labels      : any;
}

//-----------------------------------------------------------------------------

const defaultBarOptions : ChartOptions= {
  title: {
  },
  chart: {
    type: "bar",
    height: "96%",
  },

  series: [],
  legend: {},

  plotOptions: {
    bar: {
      columnWidth: "95%",
    }
  },

  stroke: {},

  dataLabels: {
    enabled: false,
  },

  colors: [ "#008FFB" ],
  xaxis: {},
  yaxis: {},
  annotations: {},
  labels: [],
  grid: {},
  tooltip: {},
  subtitle: {},
  fill: {},
  markers: {},
  states: {},
  theme: {}
}

//-----------------------------------------------------------------------------

const defaultLineOptions : ChartOptions = {
  title: {},
  chart: {
    type: "line",
    height: "96%",
    id: "base",
    group: "equity",
    zoom: {
      enabled: true,
      autoScaleYaxis: true,
      allowMouseWheelZoom: false
    }
  },

  series: [],
  legend: {},
  plotOptions: {},

  stroke: {
    curve: "stepline",
    width: 2,
  },

  dataLabels: {},
  colors: [],
  xaxis: {},

  yaxis: {
    tickAmount: 20,
    decimalsInFloat: 0,
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: true,
    }
  },
  annotations: {},
  labels: [],
  grid: {
    borderColor: "#B0B0B0",
    strokeDashArray: 3,
    xaxis: {
      lines: {
        show: true
      }
    }
  },
  tooltip: {},
  subtitle: {},
  fill: {},
  markers: {},
  states: {},
  theme: {}
}

//-----------------------------------------------------------------------------

const defaultDonutOptions : ChartOptions = {
  title: {},
  series: [],
  chart: {
    type: "donut",
  },
  labels: "",
  legend: {},
  plotOptions: {},
  dataLabels: {},
  stroke: {
    width: 0
  },
  xaxis: {},
  yaxis: {},
  colors: [],
  annotations: {},
  grid: {},
  tooltip: {},
  subtitle: {},
  fill: {},
  markers: {},
  states: {},
  theme: {}
}

//=============================================================================

export class ChartLib {

  //-------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------

  public buildLineOptions(overrides: Partial<ChartOptions> = {}) : ChartOptions {
    return deepmerge(defaultLineOptions, overrides);
  }

  //-------------------------------------------------------------------------

  public buildBarOptions(overrides: Partial<ChartOptions> = {}) : ChartOptions {
    return deepmerge(defaultBarOptions, overrides);
  }

  //-------------------------------------------------------------------------

  public buildDonutOptions(overrides: Partial<ChartOptions> = {}) : ChartOptions {
    return deepmerge(defaultDonutOptions, overrides);
  }

  //-------------------------------------------------------------------------

  public buildDataset(name: string, times : any[], values : number[], isDrawdown? : boolean, color? : string) : any {
    let data : any[] = values.map( (e, i) => {
      return {
        x : times[i] ,
        y : e
      }
    })

    let res = {
      name: name,
      data: data,
      type: "line",
      color: color,
    }

    if (isDrawdown) {
      res.type = "area"
      res.color= "#FF565A"
    }

    return res
  }

  //-------------------------------------------------------------------------

  public buildHeathmapPlotOptions(mm : MinMax) : ApexPlotOptions {
    let threshold = Math.max(Math.abs(mm.minVal), Math.abs(mm.maxVal))

    return {
      heatmap: {
        enableShades: false,
        colorScale: {
          min: -threshold,
          max: +threshold,
          ranges: [
            {
              from: -threshold*4/4,
              to:   -threshold*3/4,
              color: '#FF1010',
              name: 'very negative',
            },
            {
              from: -threshold*3/4,
              to:   -threshold*2/4,
              color: '#E03030',
              name: 'very negative',
            },
            {
              from: -threshold*2/4,
              to:   -threshold*1/4,
              color: '#D06060',
              name: 'very negative',
            },
            {
              from: -threshold*1/4,
              to: -0.0000001,
              color: '#B08080',
              name: 'negative',
            },
            {
              from: 0,
              to: 0,
              color: '#808080',
              name: 'zero',
            },
            {
              from: 0.000001,
              to: threshold*1/4,
              color: '#80B080',
              name: 'positive',
            },
            {
              from: threshold*1/4,
              to:   threshold*2/4,
              color: '#60D060',
              name: 'very positive',
            },
            {
              from: threshold*2/4,
              to:   threshold*3/4,
              color: '#30E030',
              name: 'very positive',
            },
            {
              from: threshold*3/4,
              to:   threshold*4/4,
              color: '#10FF10',
              name: 'very positive',
            }
          ]
        }
      }
    }
  }
}

//=============================================================================
