import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/services/user';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    user: User | undefined;

    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        public authService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.getUser();
    }

    getUser(): void {
        this.userService.getUser(this.authService.getLoggedInUser()).subscribe(
            response => {
                this.user = response;
                if (response == null)
                    this.router.navigate(['/login'])
            }
        );
    }

    logOut() {
        this.authService.logOut();
        this.router.navigate(['/login'])
    }
}
