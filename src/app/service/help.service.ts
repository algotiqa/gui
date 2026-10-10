//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Injectable}          from '@angular/core';
import {Observable, map}     from 'rxjs';
import {HttpClient}          from '@angular/common/http';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {parse}               from 'yaml';

import {HttpService}         from './http.service';
import {HelpSelection, HelpToc} from '../model/help';

//=============================================================================

declare const Asciidoctor : () => any;

//=============================================================================

@Injectable()
export class HelpService {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  private static LANG_PATH      : string = "assets/lang/en";
  private static HELP_PATH      : string = "help";
  private static INDEX_FILE     : string = "index.yaml";
  private static CONTENT_FILE   : string = "main.adoc";

  private asciidoctor : any = Asciidoctor();

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(private httpService : HttpService,
              private httpClient  : HttpClient,
              private sanitizer   : DomSanitizer) {
  }

  //-------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------

  public loadIndex() : Observable<HelpToc> {
    let file : string = this.buildPath(HelpService.HELP_PATH) +"/"+ HelpService.INDEX_FILE;

    return this.httpService.get<string>(file, { responseType : "text" })
      .pipe(map(data => parse(data.toString()) as HelpToc));
  }

  //-------------------------------------------------------------------------

  public loadContent(selection : HelpSelection) : Observable<SafeHtml> {
    let folder : string = this.buildPath(HelpService.HELP_PATH +"/"+ selection.topic +"/"+ selection.subtopic);
    let file   : string = folder +"/"+ HelpService.CONTENT_FILE;

    let options = {
      safe       : 'unsafe' as any,
      standalone : false,
      attributes : {
        imagesdir : folder
      }
    };

    return this.httpClient.get(file, { responseType : "text" })
      .pipe(map(adoc => this.sanitizer.bypassSecurityTrustHtml(this.asciidoctor.convert(adoc, options) as string)));
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private buildPath(folder : string) : string {
    return HelpService.LANG_PATH +"/"+ folder;
  }
}

//=============================================================================
