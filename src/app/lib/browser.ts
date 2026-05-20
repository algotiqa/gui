//=============================================================================
//===
//=== Copyright (C) 2026 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

export class BrowserLib {

  //-------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------

  public download(data:ArrayBuffer, filename:string, mimeType:string)  {
    const blob = new Blob([data], { type: mimeType });
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
