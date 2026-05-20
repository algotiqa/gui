//=============================================================================
//===
//=== Copyright (C) 2026 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
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
