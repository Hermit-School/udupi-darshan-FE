import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Details } from '../models/card';
import { API_BASE_URL } from 'src/constants/routes';

@Injectable({
    providedIn: 'root'
})
export class FoodService {

    private readonly resourceUrl = `${API_BASE_URL}/v1/food`;
  private readonly apiUrl = `${this.resourceUrl}/getFood`;

    constructor(private http: HttpClient) { }

    getAllFoods(): Observable<Details[]> {
        return this.http.get<Details[]>(this.apiUrl);
    }

    getFoodById(id: number): Observable<Details> {
        return this.http.get<Details>(`${this.resourceUrl}/${id}`);
    }

    addFood(food: Details): Observable<Details> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<Details>(`${this.resourceUrl}/postFood`, food, { headers });
    }

    updateFood(id: number, food: Details): Observable<Details> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put<Details>(`${this.resourceUrl}/updateFood/${id}`, food, { headers });
    }

    deleteFood(id: number): Observable<void> {
        return this.http.delete<void>(`${this.resourceUrl}/deleteFood/${id}`);
    }
}
