import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnswerService } from '../../services/answer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-answer-form',
  template: `
    <mat-card>
      <mat-card-content>
        <form [formGroup]="answerForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Your Answer</mat-label>
            <textarea matInput formControlName="answer_text" rows="4" placeholder="Write your answer here"></textarea>
            <mat-error *ngIf="answerForm.get('answer_text')?.hasError('required')">
              Answer text is required
            </mat-error>
          </mat-form-field>

          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="answerForm.invalid">
              Submit Answer
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  `]
})
export class AnswerFormComponent {
  @Input() questionId!: number;
  @Output() answerAdded = new EventEmitter<void>();

  answerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private answerService: AnswerService,
    private snackBar: MatSnackBar
  ) {
    this.answerForm = this.fb.group({
      answer_text: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.answerForm.valid) {
      const answer = {
        question_id: this.questionId,
        answer_text: this.answerForm.value.answer_text,
        likes: 0
      };

      this.answerService.createAnswer(answer).subscribe({
        next: () => {
          this.answerForm.reset();
          this.answerAdded.emit();
          this.snackBar.open('Answer posted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error posting answer:', error);
          this.snackBar.open('Error posting answer', 'Close', { duration: 3000 });
        }
      });
    }
  }
} 