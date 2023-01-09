import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/services/user';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    headshot?: FileList;
    bodyshot?: FileList;
    headshotName?: string;
    bodyshotName?: string;

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private imageService: ImageService,
        private router: Router) { }

    register(form: any): void {        
        if (!/^([a-zA-Z0-9_\-\.]+)@rit.edu$/.test(form.email))
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
            "bio": form.bio.trim(),
            "instagram": form.instagram.trim(),
            "headshot": this.headshotName? this.headshotName : "",
            "bodyshot": this.bodyshotName? this.bodyshotName : ""
        };
        this.userService.register(user as unknown as User).subscribe(() => {
            this.authService.logIn(user.email, user.password).subscribe(res => {
                this.router.navigate(['/profile']);
            }, err => {
                alert("There was an unexpected error while registering.");
            });
        });
    }

    logIn(email: string, password: string): void {
        this.authService.logIn(email, password).subscribe();
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

    upload(form: any): void {
        if (this.headshot) {
            const file: File | null = this.headshot.item(0);
            if (file) {
                this.imageService.upload(file).subscribe({
                    next: (event: any) => {
                        this.headshotName = event.filename;
                        if (this.bodyshot) {
                            const file: File | null = this.bodyshot.item(0);
                            if (file) {
                                this.imageService.upload(file).subscribe({
                                    next: (event: any) => {
                                        this.bodyshotName = event.filename;
                                        this.register(form);
                                    },
                                    error: (err: any) => {
                                        alert("Error uploading body shot.");
                                    }
                                });
                            }
                        }},
                    error: (err: any) => {
                        alert("Error uploading head shot.");
                    }
                });
            }
        }
    }
    
    selectHeadshot(event: any): void {
        if(event.target.files[0].size > 10000000) {
            console.log("no");
            event.target.value = "";
            alert("File cannot exceed 10MB.");
        } else {
            this.headshot = event.target.files;
        }
    }
    
    selectBodyshot(event: any): void {
        if(event.target.files[0].size > 10000000) {
            console.log("no");
            event.target.value = "";
            alert("File cannot exceed 10MB.");
        } else {
            this.bodyshot = event.target.files;
        }
    }
}