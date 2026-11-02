//=============================================================================
//===
//=== Copyright (C) 2023-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, ViewChild, ChangeDetectionStrategy} from '@angular/core';

import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../service/label.service";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {
  Portfolio, TradingSystemSmall,
} from "../../../../../../model/model";
import {
  FilterAnalysisRequest,
  FilterAnalysisResponse, FilterRun, Activation, Summary,
  TradingFilter, Outcomes, Config, EquityVsAverageConfig,
} from "../../../../../../model/filtering";
import {MatTabsModule} from "@angular/material/tabs";
import {MatButtonModule} from "@angular/material/button";
import {Lib} from "../../../../../../lib/lib";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {PortfolioService} from "../../../../../../service/portfolio.service";
import {MatGridListModule} from "@angular/material/grid-list";
import {FlexTablePanel} from "../../../../../../component/panel/flex-table/flex-table.panel";
import {FlexTableColumn} from "../../../../../../model/flex-table";
import {SimpleTablePanel} from "../../../../../../component/panel/simple-table/simple-table.panel";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {OptimizeProgressDialog} from "./optimize/progress/progress.dialog";
import {OptimizeResultDialog} from "./optimize/result/result.dialog";
import {OptimizeParameterDialog} from "./optimize/parameter/parameter.dialog";
import {ApexDataLabels, ApexMarkers, ChartComponent} from "ng-apexcharts";
import {DialogData} from "./optimize/dialog-data";
import {MatCardModule} from "@angular/material/card";
import {ChartOptions} from "../../../../../../lib/chart-lib";
import {InputNumber} from "../../../../../../component/form/input-number/input-number";
import {PeriodSelector, PeriodSelectorInfo} from "../../../../../../component/form/period-selector/period-selector";
import {ListButtons, ListContent, ListLeft, ListPanel} from "../../../../../../component/panel/list-panel/list-panel";
import {BackButton} from "../../../../../../component/button/back/back.button";
import {SaveButton} from "../../../../../../component/button/save/save.button";
import {ReloadButton} from "../../../../../../component/button/reload/reload.button";
import {RunButton} from "../../../../../../component/button/run/run.button";
import {OptimizeButton} from "../../../../../../component/button/optimize/optimize.button";
import {NavigationService} from "../../../../../../service/navigation.service";
import {NetReturnCard} from "./criteria/net-return/net-return.card";
import {EquityVsAverageCard} from "./criteria/equity-vs-average/equity-vs-average.card";
import {MaxDrawdownCard} from "./criteria/max-drawdown/max-drawdown.card";
import {WinningPercentageCard} from "./criteria/winning-percentage/winning-percentage.card";
import {TrendLineCard} from "./criteria/trendline/trendline.card";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {SelectRequired} from "../../../../../../component/form/select-required/select-required";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatCheckbox} from "@angular/material/checkbox";
import {ToggleButton} from "../../../../../../component/form/toggle-button/toggle-button";

//=============================================================================

@Component({
    selector: 'trading-system-filtering',
    templateUrl: './filtering.panel.html',
    styleUrls: ['./filtering.panel.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterModule, MatExpansionModule, MatIconModule, MatFormFieldModule, FormsModule, MatInputModule, MatOptionModule, MatSelectModule, MatSlideToggleModule, MatTabsModule, MatButtonModule, MatDividerModule, MatGridListModule, SimpleTablePanel, MatDialogModule, ChartComponent, MatCardModule, PeriodSelector, ListButtons, ListContent, ListPanel, ListLeft, BackButton, SaveButton, ReloadButton, RunButton, OptimizeButton, NetReturnCard, EquityVsAverageCard, MaxDrawdownCard, WinningPercentageCard, TrendLineCard, MatButtonToggle, MatButtonToggleGroup, ReactiveFormsModule, SelectRequired, MatMenu, MatCheckbox, MatMenuTrigger, ToggleButton]
})

//=============================================================================

export class FilteringPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  period : PeriodSelectorInfo = new PeriodSelectorInfo()

  filter       = new TradingFilter()
  tradingSystem= new TradingSystemSmall()

  summaryColumns: FlexTableColumn[] = [];
  summaryData   : SummaryRow[]      = []

  combinationModes : Object = {}
  selView = new FormControl("a")

  equityChartOptions : ChartOptions
  activChartOptions  : ChartOptions
  showMarkers : boolean = false

  portName? = ""
  portTime? = ""

  //-------------------------------------------------------------------------

  private tsId : number = 0;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private route            : ActivatedRoute,
              private snackBar         : MatSnackBar,
              private portfolioService : PortfolioService,
              private navigationService: NavigationService,
              public  dialog           : MatDialog) {

    super(eventBusService, labelService, router, "portfolio.filtering");
    this.navigationService.push()

    let ts = this.labelService.getLabel("page.portfolio.filtering.summ");

    this.summaryColumns = [
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "unfiltered"),
      new FlexTableColumn(ts, "filtered")
    ]

    this.equityChartOptions = this.buildEquityChartOptions    (this.loc("equities"), this.onChartClick)
    this.activChartOptions  = this.buildActivationChartOptions(this.loc("activation"))
    this.period.daysBack = 0
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.tsId             = Number(this.route.snapshot.paramMap.get("id"));
    this.combinationModes = this.labelService.getLabel("map.filterCombinationMode")
  }

  //-------------------------------------------------------------------------
  //---
  //--- Event methods
  //---
  //-------------------------------------------------------------------------

  onPeriodChange(period : PeriodSelectorInfo) {
    console.log("On period change")
    this.callService()
  }

  //-------------------------------------------------------------------------

  onCriterionChange(config : { enabled : boolean }, checked : boolean) {
    config.enabled = checked
  }

  //-------------------------------------------------------------------------

  onRunClick() {
    this.callService(this.filter)
  }

  //-------------------------------------------------------------------------

  onOptimizeClick() {
    this.portfolioService.getFilterOptimizationInfo(this.tsId).subscribe(
      result => {
        if (result.status == "idle") {
          this.openParametersDialog()
        }
        else if (result.status == "running"){
          this.openProgressDialog()
        }
        else {
          this.openResultDialog()
        }
      }
    )
  }

  //-------------------------------------------------------------------------

  onSaveClick() {
    this.portfolioService.setTradingFilters(this.tsId, this.filter).subscribe(
      result => {
        this.snackBar.open(this.loc("filterSaved"), undefined, { duration: 3000 })
      }
    )
  }

  //-------------------------------------------------------------------------

  onReloadClick() {
    this.callService()
  }

  //-------------------------------------------------------------------------

  onChartClick = (e: any, chart?: any, options?: any) => {
    // if (this.analysis.equities.time.length > 0) {
      // this.selectedPeriod     = -1
      // this.startDate          = this.analysis.equities.time[options.dataPointIndex]
      // this.startDateDisplayed = this.startDate.substring(0,10)
      // this.setAnnotationDate(new Date(this.startDate))
    // }
  }

  //-------------------------------------------------------------------------

  onMarkersChange() {
    if (this.showMarkers) {
      this.activChartOptions.markers = <ApexMarkers>{
        size: 3,
        hover: {
          size: 5,
        }
      }
    }
    else {
      this.activChartOptions.markers = {}
    }
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private buildEquityChartOptions(title : string, clickFunction: any) : ChartOptions {
    return Lib.chart.buildLineOptions({
      chart: {
        height: 500,
        events: {
          click: clickFunction,
        }
      },

      stroke: {
        dashArray: [ 0, 0, 0, 0, 4, 4]
      },

      title: {
        text: title
      },
    })
  }

  //-------------------------------------------------------------------------

  private buildActivationChartOptions(title : string) : ChartOptions {
    return Lib.chart.buildLineOptions({
      chart: {
        height: 300,
        id: "activ",
      },

      title: {
        text: title
      },
      yaxis: {
        min: 0,
        max: 9,
        tickAmount: 9,
      },
    })
  }

  //-------------------------------------------------------------------------

  private callService(filter? : TradingFilter) {
    console.log("Calling service")
    let req = new FilterAnalysisRequest()
    req.filter = filter
    req.period = this.period.getSelectedPeriod()

    this.portfolioService.runFilterAnalysis(this.tsId, req).subscribe(
      result => {
        this.filter         = result.filter;
        this.tradingSystem  = result.tradingSystem;
        this.summaryData    = this.buildSummary(result.summary)
        //outcomes
        this.createEquityChart(result);
        this.createActivationChart(result);
        this.setupPortfolioInfo(result.portfolio)
      }
    )
  }

  //-------------------------------------------------------------------------

  // private findDateFromDays(daysBack : number) : Date {
  //   let now   = new Date().getTime()
  //   let delta = daysBack * 24 * 3600 * 1000
  //   let past    = new Date(now-delta)
  //
  //   return new Date(past)
  // }

  //-------------------------------------------------------------------------

  // private setAnnotationDate(d : Date|undefined) {
  //   let date = undefined
  //   let text = ""
  //
  //   if (d != undefined) {
  //     date = d.getTime()
  //     text = d.toISOString().substring(0, 10)
  //   }
  //
  //   this.equityChartOptions.annotations = {
  //     xaxis: [
  //       {
  //         x: date,
  //         borderColor: '#775DD0',
  //         label: {
  //           style: {
  //             color: '#000000',
  //           },
  //           text: text
  //         }
  //       }
  //     ]
  //   }
  // }

  //-------------------------------------------------------------------------

  private buildSummary(s : Summary) : SummaryRow[] {
    return [
      new SummaryRow(this.loc("summ.netProfit"),    String(s.unfProfit),       String(s.filProfit)),
      new SummaryRow(this.loc("summ.maxDrawdown"),  String(s.unfMaxDrawdown),  String(s.filMaxDrawdown)),
      new SummaryRow(this.loc("summ.winningPerc"),  s.unfWinningPerc+ " %", s.filWinningPerc +" %"),
      new SummaryRow(this.loc("summ.averageTrade"), String(s.unfAverageTrade), String(s.filAverageTrade))
    ]
  }

  //-------------------------------------------------------------------------

  private createEquityChart(res: FilterAnalysisResponse) {
    let e = res.equities

      let datasets = [
        Lib.chart.buildDataset(this.loc("chart.unfEquity"),   e.time, e.unfilteredEquity),
        Lib.chart.buildDataset(this.loc("chart.filEquity"),   e.time, e.filteredEquity),
        Lib.chart.buildDataset(this.loc("chart.unfDrawdown"), e.time, e.unfilteredDrawdown, true),
        Lib.chart.buildDataset(this.loc("chart.filDrawdown"), e.time, e.filteredDrawdown, true),
      ]

      //--- Moving average

      let avg = this.findAverage(res.outcomes.activations, res.filter.activation.equityVsAverage, true)
      if (avg) {
        datasets = [...datasets, Lib.chart.buildDataset(this.loc("chart.averageAct"), e.time, avg, false, "#808080") ]
      }

      avg = this.findAverage(res.outcomes.deactivations, res.filter.deactivation.equityVsAverage, false)
      if (avg) {
        datasets = [...datasets, Lib.chart.buildDataset(this.loc("chart.averageDeact"), e.time, avg, false, "#808080") ]
      }

      this.equityChartOptions.series = datasets
  }

  //-------------------------------------------------------------------------

  private findAverage(list : Activation[], c : EquityVsAverageConfig, activ : boolean) : number[]|undefined {
    if (list) {
      let a = list.find( a => a.name == "equityVsAverage")
      if (a) {
        let avg = a.metrics
        let val = c.value

        if (!activ) {
          val *= -1
        }

        let res : number[] = []
        avg.forEach(v => { res.push(v + val) })

        return res
      }
    }

    return undefined
  }

  //-------------------------------------------------------------------------

  private createActivationChart(res: FilterAnalysisResponse) {
    let datasets: any[] = [
    ];

    //--- Average activation

    let factor   = 0
    let time     = res.equities.time
    let outcomes = res.outcomes

    if (outcomes.deactivations) {
      let ds = this.addActivationDataset(time, outcomes.combinedDeact, "chart.combinedDeact", factor)
      datasets = [...datasets, ds];
      factor += 2
    }

    if (outcomes.activations) {
      let ds = this.addActivationDataset(time, outcomes.combinedActiv, "chart.combinedActiv", factor)
      datasets = [...datasets, ds];
      factor += 2
    }

    let ds = this.addActivationDataset(time, outcomes.combinedFinal, "chart.combinedFinal", factor)
    datasets = [...datasets, ds];
    factor += 2

    ds = this.addActivationDataset(time, outcomes.sampledFinal, "chart.sampledFinal", factor)
    datasets = [...datasets, ds];
    factor += 2

    //-- Final activation

    if (outcomes.finalActivation) {
      let fa = outcomes.finalActivation
      ds = this.addActivationDataset(fa.times, fa.flags, "chart.finalActivation", factor)
      datasets = [...datasets, ds];
    }

    this.activChartOptions.series = datasets;
    this.onMarkersChange()
  }

  //-------------------------------------------------------------------------

  private addActivationDataset(time:Date[], values:number[], label : string, factor : number) : any {
    for (let i=0; i<values.length; i++) {
      values[i] += factor
    }

    return Lib.chart.buildDataset(this.loc(label), time, values);
  }

  //-------------------------------------------------------------------------

  private setupPortfolioInfo(p : Portfolio) {
    let plural = (p.runPeriod != 1) ? "s" : ""
    let every  = this.loc("every")
    let period = this.loc(p.periodType + plural)

    this.portName = p.name
    this.portTime = every +" "+ p.runPeriod +" "+ period
  }

  //-------------------------------------------------------------------------

  private openParametersDialog() {
    const dialogRef = this.dialog.open(OptimizeParameterDialog, {
      minWidth : "1280px",
      data: <DialogData>{
        tsId     : this.tradingSystem.id,
        tsName   : this.tradingSystem.name,
        // startDate: this.startDate,
        baseline : this.filter
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openProgressDialog()
      }
    })
  }

  //-------------------------------------------------------------------------

  private openProgressDialog() {
    const dialogRef = this.dialog.open(OptimizeProgressDialog, {
      minWidth: "1024px",
      data: {
        tsId  : this.tradingSystem.id,
        tsName: this.tradingSystem.name
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openResultDialog()
      }
    })
  }

  //-------------------------------------------------------------------------

  private openResultDialog() {
    const dialogRef = this.dialog.open(OptimizeResultDialog, {
      minWidth: "1600px",
      data: {
        tsId    : this.tradingSystem.id,
        tsName  : this.tradingSystem.name,
        baseline: this.filter
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let run : FilterRun = result["run"]
        if (run != null) {
          console.log("Got run to use: ")
          this.filter = run.filter
          this.onRunClick()
        }
        else {
          this.openParametersDialog()
        }
      }
    })
  }
}

//=============================================================================

class SummaryRow {
  name?       : string
  unfiltered? : string
  filtered?   : string

  constructor(name:string, unfiltered:string, filtered:string) {
    this.name       = name
    this.unfiltered = unfiltered
    this.filtered   = filtered
  }
}

//=============================================================================
