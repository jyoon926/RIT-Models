import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/services/user';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit {
    user: User | undefined;

    constructor(
        private route: ActivatedRoute,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.getUser();
    }

    getUser(): void {
        const name = this.route.snapshot.paramMap.get('name');
        
        if (name != null) {            
            this.userService.getUser(name).subscribe(user => {
                this.user = user;
            });
        }
    }
}
