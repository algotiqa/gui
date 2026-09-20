//=============================================================================
//===
//=== Copyright (C) 2023-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


export enum Url {
  Home                         = "home",
  Inventory_DataProducts       = "inventory/data-products",
  Inventory_DataProducts_Id    = "inventory/data-products/:id",
  Inventory_DataInstruments    = "inventory/data-instruments",
  Inventory_DataInstruments_Id = "inventory/data-instruments/:id",
  Inventory_BrokerProducts     = "inventory/broker-products",
  Inventory_BrokerProducts_Id  = "inventory/broker-products/:id",
  Inventory_TradingSessions    = "inventory/trading-sessions",
  Inventory_AgentProfiles      = "inventory/agent-profiles",
  Inventory_AgentProfiles_Id   = "inventory/agent-profiles/:id",
  Inventory_Accounts           = "inventory/accounts",
  Inventory_Accounts_Id        = "inventory/accounts/:id",
  Inventory_Portfolios         = "inventory/portfolios",
  Inventory_Portfolios_Id      = "inventory/portfolios/:id",

  Portfolio_TradingSystems     = "portfolio/trading-systems",
  Portfolio_TradingSystems_Id  = "portfolio/trading-systems/:id",
  Portfolio_Allocations        = "portfolio/allocations",
  Portfolio_Allocations_Id     = "portfolio/allocations/:id",
  Portfolio_Monitoring         = "portfolio/monitoring",

  Tool_MarketAnalysis          = "tool/market-analysis",

  Tool_BiasAnalysis            = "tool/bias-analysis",
  Tool_BiasAnalysis_Id         = "tool/bias-analysis/:id",

  Admin_Connections            = "admin/connections",
  Admin_Connections_Id         = "admin/connections/:id",
  Admin_Config                 = "admin/config",
  Admin_ImportExport           = "admin/import-export",
  Admin_AdapterPlayground      = "admin/adapter-playground",

  //--- Sub paths -------------------------------------------------------------

  Sub_Filtering      = "filtering",
  Sub_PositionSizing = "position-sizing",
  Sub_Chart          = "chart",
  Sub_Playground     = "playground",
  Sub_Backtest       = "backtest",
  Sub_Data           = "data",

  //--- Right panels ----------------------------------------------------------

  Right_Connection_Create         = "connection-create",
  Right_Connection_Edit           = "connection-edit",
  Right_TradingSystem_DevelopEdit = "tradingSystem-develop-edit",
  Right_TradingSystem_ArchiveEdit = "tradingSystem-archive-edit",
  Right_DataProduct_Create        = "dataProduct-create",
  Right_DataProduct_Edit          = "dataProduct-edit",
  Right_BrokerProduct_Create      = "brokerProduct-create",
  Right_BrokerProduct_Edit        = "brokerProduct-edit",
  Right_BiasAnalysis_Create       = "biasAnalysis-create",
  Right_BiasAnalysis_View         = "biasAnalysis-view",
  Right_BiasAnalysis_Edit         = "biasAnalysis-edit",
  Right_AgentProfile_Create       = "agentProfile-create",
  Right_AgentProfile_Edit         = "agentProfile-edit",
  Right_Account_Create            = "account-create",
  Right_Account_Edit              = "account-edit",
  Right_Portfolio_Create          = "portfolio-create",
  Right_Portfolio_Edit            = "portfolio-edit",

  //--- Modules ---------------------------------------------------------------

  Module_DocEditor           = "module/doc-editor/:id",
  Module_PerformanceAnalysis = "module/performance-analysis/:id",
  Module_QualityAnalysis     = "module/quality-analysis/:id",
  Module_Simulator           = "module/simulation/:id",
  Module_TradeAnalysis       = "module/trade-analysis/:id",
}

//=============================================================================
