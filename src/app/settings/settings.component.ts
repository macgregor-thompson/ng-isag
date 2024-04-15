import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../_core/services/spinner.service';
import { StateService } from '../_core/services/state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'isag-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  selectedIndex: 0 | 1 | 2 | 3 = 0;

  routes = [
    { path: 'years', title: 'Years' },
    { path: 'courses', title: 'Courses' },
    { path: 'users', title: 'Users' },

  ];

  constructor(private spinnerService: SpinnerService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              public stateService: StateService) {
    this.spinnerService.stop();
  }

  ngOnInit(): void {
    const tab = this.activatedRoute.snapshot.paramMap.get('tab');
    this.stateService.setTitle(`Settings | ${this.toTitle(tab)}`);
    switch (tab.toLowerCase()) {
      case 'courses':
        this.selectedIndex = 1;
        break;
      case 'users':
        this.selectedIndex = 2;
        break;
      case 'years':
      default:
        this.selectedIndex = 0;
        break;
    }
  }

  updateQueryParam(event: MatTabChangeEvent) {
    this.stateService.setTitle(`Settings | ${event.tab.textLabel}`);
    this.router.navigate(['settings/', event.tab.textLabel.toLowerCase()], );
  }

  toTitle(str: string): string {
    return str.replace(/(^|\s)\S/g, function (t) { return t.toUpperCase(); });
  }

}
