import { Component, Input } from '@angular/core';

import { Stream } from '../interfaces/stream.interface';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css'],
})
export class StreamComponent {
  @Input() stream: Stream;
  @Input() volume: number;

  /** Open Twitch stream popout */
  popoutStream(): void {
    const time = new Date().getMilliseconds();
    window.open(
      `https://player.twitch.tv/?channel=${this.stream.user_name}&enableExtensions=true&muted=false` +
      `&parent=${window.location.hostname}&player=popout&volume=${this.volume / 100}`,
      `nt:twitch-stream-${this.stream.user_name}`,
      'width=800,height=460,resizable=yes',
    );
  }

  /** Open Twitch chat popout */
  popoutChat(): void {
    const time = new Date().getMilliseconds();
    window.open(
      `https://www.twitch.tv/popout/${this.stream.user_name}/chat?popout=`,
      `nt:twitch-chat-${this.stream.user_name}`,
      'width=360,height=640,resizable=yes',
    );
  }
}
