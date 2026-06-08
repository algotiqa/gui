//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';

import {MatInputModule}       from "@angular/material/input";
import {MatCardModule}        from "@angular/material/card";
import {MatIconModule}        from "@angular/material/icon";
import {MatButtonModule}      from "@angular/material/button";
import {FlexTableColumn, ListResponse, ListService} from "../../../../../model/flex-table";
import {AbstractPanel}        from "../../../../../component/abstract.panel";
import {FlexTablePanel}       from "../../../../../component/panel/flex-table/flex-table.panel";
import {LabelService}         from "../../../../../service/label.service";
import {EventBusService}      from "../../../../../service/eventbus.service";
import {Router, RouterModule} from "@angular/router";
import {Url} from "../../../../../model/urls";
import {AppEvent} from "../../../../../model/event";
import {Observable} from "rxjs";
import {CollectorService} from "../../../../../service/collector.service";
import {BiasAnalysisFull} from "./model";
import {ConnectButton} from "../../../../../component/button/connect/connect.button";
import {CreateButton} from "../../../../../component/button/create/create.button";
import {DisconnectButton} from "../../../../../component/button/disconnect/disconnect.button";
import {EditButton} from "../../../../../component/button/edit/edit.button";
import {ListButtons, ListContent, ListPanel} from "../../../../../component/panel/list-panel/list-panel";
import {ViewButton} from "../../../../../component/button/view/view.button";
import {DeleteButton} from "../../../../../component/button/delete/delete.button";
import {PlaygroundButton} from "../../../../../component/button/playground/playground.button";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogData} from "../../../../../component/form/confirmation-dialog/confirmation.data";
import {ConfirmationDialog} from "../../../../../component/form/confirmation-dialog/confirmation-dialog.component";
import {DeleteResponse} from "../../../../../model/model";

//=============================================================================

@Component({
    selector: 'bias-analysis',
    templateUrl: './bias-analysis.list.html',
    styleUrls: ['./bias-analysis.list.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, FlexTablePanel, ConnectButton, CreateButton, DisconnectButton, EditButton, ListButtons, ListContent, ListPanel, ViewButton, DeleteButton, PlaygroundButton]
})

//=============================================================================

export class BiasAnalisysListPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  columns  : FlexTableColumn[] = [];
  service  : ListService<BiasAnalysisFull>;
  disCreate: boolean = false;
  disView  : boolean = true;
  disEdit  : boolean = true;
  disPlay  : boolean = true;
  disDelete: boolean = true;

  @ViewChild("table") table : FlexTablePanel<BiasAnalysisFull>|null = null;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private dialog          : MatDialog,
              private collectorService: CollectorService) {

    super(eventBusService, labelService, router, "tool.biasAnalysis");

    this.service = this.getBiasAnalyses;

    eventBusService.subscribeToApp(AppEvent.BIASANALYSIS_LIST_RELOAD, () => {
      this.reload()
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  private getBiasAnalyses = (): Observable<ListResponse<BiasAnalysisFull>> => {
    return this.collectorService.getBiasAnalyses(true);
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
  }

  //-------------------------------------------------------------------------

  onRowSelected(selection : BiasAnalysisFull[]) {
    this.updateButtons(selection);
  }

  //-------------------------------------------------------------------------

  onCreateClick() {
    this.openRightPanel(Url.Tool_BiasAnalysis, Url.Right_BiasAnalysis_Create, AppEvent.BIASANALYSIS_CREATE_START);
  }

  //-------------------------------------------------------------------------

  onViewClick() {
    // @ts-ignore
    let selection = this.table.getSelection();
    this.openRightPanel(Url.Tool_BiasAnalysis, Url.Right_BiasAnalysis_View, AppEvent.BIASANALYSIS_VIEW_START, selection[0]);
  }

  //-------------------------------------------------------------------------

  onEditClick() {
    // @ts-ignore
    let selection = this.table.getSelection();
    this.openRightPanel(Url.Tool_BiasAnalysis, Url.Right_BiasAnalysis_Edit, AppEvent.BIASANALYSIS_EDIT_START, selection[0]);
  }

  //-------------------------------------------------------------------------

  onPlaygroundClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    this.navigateTo([ Url.Tool_BiasAnalysis, selection[0].id, Url.Sub_Playground ]);
  }

  //-------------------------------------------------------------------------

  onDeleteClick() {
    let data : ConfirmationDialogData = {
      labels: "deleteBiasAnalysis"
    }

    this.dialog.open(ConfirmationDialog, {data}).afterClosed().subscribe(result => {
      if (!result) {
        return
      }

      // @ts-ignore
      let selection = this.table.getSelection();

      for (let i=0; i<selection.length; i++) {
        let id = selection[i].id
        // @ts-ignore
        this.collectorService.deleteBiasAnalysis(id).subscribe( res => {
          this.reload()
        })
      }
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.biasAnalysis");

    this.columns = [
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "dataSymbol"),
      new FlexTableColumn(ts, "dataName"),
      new FlexTableColumn(ts, "brokerSymbol"),
      new FlexTableColumn(ts, "brokerName"),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private reload() {
    console.log("Reloading...")
    this.table?.reload()
    this.updateButtons([])
  }

  //-------------------------------------------------------------------------

  private updateButtons = (selection : BiasAnalysisFull[]) => {
    this.disView   = (selection.length != 1)
    this.disEdit   = (selection.length != 1)
    this.disPlay   = (selection.length != 1)
    this.disDelete = (selection.length == 0)
  }
}

//=============================================================================
