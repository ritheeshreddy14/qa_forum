import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-question-form',
  template: `
    <div class="question-form">
      <h1>Ask a Question</h1>
      <mat-card>
        <mat-card-content>
          <form [formGroup]="questionForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" placeholder="Enter your question title">
              <mat-error *ngIf="questionForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="5" placeholder="Describe your question in detail"></textarea>
              <mat-error *ngIf="questionForm.get('description')?.hasError('required')">
                Description is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tags</mat-label>
              <input matInput formControlName="tags" placeholder="Enter tags separated by commas">
              <mat-hint>Example: angular, typescript, javascript</mat-hint>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" routerLink="/questions">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="questionForm.invalid">
                Submit Question
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class QuestionFormComponent {
  questionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.questionForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tags: ['']
    });
  }

  onSubmit(): void {
    if (this.questionForm.valid) {
      this.questionService.createQuestion(this.questionForm.value).subscribe({
        next: (question) => {
          this.snackBar.open('Question created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/questions', question.id]);
        },
        error: (error) => {
          console.error('Error creating question:', error);
          this.snackBar.open('Error creating question', 'Close', { duration: 3000 });
        }
      });
    }
  }
} 