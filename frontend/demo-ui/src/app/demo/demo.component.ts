import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient, HttpContext } from '@angular/common/http';
import { ErrorHandlerService } from '../core/services/error-handler.service';
import { SKIP_GLOBAL_ERROR } from '../core/interceptors/http-error.interceptor';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatSnackBarModule],
  template: `
    <mat-card style="text-align:center; padding: 20px; max-width:400px; margin: 40px auto;">
      <h2>Backend Demo Buttons</h2>
      <div style="display:flex; flex-direction:column; gap:12px; margin-top:20px;">
        <button mat-raised-button color="primary" (click)="success()">Success</button>
        <button mat-raised-button color="warn" (click)="error()">Error</button>
        <button mat-raised-button color="accent" (click)="upgrade()">Upgrade Required</button>
      </div>
    </mat-card>
  `,
})
export class DemoComponent {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
  ) {}

  success() {
    this.http.get('/api/demo/success').subscribe();
  }

  error() {
    this.http.get('/api/demo/error').subscribe();
  }

  upgrade() {
    this.http
      .get('/api/demo/upgrade', {
        context: new HttpContext().set(SKIP_GLOBAL_ERROR, true),
      })
      .subscribe({
        error: (err) => this.errorHandler.handle(err),
      });
  }
}
