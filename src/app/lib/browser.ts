//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Lib} from "./lib";

export class BrowserLib {

  //-------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------

  public downloadData(data:ArrayBuffer, filename : string, mimeType : string)  {
    const blob = new Blob([data], { type: mimeType });
    this.downloadI(blob, filename);
  }

  //-------------------------------------------------------------------------

  public downloadText(text : string, filename : string, mimeType : string) : void {
    const blob = new Blob(["\uFEFF" + text], { type: mimeType });
    this.downloadI(blob, filename);
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private downloadI(blob : Blob, filename : string)  {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href     = url;
    link.download = filename;
    link.click();

    window.URL.revokeObjectURL(url);
    link.remove();
  }
}

//=============================================================================
