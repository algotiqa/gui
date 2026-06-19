//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

//=============================================================================
//===
//=== Trading system import
//===
//=============================================================================

export class ImportOverviewSpec {
}

//=============================================================================

export class ImportExecutionSpec {
  plan? : ImportPlan
}

//=============================================================================

export class ImportPlan {
  tradingSystems : SelectedTradingSystem[] = []
  referencedItems: SelectedReference    [] = []
}

//=============================================================================

export class SelectedTradingSystem {
  id   : number  = 0
  name : string  = ""
}

//=============================================================================

export class SelectedReference {
  id       : number = 0
  itemType : number = 0
  mappedTo : number = 0
}

//=============================================================================
//===
//=== ImportOverviewResponse
//===
//=============================================================================

export class ImportOverviewResponse {
  tradingSystems : TradingSystemItem[] = []
  referencedItems: ReferencedItem[]    = []
}

//=============================================================================

export class TradingSystemItem {
  id        : number  = 0
  name      : string  = ""
  timeframe : number  = 0
}

//=============================================================================

export class ReferencedItem {
  id           : number = 0
  symbol       : string = ""
  name         : string = ""
  systemCode   : string = ""
  exchangeCode : string = ""
  itemType     : number = 0
  status       : number = 0
  options      : ReferencedOption[] = []
  mappedTo     : number = 0
  notes        : string = ""
}

//=============================================================================

export class ReferencedOption {
  id         : number = 0
  name       : string = ""
  matchNotes : string = ""
}

//=============================================================================
