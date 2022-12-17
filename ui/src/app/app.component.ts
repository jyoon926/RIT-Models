import { Component, HostListener } from '@angular/core';
import { UserService } from './services/user.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    subscriptions: Array<Subscription> = [];

    constructor(
        private userService: UserService
    ) {
        // this.subscriptions.push(
        //     this.userService.register().subscribe({
        //         next: (v) => console.log(v),
        //         error: (e) => console.log(e)
        //     })
        // );
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }
}

let cursor = document.getElementById('cursor');
let cursorX = 0;
let cursorY = 0;
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor = document.getElementById('cursor');
});

function update() {
    if (cursor) {
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
    }
}

setInterval(move, 1000/60);

function move() {
    cursorX = lerp (cursorX, mouseX, 0.2);
    cursorY = lerp (cursorY, mouseY, 0.2);
    update();
}

function lerp(start: number, end: number, amt: number) {
  return (1 - amt) * start + amt * end;
}

document.addEventListener('mouseover', function(e) {
    let element = e.target as HTMLElement;
    if (hoverElement(element) && cursor) {
        cursor.classList.add("hover");
    }
});

document.addEventListener('mouseout', function(e) {
    let element = e.target as HTMLElement;
    if (hoverElement(element) && cursor) {
        cursor.classList.remove("hover");
    }
});

function hoverElement(e: HTMLElement) {
    return (e.tagName.toLowerCase() === "a" || e.tagName.toLowerCase() === "button" || e.tagName.toLowerCase() === "input" || e.tagName.toLowerCase() === "label");
}