//=============================================================================
//===
//=== Copyright (C) 2023-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import {Observable} from "rxjs";
import {SelectionModel} from "@angular/cdk/collections";

//=============================================================================

export class ListResponse<T = any> {
  offset  : number  = 0;
  limit   : number  = 0;
  overflow: boolean = false;
  result  : T[]     = [];
}

//=============================================================================

export type ListService<T> = (params? : any) => Observable<ListResponse<T>>;

//=============================================================================

export class FlexTableColumn {
  column      : string
  header      : string
  transcoder? : Transcoder
  iconStyler? : IconStyler
  cellStyler? : CellStyler
  editor      : boolean = false;
  editorLength: number  = 32;

  //---------------------------------------------------------------------------

  constructor(obj:any, column : string, transCoder? : Transcoder, iconStyler? : IconStyler, cellStyler? : CellStyler, editor? : boolean, editorLength? : number) {
    this.column     = column;
    this.header     = obj[column];
    this.transcoder = transCoder;
    this.iconStyler = iconStyler;
    this.cellStyler = cellStyler;

    if (!editor) {
      editor = false
    }

    if (!editorLength) {
      editorLength = 32
    }

    this.editor       = editor
    this.editorLength = editorLength
  }

  //---------------------------------------------------------------------------

  transcode(value: any, row: any) : string {
    if (this.transcoder != undefined) {
      return this.transcoder.transcode(value, row)
    }

    return value
  }

  //---------------------------------------------------------------------------

  cellStyle(value: any, row: any) : string {
    if (this.cellStyler != undefined) {
      return this.cellStyler.getCellStyle(value, row)
    }

    return ""
  }
}

//=============================================================================

export interface Transcoder {
	transcode(value: any, row?: any): any;
}

//=============================================================================

export interface IconStyler {
	getStyle(value : any, row? : any) : IconStyle;
}

//=============================================================================

export interface CellStyler {
  getCellStyle(value : any, row? : any) : string;
}

//=============================================================================

export class IconStyle {
  icon?   : string
  color?  : string
  tooltip?: string

  constructor(icon : string, color? : string, tooltip? : string) {
    this.icon    = icon
    this.color   = color
    this.tooltip = tooltip
  }
}

//=============================================================================
