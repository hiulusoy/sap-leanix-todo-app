import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  title = 'sap-leanix-todo-client';

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log('app works');
    console.log('Application Routes:', (this.router as any).config);
  }
}
