//=============================================================================
//===
//=== Copyright (C) 2026 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

//=============================================================================

import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

//=============================================================================

@Injectable()
export class NavigationService {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  callStack : string[] = [];

  //---------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //---------------------------------------------------------------------------

  constructor(private router : Router) {}

  //-------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------

  public set() {
    this.callStack = []
    this.push()
  }

  //-------------------------------------------------------------------------

  public push() {
    let currAddress = this.router.url
    let idx = currAddress.indexOf("(")

    if (idx > -1) {
      currAddress = currAddress.substring(0, idx)
    }
    
    this.callStack.push(currAddress);
    console.log("Pushed: "+ currAddress)
  }

  //-------------------------------------------------------------------------

  public pop() {
    let currAddress = this.callStack.pop()
    let backAddress = this.callStack.pop()

    if (backAddress) {
      this.router.navigate([ backAddress ])
    }
  }
}

//=============================================================================

