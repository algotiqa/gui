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
import {FlexTableColumn, ListResponse, ListService} from "../../../../../model/flex-table";
import {AbstractPanel}        from "../../../../../component/abstract.panel";
import {FlexTablePanel}       from "../../../../../component/panel/flex-table/flex-table.panel";
import {LabelService}         from "../../../../../service/label.service";
import {EventBusService}      from "../../../../../service/eventbus.service";
import {Router, RouterModule} from "@angular/router";
import {Url} from "../../../../../model/urls";
import {AppEvent} from "../../../../../model/event";
import {Observable} from "rxjs";
import {CreateButton} from "../../../../../component/button/create/create.button";
import {ListButtons, ListContent, ListPanel} from "../../../../../component/panel/list-panel/list-panel";
import {ViewButton} from "../../../../../component/button/view/view.button";
import {NavigationService} from "../../../../../service/navigation.service";
import {Allocation, AllocationFull, AllocationSpec} from "../../../../../model/allocation";
import {PortfolioService} from "../../../../../service/portfolio.service";
import {SelectTextRequired} from "../../../../../component/form/select-optional/select-optional";
import {PortfolioFull} from "../../../../../model/model";
import {InventoryService} from "../../../../../service/inventory.service";
import {AllocationRunTypeStyler, AllocationStatusStyler} from "../../../../../component/panel/flex-table/icon-sylers";
import {IsoDateTranscoder} from "../../../../../component/panel/flex-table/transcoders";

//=============================================================================

@Component({
    selector: 'allocation-list',
    templateUrl: './allocation.list.html',
    styleUrls:  ['./allocation.list.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, FlexTablePanel, CreateButton, ListButtons, ListContent, ListPanel, ViewButton, SelectTextRequired]
})

//=============================================================================

export class AllocationListPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  portfolioId: number = 0
  portfolios : PortfolioFull[] = []

  columns  : FlexTableColumn[] = [];
  service  : ListService<AllocationFull>;
  disCreate: boolean = true;
  disView  : boolean = true;

  @ViewChild("table") table : FlexTablePanel<AllocationFull>|null = null;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private navigationService: NavigationService,
              private inventoryService : InventoryService,
              private portfolioService : PortfolioService) {

    super(eventBusService, labelService, router, "portfolio.allocation", "allocation");

    this.navigationService.set()
    this.service = this.getAllocations;

    eventBusService.subscribeToApp(AppEvent.ALLOCATION_LIST_RELOAD, () => {
      this.table?.reload()
      this.updateButtons([])
    })

    inventoryService.getPortfolios(true).subscribe(
      result => {
        this.portfolios = result.result
        this.portfolios.forEach( p => {
          p.name = p.accountCode +" --> "+ p.name
        })

        //--- Add "all" option

        let all = {
          id        : 0,
          name      : this.loc("all"),
          management: "M"
        }

        this.portfolios = [ all, ...this.portfolios ]
      })
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onPortfolioChange(porId : number) : void {
    this.disCreate = porId == 0
    this.table?.reload()
  }

  //-------------------------------------------------------------------------

  onRowSelected(selection : Allocation[]) {
    this.updateButtons(selection);
  }

  //-------------------------------------------------------------------------

  onCreateClick() {
    let spec = new AllocationSpec();
    spec.portfolioId = this.portfolioId;

    this.portfolioService.addAllocation(spec).subscribe(res => {
      this.table?.reload()
    })
  }

  //-------------------------------------------------------------------------

  onViewClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    if (selection.length > 0) {
      this.navigateTo([ Url.Portfolio_Allocations, selection[0].id ]);
    }
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let p = this.labelService.getLabel("model.allocation");

    this.columns = [
      new FlexTableColumn(p, "accountCode"),
      new FlexTableColumn(p, "portfolioName"),
      new FlexTableColumn(p, "runDate", new IsoDateTranscoder()),
      new FlexTableColumn(p, "runType", undefined, new AllocationRunTypeStyler()),
      new FlexTableColumn(p, "status",  undefined, new AllocationStatusStyler()),
      new FlexTableColumn(p, "accountCapital"),
      new FlexTableColumn(p, "accountCurrencyCode"),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private getAllocations = (): Observable<ListResponse<Allocation>> => {
    return this.portfolioService.getAllocations(this.portfolioId);
  }

  //-------------------------------------------------------------------------

  private updateButtons = (selection : Allocation[]) => {
    this.disView = (selection.length != 1)
  }
}

//=============================================================================
