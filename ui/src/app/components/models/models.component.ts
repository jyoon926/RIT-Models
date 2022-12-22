import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/services/user';

import { UserService } from 'src/app/services/user.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {
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
            this.users = this.users.sort((a, b) => {
                if (a.firstname < b.firstname) {
                    return -1;
                } else if (a.firstname > b.firstname) {
                    return 1;
                } return 0;
            });
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

    array(n: number) {
        return Array(n);
    }

    dropdown(e: EventTarget | null) {
        if (e != null) {
            let open = (e as HTMLElement).classList.contains("open");            
            let options = document.getElementsByClassName("select-child");
            if (options != undefined) {
                for (let i = 0; i < options.length; ++i) {
                    options[i].classList.remove("open");
                }
            }
            let children: HTMLCollection | undefined = (e as HTMLElement).parentElement?.children;
            if (children != undefined) {
                for (let i = 0; i < children.length; ++i) {
                    if (!open)
                        children[i].classList.add("open");
                }
            }
        }
    }

    parseInt(n: number): number {
        return parseInt(n.toString());
    }
}
