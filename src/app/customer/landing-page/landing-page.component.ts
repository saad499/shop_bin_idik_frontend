import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  sidebarCollapsed = false;
  carouselIndex = 0;
  carouselImages = [
    'assets/images/video-games.jpg',
    'assets/images/supermarket.jpg',
    'assets/images/sport-loisir.jpg',
    'assets/images/warm-clothes.png',
    'assets/images/clot.jpg',
    'assets/images/electronics.jpg',
    'assets/images/sneakers.jpg',
    'assets/images/jouet.jpg'
  ];

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  nextImage(): void {
    this.carouselIndex = (this.carouselIndex + 1) % this.carouselImages.length;
  }

  prevImage(): void {
    this.carouselIndex = this.carouselIndex === 0 
      ? this.carouselImages.length - 1 
      : this.carouselIndex - 1;
  }

  goToImage(index: number): void {
    this.carouselIndex = index;
  }
}
