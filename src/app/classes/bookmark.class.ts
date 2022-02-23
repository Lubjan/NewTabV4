export interface Bookmark {
  link: string;
  title: string;
  hideLink: boolean;
  partedLink?: {
    protocol: string;
    origin: string;
    path: string;
  };
  noFavIconIco?: boolean;
  noFavIconPng?: boolean;
  favIcon?: string;
}
