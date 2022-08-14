import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mazain-card',
  templateUrl: './mazain-card.component.html',
  styleUrls: ['./mazain-card.component.scss'],
})
export class MazainCardComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() { }

  async onClickInjectingBtn(){
    await this.router.navigate(['injecting']);
  }

}
