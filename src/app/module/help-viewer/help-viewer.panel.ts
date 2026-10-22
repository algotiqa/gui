//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, ChangeDetectionStrategy} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {ActivatedRoute, Router} from '@angular/router';
import {SafeHtml} from "@angular/platform-browser";

import {ModuleTitlePanel} from "../../component/panel/module-title/module-title.panel";
import {LabelService} from "../../service/label.service";
import {EventBusService} from "../../service/eventbus.service";
import {AbstractPanel} from "../../component/abstract.panel";
import {HelpService} from "../../service/help.service";
import {HelpSubtopic, HelpTocGroup, HelpTopic} from "../../model/help";

//=============================================================================

@Component({
  selector   : 'help-viewer',
  templateUrl: './help-viewer.panel.html',
  styleUrl   : './help-viewer.panel.scss',
  imports: [MatIconModule, ModuleTitlePanel],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone : true
})

//=============================================================================

export class HelpViewerPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  title       : string          = "";
  searchText  : string          = "";
  toc         : HelpTocGroup[]  = [];
  filteredToc : HelpTocGroup[]  = [];

  topic    : string = "";
  subtopic : string = "";

  content  : SafeHtml | undefined = undefined;
  loading  : boolean = false;
  notFound : boolean = false;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private route            : ActivatedRoute,
              private helpService      : HelpService) {

    super(eventBusService, labelService, router, "module.help");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.topic    = this.route.snapshot.paramMap.get("topic")    || "";
    this.subtopic = this.route.snapshot.paramMap.get("subtopic") || "";

    this.helpService.loadIndex().subscribe(toc => {
      this.toc         = toc.toc || [];
      this.filteredToc = this.toc;

      this.selectRequested();
    });
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onCloseClick() {
    window.close()
  }

  //-------------------------------------------------------------------------

  onSearchChange(value : string) {
    this.searchText  = value;
    this.filteredToc = this.filterToc(value);
  }

  //-------------------------------------------------------------------------

  onSubtopicClick(topic : HelpTopic, subtopic : HelpSubtopic) {
    this.select(topic.code, subtopic.code, subtopic.label);
  }

  //-------------------------------------------------------------------------

  onContentClick(event : MouseEvent) {
    let target = event.target as HTMLElement | null;
    let anchor = target?.closest('a');
    let href   = anchor?.getAttribute('href') || "";

    let match = href.match(/\/help\/([^/]+)\/([^/]+)\/main\.adoc$/);

    if (match == null) {
      return;
    }

    event.preventDefault();

    let topicCode    = match[1];
    let subtopicCode = match[2];
    let label        = this.findLabel(topicCode, subtopicCode) || subtopicCode;

    this.select(topicCode, subtopicCode, label);
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private selectRequested() {
    let label : string | undefined = undefined;

    if (this.topic != "") {
      let subtopic : HelpSubtopic | undefined = undefined;

      for (let group of this.toc) {
        for (let topic of group.topics) {
          if (topic.code == this.topic) {
            subtopic = topic.subtopics.find(s => s.code == this.subtopic) || topic.subtopics[0];
            break;
          }
        }

        if (subtopic != undefined) {
          break;
        }
      }

      if (subtopic != undefined) {
        this.select(this.topic, subtopic.code, subtopic.label);
        return;
      }
    }

    //--- Fallback : first subtopic available in the tree

    for (let group of this.toc) {
      for (let topic of group.topics) {
        if (topic.subtopics.length > 0) {
          label = topic.subtopics[0].label;
          this.select(topic.code, topic.subtopics[0].code, label);
          return;
        }
      }
    }
  }

  //-------------------------------------------------------------------------

  private select(topic : string, subtopic : string, label : string) {
    this.topic    = topic;
    this.subtopic = subtopic;
    this.title    = label;

    this.router.navigate(['/', 'module', 'help-viewer', topic, subtopic]).then(() => {});

    this.loadContent(topic, subtopic);
  }

  //-------------------------------------------------------------------------

  private loadContent(topic : string, subtopic : string) {
    this.loading  = true;
    this.notFound = false;
    this.content  = undefined;

    this.helpService.loadContent({ topic : topic, subtopic : subtopic }).subscribe({
      next    : html  => { this.content  = html;  this.loading = false; },
      error   : ()    => { this.notFound = true; this.loading = false; }
    });
  }

  //-------------------------------------------------------------------------

  private filterToc(search : string) : HelpTocGroup[] {
    let s : string = search.trim().toLowerCase();

    if (s == "") {
      return this.toc;
    }

    let result : HelpTocGroup[] = [];

    for (let group of this.toc) {
      if (this.matches(group.title, s)) {
        result.push(group);
        continue;
      }

      let topics : HelpTopic[] = [];

      for (let topic of group.topics) {
        if (this.matches(topic.label, s) || this.matches(topic.code, s)) {
          topics.push(topic);
          continue;
        }

        let subtopics = topic.subtopics.filter(sub => this.matches(sub.label, s) || this.matches(sub.code, s));

        if (subtopics.length > 0) {
          topics.push({ code : topic.code, label : topic.label, subtopics : subtopics });
        }
      }

      if (topics.length > 0) {
        result.push({ title : group.title, topics : topics });
      }
    }

    return result;
  }

  //-------------------------------------------------------------------------

  private matches(value : string | undefined, search : string) : boolean {
    return (value != undefined && value.toLowerCase().includes(search));
  }

  //-------------------------------------------------------------------------

  private findLabel(topicCode : string, subtopicCode : string) : string | undefined {
    for (let group of this.toc) {
      for (let topic of group.topics) {
        if (topic.code == topicCode) {
          return topic.subtopics.find(s => s.code == subtopicCode)?.label;
        }
      }
    }

    return undefined;
  }

  //-------------------------------------------------------------------------

  isSelected(topic : HelpTopic, subtopic : HelpSubtopic) : boolean {
    return (topic.code == this.topic && subtopic.code == this.subtopic);
  }
}

//=============================================================================
