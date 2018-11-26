export interface Stream {
    stream: {
        _id: number;
        game: string;
        broadcast_platform: string;
        community_id: any;
        community_ids: number[];
        viewers: number;
        video_height: number;
        average_fps: number;
        delay: number;
        created_at: string;
        is_playlist: boolean;
        stream_type: string;
        preview: {
            small: string;
            medium: string;
            large: string;
            template: string
        };
        channel: {
            mature: boolean;
            status: string;
            broadcaster_language: string;
            broadcaster_software: string;
            display_name: string;
            game: string;
            language: string;
            _id: number;
            name: string;
            created_at: string;
            updated_at: string;
            partner: boolean;
            logo: string;
            video_banner: string;
            profile_banner: string;
            profile_banner_background_color: string;
            url: string;
            views: number;
            followers: number;
            broadcaster_type: string;
            description: string;
            private_video: boolean;
            privacy_options_enabled: boolean
        }
    };
}
