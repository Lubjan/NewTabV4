import { Component, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {

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
  volume: number;

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
      this.bookmark.link = this.bookmark.link.replace(/https?:\/\//gmi, '');
    }

    if (this.bookmarks.push({
      link: `://${this.bookmark.link}`,
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
      this.bookmark.title = this.bookmark.title.replace(/https?:\/\//gmi, '');
    }

    if (this.bookmarks[this.bookmark.ix] = {
      link: `://${this.bookmark.link}`,
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
    window.open(`https://player.twitch.tv/?channel=${channel}&enableExtensions=true&muted=false&parent=${window.location.hostname}&player=popout&volume=${this.getVolume() / 100}`, 'nt:popup:twitch:stream', 'width=800,height=460,resizable=yes');
  }

  popoutChat = (channel: string): void => {
    window.open(`https://www.twitch.tv/popout/${channel}/chat?popout=`, 'nt:popup:twitch:chat', 'width=360,height=640,resizable=yes');
  }

  setVolume = (_volume: number = 40): void => {
    const volume = _volume > 100 ? 100 : _volume < 0 ? 0 : _volume;
    localStorage.setItem('volume', volume.toString());
    this.volume = this.getVolume();
  }

  getVolume = (): number => {
    const volume = parseInt(localStorage.getItem('volume'), 10);

    return !isNaN(volume) ? volume : 40;
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
    }

    this.bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  }

  ngOnInit(): void {
    this.volume = this.getVolume();
    this.twitch.onlineStream$.subscribe((stream) => this.streams.push(stream));

    if (localStorage.getItem('twitch_user_token')) {
      const sub: Subscription = this.twitch.getUser()
        .subscribe(Response => {
          this.twitchAccount = Response;
          this.twitch.getOnlineFollwing();
        }, () => localStorage.removeItem('twitch_user_token'), () => sub.unsubscribe());
    }

    this.getBookmarks();
  }
}
