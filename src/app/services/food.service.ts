import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Details } from '../models/card';
import { Environment } from '../../constants/routes';

@Injectable({
    providedIn: 'root'
})
export class FoodService {

    private readonly apiUrl = `${Environment.production}${Environment.routes.foodData}`;

    constructor(private http: HttpClient) { }

    getAllFoods(): Observable<Details[]> {
        return this.http.get<Details[]>(this.apiUrl);
    }

    getFoodById(id: number): Observable<Details> {
        return this.http.get<Details>(`${this.apiUrl}/${id}`);
    }

    addFood(food: Details): Observable<Details> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<Details>(this.apiUrl, food, { headers });
    }

    updateFood(id: number, food: Details): Observable<Details> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put<Details>(`${this.apiUrl}/${id}`, food, { headers });
    }

    deleteFood(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
