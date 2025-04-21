import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Answer } from '../models/answer.model';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  private apiUrl = 'http://localhost:3000/api/answers';

  constructor(private http: HttpClient) { }

  getAnswers(questionId: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiUrl}/question/${questionId}`);
  }

  createAnswer(answer: Answer): Observable<Answer> {
    return this.http.post<Answer>(this.apiUrl, answer);
  }

  likeAnswer(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/like`, {});
  }

  deleteAnswer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 