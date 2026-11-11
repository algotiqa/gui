//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

export class CsvLib {

  //-------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------

  public build(headers : string[], rows : any[][]) : string {
    let lines : string[] = []

    lines.push(this.buildRow(headers))

    rows.forEach(row => {
      lines.push(this.buildRow(row))
    })

    return lines.join("\r\n")
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private buildRow(cells : any[]) : string {
    return cells.map(c => this.escape(c)).join("\t")
  }

  //-------------------------------------------------------------------------

  private escape(value : any) : string {
    if (value == null) {
      return ""
    }

    let s = "" + value

    if (s.indexOf("\t") != -1 || s.indexOf("\n") != -1 || s.indexOf("\r") != -1 || s.indexOf('"') != -1) {
      s = '"' + s.replace(/"/g, '""') + '"'
    }

    return s
  }
}

//=============================================================================
