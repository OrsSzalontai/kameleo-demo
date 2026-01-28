import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface ApiErrorPayload {
  code?: string;
  message?: string;
  traceId?: string;
  details?: unknown;
}

export interface ErrorHandlerOptions {
  override?: (apiError: ApiErrorPayload | undefined) => void;
}

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  constructor(private snackBar: MatSnackBar) {}

  handle(error: any, options?: ErrorHandlerOptions): void {
    // -------------------------------------------------
    // 1. OFFLINE / NETWORK (always global, never skipped)
    // -------------------------------------------------
    if (error?.status === 0 || error?.error instanceof ProgressEvent) {
      this.toast('Network error. Please check your connection.', 'Dismiss');
      return;
    }

    const apiError = error?.error?.error as ApiErrorPayload | undefined;

    const code = apiError?.code ?? 'UNKNOWN_ERROR';

    // -------------------------------------------------
    // 2. COMPONENT OVERRIDE
    // -------------------------------------------------
    if (options?.override) {
      options.override(apiError);
      return;
    }

    // -------------------------------------------------
    // 3. GLOBAL MAPPING
    // -------------------------------------------------
    switch (code) {
      case 'PLAN_UPGRADE_REQUIRED':
        this.snackBar
          .open(apiError?.message ?? 'Upgrade required', 'Upgrade now', {
            duration: 8000,
          })
          .onAction()
          .subscribe(() => window.open('https://kameleo.io/pricing', '_blank'));
        break;

      default:
        this.toast(apiError?.message ?? 'Something went wrong', 'Dismiss');
    }
  }

  // -------------------------------------------------
  // Helper for consistency
  // -------------------------------------------------
  private toast(message: string, action: string): void {
    this.snackBar.open(message, action, { duration: 5000 });
  }
}
