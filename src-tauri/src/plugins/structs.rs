use serde::{Deserialize, Serialize};

#[derive(Default, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FeedItem {
  pub id: String,
  pub title: String,
  pub category: Option<String>,
  pub text: Option<String>,
  pub thumb: Option<String>,
  pub author: String,
  pub points: Option<i32>,
  pub views: Option<i32>,
  pub comments: Option<i32>,
  pub sub_id: Option<String>,
  pub created_at: String,
  pub modified_at: Option<String>,
}

#[derive(Default, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LoadFeeds {
  pub items: Vec<FeedItem>,
  pub page: i32,
  pub total: Option<i32>,
  pub total_pages: Option<i32>,
  pub items_per_page: i32,
}

#[derive(Default, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FeedComment {
  pub id: String,
  pub parent_id: Option<String>,
  pub author: String,
  pub reply_to: Option<String>,
  pub avatar: Option<String>,
  pub up: Option<i32>,
  pub down: Option<i32>,
  pub is_best: bool,
  pub depth: i32,
  pub contents: Vec<Contents>,
  pub created_at: String,
  pub modified_at: Option<String>,
  pub removed: bool,
}

#[derive(Default, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FeedDetail {
  pub id: String,
  pub title: String,
  pub url: Option<String>,
  pub author: String,
  pub up: Option<i32>,
  pub down: Option<i32>,
  pub views: Option<i32>,
  pub comment_num: Option<i32>,
  pub comments: Vec<FeedComment>,
  pub contents: Vec<Contents>,
  pub created_at: String,
  pub modified_at: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum Contents {
  Block { items: Vec<Contents>, name: String },
  Text { text: String, name: Option<String> },
  Link { url: String, text: Option<String> },
  Image { url: String, alt: Option<String> },
  Video { url: String },
  Youtube { url: String },
  // Twitter { url: String },
}
