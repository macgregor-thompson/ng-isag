import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'isag-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  // bootstrap alerts
  @Input() alertClass: 'warning' | 'danger' | 'success' | 'primary' = 'warning';

  constructor() { }

  ngOnInit() {
  }

}
