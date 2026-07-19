//=============================================================================
//===
//=== Copyright (C) 2024-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Injectable}      from "@angular/core";
import {Observable}      from "rxjs";
import {
  PortfolioMonitoringResponse,
  PorTradingSystem,
  StatusResponse,
  TradingSystemPropertyResponse,
  Portfolio,
  PortfolioTree,
} from "../model/model";
import {HttpService}     from "./http.service";
import {ListResponse} from "../model/flex-table";
import {PerformanceAnalysisRequest, PerformanceAnalysisResponse} from "../model/performance";
import {QualityAnalysisRequest, QualityAnalysisResponse} from "../model/quality";
import {SimulationRequest, SimulationResult} from "../model/simulation";
import {TradeAnalysisRequest, TradeAnalysisResponse} from "../model/trade-analysis";
import {
  FilterAnalysisRequest,
  FilterAnalysisResponse,
  FilterOptimizationRequest, FilterOptimizationResponse,
  TradingFilter
} from "../model/filtering";
import {
  PositionAnalysisRequest,
  PositionAnalysisResponse,
  PositionOptimizationRequest, PositionOptimizationResponse,
  TradingPosition
} from "../model/position-sizing";
import {DashboardSummary} from "../model/dashboard";

//=============================================================================

@Injectable()
export class PortfolioService {

  //---------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //---------------------------------------------------------------------------

  constructor(private httpService: HttpService) {}

  //---------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //---------------------------------------------------------------------------

  //---------------------------------------------------------------------------
  //--- Trading systems
  //---------------------------------------------------------------------------

  public getTradingSystems = (): Observable<ListResponse<PorTradingSystem>> => {
    return this.httpService.get<ListResponse<PorTradingSystem>>('/api/portfolio/v1/trading-systems');
  }

  //---------------------------------------------------------------------------

  public getTradingSystem = (id : number): Observable<PorTradingSystem> => {
    return this.httpService.get<PorTradingSystem>('/api/portfolio/v1/trading-systems/'+ id);
  }

  //---------------------------------------------------------------------------

  public getPerformanceAnalysis = (id:number, req : PerformanceAnalysisRequest): Observable<PerformanceAnalysisResponse> => {
    return this.httpService.post<PerformanceAnalysisResponse>('/api/portfolio/v1/trading-systems/'+ id +'/performance-analysis', req);
  }

  //---------------------------------------------------------------------------

  public getQualityAnalysis = (id:number, req : QualityAnalysisRequest): Observable<QualityAnalysisResponse> => {
    return this.httpService.post<QualityAnalysisResponse>('/api/portfolio/v1/trading-systems/'+ id +'/quality-analysis', req);
  }

  //---------------------------------------------------------------------------

  public getTradeAnalysis = (id:number, req : TradeAnalysisRequest): Observable<TradeAnalysisResponse> => {
    return this.httpService.post<TradeAnalysisResponse>('/api/portfolio/v1/trading-systems/'+ id +'/trade-analysis', req);
  }

  //---------------------------------------------------------------------------

  public setTradingSystemTrading = (id: number, value: boolean): Observable<TradingSystemPropertyResponse> => {
    return this.httpService.post<TradingSystemPropertyResponse>('/api/portfolio/v1/trading-systems/'+ id +'/trading', { value: value });
  }

  //---------------------------------------------------------------------------

  public setTradingSystemRunning = (id: number, value: boolean): Observable<TradingSystemPropertyResponse> => {
    return this.httpService.post<TradingSystemPropertyResponse>('/api/portfolio/v1/trading-systems/'+ id +'/running', { value: value });
  }

  //---------------------------------------------------------------------------

  public setTradingSystemActivation = (id: number, value: boolean): Observable<TradingSystemPropertyResponse> => {
    return this.httpService.post<TradingSystemPropertyResponse>('/api/portfolio/v1/trading-systems/'+ id +'/activation', { value: value });
  }

  //---------------------------------------------------------------------------

  public setTradingSystemActive = (id: number, value: boolean): Observable<TradingSystemPropertyResponse> => {
    return this.httpService.post<TradingSystemPropertyResponse>('/api/portfolio/v1/trading-systems/'+ id +'/active', { value: value });
  }

  //---------------------------------------------------------------------------

  public deleteTradingSystemTrades = (id:number): Observable<void> => {
    return this.httpService.delete<void>('/api/portfolio/v1/trading-systems/'+ id +'/trades');
  }

  //---------------------------------------------------------------------------
  //--- Filtering
  //---------------------------------------------------------------------------

  public getTradingFilters = (tsId : number): Observable<TradingFilter> => {
    return this.httpService.get<TradingFilter>('/api/portfolio/v1/trading-systems/'+ tsId +'/filters');
  }

  //---------------------------------------------------------------------------

  public setTradingFilters = (tsId : number, filters : TradingFilter): Observable<string> => {
    return this.httpService.post<string>('/api/portfolio/v1/trading-systems/'+ tsId +'/filters', filters);
  }

  //---------------------------------------------------------------------------

  public runFilterAnalysis = (tsId : number, req : FilterAnalysisRequest): Observable<FilterAnalysisResponse> => {
    return this.httpService.post<FilterAnalysisResponse>('/api/portfolio/v1/trading-systems/'+ tsId +'/filter-analysis', req);
  }

  //---------------------------------------------------------------------------

  public startFilterOptimization = (tsId : number, req : FilterOptimizationRequest): Observable<StatusResponse> => {
    return this.httpService.post<StatusResponse>('/api/portfolio/v1/trading-systems/'+ tsId +'/filter-optimization', req);
  }

  //---------------------------------------------------------------------------

  public stopFilterOptimization = (tsId : number): Observable<StatusResponse> => {
    return this.httpService.delete<StatusResponse>('/api/portfolio/v1/trading-systems/'+ tsId +'/filter-optimization');
  }

  //---------------------------------------------------------------------------

  public getFilterOptimizationInfo = (tsId : number): Observable<FilterOptimizationResponse> => {
    return this.httpService.get<FilterOptimizationResponse>('/api/portfolio/v1/trading-systems/'+ tsId +'/filter-optimization');
  }

  //---------------------------------------------------------------------------
  //--- Position sizing
  //---------------------------------------------------------------------------

  public setTradingPosition = (tsId : number, req : TradingPosition): Observable<void> => {
    return this.httpService.post<void>('/api/portfolio/v1/trading-systems/'+ tsId +'/position', req);
  }

  //---------------------------------------------------------------------------

  public runPositionAnalysis = (tsId : number, req : PositionAnalysisRequest): Observable<PositionAnalysisResponse> => {
    return this.httpService.post<PositionAnalysisResponse>('/api/portfolio/v1/trading-systems/'+ tsId +'/position-analysis', req);
  }

  //---------------------------------------------------------------------------

  public startPositionOptimization = (tsId : number, req : PositionOptimizationRequest): Observable<StatusResponse> => {
    return this.httpService.post<StatusResponse>('/api/portfolio/v1/trading-systems/'+ tsId +'/position-optimization', req);
  }

  //---------------------------------------------------------------------------

  public stopPositionOptimization = (tsId : number): Observable<StatusResponse> => {
    return this.httpService.delete<StatusResponse>('/api/portfolio/v1/trading-systems/'+ tsId +'/position-optimization');
  }

  //---------------------------------------------------------------------------

  public getPositionOptimizationInfo = (tsId : number): Observable<PositionOptimizationResponse> => {
    return this.httpService.get<PositionOptimizationResponse>('/api/portfolio/v1/trading-systems/'+ tsId +'/position-optimization');
  }

  //---------------------------------------------------------------------------
  //--- Simulation
  //---------------------------------------------------------------------------

  public startSimulation = (tsId : number, req : SimulationRequest): Observable<StatusResponse> => {
    return this.httpService.post<StatusResponse>('/api/portfolio/v1/trading-systems/'+ tsId +'/simulation', req);
  }

  //---------------------------------------------------------------------------

  public stopSimulation = (tsId : number): Observable<StatusResponse> => {
    return this.httpService.delete<StatusResponse>('/api/portfolio/v1/trading-systems/'+ tsId +'/simulation');
  }

  //---------------------------------------------------------------------------

  public getSimulationResult = (tsId : number): Observable<SimulationResult> => {
    return this.httpService.get<SimulationResult>('/api/portfolio/v1/trading-systems/'+ tsId +'/simulation');
  }

  //---------------------------------------------------------------------------
  //--- Portfolios
  //---------------------------------------------------------------------------

  public getPortfolios = (): Observable<ListResponse<Portfolio>> => {
    return this.httpService.get<ListResponse<Portfolio>>('/api/portfolio/v1/portfolios');
  }

  //---------------------------------------------------------------------------

  public getPortfolioTree = (): Observable<PortfolioTree[]> => {
    return this.httpService.get<PortfolioTree[]>('/api/portfolio/v1/portfolio/tree');
  }

  //---------------------------------------------------------------------------

  public getPortfolioMonitoring = (ids : number[], period : number): Observable<PortfolioMonitoringResponse> => {

    let params = {
      "tsIds" : ids,
      "period": period
    };

    return this.httpService.post<PortfolioMonitoringResponse>('/api/portfolio/v1/portfolio/monitoring', params);
  }

  //---------------------------------------------------------------------------
  //--- Dashboard
  //---------------------------------------------------------------------------

  public getDashboardSummary = (): Observable<DashboardSummary> => {
    return this.httpService.get<DashboardSummary>('/api/portfolio/v1/dashboard/summary');
  }
}

//=============================================================================
