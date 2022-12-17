import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/services/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    constructor(private userService: UserService, private router: Router) { }
  
    ngOnInit(): void {
        this.userService.onLoginSuccess(this.loginSuccess.bind(this));
    }

    register(form: any): void {
        if (!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(form.email))
            return;
        let user = {
            "email": form.email.trim(),
            "password": form.password,
            "firstname": form.firstname.trim().charAt(0).toUpperCase() + form.firstname.trim().slice(1).toLowerCase(),
            "lastname": form.lastname.trim().charAt(0).toUpperCase() + form.lastname.trim().slice(1).toLowerCase(),
            "fullname": form.firstname.trim().toLowerCase() + form.lastname.trim().toLowerCase(),
            "gender": form.gender,
            "race": form.race,
            "height": form.height as number,
            "waist": form.waist,
            "hip": form.hip,
            "chest": form.chest,
            "eyes": form.eyes,
            "shoe": form.shoe,
            "hair": form.hair,
            "bio": form.bio.trim()
        };
        this.userService.register(user as unknown as User).subscribe();
        this.userService.logIn(user.email, user.password).subscribe();
    }

    logIn(email: string, password: string): void {
        this.userService.logIn(email, password).subscribe();
    }

    loginSuccess() {
        // this.router.navigate(['profile']);
    }

    keydown(event: any) {
        let key = event.key;
        let value = event.target.value;
        if (key !== 'Backspace' && key !== 'Tab') {
            if (!key.match(/^\d$/) || value.length >= 2) {
                event.preventDefault();
            }
        }
    }
}