import {
  Component,
  DestroyRef,
  HostListener,
  inject,
  OnInit,
  ViewChild
} from "@angular/core";
import {MatDrawerMode, MatSidenav, MatSidenavModule} from "@angular/material/sidenav";
import {CommonModule} from "@angular/common";
import {RouterModule, RouterOutlet} from "@angular/router";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatRippleModule} from "@angular/material/core";
import {BehaviorSubject, mergeMap, of} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {FormControl} from "@angular/forms";
import {AppTheme, THEMES, UpdateTheme} from "@Store/reducers/theme-reducer";
import {TTheme} from "@Global/model";
import {Store} from "@ngrx/store";
import LayoutSmComponent from '@Global/layout/layout-sm/component';
import NavItemComponent from '@Global/layout/nav-item/component';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,RouterOutlet,
    MatSidenavModule, MatDividerModule, MatListModule, MatToolbarModule, MatIconModule, MatButtonModule,
    MatRippleModule, MatDialogModule,
    LayoutSmComponent, NavItemComponent
  ],
  templateUrl: 'template.html',
  styleUrls: ['style.scss']
})
export class LayoutComponent implements OnInit {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  mode!: MatDrawerMode;
  openSidenav!:boolean;
  private destroyRef = inject(DestroyRef);
  isProdMode: boolean = environment.production;
  public screenWidth$ = new BehaviorSubject<number>(window.innerWidth);
  themeControl: FormControl = new FormControl<string>('');
  themes: TTheme[] = THEMES;

  constructor(private readonly dialog: MatDialog,
              private readonly store: Store<AppTheme>) {
    this.store.select("theme").pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      this.themeControl.setValue(value.displayName);
    });
  }

  ngOnInit(): void {
    this.screenWidth$.asObservable().pipe(takeUntilDestroyed(this.destroyRef),
        mergeMap((value) => {
          if(value < 640) {
            this.mode = 'over';
             if(this.sidenav?.opened) {
               return this.dialog.open(LayoutSmComponent,
              {
                maxWidth: '100vw',
                maxHeight: '100vh',
                height: '100%',
                width: '100%',
             }).afterClosed().pipe(takeUntilDestroyed(this.destroyRef))
             }
             return of(value)
          }
          return of(value);
        })).subscribe((openSidenav: any) => this.openSidenav = !openSidenav);
  }

  changeTheme() {
    this.store.dispatch(new UpdateTheme(
        this.themes.find(value =>
            value.displayName != this.themeControl.value)));
  }

  getDebugClass(): string {
    switch (environment.env) {
      case 'DEV':
        return 'app-toolbar-success';
      case 'QA':
        return 'app-toolbar-warning';
      default:
        return '';
    }
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event: any) {
    this.screenWidth$.next(event.target.innerWidth);
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll(event: any) {
    event.stopPropagation();
  }

  toggle() {
      this.dialog.open(LayoutSmComponent, {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%'})
          .afterClosed().pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((openSidenav: any) => this.openSidenav = !openSidenav);
  }

  openedStart() {
    this.sidenav.mode = "side";
    this.sidenav.open();
  }

}
