import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    constructor(private userService: UserService, private authService: AuthService, private router: Router) { }

    logIn(email: string, password: string): void {
        this.authService.logIn(email, password).subscribe(
            (response: any) => {
                this.router.navigate(['/profile']);
            }
        );
    }

    loginFailed() {
        console.log("failed");
        let p = document.getElementById('failed');
        if (p != null) {
            p.style.opacity = "0.6";
        }
    }
}
