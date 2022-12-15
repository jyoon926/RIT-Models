import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { User } from './user';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private userUrl = environment.serverUrl + '/user/';
    private loginSuccess!: () => void;
    private loginFailed!: () => void;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {}

    register(user: User) {
        return this.http.post<User>(this.userUrl + "/register", user, this.httpOptions).pipe(tap((newUser: User) => {
            this.log('added user w/ id=' + newUser._id);
        }), catchError(this.handleError<User>('addUser')));
    }

    logIn(username: string, password: string) {
        const body = {"username": username , "password": password};
        console.log(body);
        return this.http.put(this.userUrl + '/login', body, this.httpOptions).pipe(tap({
            next: () => {
                this.loginSuccess();
            }, error: e => {
                this.loginFailed();
            }
        }));
    }

    updateUser(user: User) {
        return this.http.put(this.userUrl, user, this.httpOptions).pipe(tap(_ => this.log('updated user id=' + user._id)), catchError(this.handleError<any>('updateUser')));
    }

    deleteUser(id: number): Observable<User> {
        const url = `${this.userUrl}/${id}`;
    
        return this.http.delete<User>(url, this.httpOptions).pipe(
            tap(_ => this.log(`deleted user id=${id}`)),
            catchError(this.handleError<User>('deleteUser'))
        );
    }

    findUsers(term: string): Observable<User[]> {
        if (!term.trim()) { return of([]); }
        return this.http.get<User[]>(`${this.userUrl}/?name=${term}`).pipe(
            tap(x => x.length ?
               this.log(`found users matching "${term}"`) :
               this.log(`no users matching "${term}"`)),
            catchError(this.handleError<User[]>('findUsers', []))
        );
    }

    onLoginSuccess(fn: () => void) {
        this.loginSuccess = fn;
    }

    onLoginFailed(fn: () => void) {
        this.loginFailed = fn;
    }

    public log(message: string) {
        this.messageService.add(`UserService: ${message}`);
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
    
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
    
        // TODO: better job of transforming error for user consumption
        this.log(`${operation} failed: ${error.message}`);
    
        // Let the app keep running by returning an empty result.
        return of(result as T);
        };
    }
}
