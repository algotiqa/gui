//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

export class PortfolioBuilderResponse {
  current?  : PortfolioBuilder
  available : PortfolioBuilder[] = []
}

//=============================================================================

export class PortfolioBuilder {
  name  : string             = ""
  label : string             = "" //--- This is only used by frontend
  config: BuilderConfig = new BuilderConfig()
  specs : {[key:string]:any} = {}
}

//=============================================================================

export class BuilderConfig {
  corrThresh : number = 0
}

//=============================================================================
