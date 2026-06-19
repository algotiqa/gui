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
import {MatTooltip} from "@angular/material/tooltip";
import {InputTextRequired} from "../../form/input-text-required/input-text-required";
import {RoundBox} from "../../form/round-box/round-box";

//=============================================================================

export type FlexTableFilter<T> = (row: T, filter: string) => boolean;

export type FlexTableUpdateListener<T> = (data : T[], selection : SelectionModel<T>) => void

//=============================================================================

//=============================================================================

@Component({
    selector: 'flex-table',
    templateUrl: './flex-table.panel.html',
    styleUrls: ['./flex-table.panel.scss'],
  imports: [MatTableModule, MatSortModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule, MatTooltip, InputTextRequired, RoundBox]
})

//=============================================================================

export class FlexTablePanel<T = any> implements AfterViewInit {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input()  dataProvider? : ListService<T>;
  @Input()  searchPanel    = true
  @Input()  updateListener : FlexTableUpdateListener<T>|undefined = undefined
  @Output() onRowsSelected : EventEmitter<T[]> = new EventEmitter<T[]>();
  @Output() onRefresh      : EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatSort) sort : MatSort |null = null;

  //-------------------------------------------------------------------------

  rawData         : T[] = [];
  rowCount        : number = 0
  tableColumns    : FlexTableColumn[] = [];
  displayedColumns: string[] = [];
  tableData = new MatTableDataSource<T>();
  selection = new SelectionModel<T>(true, []);

  textToFilter : string = ""

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(private labelService : LabelService) {
    this.tableData.filterPredicate = this.filterPredicate
  }

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
    this.displayedColumns = ["select", ...value.map( c => c.column )]
  }

  //-------------------------------------------------------------------------

  get data(): T[] {
    return this.rawData;
  }

  //-------------------------------------------------------------------------

  @Input()
  set data(value: T[]) {
    this.rawData        = value
    this.tableData.data = value
    this.rowCount       = value.length
    this.applyFilter()
    this.handleUpdateListener()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  ngAfterViewInit() {
    this.tableData.sort = this.sort;
    this.reload();
  }

  //-------------------------------------------------------------------------

  reload = () : void => {
    if (this.dataProvider != undefined) {
      this.dataProvider().subscribe(
        result => {
          this.tableData.data = result.result;
          this.rowCount       = result.result.length
          this.applyFilter()
          this.handleUpdateListener()
        }
      )
    }
    else {
      this.onRefresh.emit()

      // if (this.data != undefined) {
      //   this.tableData.data = this.data;
      //   this.rowCount       = this.data.length
      //   this.clearSelection();
      //   this.applyFilter()
      // }
    }
  }

  //-------------------------------------------------------------------------

  loc(code : string) : string {
    return this.labelService.getLabelString("flexTable."+ code);
  }

  //-------------------------------------------------------------------------

  onRowClick(row : any) : void {
    this.selection.toggle(row)
    this.onRowsSelected.emit(this.selection.selected)
  }

  //-------------------------------------------------------------------------

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows     = this.tableData.data.length;
    return numSelected === numRows;
  }

  //-------------------------------------------------------------------------

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.onRowsSelected.emit(this.selection.selected)
      return;
    }

    this.selection.select(...this.tableData.filteredData);
    this.onRowsSelected.emit(this.selection.selected)
  }

  //-------------------------------------------------------------------------

  updateFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.textToFilter = filterValue.trim().toLowerCase()
    this.applyFilter()
  }

  //-------------------------------------------------------------------------

  public getSelection = () : T[] => {
    return this.selection.selected
  }

  //-------------------------------------------------------------------------

  public clearSelection() {
    this.selection = new SelectionModel<T>(true, []);
    this.onRowsSelected.emit(this.selection.selected)
  }

  //-------------------------------------------------------------------------

  public applyFilter() {
    this.tableData.filter = new Date().toString()
    this.rowCount = this.tableData.filteredData.length
  }

  //-------------------------------------------------------------------------

  public defaultFilter:(FlexTableFilter<T>) = (row : T, filter : string) => {
    if (filter.length == 0) {
      return true
    }

    for (let fc of this.tableColumns) {
      // @ts-ignore
      let value = row[fc.column]
      if (fc.transcoder != undefined) {
        value = fc.transcoder.transcode(value, row)
      }

      if (value != null) {
        value = "" + value
        value = value.trim().toLowerCase()

        if (value.indexOf(filter) != -1) {
          return true
        }
      }
    }

    return false
  }

  //-------------------------------------------------------------------------

  @Input() filter: FlexTableFilter<T> = this.defaultFilter

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private filterPredicate = (row: T, filter: string) : boolean => {
    return this.filter(row, this.textToFilter)
  }

  //-------------------------------------------------------------------------

  private handleUpdateListener() {
    this.selection = new SelectionModel<T>(true, []);

    if (this.updateListener) {
      this.updateListener(this.tableData.data, this.selection)
    }

    this.onRowsSelected.emit(this.selection.selected)
  }
}

//=============================================================================
