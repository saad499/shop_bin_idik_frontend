import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PopupService, PopupData } from '../../services/popup.service';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="popup-overlay" *ngIf="popupData.isVisible" (click)="closePopup()">
      <div class="popup-container" [ngClass]="'popup-' + popupData.type" (click)="$event.stopPropagation()">
        <div class="popup-header">
          <div class="popup-icon">
            <span [innerHTML]="getIcon()"></span>
          </div>
          <h3>{{ popupData.title }}</h3>
          <button class="close-btn" (click)="closePopup()">&times;</button>
        </div>
        <div class="popup-body">
          <p>{{ popupData.message }}</p>
        </div>
        <div class="popup-footer">
          <button class="btn-primary" (click)="closePopup()">OK</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease-in-out;
    }

    .popup-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      max-width: 400px;
      width: 90%;
      animation: slideIn 0.3s ease-out;
      overflow: hidden;
    }

    .popup-header {
      display: flex;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #eee;
      position: relative;
    }

    .popup-icon {
      margin-right: 12px;
      font-size: 24px;
    }

    .popup-success .popup-icon { color: #10b981; }
    .popup-error .popup-icon { color: #ef4444; }
    .popup-warning .popup-icon { color: #f59e0b; }
    .popup-info .popup-icon { color: #3b82f6; }

    .popup-header h3 {
      margin: 0;
      flex: 1;
      font-size: 18px;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #9ca3af;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s;
    }

    .close-btn:hover {
      background-color: #f3f4f6;
    }

    .popup-body {
      padding: 20px;
      color: #374151;
      line-height: 1.6;
    }

    .popup-footer {
      padding: 20px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 10px 24px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .popup-success .btn-primary { background: #10b981; }
    .popup-success .btn-primary:hover { background: #059669; }

    .popup-error .btn-primary { background: #ef4444; }
    .popup-error .btn-primary:hover { background: #dc2626; }

    .popup-warning .btn-primary { background: #f59e0b; }
    .popup-warning .btn-primary:hover { background: #d97706; }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `]
})
export class PopupComponent implements OnDestroy {
  popupData: PopupData = {
    type: 'info',
    title: '',
    message: '',
    isVisible: false
  };
  
  private subscription: Subscription;

  constructor(private popupService: PopupService) {
    this.subscription = this.popupService.popup$.subscribe(
      data => {
        console.log('Popup data received:', data); // Debug log
        this.popupData = data;
      }
    );
  }

  getIcon(): string {
    const icons = {
      success: '✓',
      error: '⚠',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[this.popupData.type] || icons.info;
  }

  closePopup() {
    this.popupService.hide();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
