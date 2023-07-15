import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/services/user';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-profile',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
})
export class ModelComponent implements OnInit {
  user: User | undefined;
  images = new Map<string, any>();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    public authService: AuthService,
    private location: Location,
    private imageService: ImageService,
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    const username = this.route.snapshot.paramMap.get('username');

    if (username != null) {
      this.userService.getUser(username).subscribe((user) => {
        this.user = user;
        this.getImages();
      });
    }
  }

  getImages(): void {
    if (this.user && this.user.headshot) this.getImageFromService(this.user.headshot);
    if (this.user && this.user.bodyshot) this.getImageFromService(this.user.bodyshot);
  }

  getImageFromService(filename: string) {
    this.imageService.getImage(filename).subscribe(
      (data: Blob) => {
        this.createImageFromBlob(data, filename);
      },
      (error: any) => {
        console.log(error);
      },
    );
  }

  createImageFromBlob(image: Blob, filename: string) {
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.images.set(filename, reader.result);
      },
      false,
    );
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getImage(filename: string): string {
    if (filename && this.images.has(filename)) return this.images.get(filename);
    return '';
  }

  selectImage(filename: string): void {
    let dom = document.getElementById('image');
    if (dom) {
      dom.style.backgroundImage = 'url(' + this.getImage(filename) + ')';
    }
  }

  parseInt(n: number): number {
    return parseInt(n.toString());
  }

  back(): void {
    this.location.back();
  }
}
