import { Component, OnInit } from '@angular/core';
import { GolferService } from '../_core/services/golfer.service';
import { Golfer } from '../_shared/models/golfer';

@Component({
  selector: 'isag-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  golfers: Golfer[];

  constructor(private golferService: GolferService) { }

  ngOnInit(): void {
    this.golferService.getAllGolfers().subscribe(g => this.golfers = g);
  }

}
