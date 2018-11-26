import { Injectable } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { app_key, app_url } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TwitchService {

  private scopes: string[] = [
    'user_read'
  ];

  private headers = {
    'Accept': 'application/vnd.twitchtv.v5+json',
    'Client-ID': app_key,
    'Authorization': `OAuth ${localStorage.getItem('twitch_user_token')}`
  };

  constructor (
    private http: HttpClient
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

  public sendAuthRequest = (): void => {
    localStorage.setItem('twitchAuthInProcess', JSON.stringify(true));
    location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${app_key}&redirect_uri=${app_url}&response_type=token&scope=${this.scopes.join(' ')}`;
  }

  public getUser = (): Observable<any> => {
    setTimeout(() => {}, 250);
    return this.http.get('https://api.twitch.tv/kraken/user', {
      headers: this.headers
    });
  }

  public getOnlineFollwing = (_id: string): any[] => {
    const streams: any[] = [];
    const followingSub: Subscription = this.getUserFollowingStreams(_id).subscribe(Response => {
      Response.follows.forEach(Stream => {
        const streamSub: Subscription = this.getStreamInfo(Stream.channel._id).subscribe(sResponse => {
          if (sResponse.stream) {
            streams.push(sResponse);
          }
        });
      });
    }, () => null, () => followingSub.unsubscribe());
    return streams;
  }

  private getStreamInfo = (_streamerId: string): Observable<any> => {
    return this.http.get(`https://api.twitch.tv/kraken/streams/${_streamerId}`, {
      headers: this.headers
    });
  }

  private getUserFollowingStreams = (_id: string): Observable<any> => {
    return this.http.get(`https://api.twitch.tv/kraken/users/${_id}/follows/channels`, {
      headers: this.headers
    });
  }

  private saveUserInfo = (access_token: string): void => {
    localStorage.setItem('twitch_user_token', access_token);
    localStorage.removeItem('twitchAuthInProcess');
    location.hash = '';
    this.headers = {
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': app_key,
      'Authorization': `OAuth ${localStorage.getItem('twitch_user_token')}`
    };
  }

}
