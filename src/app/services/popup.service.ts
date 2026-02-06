import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PopupData {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  isVisible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private popupSubject = new BehaviorSubject<PopupData>({
    type: 'info',
    title: '',
    message: '',
    isVisible: false
  });

  popup$ = this.popupSubject.asObservable();

  showSuccess(title: string, message: string) {
    this.show('success', title, message);
  }

  showError(title: string, message: string) {
    this.show('error', title, message);
  }

  showWarning(title: string, message: string) {
    this.show('warning', title, message);
  }

  showInfo(title: string, message: string) {
    this.show('info', title, message);
  }

  private show(type: PopupData['type'], title: string, message: string) {
    console.log('Showing popup:', { type, title, message }); // Debug log
    const popupData = {
      type,
      title,
      message,
      isVisible: true
    };
    // Force immediate emission
    setTimeout(() => {
      this.popupSubject.next(popupData);
    }, 0);
  }

  hide() {
    this.popupSubject.next({
      ...this.popupSubject.value,
      isVisible: false
    });
  }
}
