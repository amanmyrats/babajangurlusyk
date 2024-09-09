import { Injectable } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActiveRouteService {
  private activeRouteSubject = new BehaviorSubject<string>('');
  activeRoute$ = this.activeRouteSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.activeRouteSubject.next(event.urlAfterRedirects);
    });
  }
}