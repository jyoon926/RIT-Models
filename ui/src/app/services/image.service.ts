import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap, Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
    private imageUrl = environment.serverUrl + '/images/';
    constructor(
        private http: HttpClient
    ) {}

    upload(file: File) {
        const formData: FormData = new FormData();

        formData.append('file', file);
        console.log("upload");
        
        return this.http.post<File>(`${this.imageUrl}uploadfile`, formData).pipe(tap((message) => 
            {console.log(message);}, (error) => {console.log(error);
            }
        ));
    }

    getImage(filename: string): Observable<Blob> {
        const url = `${this.imageUrl}/${filename}`;
        return this.http.get(url, { responseType: 'blob' });
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     *
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }
}
