//=============================================================================
//===
//=== Copyright (C) 2022-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component}  from '@angular/core';

import {MatCardModule}      from "@angular/material/card";
import {MatGridListModule}  from "@angular/material/grid-list";
import {MatIconModule}      from "@angular/material/icon";
import {ChartComponent}     from "ng-apexcharts";

import {AbstractPanel}      from "../../../../component/abstract.panel";
import {EventBusService}    from "../../../../service/eventbus.service";
import {LabelService}       from "../../../../service/label.service";
import {SessionService}     from "../../../../service/session.service";
import {PortfolioService}   from "../../../../service/portfolio.service";
import {Router}             from "@angular/router";
import {
  DashboardSummary,
} from "../../../../model/dashboard";
import {Lib} from "../../../../lib/lib";

//=============================================================================

@Component({
	selector    : 'home-panel',
	templateUrl : './home.panel.html',
	styleUrls   : ['./home.panel.scss'],
  imports     : [MatCardModule, MatGridListModule, MatIconModule, ChartComponent]
})

//=============================================================================

export class HomePanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  res   : DashboardSummary | null = null;
  today = '';

  allOptions        : any = {};
  tradingOptions    : any = {};
  topByProfitOptions: any = {};
  marketOptions     : any = {};
  currencyOptions   : any = {};
  topByTradesOptions: any = {};

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(eventBusService    : EventBusService,
              labelService       : LabelService,
              router             : Router,
              public  sessionService   : SessionService,
              private portfolioService : PortfolioService) {
    super(eventBusService, labelService, router, "home");
	}

	//-------------------------------------------------------------------------
	//---
	//--- Init methods
	//---
	//-------------------------------------------------------------------------

  override init = () : void => {
    this.today = new Date().toLocaleDateString();
    this.loadSummary();
  };

	//-------------------------------------------------------------------------
	//---
	//--- Public methods
	//---
	//-------------------------------------------------------------------------

  valueColor(value : number|undefined) : string {
    if (value == undefined || value == 0) {
      return '#000000';
    }
    return (value > 0) ? '#10A010' : '#A01010';
  }

  //-------------------------------------------------------------------------

  formatNumber(value : number|undefined) : string {
    if (value == undefined) {
      return '-';
    }
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  //-------------------------------------------------------------------------
  //---
	//--- Private methods
	//---
	//-------------------------------------------------------------------------

  private loadSummary = () : void => {
    this.portfolioService.getDashboardSummary().subscribe( res => {
      this.res = res;
      this.rebuildCharts(res);
    });
  };

  //-------------------------------------------------------------------------

  private rebuildCharts = (s : DashboardSummary) : void => {
    this.ensureNotNull(s)
    this.allOptions        = this.buildAllOptions(s);
    this.tradingOptions    = this.buildTradingOptions(s);
    this.topByProfitOptions= this.buildTopSystemsByProfitOptions(s);
    this.marketOptions     = this.buildMarketOptions(s);
    this.currencyOptions   = this.buildCurrencyOptions(s);
    this.topByTradesOptions= this.buildTopSystemsByTradesOptions(s);
  };

  //-------------------------------------------------------------------------

  private ensureNotNull(s : DashboardSummary) {
    if (s.byMarket == null) {
      s.byMarket = [];
    }

    if (s.byCurrency == null) {
      s.byCurrency = [];
    }

    if (s.topSystemsByProfit == null) {
      s.topSystemsByProfit = [];
    }

    if (s.topSystemsByTrades == null) {
      s.topSystemsByTrades = [];
    }
  }

  //-------------------------------------------------------------------------

  private buildAllOptions(s : DashboardSummary) : any {
    return Lib.chart.buildDonutOptions({
      //@ts-ignore
      chart: {
        width: 400,
      },
      series: s.allSystems.map(b => b.value),
      labels: s.allSystems.map(b => this.map('mode', b.name)),
      colors: [ '#E0A030', '#6090D0', '#A0A0A0' ],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                showAlways: true,
                show: true,
              },
            },
          },
        },
      },
      legend: {
        width: 100
      }
    })
  }

  //-------------------------------------------------------------------------

  private buildTradingOptions(s : DashboardSummary) : any {
    return Lib.chart.buildDonutOptions({
      //@ts-ignore
      chart: {
        width: 400,
      },
      series: s.byStatus.map(b => b.value),
      labels: s.byStatus.map(b => this.map('status', b.name)),
      colors: [ '#A0A0A0', '#6090D0', '#00B0B0', '#FF8800', '#E0A030' ],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                showAlways: true,
                show: true,
              },
            },
          },
        },
      },
      legend: {
        width: 100
      }
    })
  }

  //-------------------------------------------------------------------------

  private buildTopSystemsByProfitOptions(s : DashboardSummary) : any {
    return {
      series: [{ name: this.loc('netProfit'), data: s.topSystemsByProfit.map(t => ({ x: t.name, y: t.value })) }],
      chart: { type: 'bar', height: 260 },
      plotOptions: { bar: { horizontal: true, barHeight: '70%' } },
      colors: ['#00B0B0'],
      dataLabels: { enabled: false },
      xaxis: { labels: { trim: true } },
      tooltip: { y: { formatter: (v: number) => this.formatNumber(v) } },
      grid: { borderColor: '#E0E0E0' },
    };
  }

  //-------------------------------------------------------------------------

  private buildMarketOptions(s : DashboardSummary) : any {
    return Lib.chart.buildDonutOptions({
      //@ts-ignore
      chart: {
        width: 400,
      },
      series: s.byMarket.map(b => b.value),
      labels: s.byMarket.map(b => this.map('market', b.name)),
      colors: [ '#8060C0', '#00B0B0', '#E0A030', '#6090D0',
                '#505AF8', '#10A010', '#FF8800', '#A01010' ],
      legend: {
        width: 100
      }
    })
  }

  //-------------------------------------------------------------------------

  private buildCurrencyOptions(s : DashboardSummary) : any {
    return {
      series: [{ name: this.loc('netProfit'), data: s.byCurrency.map(b => ({ x: b.name, y: b.value })) }],
      chart: {
        type: 'bar',
        width: 400,
        toolbar: { show: false }
      },
      plotOptions: { bar: { columnWidth: '60%' } },
      colors: ['#505AF8'],
      dataLabels: { enabled: false },
      grid: { borderColor: '#E0E0E0' },
    };
  }

  //-------------------------------------------------------------------------

  private buildTopSystemsByTradesOptions(s : DashboardSummary) : any {
    return {
      series: [{ name: this.loc('trades'), data: s.topSystemsByTrades.map(t => ({ x: t.name, y: t.value })) }],
      chart: { type: 'bar', height: 260 },
      plotOptions: { bar: { horizontal: true, barHeight: '70%' } },
      colors: ['#6090D0'],
      dataLabels: { enabled: false },
      xaxis: { labels: { trim: true } },
      tooltip: { y: { formatter: (v: number) => this.formatNumber(v) } },
      grid: { borderColor: '#E0E0E0' },
    };
  }
}

//=============================================================================
