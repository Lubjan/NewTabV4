import { Component, OnInit, OnDestroy } from '@angular/core';

import { LanguaService } from './services/langua/langua.service';

import { Bookmark } from './interfaces/bookmark.interface';
import { Stream } from './interfaces/stream.interface';
import { TwitchAccount } from './interfaces/twitchaccount.interface';
import { TwitchService } from './services/twitch/twitch.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  // public sortOrder = 'stream.created_at';

  public bookmarks: Bookmark[] = [];
  public streams: Stream[] = [];
  public twitchAccount: TwitchAccount;

  public selectedTheme = 'dark';

  public twitchDropdown = false;
  public languageDropdown = false;

  public bookmarkCreation = false;
  public bookmarkEditing = false;

  public bookmark: Bookmark = {
    link: '',
    title: ''
  };

  constructor (
    public langua: LanguaService,
    private twitch: TwitchService
  ) {
    this.selectedTheme = localStorage.getItem('theme') || 'dark';
    if ('bright' === this.selectedTheme) {
      document.body.classList.add('bright');
    }

    document.title = `${langua.g('title')}`;

    document.body.style.setProperty('--innerWidth', `${window.innerWidth}px`);
    document.body.style.setProperty('--innerHeight', `${window.innerHeight}px`);
    window.addEventListener('resize', () => {
      document.body.style.setProperty('--innerWidth', `${window.innerWidth}px`);
      document.body.style.setProperty('--innerHeight', `${window.innerHeight}px`);
    });
  }

  public toggleTheme = (): void => {
    if ('dark' !== this.selectedTheme) {
      localStorage.setItem('theme', 'dark');
      this.selectedTheme = 'dark';
      document.body.classList.remove('bright');
    } else {
      localStorage.setItem('theme', 'bright');
      this.selectedTheme = 'bright';
      document.body.classList.add('bright');
    }
  }

  public createBookmark = (): void => {
    if (this.bookmark.title.indexOf('http') || this.bookmark.title.indexOf('https')) {
      this.bookmark.title = this.bookmark.title.replace('http://', '');
      this.bookmark.title = this.bookmark.title.replace('https://', '');
    }

    if (this.bookmarks.push({
      link: `http://${this.bookmark.link}`,
      title: this.bookmark.title
    })) {
      localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
    }

    this.bookmarkCreation = false;
    this.bookmark = {
      link: '',
      title: ''
    };

    this.getBookmarks();
  }

  public saveEditBookmark = (): void => {
    if (this.bookmark.title.indexOf('http') || this.bookmark.title.indexOf('https')) {
      this.bookmark.title = this.bookmark.title.replace('http://', '');
      this.bookmark.title = this.bookmark.title.replace('https://', '');
    }

    if (this.bookmarks[this.bookmark.ix] = {
      link: `http://${this.bookmark.link}`,
      title: this.bookmark.title
    }) {
      localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
    }

    this.bookmarkEditing = false;
    this.bookmark = {
      link: '',
      title: ''
    };

    this.getBookmarks();
  }

  public authTwitch = (): void => {
    this.twitch.sendAuthRequest();
  }

  public twitchLogout = (): void => {
    localStorage.removeItem('twitch_user_token');
    location.href = location.href + '';
  }

  public popoutStream = (channel: string): void => {
    window.open(`https://player.twitch.tv/?volume=0.42&!muted&channel=${channel}`, 'nt:popup:twitch:stream', 'width=800,height=460,resizable=yes');
  }

  public popoutChat = (channel: string): void => {
    window.open(`https://www.twitch.tv/popout/${channel}/chat?popout=`, 'nt:popup:twitch:chat', 'width=360,height=640,resizable=yes');
  }

  public bookmarkEdit = (Evn, index: number): void => {
    this.bookmark.link = this.bookmarks[index].link;
    this.bookmark.title = this.bookmarks[index].title;
    this.bookmark.ix = index;
    this.bookmarkEditing = true;
    Evn.preventDefault();
  }

  public bookmarkRemove = (Evn, index: number): void => {
    this.bookmarks.splice(index, 1);
    localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
    Evn.preventDefault();
  }

  private getBookmarks = (): void => {
    if (!localStorage.getItem('bookmarks')) {
      localStorage.setItem('bookmarks', JSON.stringify([]));
      this.bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
      this.bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }
  }

  ngOnInit (): void {
    this.getBookmarks();

    if (localStorage.getItem('twitch_user_token')) {
      const twitchUserSub: Subscription = this.twitch.getUser().subscribe(Response => {
        this.twitchAccount = Response;
        this.streams = this.twitch.getOnlineFollwing(Response._id);
      }, () => {
        localStorage.removeItem('twitch_user_token');
      }, () => twitchUserSub.unsubscribe());
    }
  }

  ngOnDestroy (): void {
  }

}
