import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchGifsResponse } from '../interface/gif.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private _historial: string[] = [];
  private apiKey: string = 'gt8z8ALXYKu4E9IyqbS1DhJxwdJjheRH';
  private baseUrl: string = 'https://api.giphy.com/v1/gifs';

  public results: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.results = JSON.parse(localStorage.getItem('results')!) || [];
  }

  searchGifs(query: string) {
    query = query.toLowerCase();
    const hasValue = query.trim().length > 0;
    const theValueExists = this._historial.includes(query);

    if (hasValue && !theValueExists) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http
      .get<SearchGifsResponse>(`${this.baseUrl}/search`, { params })
      .subscribe((res) => {
        this.results = res.data;
        localStorage.setItem('results', JSON.stringify(this.results));
      });
  }
}
