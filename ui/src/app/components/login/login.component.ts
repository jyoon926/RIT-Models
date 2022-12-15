import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    constructor(private userService: UserService, private router: Router) { }
  
    ngOnInit(): void {
        this.userService.onLoginSuccess(this.loginSuccess.bind(this));
        this.userService.onLoginFailed(this.loginFailed.bind(this));
      }
    

    logIn(username: string, password: string): void {
        username = username.trim();
        if (!username || !password) {
            this.loginFailed();
            return;
        } else {
            this.userService.logIn(username, password).subscribe();
        }
    }

    loginSuccess() {
        this.router.navigate(['profile']);
    }

    loginFailed() {
        console.log("failed");
        let p = document.getElementById('failed');
        if (p != null) {
            p.style.opacity = "0.6";
        }
    }
}
