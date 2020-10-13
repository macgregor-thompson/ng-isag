import { Component, Input, OnInit } from '@angular/core';

import { Course } from '../../../_shared/models/course/course';
import { Hole } from '../../../_shared/models/course/hole';

@Component({
  selector: 'isag-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit {
  @Input() course: Course;
  @Input() rankings: boolean;

  frontNine = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Out',
  ];

  backNine = [
    '10', '11', '12', '13', '14', '15', '16', '17', '18', 'In', 'Total'
  ];

  constructor() { }

  ngOnInit(): void {
   // this.data = new MatTableDataSource(this.displayedColumns);
  }

}
