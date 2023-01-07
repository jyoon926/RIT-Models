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
            // this.users.sort(() => Math.random() - 0.5);
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

    random(): number {
        return Math.random() * 80 - 40;
    }
}

const images = document.getElementsByClassName("model-image");
let globalIndex = 0, last = { x: 0, y: 0 };
const activate = (image: HTMLElement, x: number, y: number) => {
    if (image) {
        image.style.left = `${x}px`;
        image.style.top = `${y}px`;
        image.style.zIndex = "" + globalIndex;
        image.classList.add("active");
        last = {x,y};
    }
}
const deactivate = (image: HTMLElement) => {
    if (image) {
        image.classList.remove("active");
    }
}
const distanceFromLast = (x: number, y: number) => {
    return Math.hypot(x - last.x, y - last.y);
}
window.onmousemove = e => {
    if (distanceFromLast(e.clientX, e.clientY) > (window.innerWidth / 20)) {
        const lead = images[globalIndex % images.length],
                tail = images[(globalIndex - Math.min(10, images.length)) % images.length];
        activate(lead as HTMLElement, e.clientX, e.clientY);
        // deactivate(tail as HTMLElement);
        
        globalIndex++;
    }
}