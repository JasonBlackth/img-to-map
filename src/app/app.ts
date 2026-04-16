import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Project } from './project/project';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Project],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
