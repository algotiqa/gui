//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatIconModule} from "@angular/material/icon";

import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {ReferencedItem} from "../../../../../../model/importer";
import {LabelService} from "../../../../../../service/label.service";
import {SelectRequired} from "../../../../../../component/form/select-required/select-required";

//=============================================================================

@Component({
  selector: 'references-table',
  templateUrl: './references.panel.html',
  styleUrls: ['./references.panel.scss'],
  imports: [MatTableModule, MatSortModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule, MatTooltip, SelectRequired]
})

//=============================================================================

export class ReferencesPanel implements AfterViewInit {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  rawData : ReferencedItem[]  = [];

  tableData = new MatTableDataSource();

  displayedColumns: string[] = ['type', 'symbol', 'name', 'exchange', 'system', 'connection', 'status', 'notes'];

  @ViewChild(MatSort) sort : MatSort |null = null;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(private labelService : LabelService) {
  }

  //-------------------------------------------------------------------------
  //---
  //--- Properties
  //---
  //-------------------------------------------------------------------------

  get data(): ReferencedItem[] {
    return this.rawData;
  }

  //-------------------------------------------------------------------------

  @Input()
  set data(value: ReferencedItem[]) {
    this.rawData        = value
    this.tableData.data = value
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
    return this.labelService.getLabelString("page.dialog.import.reference."+ code);
  }

  //-------------------------------------------------------------------------

  onKeyChange(event : number, element: ReferencedItem) {
    element.options.forEach((option) => {
      if (option.id == event) {
        element.notes = option.matchNotes.replace("\n","<br>")
      }
    })
  }

  //-------------------------------------------------------------------------

  splitNotes(notes : string) : string[] {
    if (notes == undefined) {
      return [];
    }
    return notes.split('|')
  }
}

//=============================================================================
