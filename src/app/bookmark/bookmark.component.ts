import { Component, Input } from '@angular/core';

import { Bookmark } from '../classes/bookmark.class';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css'],
})
export class BookmarkComponent {
  get bookmark(): Bookmark {return this._bookmark;}

  @Input() set bookmark(value: Bookmark) {
    const parted = /(?<protocol>(https?|ftps?):\/\/)(?<origin>[\w\d.-]+(:\d+)?)(?<path>\/[\w\d%.-_\/]+)?/gim.exec(value.link);
    value.partedLink = {
      origin: parted.groups?.origin,
      protocol: parted.groups?.protocol,
      path: parted.groups?.path ? decodeURIComponent(parted.groups?.path) : null,
    };

    this._bookmark = value;
  }

  private _bookmark: Bookmark;
}
