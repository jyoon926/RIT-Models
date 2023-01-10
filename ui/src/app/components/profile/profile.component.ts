import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/services/user';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    headshot?: FileList;
    bodyshot?: FileList;
    headshotName?: string;
    bodyshotName?: string;
    user: User | undefined;
    images = new Map<string, any>();

    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        public authService: AuthService,
        private imageService: ImageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.getUser();
    }

    getUser(): void {
        this.userService.getUser(this.authService.getLoggedInUser()).subscribe(
            response => {
                this.user = response;
                this.getImages();
                if (response == null)
                    this.router.navigate(['/login'])
            }
        );
    }

    getImages(): void {
        if (this.user && this.user.headshot)
            this.getImageFromService(this.user.headshot);
        if (this.user && this.user.bodyshot)
            this.getImageFromService(this.user.bodyshot);
    }
    
    getImageFromService(filename: string) {
        this.imageService.getImage(filename).subscribe((data: Blob) => {
            this.createImageFromBlob(data, filename);
        }, (error: any) => {
            console.log(error);
        });
    }

    createImageFromBlob(image: Blob, filename: string) {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
           this.images.set(filename, reader.result);
        }, false);
        if (image) {
           reader.readAsDataURL(image);
        }
    }

    getImage(filename: string): string {
        if (filename && this.images.has(filename))
            return this.images.get(filename);
        return "";
    }

    logOut() {
        this.authService.logOut();
        this.router.navigate(['/login'])
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
        this.uploadHeadshot(form);
    }

    uploadHeadshot(form: any) {
        if (this.headshot) {
            const file: File | null = this.headshot.item(0);
            if (file) {
                this.imageService.upload(file).subscribe({
                    next: (event: any) => {
                        this.headshotName = event.filename;
                        this.uploadBodyshot(form);
                    },
                    error: (err: any) => {
                        alert("Error uploading head shot.");
                    }
                });
            }
        } else {
            this.uploadBodyshot(form);
        }
    }

    uploadBodyshot(form: any) {
        if (this.bodyshot) {
            const file: File | null = this.bodyshot.item(0);
            if (file) {
                this.imageService.upload(file).subscribe({
                    next: (event: any) => {
                        this.bodyshotName = event.filename;
                        this.update(form);
                    },
                    error: (err: any) => {
                        alert("Error uploading body shot.");
                    }
                });
            }
        } else {
            this.update(form);
        }
    }
    
    selectHeadshot(event: any): void {
        if(event.target.files[0].size > 5000000) {
            console.log("no");
            event.target.value = "";
            alert("File cannot exceed 5MB.");
        } else {
            this.headshot = event.target.files;
        }
    }
    
    selectBodyshot(event: any): void {
        if(event.target.files[0].size > 5000000) {
            console.log("no");
            event.target.value = "";
            alert("File cannot exceed 5MB.");
        } else {
            this.bodyshot = event.target.files;
        }
    }

    update(form: any): void {
        let user = {
            "_id": this.user?._id,
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
            "headshot": this.headshotName ? this.headshotName : this.user?.headshot,
            "bodyshot": this.bodyshotName ? this.bodyshotName : this.user?.bodyshot
        };
        this.userService.updateUser(user as unknown as User).subscribe({
            next: (event: any) => {
                location.reload();
            },
            error: (err: any) => {
                alert("There was an unexpected error.");
            }
        });
    }

    togglePublic(user: User): void {
        user.public = !user.public;
        this.userService.updateUser(user).subscribe({
            next: (event: any) => {
                console.log("User is now " + (event.public?"public":"private"));
                
            }
        });
    }
}
