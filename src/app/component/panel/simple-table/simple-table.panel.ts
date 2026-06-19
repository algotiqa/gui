//=============================================================================
//===
//=== Copyright (C) 2023-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatIconModule} from "@angular/material/icon";

import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {LabelService} from "../../../service/label.service";
import {FlexTableColumn, ListService} from "../../../model/flex-table";
import {MatButtonModule} from "@angular/material/button";

//=============================================================================

@Component({
    selector: 'simple-table',
    templateUrl: './simple-table.panel.html',
    styleUrls: ['./simple-table.panel.scss'],
    imports: [MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, MatIconModule]
})

//=============================================================================

export class SimpleTablePanel<T = any> implements AfterViewInit {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() searchPanel= true

  @ViewChild(MatSort) sort : MatSort |null = null;

  //-------------------------------------------------------------------------

  rawData         : T[] = [];
  tableColumns    : FlexTableColumn[] = [];
  displayedColumns: string[] = [];
  tableData = new MatTableDataSource<T>();

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(private labelService : LabelService) {}

  //-------------------------------------------------------------------------
  //---
  //--- Properties
  //---
  //-------------------------------------------------------------------------

  get columns(): FlexTableColumn[] {
    return this.tableColumns;
  }

  //-------------------------------------------------------------------------

  @Input()
  set columns(value: FlexTableColumn[]) {
    this.tableColumns     = value;
    this.displayedColumns = [ ...value.map( c => c.column )]
  }

  //-------------------------------------------------------------------------

  get data(): T[] {
    return this.rawData;
  }

  //-------------------------------------------------------------------------

  @Input()
  set data(value: T[]) {
    this.rawData        = value;
    this.tableData.data = value;
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  ngAfterViewInit() {
    this.tableData.sort = this.sort;
  }

  //-------------------------------------------------------------------------

  loc(code : string) : string {
    return this.labelService.getLabelString("simpleTable."+ code);
  }

  //-------------------------------------------------------------------------

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableData.filter = filterValue.trim().toLowerCase();
  }
}

//=============================================================================
