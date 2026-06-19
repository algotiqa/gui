//=============================================================================
//===
//=== Copyright (C) 2025-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


export class MinMax {
  minVal  : number  = 0
  maxVal  : number  = 0
  hasData : boolean = false

  //---------------------------------------------------------------------------

  constructor(list? : number[]) {
    if (list) {
      this.add(list)
    }
  }

  //---------------------------------------------------------------------------

  add(list : number[]) {
    list.forEach((val) => {
      this.update(val)
    })
  }

  //---------------------------------------------------------------------------

  update(value : number) {
    if ( ! this.hasData) {
      this.minVal = value
      this.maxVal = value
      this.hasData= true
    }
    else {
      this.minVal = Math.min(this.minVal, value)
      this.maxVal = Math.max(this.maxVal, value)
    }
  }
}

//=============================================================================
