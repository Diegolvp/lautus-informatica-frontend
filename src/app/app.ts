import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./auth/login/login.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('lautus-informatica');
}
