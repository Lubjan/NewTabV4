import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Bookmark } from './classes/bookmark.class';
import { Stream } from './interfaces/stream.interface';
import { Account } from './interfaces/twitch.interface';
import { LanguaService } from './services/langua/langua.service';
import { TwitchService } from './services/twitch/twitch.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  /**
   * Get or Set the theme for the page
   */
  get selectedTheme(): string {
    return localStorage.getItem('theme') ?? 'dark';
  }
  set selectedTheme(theme: string) {
    localStorage.setItem('theme', theme);
  }

  /**
   * Get or Set the bookmarks in the localStorage
   */
  get bookmarkStorage(): Bookmark[] {
    return JSON.parse(localStorage.getItem('bookmarks'));
  }
  set bookmarkStorage(bookmarks: Bookmark[]) {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }

  /**
   * Get or Set the volume for poput player
   */
  get volume(): number {
    const volume = parseInt(localStorage.getItem('volume'), 10);

    return !isNaN(volume) ? volume : 40;
  }
  set volume(_volume: number) {
    const volume = typeof _volume === 'undefined' ? 40 : _volume > 100 ? 100 : _volume < 0 ? 0 : _volume;
    localStorage.setItem('volume', volume.toString());
  }


  bookmarks: Bookmark[] = [];
  streams: Stream[] = [];
  twitchAccount: Account;

  twitchDropdown = false;
  languageDropdown = false;

  bookmarkCreation = false;
  bookmarkEditing = false;

  bookmark = new Bookmark();

  private destroy$: Subject<void> = new Subject();

  constructor(public langua: LanguaService, private twitch: TwitchService) {
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
            this.twitchAccount = res;
            this.twitch.getOnlineFollwing();
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
   * Updates or Creates a Bookmark
   *
   * If Updating, a parameter called index ahs to be passed, the value of bookmark.ix should be used
   *
   * @param index The ix parameter of the Bookmark if it is in edit mode
   */
  updateOrCreateBookmark(index: number = null): void {
    if (!/https?:\/\//gim.test(this.bookmark.link)) {
      this.bookmark.link = `http://${this.bookmark.link}`;
    }

    const bookmarkModel = {
      link: this.bookmark.link,
      title: this.bookmark.title,
    };

    (index !== null && typeof index !== 'undefined') ? this.bookmarks[this.bookmark.ix] = bookmarkModel : this.bookmarks.push(bookmarkModel);

    this.bookmarkStorage = this.bookmarks;
    this.bookmarkCreation = this.bookmarkEditing = false;
    this.resetBookmark();
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
  }

  /**
   * Opens a stream popout
   *
   * @param channel The channel name to open the stream for
   */
  popoutStream(channel: string): void {
    const time = new Date().getMilliseconds();
    window.open(`https://player.twitch.tv/?channel=${channel}&enableExtensions=true&muted=false&parent=${window.location.hostname}&player=popout&volume=${this.volume / 100}`, `nt:popup:twitch:stream:cast-${time}`, 'width=800,height=460,resizable=yes');
  }

  /**
   * Opens a chat popout
   *
   * @param channel The channel name tp open the chat for
   */
  popoutChat(channel: string): void {
    const time = new Date().getMilliseconds();
    window.open(`https://www.twitch.tv/popout/${channel}/chat?popout=`, `nt:popup:twitch:chat:cast-${time}`, 'width=360,height=640,resizable=yes');
  }


  /**
   * Stores the bookmark to edit in a temp var
   *
   * @param evn Event fired by triggering element
   * @param index The index of the bookmark
   */
  setBookmarkEditMode(evn, index: number): void {
    this.bookmark.link = this.bookmarks[index].link;
    this.bookmark.title = this.bookmarks[index].title;
    this.bookmark.ix = index;

    this.bookmarkEditing = true;
    evn.preventDefault();
  }

  /**
   * Removes a bookmark
   *
   * @param evn Event fired by the triggering element
   * @param index The index of the bookmark
   */
  removeBookmark(evn: MouseEvent | KeyboardEvent, index: number): void {
    this.bookmarkEditing = false;

    this.bookmarks.splice(index, 1);
    this.bookmarkStorage = this.bookmarks;

    this.resetBookmark();
    evn.preventDefault();
  }

  /**
   * Reset the Bookmark currently in edit mode
   */
  resetBookmark(): void {
    this.bookmark = new Bookmark();
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


