import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { User } from './user';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private userUrl = environment.serverUrl + '/user';
    private loggedInUser: any;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient
    ) {}

    register(user: User) {
        user.isadmin = false;        
        return this.http.post<User>(this.userUrl + "/register", user, this.httpOptions).pipe(tap((newUser: User) => {
            console.log('added user w/ id=' + newUser._id);
        }), catchError(this.handleError<User>('addUser')));
    }

    logIn(email: string, password: string) {
        const body = {"email": email , "password": password};
        return this.http.post(this.userUrl + '/login', body, this.httpOptions);
    }

    updateUser(user: User) {
        return this.http.put(`${this.userUrl}/${user._id}`, user, this.httpOptions).pipe(tap(_ => console.log('updated user id=' + user._id)), catchError(this.handleError<any>('updateUser')));
    }

    deleteUser(id: number): Observable<User> {
        const url = `${this.userUrl}/${id}`;
    
        return this.http.delete<User>(url, this.httpOptions).pipe(
            tap(_ => console.log(`deleted user id=${id}`)),
            catchError(this.handleError<User>('deleteUser'))
        );
    }

    findUsers(term: string): Observable<User[]> {
        if (!term.trim()) { return of([]); }
        return this.http.get<User[]>(`${this.userUrl}/?name=${term}`).pipe(
            tap(x => x.length ?
               console.log(`found users matching "${term}"`) :
               console.log(`no users matching "${term}"`)),
            catchError(this.handleError<User[]>('findUsers', []))
        );
    }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.userUrl}/users`).pipe(
            catchError(this.handleError<User[]>('users', []))
        );
    }

    getUser(name: string): Observable<User> {
        return this.http.get<User>(`${this.userUrl}/${name}`).pipe(
            tap(
                // _ => console.log(`fetched user ${name}`)
            ),
            catchError(this.handleError<User>(`getUser ${name}`))
        );
    }
    
    setLoggedInUser(user: any) {
        this.loggedInUser = user;
    }
  
    getLoggedInUser(): string {
        return this.loggedInUser;
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
