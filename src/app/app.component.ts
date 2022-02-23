import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Bookmark } from './classes/bookmark.class';
import { Stream } from './interfaces/stream.interface';
import { User } from './interfaces/user.interface';
import { LanguaService } from './services/langua/langua.service';
import { TwitchService } from './services/twitch/twitch.service';

@Component({
  selector: 'app-root',
  styleUrls: ['app.component.css'],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  get bookmarkStorage(): Bookmark[] { return JSON.parse(localStorage.getItem('bookmarks')); }
  get volume(): number {
    const volume = parseInt(localStorage.getItem('volume'), 10);

    return !isNaN(volume) ? volume : 40;
  }
  get selectedTheme(): string { return localStorage.getItem('theme') ?? 'dark'; }


  /** Get or Set the bookmarks in the localStorage */
  set bookmarkStorage(bookmarks: Bookmark[]) { localStorage.setItem('bookmarks', JSON.stringify(bookmarks)); }

  /** Get or Set the volume for poput player */
  set volume(_volume: number) {
    const volume = typeof _volume === 'undefined' ? 40 : _volume > 100 ? 100 : _volume < 0 ? 0 : _volume;
    localStorage.setItem('volume', volume.toString());
  }

  /** Get or Set the theme for the page */
  set selectedTheme(theme: string) { localStorage.setItem('theme', theme); }


  bookmarks: Bookmark[] = [];
  streams: Stream[] = [];
  twitchAccount: User;

  twitchDropdown = false;
  languageDropdown = false;

  bookmarkCreation = false;
  bookmarkEditing = false;

  private destroy$: Subject<void> = new Subject();

  constructor(public langua: LanguaService, public twitch: TwitchService) {
    document.body.classList.add(this.selectedTheme);

    this.setBodyCssVars();
    window.addEventListener('resize', () => this.setBodyCssVars());
  }

  ngOnInit(): void {
    this.twitch.onlineStream$.subscribe((stream) => this.streams.push(stream));

    if (this.twitch.userToken) {
      this.twitch.getUser()
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            if (!res?.data?.length) {
              this.twitch.userToken = null;
            }
            this.twitchAccount = res.data[0];
            this.twitch.getOnlineFollwing(this.twitchAccount.id);
          },
          () => localStorage.removeItem('twitch_user_token'),
        );
    }

    this.getBookmarks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Toggle the theme of the page between dark and bright
   */
  toggleTheme(): void {
    document.body.classList.remove(this.selectedTheme);
    document.body.classList.add(this.selectedTheme = this.selectedTheme === 'dark' ? 'bright' : 'dark');
  }

  /**
   * Send auth request to Twitch
   */
  authTwitch(): void {
    this.twitch.authUser();
  }

  /**
   * Remove the user token to log the user out
   */
  twitchLogout(): void {
    localStorage.removeItem('twitch_user_token');
    location.href = location.href;
    this.streams = [];
  }

  /**
   * Load stored bookmarks
   */
  private getBookmarks(): void {
    if (!this.bookmarkStorage) {
      this.bookmarkStorage = [];
    }

    this.bookmarks = this.bookmarkStorage;
  }

  /**
   * Set CSS variables for width and hight on the body, used in CSS caluclations
   */
  private setBodyCssVars(): void {
    document.body.style.setProperty('--innerWidth', `${window.innerWidth}px`);
    document.body.style.setProperty('--innerHeight', `${window.innerHeight}px`);
  }
}


