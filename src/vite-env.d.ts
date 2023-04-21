/// <reference types="vite/client" />

type IdType = string;

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
  type: 'link' | 'youtube' | 'twitter' | 'video';
  url: string;
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

declare type ContentType = ContentText | ContentImage | ContentBlock | ContentLink;

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
