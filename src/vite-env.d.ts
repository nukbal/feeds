/// <reference types="vite/client" />

type IdType = string;
type SupportServices = 'hacker_news' | 'ruliweb' | 'fmk';

interface FeedLinkItem {
  id: string;
  label: string;
  removable?: boolean;
}

interface FeedItemType {
  id: IdType;
  title: string;
  category: string | null;
  text: string | null;
  thumb: string | null;
  subId: string | null;
  author: string;
  points: number | null;
  views: number | null;
  comments: number | null;
  createdAt: string;
  modifiedAt: string | null;
}

interface ContentText {
  type: 'text';
  text: string;
  name: string | null;
}
interface ContentLink {
  type: 'link';
  url: string;
  text: string | null;
}

interface ContentEmbed {
  type: 'youtube' | 'twitter';
  url: string;
}

interface ContentVideo {
  type: 'video';
  url: string;
  thumb: string | null;
}

interface ContentImage {
  type: 'image';
  url: string;
  alt: string | null;
}

interface ContentBlock {
  type: 'block';
  items: ContentType[];
  name: string | null;
}

declare type ContentType = ContentText | ContentImage | ContentBlock | ContentLink | ContentVideo | ContentEmbed;

interface FeedCommentType {
  id: IdType;
  parentId: IdType;
  author: string;
  replyTo: string | null;
  avatar: string | null;
  up: number| null;
  down: number | null;
  contents: ContentType[];
  depth: number;
  isBest: boolean;
  createdAt: string;
  modifiedAt: string | null;
  removed: boolean;
}

interface FeedDetailType extends FeedItemType {
  url: string | null;
  contents: ContentType[];
  comments: FeedCommentType[];
}
