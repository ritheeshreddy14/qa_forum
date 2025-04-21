import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-question-list',
  template: `
    <div class="question-list">
      

      <div class="content">
        <h1>Questions</h1>
        
        <!-- Loading State -->
        <mat-progress-spinner
          *ngIf="isLoading"
          mode="indeterminate"
          diameter="40"
          class="loading-spinner">
        </mat-progress-spinner>

        <!-- Debug Info -->
        <div class="debug-info" *ngIf="!isLoading && questions.length === 0">
          <p>No questions found in database. Please add some questions.</p>
          <button mat-raised-button color="primary" routerLink="/questions/new">
            Add Question
          </button>
        </div>

        <!-- Questions List -->
        <div class="questions-container" *ngIf="!isLoading && filteredQuestions.length > 0">
          <mat-card 
            *ngFor="let question of filteredQuestions" 
            class="question-card"
            [routerLink]="['/questions', question.id]"
            role="button"
          >
            <mat-card-header>
              <mat-card-title>
                {{ question.title }}
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>{{ question.description }}</p>
              <div *ngIf="question.tags" class="tags">
                <mat-chip-listbox>
                  <mat-chip *ngFor="let tag of question.tags.split(',')" (click)="addTagFilter(tag.trim()); $event.stopPropagation()">
                    {{ tag.trim() }}
                  </mat-chip>
                </mat-chip-listbox>
              </div>
            </mat-card-content>
            <mat-card-footer>
              <small class="footer-date">Posted on {{ question.created_at | date }}</small>
            </mat-card-footer>
          </mat-card>
        </div>

        <!-- Active Filters -->
        <div class="active-filters" *ngIf="activeFilters.length > 0">
          <mat-chip-listbox>
            <mat-chip *ngFor="let filter of activeFilters" (removed)="removeFilter(filter)">
              {{filter}}
              <button matChipRemove>
                <mat-icon>cancel</mat-icon>
              </button>
            </mat-chip>
          </mat-chip-listbox>
        </div>

        <!-- No Results Message -->
        <mat-card class="no-results" *ngIf="!isLoading && filteredQuestions.length === 0 && questions.length > 0">
          <mat-card-content>
            <p>No questions found matching your criteria.</p>
            <button mat-button (click)="clearFilters()">Clear Filters</button>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `
})
export class QuestionListComponent implements OnInit {
  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  searchControl = new FormControl('');
  sortControl = new FormControl('latest');
  activeFilters: string[] = [];
  isLoading = true;

  constructor(
    private questionService: QuestionService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadQuestions();
    this.setupSearchListener();
    this.setupSortListener();
  }

  setupSearchListener(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.filterQuestions();
    });
  }

  setupSortListener(): void {
    this.sortControl.valueChanges.subscribe(() => {
      this.sortQuestions();
    });
  }

  loadQuestions(): void {
    this.isLoading = true;
    console.log('Loading questions...');
    this.questionService.getQuestions().subscribe({
      next: (questions) => {
        console.log('Questions loaded:', questions);
        this.questions = questions;
        this.filterQuestions();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading questions:', error);
        this.snackBar.open('Error loading questions', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  filterQuestions(): void {
    console.log('Filtering questions. Total questions:', this.questions.length);
    let filtered = [...this.questions];
    const searchTerm = this.searchControl.value?.toLowerCase() || '';

    if (searchTerm) {
      filtered = filtered.filter(question => 
        question.title.toLowerCase().includes(searchTerm) ||
        question.description.toLowerCase().includes(searchTerm) ||
        question.tags?.toLowerCase().includes(searchTerm)
      );
    }

    if (this.activeFilters.length > 0) {
      filtered = filtered.filter(question => 
        this.activeFilters.every(filter => 
          question.tags?.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }

    this.filteredQuestions = filtered;
    console.log('Filtered questions:', this.filteredQuestions.length);
    this.sortQuestions();
  }

  sortQuestions(): void {
    const sortOrder = this.sortControl.value || 'latest';
    this.filteredQuestions.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });
  }

  addTagFilter(tag: string): void {
    if (!this.activeFilters.includes(tag)) {
      this.activeFilters.push(tag);
      this.filterQuestions();
    }
  }

  addTagFilterFromDropdown(tag: string): void {
    this.addTagFilter(tag);
  }

  removeFilter(filter: string): void {
    this.activeFilters = this.activeFilters.filter(f => f !== filter);
    this.filterQuestions();
  }

  clearFilters(): void {
    this.activeFilters = [];
    this.searchControl.setValue('');
    this.sortControl.setValue('latest');
    this.filterQuestions();
  }
} 