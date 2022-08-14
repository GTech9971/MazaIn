import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mazai-showcase',
  templateUrl: './mazai-showcase.component.html',
  styleUrls: ['./mazai-showcase.component.scss'],
})
export class MazaiShowcaseComponent implements OnInit {

  mazaiCount: number = 5;


  mazaiStyles: MazaiStyle[];

  constructor() {
    this.mazaiStyles = [];
    for (let i = 0; i < 5; i++) {
      let deg: number = Math.random() * 90;
      deg = Math.floor(deg);
      this.mazaiStyles.push({ deg: deg });
    }

  }

  ngOnInit() { }

}

interface MazaiStyle {
  deg: number;
}