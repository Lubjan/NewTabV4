import { Language } from '../../interfaces/language.interface';

export interface LanguaDictonary {
    connectTwitch: string;
    connectYouTube: string;
    bookmarks: string;
    streams: string;
    no_bookmarks: string;
    no_twitch: string;
    no_streams: string;
    add_new_bookmark: string;
    new_bookmark_title: string;
    new_bookmark_link: string;
    new_bookmark_icon: string;
    required: string;
    popup_confirm: string;
    popup_cancel: string;
    popup_delete: string;
    twitch_logout: string;
    stream_popup_stream: string;
    stream_popup_chat: string;
    edit_bookmark: string;
    title: string;
}

export const DictornaryEnglish: LanguaDictonary = {
    bookmarks: 'Bookmarks',
    connectTwitch: 'Connect',
    connectYouTube: 'Connect',
    streams: 'Streams',
    no_bookmarks: 'You ain\'t got no Bookmarks yet',
    no_twitch: 'You haven\'t linked your Twitch Account',
    no_streams: 'None of your followed Channels are currently streaming',
    add_new_bookmark: 'Add a Bookmark',
    new_bookmark_icon: 'Icon',
    new_bookmark_link: 'Link',
    new_bookmark_title: 'Displayname',
    required: 'Required',
    popup_cancel: 'Cancel',
    popup_delete: 'Delete',
    popup_confirm: 'Confirm',
    twitch_logout: 'Unlink Twitch',
    stream_popup_chat: 'Popout Chat',
    stream_popup_stream: 'Popout Stream',
    edit_bookmark: 'Edit Bookmark',
    title: 'New Tab'
};

export const DictornaryGerman: LanguaDictonary = {
    bookmarks: 'Seiten',
    connectTwitch: 'Verbinden',
    connectYouTube: 'Verbinden',
    streams: 'Streams',
    no_bookmarks: 'Du hast noch keine gespeicherten Seiten',
    no_twitch: 'Du hast deinen Twitch Account noch nicht verbunden',
    no_streams: 'Keiner deienr gefolgten Kanäle streamt derzeit',
    add_new_bookmark: 'Seite Hinzufügen',
    new_bookmark_icon: 'Seitensymbol',
    new_bookmark_link: 'URL',
    new_bookmark_title: 'Anzeigename',
    required: 'Pflichfeld',
    popup_cancel: 'Abbrechen',
    popup_delete: 'Löschen',
    popup_confirm: 'Bestätigen',
    twitch_logout: 'Twitch Trennen',
    stream_popup_chat: 'Chat Popup',
    stream_popup_stream: 'Stream Popout',
    edit_bookmark: 'Seite Bearbeiten',
    title: 'Neuer Tab'
};

export const DictonarySet = {
    en: DictornaryEnglish,
    de: DictornaryGerman
};

export const LanguageSet = {
    en: <Language>{
        display: 'English',
        id: 'en'
    },
    de: <Language>{
        display: 'Deutsch',
        id: 'de'
    }
};
