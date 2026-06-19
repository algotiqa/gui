//=============================================================================
//===
//=== Copyright (C) 2023-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, EventEmitter, Input, Output} from '@angular/core';

import {MatIconModule}           from "@angular/material/icon";
import {MatButtonModule}         from "@angular/material/button";
import {MatTreeModule}           from "@angular/material/tree";
import {MatTreeNestedDataSource} from "@angular/material/tree";
import {NestedTreeControl}       from '@angular/cdk/tree';
import {SelectionModel}          from "@angular/cdk/collections";

import {TreeNodeProvider}        from "../../../model/flex-tree";

//=============================================================================

@Component({
    selector: 'flex-tree',
    templateUrl: './flex-tree.panel.html',
    styleUrls: ['./flex-tree.panel.scss'],
    imports: [MatButtonModule, MatIconModule, MatTreeModule]
})

//=============================================================================

export class FlexTreePanel<T> {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input()  nodeProvider   : TreeNodeProvider<T>;
  @Output() onNodeSelected : EventEmitter<T> = new EventEmitter<T>();

  //-------------------------------------------------------------------------

  private getChildren=(node : T) : T[] => {
    return this.nodeProvider.getChildren(node);
  }

  //-------------------------------------------------------------------------

  dataSource= new MatTreeNestedDataSource<T>();
  treeControl   = new NestedTreeControl<T>(this.getChildren);
  selection          = new SelectionModel<T>(true, []);

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor() {
    this.nodeProvider = new class implements TreeNodeProvider<T> {
      getName(node: T): string { return ""; }
      getChildren(node: T): T[] { return []; }
    }
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  get roots(): T[] {
    return this.dataSource.data;
  }

  //-------------------------------------------------------------------------

  @Input()
  set roots(treeRoots : T[]) {
    this.dataSource.data = treeRoots;
  }

  //-------------------------------------------------------------------------

  hasChild = (_: number, node: T) => {
    let children = this.nodeProvider.getChildren(node);
    return !!children && children.length > 0;
  }

  //-------------------------------------------------------------------------

  onClick = (node : T) => {
    this.selection.clear()
    this.selection.select(node);
    this.onNodeSelected.emit(node);
  }

  //-------------------------------------------------------------------------

  getColor = (node : T) : string => {
    if (this.selection.isSelected(node)) {
      return "#4080c0";
    }

    return "";
  }

  //-------------------------------------------------------------------------

  public getSelectedNode = () : T|undefined => {
    let sel = this.selection.selected;

    if (sel.length > 0) {
      return sel[0]
    }

    return undefined
  }

  //-------------------------------------------------------------------------

  public getSelection = () : T[] => {
    return this.selection.selected
  }
}

//=============================================================================
