//=============================================================================
//===
//=== Copyright (C) 2022-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

//=============================================================================

@Injectable()
export class SearchService {
  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  private _search = new Subject<string>();
  public search$ = this._search.asObservable();

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  set search(value: string | undefined) {
    if (value != undefined) {
      this._search.next(value);
    }
  }

  //-------------------------------------------------------------------------

  public filter(search?: string, label?: string): boolean {
    if (!search || !label) {
      return false;
    }

    return !label.toLowerCase().includes(search.toLowerCase());
  }
}

//=============================================================================
