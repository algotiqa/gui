//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute, Router} from '@angular/router';
import {BroadcastEvent, BroadcastService, EventType} from "../../service/broadcast.service";
import {ModuleTitlePanel} from "../../component/panel/module-title/module-title.panel";
import {PortfolioService} from "../../service/portfolio.service";
import {Allocation, CorrelationMatrix} from "../../model/allocation";
import {LabelService} from "../../service/label.service";
import {EventBusService} from "../../service/eventbus.service";
import {AbstractPanel} from "../../component/abstract.panel";
import {NgApexchartsModule} from "ng-apexcharts";

//=============================================================================

@Component({
  selector   : 'correlation-matrix',
  templateUrl: './correlation-matrix.component.html',
  styleUrl   : './correlation-matrix.component.scss',
  imports: [MatToolbarModule, MatButtonModule, ModuleTitlePanel, NgApexchartsModule],
  standalone : true
})

//=============================================================================

export class CorrelationMatrixPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  ae           : Allocation = new Allocation()
  chartOptions : any

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private route            : ActivatedRoute,
              private portfolioService : PortfolioService,
              private broadcastService : BroadcastService) {

    super(eventBusService, labelService, router, "module.allocationCorrelation");

    //TODO: Close module when allocation is deleted
    // broadcastService.onEvent((e : BroadcastEvent)=>{
      // if (e.type == EventType.TradingsSystem_Deleted && e.id == this.tsId) {
      //   window.close()
      // }
    // })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    let id = Number(this.route.snapshot.paramMap.get("id"));

    this.portfolioService.getAllocation(id).subscribe(
      result => {
        this.ae = result

        this.buildChart()
      }
    )
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onCloseClick() {
    window.close()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private buildChart() : void {
    let cm = this.ae.corrMatrix;

    if (cm == undefined || cm.names.length == 0) {
      return
    }

    let count    = cm.names.length;
    let cellSize = 60;

    this.chartOptions = {
      chart: {
        type                : "heatmap",
        width               : count * cellSize + 150,
        height              : count * cellSize + 130,
        toolbar             : { show: false },
        animations          : { enabled: false },
        redrawOnParentResize: false,
      },

      series: this.buildSeries(cm),

      plotOptions: {
        heatmap: {
          enableShades: false,
          radius      : 0,
          colorScale: {
            ranges: [
              { from:  0.9999, to: 1,      color: "#808080", name: "diagonal"   },
              { from: -1,      to: 0.3,    color: "#66BB6A", name: "low"        },
              { from:  0.3,    to: 0.5,    color: "#C0CA33", name: "acceptable" },
              { from:  0.5,    to: 0.7,    color: "#FFB300", name: "moderate"   },
              { from:  0.7,    to: 0.9999, color: "#D32F2F", name: "high"       },
            ]
          }
        }
      },

      dataLabels: {
        enabled  : true,
        formatter: (value : any) => {
          return value == null ? "" : Number(value).toFixed(2)
        },
        style: {
          fontSize: "10px",
        },
      },

      xaxis: {
        categories: cm.names,
        labels: {
          rotate                : -90,
          trim                  : false,
          hideOverlappingLabels : false,
          style                 : { fontSize: "11px" },
        },
        tooltip: { enabled: false },
      },

      legend: { show: false },
    }
  }

  //-------------------------------------------------------------------------

  private buildSeries(cm : CorrelationMatrix) : any[] {
    let series : any[] = []

    for (let row = 0; row < cm.names.length; row++) {
      let data : any[] = []

      for (let col = 0; col < row; col++) {
        data.push({ x: cm.names[col], y: null })
      }

      for (let col = row; col < cm.names.length; col++) {   //--- Upper-right triangle
        data.push({ x: cm.names[col], y: cm.cells[row][col] })
      }

      series = [ { name: cm.names[row], data: data }, ...series ]
    }

    return series
  }
}

//=============================================================================
