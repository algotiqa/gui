//=============================================================================
//===
//=== Copyright (C) 2023-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import {Routes}             from "@angular/router";

import {Url}                from "./app/model/urls";
import {HomePanel}          from "./app/layout/main-panel/work-panel/home/home.panel";
import {ConfigurationPanel} from "./app/layout/main-panel/work-panel/admin/configuration/configuration.panel";
import {UnknownPanel}       from "./app/layout/main-panel/work-panel/unknown/unknown.panel";
import {MonitoringPanel}    from "./app/layout/main-panel/work-panel/portfolio/monitoring/monitoring.panel";
import {FilteringPanel} from "./app/layout/main-panel/work-panel/portfolio/trading-system/filtering/filtering.panel";
import {ConnectionList} from "./app/layout/main-panel/work-panel/admin/connection/connection.list";
import {ConnectionEditPanel} from "./app/layout/main-panel/work-panel/admin/connection/edit/edit.panel";
import {ProductDataEditPanel} from "./app/layout/main-panel/work-panel/inventory/data-product/edit/data-product.edit";
import {
  ProductDataCreatePanel
} from "./app/layout/main-panel/work-panel/inventory/data-product/create/data-product.create";
import {
  BrokerProductCreatePanel
} from "./app/layout/main-panel/work-panel/inventory/broker-product/create/broker-product.create";
import {
  ProductBrokerEditPanel
} from "./app/layout/main-panel/work-panel/inventory/broker-product/edit/broker-product.edit";
import {
  DataProductView
} from "./app/layout/main-panel/work-panel/inventory/data-product/view/data-product.view";
import {
  DataInstrumentChartPanel
} from "./app/layout/main-panel/work-panel/inventory/data-product/view/chart/instrument-data.chart";
import {DataProductList} from "./app/layout/main-panel/work-panel/inventory/data-product/data-product.list";
import {BiasAnalisysListPanel} from "./app/layout/main-panel/work-panel/tool/bias-analysis/bias-analisys.list";
import {
  BiasAnalysisCreatePanel
} from "./app/layout/main-panel/work-panel/tool/bias-analysis/create/bias-analysis.create";
import {BiasAnalysisEditPanel} from "./app/layout/main-panel/work-panel/tool/bias-analysis/edit/bias-analysis.edit";
import { BiasAnalysisPlaygroundPanel
} from "./app/layout/main-panel/work-panel/tool/bias-analysis/playground/bias-analysis.playground";
import {
  DataInstrumentDataPanel
} from "./app/layout/main-panel/work-panel/inventory/data-product/view/data/instrument-data.data";
import {
  BiasAnalysisBacktestPanel
} from "./app/layout/main-panel/work-panel/tool/bias-analysis/backtest/bias-analysis.backtest";
import {ConnectionCreatePanel} from "./app/layout/main-panel/work-panel/admin/connection/create/create.panel";
import {
  TradingSystemDashboard
} from "./app/layout/main-panel/work-panel/portfolio/trading-system/trading-system.dashboard";
import {
  TradingSystemDevelEditPanel
} from "./app/layout/main-panel/work-panel/portfolio/trading-system/development/edit/edit.panel";
import {BiasAnalysisViewPanel} from "./app/layout/main-panel/work-panel/tool/bias-analysis/view/bias-analysis.view";
import {DocEditorComponent} from "./app/module/doc-editor/doc-editor.component";
import {TradingSystemPerformancePanel} from "./app/module/performance-metrics/performance.panel";
import {MarketAnalysisListPanel} from "./app/layout/main-panel/work-panel/tool/market-analysis/market-analysis.list";
import {TradingSystemQualityPanel} from "./app/module/quality-analyzer/quality.panel";
import {TradingSystemSimulationPanel} from "./app/module/simulator/simulation.panel";
import {
  TradingSystemArchiveEditPanel
} from "./app/layout/main-panel/work-panel/portfolio/trading-system/archive/edit/edit.panel";
import {AgentProfilePanel} from "./app/layout/main-panel/work-panel/inventory/agent-profile/agent-profile.list";
import {TradingSessionPanel} from "./app/layout/main-panel/work-panel/inventory/trading-session/trading-session.list";
import {ConnectionView} from "./app/layout/main-panel/work-panel/admin/connection/view/connection.view";
import {BrokerProductView} from "./app/layout/main-panel/work-panel/inventory/broker-product/view/broker-product.view";
import {BrokerProductList} from "./app/layout/main-panel/work-panel/inventory/broker-product/broker-product.list";
import {TradingSystemPanel} from "./app/layout/main-panel/work-panel/admin/import-export/trading-system.panel";
import {
  AdapterPlaygroundPanel
} from "./app/layout/main-panel/work-panel/admin/adapter-playground/adapter-playground.panel";
import {
  PositionSizingPanel
} from "./app/layout/main-panel/work-panel/portfolio/trading-system/position-sizing/position-sizing.panel";
import {TradeAnalyzerPanel} from "./app/module/trade-analyzer/trade-analyzer.panel";

//=============================================================================

export const routes: Routes = [
  { path:'',                                     redirectTo: Url.Home, pathMatch: 'full'    },

  { path: Url.Home,                               component: HomePanel                       },

  //--- Inventory

  { path: Url.Inventory_DataProducts,             component: DataProductList  },
  { path: Url.Inventory_DataProducts_Id,          component: DataProductView  },
  { path: Url.Inventory_DataProducts_Id, children : [
      { path: Url.Sub_Chart, component:  DataInstrumentChartPanel }
  ]},

  { path: Url.Inventory_DataInstruments_Id, children : [
      { path: Url.Sub_Data, component:  DataInstrumentDataPanel }
    ]},

  { path: Url.Right_DataProduct_Create,           component: ProductDataCreatePanel,   outlet : 'right' },
  { path: Url.Right_DataProduct_Edit,             component: ProductDataEditPanel,     outlet : 'right' },
  { path: Url.Inventory_BrokerProducts,           component: BrokerProductList               },
  { path: Url.Inventory_BrokerProducts_Id,        component: BrokerProductView               },
  { path: Url.Inventory_TradingSessions,          component: TradingSessionPanel             },
  { path: Url.Inventory_AgentProfiles,            component: AgentProfilePanel               },
  { path: Url.Right_BrokerProduct_Create,         component: BrokerProductCreatePanel, outlet : 'right' },
  { path: Url.Right_BrokerProduct_Edit,           component: ProductBrokerEditPanel,   outlet : 'right' },

  //--- Portfolio

  { path: Url.Portfolio_TradingSystems,           component: TradingSystemDashboard          },
  { path: Url.Right_TradingSystem_DevelopEdit,    component: TradingSystemDevelEditPanel,   outlet : 'right' },
  { path: Url.Right_TradingSystem_ArchiveEdit,    component: TradingSystemArchiveEditPanel, outlet : 'right' },

  { path: Url.Portfolio_TradingSystems_Id, children : [
      { path: Url.Sub_Filtering,      component:  FilteringPanel },
      { path: Url.Sub_PositionSizing, component:  PositionSizingPanel }
  ]},

  { path: Url.Portfolio_Monitoring,               component: MonitoringPanel                 },

  //--- Tool

  { path: Url.Tool_MarketAnalysis,                component: MarketAnalysisListPanel         },
  { path: Url.Tool_BiasAnalysis,                  component: BiasAnalisysListPanel           },
  { path: Url.Right_BiasAnalysis_Create,          component: BiasAnalysisCreatePanel, outlet : 'right' },
  { path: Url.Right_BiasAnalysis_View,            component: BiasAnalysisViewPanel,   outlet : 'right' },
  { path: Url.Right_BiasAnalysis_Edit,            component: BiasAnalysisEditPanel,   outlet : 'right' },
  { path: Url.Tool_BiasAnalysis_Id, children : [
      { path: Url.Sub_Playground, component:  BiasAnalysisPlaygroundPanel },
      { path: Url.Sub_Backtest,   component:  BiasAnalysisBacktestPanel   }
    ]},

  //--- Admin

  { path: Url.Admin_Config,                       component: ConfigurationPanel              },
  { path: Url.Admin_Connections,                  component: ConnectionList },
  { path: Url.Admin_Connections_Id,               component: ConnectionView },
  { path: Url.Right_Connection_Create,            component: ConnectionCreatePanel, outlet : 'right' },
  { path: Url.Right_Connection_Edit,              component: ConnectionEditPanel,   outlet : 'right' },
  { path: Url.Admin_ImportExport,                 component: TradingSystemPanel                      },
  { path: Url.Admin_AdapterPlayground,            component: AdapterPlaygroundPanel                  },

  //--- Modules

  { path: Url.Module_DocEditor,                   component: DocEditorComponent            },
  { path: Url.Module_PerformanceAnalysis,         component: TradingSystemPerformancePanel },
  { path: Url.Module_QualityAnalysis,             component: TradingSystemQualityPanel     },
  { path: Url.Module_Simulator,                   component: TradingSystemSimulationPanel  },
  { path: Url.Module_TradeAnalysis,               component: TradeAnalyzerPanel            },

  { path:'**',                                    component: UnknownPanel },
];

//=============================================================================
