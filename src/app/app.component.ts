import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Bookmark } from './interfaces/bookmark.interface';
import { Stream } from './interfaces/stream.interface';
import { TwitchAccount } from './interfaces/twitchaccount.interface';
import { LanguaService } from './services/langua/langua.service';
import { TwitchService } from './services/twitch/twitch.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

  sortOrder = 'stream.created_at';

  bookmarks: Bookmark[] = [];
  streams: Stream[] = [];
  twitchAccount: TwitchAccount;

  selectedTheme = 'dark';

  twitchDropdown = false;
  languageDropdown = false;

  bookmarkCreation = false;
  bookmarkEditing = false;

  bookmark: Bookmark = {
    link: '',
    title: '',
  };
  destroy$: any;

  constructor(
    public langua: LanguaService,
    private twitch: TwitchService,
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

  toggleTheme = (): void => {
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

  createBookmark = (): void => {
    if (this.bookmark.link.indexOf('http') || this.bookmark.link.indexOf('https')) {
      this.bookmark.link = this.bookmark.link.replace(/https?:\/\//i, '');
    }

    if (this.bookmarks.push({
      link: `http://${this.bookmark.link}`,
      title: this.bookmark.title,
    })) {
      localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
    }

    this.bookmarkCreation = false;
    this.bookmark = {
      link: '',
      title: '',
    };

    this.getBookmarks();
  }

  saveEditBookmark = (): void => {
    if (this.bookmark.title.indexOf('http') || this.bookmark.title.indexOf('https')) {
      this.bookmark.title = this.bookmark.title.replace('http://', '');
      this.bookmark.title = this.bookmark.title.replace('https://', '');
    }

    if (this.bookmarks[this.bookmark.ix] = {
      link: `http://${this.bookmark.link}`,
      title: this.bookmark.title,
    }) {
      localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
    }

    this.bookmarkEditing = false;
    this.bookmark = {
      link: '',
      title: '',
    };

    this.getBookmarks();
  }

  authTwitch = (): void => {
    this.twitch.sendAuthRequest();
  }

  twitchLogout = (): void => {
    localStorage.removeItem('twitch_user_token');
    location.href = location.href;
  }

  popoutStream = (channel: string): void => {
    window.open(`https://player.twitch.tv/?channel=${channel}&enableExtensions=true&muted=false&parent=${window.location.host}&player=popout&volume=0.42`, 'nt:popup:twitch:stream', 'width=800,height=460,resizable=yes');
  }

  popoutChat = (channel: string): void => {
    window.open(`https://www.twitch.tv/popout/${channel}/chat?popout=`, 'nt:popup:twitch:chat', 'width=360,height=640,resizable=yes');
  }

  bookmarkEdit = (Evn, index: number): void => {
    this.bookmark.link = this.bookmarks[index].link;
    this.bookmark.title = this.bookmarks[index].title;
    this.bookmark.ix = index;
    this.bookmarkEditing = true;
    Evn.preventDefault();
  }

  bookmarkRemove = (Evn, index: number): void => {
    this.bookmarks.splice(index, 1);
    localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
    this.resetBookmark();
    this.bookmarkEditing = false;
    Evn.preventDefault();
  }

  resetBookmark = (): void => {
    this.bookmark = {
      link: '',
      title: '',
    };
  }

  private getBookmarks = (): void => {
    if (!localStorage.getItem('bookmarks')) {
      localStorage.setItem('bookmarks', JSON.stringify([]));
      this.bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
      this.bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }
  }

  ngOnInit(): void {
    this.getBookmarks();

    if (localStorage.getItem('twitch_user_token')) {
      const sub: Subscription = this.twitch.getUser()
        .subscribe(Response => {
          this.twitchAccount = Response;
          this.streams = this.twitch.getOnlineFollwing(Response._id);
        }, () => localStorage.removeItem('twitch_user_token'), () => sub.unsubscribe());
    }
  }

  ngOnDestroy(): void {

  }

}
