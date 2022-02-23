import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Stream, Streams } from 'src/app/interfaces/stream.interface';
import { Users } from 'src/app/interfaces/user.interface';

import { app_key, app_url } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TwitchService {
  get authInProcess(): boolean { return JSON.parse(localStorage.getItem('twitchAuthInProcess')); }
  get userToken(): string { return localStorage.getItem('twitch_user_token'); }

  /** Get or Set whether the page is in authenthication mode for a Twitch Client */
  set authInProcess(state: boolean) { localStorage.setItem('twitchAuthInProcess', JSON.stringify(state)); }

  /** Get or Set the Twitch User auth token */
  set userToken(val: string) { localStorage.setItem('twitch_user_token', val); }

  onlineStream$: Subject<Stream> = new Subject();

  /**
   * Get the Request Headers with OAuth Token of the User
   */
  private get headers(): any {
    return {
      /* eslint-disable @typescript-eslint/naming-convention */
      Accept: 'application/vnd.twitchtv.v5+json',
      'Client-ID': app_key,
      Authorization: `Bearer ${this.userToken}`,
      /* eslint-enable @typescript-eslint/naming-convention */
    };
  }

  /**
   * Permissions to request from the user
   */
  private scopes: string[] = [
    'user:read:email',
    'user:read:follows',
  ];

  constructor(private http: HttpClient) {
    if (this.authInProcess) {
      if (~location.hash.indexOf('access_token')) {
        this.saveUserInfo();
      } else {
        localStorage.removeItem('twitchAuthInProcess');
      }
    }
  }

  /**
   * Sets the page into authMode and sends the User to the Twitch permission cofnirmation page
   */
  authUser(): void {
    this.authInProcess = true;
    location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${app_key}&redirect_uri=${app_url}&response_type=token&scope=${this.scopes.join(' ')}`;
  }

  /**
   * Returns the Account object for the authethicated Twitch User
   */
  getUser(): Observable<Users> {
    return this.http.get<Users>('https://api.twitch.tv/helix/users', { headers: this.headers });
  }

  /**
   * Get all (up to 100) online following channels for the authethicated Twitch User
   */
  getOnlineFollwing(id: string): void {
    this.http.get(`https://api.twitch.tv/helix/streams/followed?user_id=${id}&first=100`, { headers: this.headers }).subscribe((res: Streams) => {
      const params = new HttpParams().appendAll({ id: res.data?.map((stream) => stream.user_id) });
        this.http.get<Users>(`https://api.twitch.tv/helix/users`, { params, headers: this.headers }).subscribe((users) => {
          res.data?.forEach((stream) => this.onlineStream$.next({
            ...stream,
            profile_image_url: users?.data?.find((user) => user.id === stream.user_id).profile_image_url,
          }));
        });
    });
  }

  /**
   * Stores the User auth Token in the localStorage
   */
  private saveUserInfo(): void {
    this.userToken = new RegExp(/#?access_token=(\w+)/gi).exec(location.hash)[1];

    location.hash = '';
  }
}
