import { Component, OnInit } from '@angular/core';

import { SpinnerService } from '../_core/services/spinner.service';
import { Rules } from '../_shared/models/rules';
import { StateService } from '../_core/services/state.service';
import { RulesService } from '../_core/services/rules.service';

@Component({
  selector: 'isag-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {
  rules: Rules;
  rulesHtmlCopy: string;
  editingRules = false;

  constructor(private spinnerService: SpinnerService,
              private rulesService: RulesService,
              public stateService: StateService) { }

  ngOnInit(): void {
    this.rulesService.getByYear().subscribe(r => {

      this.rules = r;
      this.rulesHtmlCopy = r.html;
    });
  }

  save(): void {
    this.rulesHtmlCopy = this.rules.html;
    this.rulesService.update(this.rules._id, {html: this.rules.html}).subscribe(() => this.editingRules = !this.editingRules);
  }

  cancel(): void {
    this.rules.html = this.rulesHtmlCopy;
    this.editingRules = !this.editingRules;
  }

}
