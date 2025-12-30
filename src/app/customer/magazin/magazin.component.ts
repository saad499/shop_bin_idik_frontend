import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommercantService } from '../../services/commercant/commercant.service';
import { CommercantDto } from '../../dto/CommercantDto';

@Component({
  selector: 'app-magazin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './magazin.component.html',
  styleUrls: ['./magazin.component.css']
})
export class MagazinComponent implements OnInit {
  sidebarCollapsed = false;
  magazins: CommercantDto[] = [];
  searchTerm: string = '';
  currentPage = 0;
  totalPages = 1;
  pageSize = 4;

  constructor(
    private commercantService: CommercantService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMagazins();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  loadMagazins(): void {
    console.log('Loading magazins...');
    this.commercantService.getAllCommercants().subscribe({
      next: (commercants) => {
        console.log('Magazins response:', commercants);
        // Simulate pagination for static data
        const startIndex = this.currentPage * this.pageSize;
        this.magazins = commercants.slice(startIndex, startIndex + this.pageSize) || [];
        this.totalPages = Math.ceil(commercants.length / this.pageSize);
        console.log('Total pages set to:', this.totalPages);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading magazins:', error);
        this.magazins = [];
        this.totalPages = 0;
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange(event: any): void {
    this.searchTerm = event.target.value;
    setTimeout(() => {
      if (this.searchTerm === event.target.value) {
        this.searchMagazins();
      }
    }, 300);
  }

  searchMagazins(): void {
    if (this.searchTerm.trim() === '') {
      this.currentPage = 0;
      this.loadMagazins();
      return;
    }

    console.log('Searching magazins with term:', this.searchTerm);
    this.commercantService.searchMagazinByName(this.searchTerm).subscribe({
      next: (commercants) => {
        console.log('Search response:', commercants);
        // Simulate pagination for search results
        const startIndex = this.currentPage * this.pageSize;
        this.magazins = commercants.slice(startIndex, startIndex + this.pageSize) || [];
        this.totalPages = Math.ceil(commercants.length / this.pageSize);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error searching magazins:', error);
        this.magazins = [];
        this.totalPages = 0;
        this.cdr.detectChanges();
      }
    });
  }

  goToPage(page: number): void {
    if (page < 0) {
      page = this.totalPages - 1;
    } else if (page >= this.totalPages) {
      page = 0;
    }
    
    console.log('Going to page:', page);
    this.currentPage = page;
    if (this.searchTerm.trim() === '') {
      this.loadMagazins();
    } else {
      this.searchMagazins();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  visitStore(magazin: CommercantDto): void {
    console.log('Visiting store:', magazin);
    // TODO: Navigate to store page or open store
  }

  followStore(magazin: CommercantDto): void {
    console.log('Following store:', magazin);
    // TODO: Implement follow store functionality
  }
}
