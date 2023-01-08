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
    displayedUsers: User[] = [];
    
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
            this.displayedUsers = this.users;
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

    floor(n: number): number {
        return Math.floor(n);
    }

    fillSlider(from: HTMLInputElement, to: HTMLInputElement, controlSlider: HTMLInputElement) {
        const max = parseInt(to.max);
        const min = parseInt(to.min);
        const start = parseInt(from.value);
        const end = parseInt(to.value);
        let rangeDistance = max - min;
        const fromPosition = start - min;
        const toPosition = end - min;
        let sliderColor = "#aaa";
        let fillColor = "#000";
        controlSlider.style.background = `linear-gradient(
          to right,
          ${sliderColor} 0%,
          ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
          ${fillColor} ${((fromPosition)/(rangeDistance))*100}%,
          ${fillColor} ${(toPosition)/(rangeDistance)*100}%, 
          ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
          ${sliderColor} 100%)`;
    }
    
    changeFrom(fromSlider: any, toSlider: any, display: any, type: number) {
        let from: number = parseInt((fromSlider as HTMLInputElement).value);
        let to: number = parseInt((toSlider as HTMLInputElement).value);
        if (from > to) {
            fromSlider.value = to;
            from = to;
        }
        if (type == 0)
            (display as HTMLElement).innerHTML = Math.floor(from / 12) + "' " + (from % 12) + "\"";
        else if (type == 1)
            (display as HTMLElement).innerHTML = from + "\"";
        else
            (display as HTMLElement).innerHTML = from + "";
        this.fillSlider(fromSlider, toSlider, toSlider);
    }
    
    changeTo(fromSlider: any, toSlider: any, display: any, type: number) {
        let from: number = parseInt((fromSlider as HTMLInputElement).value);
        let to: number = parseInt((toSlider as HTMLInputElement).value);
        if (from > to) {
            toSlider.value = from;
            to = from;
        }
        if (type == 0)
            (display as HTMLElement).innerHTML = Math.floor(to / 12) + "' " + (to % 12) + "\"";
        else if (type == 1)
            (display as HTMLElement).innerHTML = to + "\"";
        else
            (display as HTMLElement).innerHTML = to + "";
        this.fillSlider(fromSlider, toSlider, toSlider);
    }

    addUserToDisplayed(user: User) {
        // Gender
        if (user.gender == "Man" && !(<HTMLInputElement>document.getElementById("men")).checked) return;
        if (user.gender == "Woman" && !(<HTMLInputElement>document.getElementById("women")).checked) return;
        if (user.gender == "Non-binary/non-conforming" && !(<HTMLInputElement>document.getElementById("non-binary")).checked) return;
        if (user.gender == "Other" && !(<HTMLInputElement>document.getElementById("other-gender")).checked) return;
        // Height
        if (user.height > parseInt((<HTMLInputElement>document.getElementById("heightTo")).value)) return;
        if (user.height < parseInt((<HTMLInputElement>document.getElementById("heightFrom")).value)) return;
        // Waist
        if (user.waist > parseInt((<HTMLInputElement>document.getElementById("waistTo")).value)) return;
        if (user.waist < parseInt((<HTMLInputElement>document.getElementById("waistFrom")).value)) return;
        // Hip
        if (user.hip > parseInt((<HTMLInputElement>document.getElementById("hipTo")).value)) return;
        if (user.hip < parseInt((<HTMLInputElement>document.getElementById("hipFrom")).value)) return;
        // Chest
        if (user.chest > parseInt((<HTMLInputElement>document.getElementById("chestTo")).value)) return;
        if (user.chest < parseInt((<HTMLInputElement>document.getElementById("chestFrom")).value)) return;
        // Shoe
        if (user.shoe > parseInt((<HTMLInputElement>document.getElementById("shoeTo")).value)) return;
        if (user.shoe < parseInt((<HTMLInputElement>document.getElementById("shoeFrom")).value)) return;
        // Hair
        if (user.hair == "Black" && !(<HTMLInputElement>document.getElementById("hair-black")).checked) return;
        if (user.hair == "Brown" && !(<HTMLInputElement>document.getElementById("hair-brown")).checked) return;
        if (user.hair == "Blue" && !(<HTMLInputElement>document.getElementById("hair-blue")).checked) return;
        if (user.hair == "Hazel" && !(<HTMLInputElement>document.getElementById("hair-hazel")).checked) return;
        if (user.hair == "Green" && !(<HTMLInputElement>document.getElementById("hair-green")).checked) return;
        if (user.hair == "Gray" && !(<HTMLInputElement>document.getElementById("hair-gray")).checked) return;
        if (user.hair == "Red" && !(<HTMLInputElement>document.getElementById("hair-red")).checked) return;
        if (user.hair == "Amber" && !(<HTMLInputElement>document.getElementById("hair-amber")).checked) return;
        if (user.hair == "Other" && !(<HTMLInputElement>document.getElementById("hair-other")).checked) return;
        // Eyes
        if (user.eyes == "Black" && !(<HTMLInputElement>document.getElementById("eyes-black")).checked) return;
        if (user.eyes == "Brown" && !(<HTMLInputElement>document.getElementById("eyes-brown")).checked) return;
        if (user.eyes == "Blonde" && !(<HTMLInputElement>document.getElementById("eyes-blonde")).checked) return;
        if (user.eyes == "Red" && !(<HTMLInputElement>document.getElementById("eyes-red")).checked) return;
        if (user.eyes == "Gray" && !(<HTMLInputElement>document.getElementById("eyes-gray")).checked) return;
        if (user.eyes == "White" && !(<HTMLInputElement>document.getElementById("eyes-white")).checked) return;
        if (user.eyes == "Blue" && !(<HTMLInputElement>document.getElementById("eyes-blue")).checked) return;
        if (user.eyes == "Purple" && !(<HTMLInputElement>document.getElementById("eyes-purple")).checked) return;
        if (user.eyes == "Pink" && !(<HTMLInputElement>document.getElementById("eyes-pink")).checked) return;
        if (user.eyes == "Green" && !(<HTMLInputElement>document.getElementById("eyes-green")).checked) return;
        if (user.eyes == "Other" && !(<HTMLInputElement>document.getElementById("eyes-other")).checked) return;
        this.displayedUsers.push(user);
    }

    changeFilters() {
        this.displayedUsers = [];
        this.users.forEach(user => {
            this.addUserToDisplayed(user);
        });
    }
}