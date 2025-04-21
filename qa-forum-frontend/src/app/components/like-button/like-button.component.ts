import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AnswerService } from '../../services/answer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-like-button',
  template: `
    <button mat-button color="primary" (click)="onLike()">
      <mat-icon>thumb_up</mat-icon>
      <span>{{ likes }} Likes</span>
    </button>
  `,
  styles: [`
    button {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  `]
})
export class LikeButtonComponent {
  @Input() answerId!: number;
  @Input() likes: number = 0;
  @Output() liked = new EventEmitter<void>();

  constructor(
    private answerService: AnswerService,
    private snackBar: MatSnackBar
  ) { }

  onLike(): void {
    this.answerService.likeAnswer(this.answerId).subscribe({
      next: () => {
        this.liked.emit();
      },
      error: (error) => {
        console.error('Error liking answer:', error);
        this.snackBar.open('Error liking answer', 'Close', { duration: 3000 });
      }
    });
  }
} 