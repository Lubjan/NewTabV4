import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Stream } from 'src/app/interfaces/stream.interface';

import { app_key, app_url } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TwitchService {

  onlineStream$: Subject<Stream> = new Subject();

  private scopes: string[] = [
    'user_read',
  ];

  private headers = {
    Accept: 'application/vnd.twitchtv.v5+json',
    'Client-ID': app_key,
    Authorization: `OAuth ${localStorage.getItem('twitch_user_token')}`,
  };

  constructor(
    private http: HttpClient,
  ) {
    if (localStorage.getItem('twitchAuthInProcess')) {
      if (-1 !== location.hash.indexOf('access_token')) {
        const access_token: string = new RegExp(/#?access_token=(\w+)/gi).exec(location.hash)[1];
        this.saveUserInfo(access_token);
      } else {
        localStorage.removeItem('twitchAuthInProcess');
      }
    }
  }

  sendAuthRequest = (): void => {
    localStorage.setItem('twitchAuthInProcess', JSON.stringify(true));
    location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${app_key}&redirect_uri=${app_url}&response_type=token&scope=${this.scopes.join(' ')}`;
  }

  getUser = (): Observable<any> => {
    return this.http.get('https://api.twitch.tv/kraken/user', {
      headers: this.headers,
    });
  }

  getOnlineFollwing = (): void => {
    this.http.get(`https://api.twitch.tv/kraken/streams/followed/?limit=100`, { headers: this.headers })
      .subscribe((res: {streams: Stream[]}) => {
        for (const stream of res.streams) {
          this.onlineStream$.next(stream);
        }
      });
  }

  private saveUserInfo = (access_token: string): void => {
    localStorage.setItem('twitch_user_token', access_token);
    localStorage.removeItem('twitchAuthInProcess');
    location.hash = '';
    this.headers = {
      Accept: 'application/vnd.twitchtv.v5+json',
      'Client-ID': app_key,
      Authorization: `OAuth ${localStorage.getItem('twitch_user_token')}`,
    };
  }

}
