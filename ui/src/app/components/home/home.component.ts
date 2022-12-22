import { Component, HostBinding, HostListener } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';
import { User } from 'src/app/services/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    users: User[] = [];
    images = new Map<string, any>();
    
    constructor(
        private userService: UserService,
        private imageService: ImageService
    ) {}

    ngOnInit(): void {
        this.getUsers();
    }

    getUsers(): void {
        this.userService.getUsers().subscribe(users => {
            this.users = users;
            this.users.sort(() => Math.random() - 0.5);
            this.getImages();
        });
    }

    getImages(): void {
        this.users.forEach(user => {
            if (user.headshot)
                this.getImageFromService(user.headshot);
        });
    }
    
    getImageFromService(filename: string) {
        this.imageService.getImage(filename).subscribe(data => {
            this.createImageFromBlob(data, filename);
        }, error => {
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

    getImage(filename:string): string {
        if (filename && this.images.has(filename))
            return this.images.get(filename);
        return "";
    }
}