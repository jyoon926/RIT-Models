import { Component, HostListener } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
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
    cursorX = lerp (cursorX, mouseX, 0.15);
    cursorY = lerp (cursorY, mouseY, 0.15);
    update();
}

function lerp(start: number, end: number, amt: number) {
  return (1 - amt) * start + amt * end;
}

document.addEventListener('mouseover', function(e) {
    let element = e.target as HTMLElement;
    if (element.tagName.toLowerCase() === "a" && cursor) {
        cursor.classList.add("hover");
    }
});

document.addEventListener('mouseout', function(e) {
    let element = e.target as HTMLElement;
    if (element.tagName.toLowerCase() === "a" && cursor) {
        cursor.classList.remove("hover");
    }
});