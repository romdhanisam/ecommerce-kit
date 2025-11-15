import {Component, DestroyRef, ElementRef, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {OverlayContainer} from '@angular/cdk/overlay';
import {AppTheme} from '@Store/reducers/theme-reducer';
import {Store} from '@ngrx/store';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'ecommerce-kit';
  private destroyRef = inject(DestroyRef);

  constructor(
    private readonly _overlayContainer: OverlayContainer,
    private readonly otRootRef: ElementRef,
    private readonly store: Store<AppTheme>,
  ) {
  }

  ngOnInit(): void {
    this.store.select("theme").pipe(takeUntilDestroyed(this.destroyRef)).subscribe(newThemeValue => {
      newThemeValue.isDark ? this.applyOverlayContainerTheme('ecommerce-kit-light-theme', newThemeValue.name) :
        this.applyOverlayContainerTheme('ecommerce-kit-dark-theme', newThemeValue.name);
    });
  }

  private applyOverlayContainerTheme(oldTheme: string, newTheme: string): void {
    if (!!oldTheme && oldTheme !== newTheme) {
      this._overlayContainer.getContainerElement().classList.remove(oldTheme);
      this.otRootRef.nativeElement.classList.remove(oldTheme);
    }
    this._overlayContainer.getContainerElement().classList.add(newTheme);
    this.otRootRef.nativeElement.classList.add(newTheme);
  }


}
