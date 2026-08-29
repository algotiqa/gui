//=============================================================================
//===
//=== Copyright (C) 2024-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Injectable}        from "@angular/core";
import {Observable}        from "rxjs";
import {ListResponse}      from "../model/flex-table";
import {
  DatafileUploadSpec,
  DataInstrument,
  DatafileUploadResponse,
  ParserMap,
  DataPoint,
  DataInstrumentDataResponse,
  DataInstrumentFull,
  DataProductExt,
  ConnectionSpec,
  Connection,
  DataProductSpec,
  DataProduct, DataInstrumentExt
} from "../model/model";
import {HttpService, UploadEvent} from "./http.service";
import {HttpParams} from "@angular/common/http";
import {
  BiasAnalysis, BiasBacktestRequest,
  BiasBacktestResponse,
  BiasConfig,
  BiasSummaryResponse
} from "../layout/main-panel/work-panel/tool/bias-analysis/model";
import {DataProductAnalysisResponse} from "../layout/main-panel/work-panel/tool/market-analysis/model";
import {PeriodSelectorInfo} from "../component/form/period-selector/period-selector";
import {Lib} from "../lib/lib";

//=============================================================================

@Injectable()
export class CollectorService {

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
  //--- Products
  //---------------------------------------------------------------------------

  public analyzeProduct = (id : number, period : PeriodSelectorInfo,
                           timeframe : number, limit : number): Observable<DataProductAnalysisResponse> => {
    let spec = Lib.query.createSpec(period, timeframe, undefined, undefined, limit)

    return this.httpService.get<DataProductAnalysisResponse>('/api/collector/v1/data-products/'+ id +'/analysis', { params: spec });
  }

  //---------------------------------------------------------------------------
  //--- Instruments
  //---------------------------------------------------------------------------

  public getParsers = (): Observable<ParserMap> => {
    return this.httpService.get<ParserMap>('/api/collector/v1/config/parsers');
  }

  //---------------------------------------------------------------------------

  public getDataInstruments = (): Observable<ListResponse<DataInstrumentFull>> => {
    return this.httpService.get<ListResponse<DataInstrumentFull>>('/api/collector/v1/data-instruments');
  }

  //---------------------------------------------------------------------------

  public getDataInstrumentById = (id:number, details: boolean): Observable<DataInstrumentExt> => {
    let params = new HttpParams()
    params = params.set("details", details)
    return this.httpService.get<DataInstrumentExt>('/api/collector/v1/data-instruments/'+ id, { params: params });
  }

  //---------------------------------------------------------------------------

  public getDataInstrumentsByProductId = (id: number, stored: boolean): Observable<ListResponse<DataInstrumentExt>> => {
    let params = new HttpParams()
    params = params.set("stored", stored)
    return this.httpService.get<ListResponse<DataInstrumentExt>>('/api/collector/v1/data-products/'+id+'/instruments', { params: params });
  }

  //---------------------------------------------------------------------------

  public uploadDataInstrumentData = (productId: number, spec: DatafileUploadSpec, files: any[]) : Observable<UploadEvent<DatafileUploadResponse>> => {
    return this.httpService.upload<DatafileUploadResponse>('/api/collector/v1/data-products/'+ productId +'/instruments', spec, files)
  }

  //---------------------------------------------------------------------------

  public getDataInstrumentData = (id: number, period:PeriodSelectorInfo, timeframe:number, timezone:string, reduction:number): Observable<DataInstrumentDataResponse> => {
    let spec = Lib.query.createSpec(period, timeframe, timezone, reduction)

    return this.httpService.get<DataInstrumentDataResponse>('/api/collector/v1/data-instruments/'+id+'/data', { params: spec });
  }

  //---------------------------------------------------------------------------

  public reloadDataInstrumentData = (diId: number) : Observable<void> => {
    return this.httpService.post<void>('/api/collector/v1/data-instruments/'+ diId +'/reload',{})
  }

  //---------------------------------------------------------------------------
  //--- Bias analyses
  //---------------------------------------------------------------------------

  public getBiasAnalyses = (details: boolean): Observable<ListResponse<BiasAnalysis>> => {
    let params = new HttpParams()
    params = params.set("details", details)
    return this.httpService.get<ListResponse<BiasAnalysis>>('/api/collector/v1/bias-analyses', { params: params });
  }

  //---------------------------------------------------------------------------

  // public getBiasAnalysisById = (id:number, details: boolean): Observable<BiasAnalysisExt> => {
  //   let params = new HttpParams()
  //   params = params.set("details", details)
  //   return this.httpService.get<BiasAnalysisExt>('/api/collector/v1/bias-analyses/'+ id, { params: params });
  // }

  //---------------------------------------------------------------------------

  public addBiasAnalysis = (ba : BiasAnalysis): Observable<BiasAnalysis> => {
    return this.httpService.post<BiasAnalysis>('/api/collector/v1/bias-analyses', ba);
  }

  //---------------------------------------------------------------------------

  public updateBiasAnalysis = (ba : BiasAnalysis): Observable<BiasAnalysis> => {
    return this.httpService.put<BiasAnalysis>('/api/collector/v1/bias-analyses/'+ba.id, ba);
  }

  //---------------------------------------------------------------------------

  public deleteBiasAnalysis = (id:number): Observable<BiasAnalysis> => {
    return this.httpService.delete<BiasAnalysis>('/api/collector/v1/bias-analyses/'+ id);
  }

  //---------------------------------------------------------------------------

  public getBiasSummary = (id:number, period : PeriodSelectorInfo): Observable<BiasSummaryResponse> => {
    let spec = Lib.query.createSpec(period, undefined, undefined, undefined, undefined)

    return this.httpService.get<BiasSummaryResponse>('/api/collector/v1/bias-analyses/'+ id+'/summary', { params: spec });
  }

  //---------------------------------------------------------------------------
  //--- Configs

  public getBiasConfigsByAnalysisId = (id: number): Observable<ListResponse<BiasConfig>> => {
    return this.httpService.get<ListResponse<BiasConfig>>('/api/collector/v1/bias-analyses/'+ id +'/configs', {});
  }

  //---------------------------------------------------------------------------

  public addBiasConfig = (id: number, bc : BiasConfig): Observable<BiasConfig> => {
    return this.httpService.post<BiasConfig>('/api/collector/v1/bias-analyses/'+ id +'/configs', bc);
  }

  //---------------------------------------------------------------------------

  public updateBiasConfig = (id: number, bc : BiasConfig): Observable<BiasConfig> => {
    return this.httpService.put<BiasConfig>('/api/collector/v1/bias-analyses/'+ id +'/configs/'+ bc.id, bc);
  }

  //---------------------------------------------------------------------------

  public deleteBiasConfig = (baId: number, id : number): Observable<boolean> => {
    return this.httpService.delete<boolean>('/api/collector/v1/bias-analyses/'+ baId +'/configs/'+ id);
  }

  //---------------------------------------------------------------------------

  public runBacktest = (id: number, req: BiasBacktestRequest): Observable<BiasBacktestResponse> => {
    let base = Lib.query.createSpec(req.period, undefined, undefined, undefined, undefined)
    let spec = {
      ...base,
      stopLoss     : req.stopLoss,
      takeProfit   : req.takeProfit,
      sessionConfig: JSON.stringify(req.session)
    }

    return this.httpService.get<BiasBacktestResponse>('/api/collector/v1/bias-analyses/'+ id +'/backtest', { params: spec });
  }
}

//=============================================================================
