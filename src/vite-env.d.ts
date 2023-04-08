/// <reference types="vite/client" />

type IdType = string;

interface FeedItemType {
  id: IdType;
  title: string;
  url: string | null;
  author: string;
  points: number | null;
  views: number | null;
  comments: number | null;
  createdAt: string;
  modifiedAt: string | null;
}

interface DetailItemText {
  type: 'text';
  text: string;
}

interface DetailItemImage {
  type: 'image',
  value: string;
}

interface DetailItemVideo {
  type: 'video',
  value: string;
}

type DetailItemType = DetailItemText | DetailItemImage;

interface FeedCommentType {
  id: IdType;
  parentId: IdType;
  author: string;
  avatar: string | null;
  up: number| null;
  down: number | null;
  contents: DetailItemType[];
  depth: number;
  isBest: boolean;
  createdAt: string;
  modifiedAt: string | null;
}

interface FeedDetailType extends FeedItemType {
  contents: DetailItemType[];
  comments: FeedCommentType[];
}
