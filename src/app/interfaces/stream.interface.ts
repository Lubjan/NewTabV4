export interface Stream {
  _id: number;
  average_fps: number;
  channel: {
    _id: number;
    broadcaster_language: string;
    created_at: string;
    display_name: string;
    followers: number;
    game: string;
    language: string;
    logo: string;
    mature: boolean;
    name: string;
    partner: boolean;
    profile_banner: string;
    profile_banner_background_color: string;
    status: string;
    updated_at: string;
    url: string;
    video_banner: string;
    views: number;
  };
  created_at: string;
  delay: number;
  game: string;
  is_playlist: boolean;
  preview: {
    large: string;
    medium: string;
    small: string;
    template: string;
  };
  video_height: number;
  viewers: number;

}

export interface Streams {
  data: Stream[];
}
