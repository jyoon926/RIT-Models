import { Component } from '@angular/core';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent {
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
}
