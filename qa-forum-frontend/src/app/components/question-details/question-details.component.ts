import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { AnswerService } from '../../services/answer.service';
import { Question } from '../../models/question.model';
import { Answer } from '../../models/answer.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-question-details',
  template: `
    <div class="question-details" *ngIf="question">
      <mat-card class="question-card">
        <mat-card-header>
          <mat-card-title>{{ question.title }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>{{ question.description }}</p>
          <div *ngIf="question.tags" class="tags">
            <mat-chip-listbox>
              <mat-chip *ngFor="let tag of question.tags.split(',')">
                {{ tag.trim() }}
              </mat-chip>
            </mat-chip-listbox>
          </div>
        </mat-card-content>
        <mat-card-footer>
          <small class="footer-date">Posted on {{ question.created_at | date }}</small>
        </mat-card-footer>
      </mat-card>

      <h2>Answers</h2>
      <app-answer-form [questionId]="questionId" (answerAdded)="loadAnswers()"></app-answer-form>

      <mat-card *ngFor="let answer of answers" class="answer-card">
        <mat-card-content>
          <p>{{ answer.answer_text }}</p>
        </mat-card-content>
        <mat-card-actions>
          <app-like-button 
            [answerId]="answer.id || 0" 
            [likes]="answer.likes || 0" 
            (liked)="onAnswerLiked(answer)">
          </app-like-button>
          <button mat-icon-button color="warn" (click)="deleteAnswer(answer.id || 0)">
            <mat-icon>delete</mat-icon>
          </button>
        </mat-card-actions>
        <mat-card-footer>
          <small class="footer-date">Posted on {{ answer.created_at | date }}</small>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  
})
export class QuestionDetailsComponent implements OnInit {
  questionId: number = 0;
  question: Question | null = null;
  answers: Answer[] = [];

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.questionId = +params['id'];
      this.loadQuestion();
      this.loadAnswers();
    });
  }

  loadQuestion(): void {
    this.questionService.getQuestion(this.questionId).subscribe({
      next: (question) => {
        this.question = question;
      },
      error: (error) => {
        console.error('Error loading question:', error);
        this.snackBar.open('Error loading question', 'Close', { duration: 3000 });
      }
    });
  }

  loadAnswers(): void {
    this.answerService.getAnswers(this.questionId).subscribe({
      next: (answers) => {
        this.answers = answers;
      },
      error: (error) => {
        console.error('Error loading answers:', error);
        this.snackBar.open('Error loading answers', 'Close', { duration: 3000 });
      }
    });
  }

  onAnswerLiked(answer: Answer): void {
    if (answer.likes !== undefined) {
      answer.likes++;
    } else {
      answer.likes = 1;
    }
  }

  deleteAnswer(id: number): void {
    this.answerService.deleteAnswer(id).subscribe({
      next: () => {
        this.answers = this.answers.filter(answer => answer.id !== id);
        this.snackBar.open('Answer deleted successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error deleting answer:', error);
        this.snackBar.open('Error deleting answer', 'Close', { duration: 3000 });
      }
    });
  }
} 