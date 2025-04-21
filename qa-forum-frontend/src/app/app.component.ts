import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <div class="toolbar-content">
        <div class="logo-section">
          <mat-icon class="logo-icon">forum</mat-icon>
          <span>QA Forum</span>
        </div>
        
        <div class="nav-section">
          <button mat-button routerLink="/questions" routerLinkActive="active">
            <mat-icon>question_answer</mat-icon>
            <span>Questions</span>
          </button>
          <button mat-button routerLink="/questions/new" routerLinkActive="active" class="ask-button">
            <mat-icon>add_circle</mat-icon>
            <span>Ask Question</span>
          </button>
        </div>
      </div>
    </mat-toolbar>

    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .toolbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      height: 80px;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .logo-icon {
        font-size: 32px;
        height: 32px;
        width: 32px;
      }

      span {
        font-size: 1.6rem;
        font-weight: 500;
      }
    }

    .nav-section {
      display: flex;
      align-items: center;
      gap: 12px;

      button {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 80px;
        padding: 0 24px;

        mat-icon {
          font-size: 24px;
          height: 24px;
          width: 24px;
          margin-right: 8px;
        }

        span {
          font-size: 1.1rem;
        }
      }

      .ask-button {
        margin-left: 8px;
        
        &:hover {
          background: rgba(255,255,255,0.2);
        }
      }
    }

    @media (max-width: 600px) {
      .nav-section button span {
        display: none;
      }
      
      .nav-section button mat-icon {
        margin: 0;
        font-size: 28px;
        height: 28px;
        width: 28px;
      }
      
      .logo-section {
        .logo-icon {
          font-size: 28px;
          height: 28px;
          width: 28px;
        }
        
        span {
          font-size: 1.4rem;
        }
      }
    }
  `]
})
export class AppComponent {
  title = 'QA Forum';
} 