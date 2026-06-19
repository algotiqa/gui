//=============================================================================
//===
//=== Copyright (C) 2025-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

export class CheckButtonConfig {
  offIcon : string = ""
  offLabel: string = ""
  offColor: string = ""

  onIcon  : string = ""
  onLabel : string = ""
  onColor : string = ""

  labelRoot : string = ""

  //-------------------------------------------------------------------------

  constructor(offIcon:string, offLabel:string, offColor:string, onIcon:string, onLabel:string, onColor:string, labelRoot:string) {
    this.offIcon  = offIcon
    this.offLabel = offLabel
    this.offColor = offColor
    this.onIcon   = onIcon
    this.onLabel  = onLabel
    this.onColor  = onColor
    this.labelRoot= labelRoot
  }
}

//=============================================================================
