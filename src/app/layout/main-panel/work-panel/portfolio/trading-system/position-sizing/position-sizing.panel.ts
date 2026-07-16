//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, ViewChild} from '@angular/core';

import {MatInputModule}       from "@angular/material/input";
import {MatCardModule}        from "@angular/material/card";
import {MatIconModule}        from "@angular/material/icon";
import {MatButtonModule}      from "@angular/material/button";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ListButtons, ListContent, ListLeft, ListPanel} from "../../../../../../component/panel/list-panel/list-panel";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../service/label.service";
import {NavigationService} from "../../../../../../service/navigation.service";
import {BackButton} from "../../../../../../component/button/back/back.button";
import {OptimizeButton} from "../../../../../../component/button/optimize/optimize.button";
import {PeriodSelector, PeriodSelectorInfo} from "../../../../../../component/form/period-selector/period-selector";
import {ReloadButton} from "../../../../../../component/button/reload/reload.button";
import {RunButton} from "../../../../../../component/button/run/run.button";
import {SaveButton} from "../../../../../../component/button/save/save.button";
import {InputNumber} from "../../../../../../component/form/input-number/input-number";
import {PortfolioService} from "../../../../../../service/portfolio.service";
import {
  ExecutionResult,
  Model, PositionAnalysisRequest, PositionAnalysisResponse, PositionParameters, TradingPosition
} from "../../../../../../model/position-sizing";
import {SelectRequired} from "../../../../../../component/form/select-required/select-required";
import {ParamSpec} from "../../../../../../model/model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {
  ApexAnnotations,
  ApexTitleSubtitle,
  ApexXAxis,
  ChartComponent,
  YAxisAnnotations
} from "ng-apexcharts";
import {ChartOptions} from "../../../../../../lib/chart-lib";
import {Lib} from "../../../../../../lib/lib";
import {FlexTablePanel} from "../../../../../../component/panel/flex-table/flex-table.panel";
import {SimpleTablePanel} from "../../../../../../component/panel/simple-table/simple-table.panel";
import {FlexTableColumn} from "../../../../../../model/flex-table";
import {OptimizeParameterDialog} from "./optimize/parameter/parameter.dialog";
import {OptimizeProgressDialog}  from "./optimize/progress/progress.dialog";
import {OptimizeResultDialog}    from "./optimize/result/result.dialog";
import {DialogData} from "./optimize/dialog-data";

//=============================================================================

@Component({
  selector: 'position-sizing',
  templateUrl: './position-sizing.panel.html',
  styleUrls: [ './position-sizing.panel.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, ListPanel, ListButtons,
    ListContent, BackButton, OptimizeButton, PeriodSelector, ReloadButton, RunButton, SaveButton, ListLeft,
    InputNumber, SelectRequired, MatButtonToggle, MatButtonToggleGroup, ReactiveFormsModule, ChartComponent, SimpleTablePanel]
})

//=============================================================================

export class PositionSizingPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  tsId      : number = 0
  period    : PeriodSelectorInfo = new PeriodSelectorInfo()
  params    : PositionParameters = new PositionParameters()
  curModel  : Model = new Model()
  selModel  : Model = new Model()
  paramSpecs: {[name:string]:ParamSpec} = {}
  modelSpecs: {[name:string]:ParamSpec} = {}

  positionModels         : Object = {}
  positionRiskPerUnits   : Object = {}
  positionMoneyConversion: Object = {}

  par : PositionAnalysisResponse = new PositionAnalysisResponse()

  profitType = new FormControl("net")
  chartType  = new FormControl("equity")
  axisType   = new FormControl("time")

  chartEquity  : ChartOptions;
  chartDrawdown: ChartOptions;
  chartPosition: ChartOptions;

  summaryColumns: FlexTableColumn[] = [];
  summaryData   : SummaryRow[]      = []

  @ViewChild("inInitCap")    inInitCapComp?   : InputNumber
  @ViewChild("inMaxTolDDP")  inMaxxDDPerComp? : InputNumber
  @ViewChild("inMargOver")   inMargOverComp?  : InputNumber
  @ViewChild("inMaxUnits")   inMaxUnitsComp?  : InputNumber
  @ViewChild("srRiskPerU")   srRiskPerU?      : SelectRequired
  @ViewChild("inRiskVal")    inRiskValComp?   : InputNumber

  @ViewChild("inUnits")      inUnits?         : InputNumber
  @ViewChild("inRiskPerTr")  inRiskPerTr?     : InputNumber
  @ViewChild("inAvgLen")     inAvgLenComp?    : InputNumber
  @ViewChild("inMaxVol")     inMaxVolComp?    : InputNumber
  @ViewChild("inRiskOnCap")  inRiskOnCapComp? : InputNumber
  @ViewChild("inRiskOnEar")  inRiskOnEarComp? : InputNumber
  @ViewChild("srMonConv")    srMoneyConv?     : SelectRequired
  @ViewChild("inPercOnCap")  inPercOnCapComp? : InputNumber

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService              : EventBusService,
              labelService                 : LabelService,
              router                       : Router,
              private snackBar             : MatSnackBar,
              private route                : ActivatedRoute,
              private portfolioService     : PortfolioService,
              private navigationService    : NavigationService,
              public  dialog               : MatDialog
  ) {

    super(eventBusService, labelService, router, "portfolio.positionSizing");
    this.navigationService.push()
    this.setupSummaryColumns()

    this.period.daysBack = 0
    this.chartEquity     = this.buildEquityChartOptions()
    this.chartDrawdown   = this.buildDrawdownChartOptions()
    this.chartPosition   = this.buildPositionChartOptions()
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.tsId = Number(this.route.snapshot.paramMap.get("id"));
    this.positionModels         = this.labelService.getLabel("map.positionModel")
    this.positionRiskPerUnits   = this.labelService.getLabel("map.positionRiskPerUnit")
    this.positionMoneyConversion= this.labelService.getLabel("map.positionMoneyConversion")

    this.callService(this.buildDefaultRequest())
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public
  //---
  //-------------------------------------------------------------------------

  curName() : any {
    // @ts-ignore
    return this.positionModels[this.curModel.name]
  }

  //-------------------------------------------------------------------------

  curMoneyConversion() : any {
    // @ts-ignore
    return this.positionMoneyConversion[this.curModel.config['moneyConversion']]
  }

  //-------------------------------------------------------------------------
  //--- Param spec
  //-------------------------------------------------------------------------

  minP(name:string) : number {
    return this.paramSpecs[name]?.minValue
  }

  //-------------------------------------------------------------------------

  maxP(name:string) : number {
    return this.paramSpecs[name]?.maxValue
  }

  //-------------------------------------------------------------------------

  optP(name:string) : boolean {
    return !this.paramSpecs[name]?.required
  }

  //-------------------------------------------------------------------------
  //--- Model spec
  //-------------------------------------------------------------------------

  minM(name:string) : number {
    return this.modelSpecs[name]?.minValue
  }

  //-------------------------------------------------------------------------

  maxM(name:string) : number {
    return this.modelSpecs[name]?.maxValue
  }

  //-------------------------------------------------------------------------

  optM(name:string) : boolean {
    return !this.modelSpecs[name]?.required
  }

  //-------------------------------------------------------------------------
  //---
  //--- Validation
  //---
  //-------------------------------------------------------------------------

  public runEnabled() : boolean {
    let paramValid =
      this.inInitCapComp  ?.isValid() !== false &&
      this.inMaxxDDPerComp?.isValid() !== false &&
      this.inMargOverComp ?.isValid() !== false &&
      this.inMaxUnitsComp ?.isValid() !== false &&
      this.srRiskPerU     ?.isValid() !== false

    if (!paramValid) return false

    if (this.params.riskPerUnit == "") {
      if (! (this.inRiskValComp?.isValid() !== false)) {
        return false
      }
    }

    switch (this.selModel.name) {
      case "FU":
        return this.inUnits?.isValid() !== false
      case "PR":
        return this.inRiskPerTr?.isValid() !== false
      case "PV":
        return this.inAvgLenComp?.isValid() !== false &&
               this.inMaxVolComp?.isValid() !== false
      case "MM":
        return this.inRiskOnCapComp?.isValid() !== false &&
               this.inRiskOnEarComp?.isValid() !== false &&
               this.srMoneyConv    ?.isValid() !== false &&
               this.inPercOnCapComp?.isValid() !== false
      default:
        return false
    }
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onPeriodChange(period : PeriodSelectorInfo) {
    console.log("On period change")
  }

  //-------------------------------------------------------------------------

  onRunClick() {
    let req = <PositionAnalysisRequest>{
      params : this.params,
      model  : this.selModel,
      period : this.period.getSelectedPeriod()
    }

    this.callService(req)
  }

  //-------------------------------------------------------------------------

  onOptimizeClick() {
    this.portfolioService.getPositionOptimizationInfo(this.tsId).subscribe(
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
    let req = <TradingPosition>{
      params : this.params,
      model  : this.selModel,
    }

    this.portfolioService.setTradingPosition(this.tsId, req).subscribe(
      result => {
        this.curModel = structuredClone(this.selModel)
        this.snackBar.open(this.loc("positionSaved"), undefined, { duration: 3000 })
      }
    )
  }

  //-------------------------------------------------------------------------

  onReloadClick() {
    this.callService(this.buildDefaultRequest())
  }

  //-------------------------------------------------------------------------

  onProfitTypeChange() {
    this.rebuildChart()
  }

  //-------------------------------------------------------------------------

  onChartTypeChange() {
    this.rebuildChart()
  }

  //-------------------------------------------------------------------------

  onAxisTypeChange() {
    this.rebuildChart()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private buildEquityChartOptions() : ChartOptions {
    return Lib.chart.buildLineOptions({
    })
  }

  //-------------------------------------------------------------------------

  private buildDrawdownChartOptions() : ChartOptions {
    return Lib.chart.buildLineOptions({
    })
  }

  //-------------------------------------------------------------------------

  private buildPositionChartOptions() : ChartOptions {
    return Lib.chart.buildLineOptions({
    })
  }

  //-------------------------------------------------------------------------

  private buildDefaultRequest() : PositionAnalysisRequest {
    let req = new PositionAnalysisRequest();
    req.period = this.period.getSelectedPeriod()

    return req
  }

  //-------------------------------------------------------------------------

  private callService(req : PositionAnalysisRequest) {
    console.log("Calling service")
    this.portfolioService.runPositionAnalysis(this.tsId, req).subscribe(
      res => {
        this.par      = res
        this.params   = res.params
        this.curModel = res.current.model

        if (res.paramSpecs) {
          this.paramSpecs = res.paramSpecs
          this.modelSpecs = res.modelSpecs
          this.setupModelDefaults()
        }

        if (res.noLosses) {
          this.snackBar.open(this.loc("noLosses"), undefined, { duration: 3000 })
        }

        this.rebuildChart()
        this.summaryData = this.buildSummary()
      }
    )
  }

  //-------------------------------------------------------------------------

  private setupModelDefaults() {
    for (let key in this.modelSpecs) {
      if (this.selModel.config[key] == undefined) {
        this.selModel.config[key] = this.modelSpecs[key].defValue
      }
    }
  }

  //-------------------------------------------------------------------------

  private rebuildChart() {
    this.rebuildEquityChart()
    this.rebuildDrawdownChart()
    this.rebuildPositionChart()
  }

  //-------------------------------------------------------------------------

  private rebuildEquityChart() {
    let datasets : any[] = []
    let xAxis = this.getXAxis(this.par.time)

    if (this.profitType.value == "gross") {
      this.chartEquity.title = this.getTitle("grossEquity")

      datasets.push(Lib.chart.buildDataset(this.loc("baselineChart"), xAxis, this.par.baseline.gross.equity, false, "#808080"))
      datasets.push(Lib.chart.buildDataset(this.loc("currentChart"),  xAxis, this.par.current .gross.equity, false, "#008FFB"))

      if (this.par.selected) {
        datasets.push(Lib.chart.buildDataset(this.loc("selectedChart"), xAxis, this.par.selected.gross.equity, false, "#20A020"))
      }
    }
    else {
      this.chartEquity.title = this.getTitle("netEquity")

      datasets.push(Lib.chart.buildDataset(this.loc("baselineChart"), xAxis, this.par.baseline.net.equity, false, "#808080"))
      datasets.push(Lib.chart.buildDataset(this.loc("currentChart"),  xAxis, this.par.current .net.equity, false, "#008FFB"))

      if (this.par.selected) {
        datasets.push(Lib.chart.buildDataset(this.loc("selectedChart"), xAxis, this.par.selected.net.equity, false, "#20A020"))
      }
    }

    this.chartEquity.series = datasets
    this.chartEquity.annotations = this.rebuildEquityAnnotations()
    this.updateChartType(this.chartEquity)
  }

  //-------------------------------------------------------------------------

  private rebuildDrawdownChart() {
    let datasets : any[] = []
    let xAxis = this.par.time

    if (this.profitType.value == "gross") {
      this.chartDrawdown.title = this.getTitle("grossDrawdown")

      datasets.push(Lib.chart.buildDataset(this.loc("baselineChart"), xAxis, this.par.baseline.gross.drawdownPerc, false, "#808080"))
      datasets.push(Lib.chart.buildDataset(this.loc("currentChart"),  xAxis, this.par.current .gross.drawdownPerc, false, "#008FFB"))

      if (this.par.selected) {
        datasets.push(Lib.chart.buildDataset(this.loc("selectedChart"), xAxis, this.par.selected.gross.drawdownPerc, true))
      }
    }
    else {
      this.chartDrawdown.title = this.getTitle("netDrawdown")

      datasets.push(Lib.chart.buildDataset(this.loc("baselineChart"),  xAxis, this.par.baseline.net.drawdownPerc, false, "#808080"))
      datasets.push(Lib.chart.buildDataset(this.loc("currentChart"),   xAxis, this.par.current .net.drawdownPerc, false, "#008FFB"))

      if (this.par.selected) {
        datasets.push(Lib.chart.buildDataset(this.loc("selectedChart"), xAxis, this.par.selected.net.drawdownPerc, false, "#20A020"))
      }
    }

    this.chartDrawdown.series = datasets
    this.chartDrawdown.annotations = this.rebuildDrawdownAnnotations()
    this.updateChartType(this.chartDrawdown)
  }

  //-------------------------------------------------------------------------

  private rebuildPositionChart() {
    let datasets : any[] = []
    let xAxis = this.getXAxis(this.par.time)

    if (this.profitType.value == "gross") {
      this.chartPosition.title = this.getTitle("grossPosition")

      datasets.push(Lib.chart.buildDataset(this.loc("baselineChart"), xAxis, this.par.baseline.gross.positions, false, "#808080"))
      datasets.push(Lib.chart.buildDataset(this.loc("currentChart"),  xAxis, this.par.current .gross.positions, false, "#008FFB"))

      if (this.par.selected) {
        datasets.push(Lib.chart.buildDataset(this.loc("selectedChart"), xAxis, this.par.selected.gross.positions, false, "#20A020"))
      }
    }
    else {
      this.chartPosition.title = this.getTitle("netPosition")

      datasets.push(Lib.chart.buildDataset(this.loc("baselineChart"), xAxis, this.par.baseline.net.positions, false, "#808080"))
      datasets.push(Lib.chart.buildDataset(this.loc("currentChart"),  xAxis, this.par.current .net.positions, false, "#008FFB"))

      if (this.par.selected) {
        datasets.push(Lib.chart.buildDataset(this.loc("selectedChart"), xAxis, this.par.selected.net.positions, false, "#20A020"))
      }
    }

    this.chartPosition.series      = datasets
    this.chartPosition.annotations = this.rebuildPositionAnnotations()
    this.updateChartType(this.chartPosition)
  }

  //-------------------------------------------------------------------------

  private getTitle(key : string) : ApexTitleSubtitle {
    return {
      text: this.loc(key)
    }
  }

  //-------------------------------------------------------------------------

  private updateChartType(chart : ChartOptions) {
    if (this.axisType.value == "number") {
      chart.xaxis = <ApexXAxis>{
        type:"numeric",
        tickAmount: 20,
        decimalsInFloat: 0,
      }
    }
    else {
      chart.xaxis = <ApexXAxis>{
        type:"datetime",
      }
    }
  }

  //-------------------------------------------------------------------------

  private getXAxis(time : Date[]) : any[] {
    if (this.axisType.value == "time") {
      return time
    }

    let axis : number[] = new Array(time.length)
    for (let i=0; i<axis.length; i++) {
      axis[i] = i+1
    }

    return axis
  }

  //-------------------------------------------------------------------------

  private rebuildEquityAnnotations() : ApexAnnotations {
    return {
      yaxis: [ this.rebuildRuinCapital() ]
    }
  }

  //-------------------------------------------------------------------------

  private rebuildRuinCapital() : YAxisAnnotations {
    return {
      y : this.par.usedMargin,
      y2: 0,
      fillColor: "#C08080",
      opacity: 0.1,
      strokeDashArray: 0,
      borderColor: '#A060A0',
      label: {
        borderColor: '#C07050',
        style: {
          fontSize  : '13px',
          color     : '#fff',
          background: '#F08060',
        },
        text: this.loc("ruinCapital"),
      }
    }
  }

  //-------------------------------------------------------------------------

  private rebuildDrawdownAnnotations() : ApexAnnotations {
    return {
      yaxis: [ this.rebuildMaxDrawdown() ]
    }
  }

  //-------------------------------------------------------------------------

  private rebuildMaxDrawdown() : YAxisAnnotations {
    return {
      y : -this.par.params.maxTolDrawdPerc,
      y2: -1000,
      fillColor: "#C08080",
      opacity: 0.1,
      strokeDashArray: 0,
      borderColor: '#A060A0',
      label: {
        borderColor: '#C07050',
        style: {
          fontSize  : '13px',
          color     : '#fff',
          background: '#F08060',
        },
        text: this.loc("maxTolDD"),
      }
    }
  }

  //-------------------------------------------------------------------------

  private rebuildPositionAnnotations() : ApexAnnotations {
    return {
      yaxis: [ this.rebuildMaxUnits() ]
    }
  }

  //-------------------------------------------------------------------------

  private rebuildMaxUnits() : YAxisAnnotations {
    return {
      y : this.par.params.maxUnits*10,
      y2: this.par.params.maxUnits,
      fillColor: "#808080",
      opacity: 0.1,
      strokeDashArray: 0,
      borderColor: '#806080',
      label: {
        borderColor: '#807080',
        style: {
          fontSize  : '13px',
          color     : '#fff',
          background: '#808080',
        },
        text: this.loc("maxUnits"),
      }
    }
  }

  //-------------------------------------------------------------------------
  //--- Summary
  //-------------------------------------------------------------------------

  private setupSummaryColumns() {
    let ts = this.labelService.getLabel("page.portfolio.positionSizing.summ");

    this.summaryColumns = [
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "baseline"),
      new FlexTableColumn(ts, "current"),
      new FlexTableColumn(ts, "selected")
    ]
  }

  //-------------------------------------------------------------------------

  private buildSummary() : SummaryRow[] {
    let baseline = this.par.baseline .gross
    let current  = this.par.current  .gross
    let selected = this.par.selected?.gross

    if (this.profitType.value == "net") {
      baseline = this.par.baseline .net
      current  = this.par.current  .net
      selected = this.par.selected?.net
    }

    return [
      new SummaryRow(this.loc("summ.return"),          baseline.return          , current.return          , selected?.return),
      new SummaryRow(this.loc("summ.maxDrawdown"),     baseline.maxDrawdown     , current.maxDrawdown     , selected?.maxDrawdown),
      new SummaryRow(this.loc("summ.maxDrawdownPerc"), baseline.maxDrawdownPerc , current.maxDrawdownPerc , selected?.maxDrawdownPerc, "%"),
      new SummaryRow(this.loc("summ.returnDrawdRatio"),baseline.returnDrawdRatio, current.returnDrawdRatio, selected?.returnDrawdRatio),
      new SummaryRow(this.loc("summ.returnOnAccount"), baseline.returnOnAccount , current.returnOnAccount , selected?.returnOnAccount, "%"),
      new SummaryRow(this.loc("summ.ruined"),          this.tf(baseline.ruined) , this.tf(current.ruined) , this.tf(selected?.ruined)),
    ]
  }

    //-------------------------------------------------------------------------

    private tf(value : boolean) : string {
        return value ? "\u{26A0}" : "-"
    }

  //-------------------------------------------------------------------------
  //--- Optimization
  //-------------------------------------------------------------------------

  private openParametersDialog() {
    const dialogRef = this.dialog.open(OptimizeParameterDialog, {
      minWidth : "1280px",
      data: <DialogData>{
        tsId      : this.par.tradingSystem.id,
        tsName    : this.par.tradingSystem.name,
        period    : this.period,
        params    : this.params,
        paramSpecs: this.paramSpecs,
        modelSpecs: this.modelSpecs,
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
        tsId   : this.par.tradingSystem.id,
        tsName : this.par.tradingSystem.name,
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
        tsId    : this.par.tradingSystem.id,
        tsName  : this.par.tradingSystem.name,
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let er : ExecutionResult = result["result"]
        if (er != null) {
          console.log("Got result to use: ")
          let model = new Model()
          model.name   = er.model
          model.config = er.config
          this.selModel = model
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
  name?     : string
  baseline? : any
  current?  : any
  selected? : any

  constructor(name:string, baseline:any, current:any, selected:any, format?:string) {
    this.name     = name
    this.baseline = baseline
    this.current  = current
    this.selected = selected

    if (format == "%") {
      this.baseline += "%"
      this.current  += "%"

      if (this.selected) {
        this.selected += "%"
      }
    }
  }
}

//=============================================================================
