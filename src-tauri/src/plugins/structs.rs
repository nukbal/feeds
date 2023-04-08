use serde::{Deserialize, Serialize};

#[derive(Default, Debug, Serialize, Deserialize)]
pub struct FeedItem {
  pub id: String,
  pub title: String,
  pub url: Option<String>,
  pub author: String,
  pub points: Option<i32>,
  pub views: Option<i32>,
  pub comments: Option<i32>,
  #[serde(rename = "createdAt")]
  pub created_at: String,
  #[serde(rename = "modifiedAt")]
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

#[derive(Default, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FeedComment {
  pub id: String,
  pub parent_id: Option<String>,
  pub author: String,
  pub avatar: Option<String>,
  pub up: Option<i32>,
  pub down: Option<i32>,
  pub is_best: bool,
  pub depth: i32,
  pub contents: Vec<Contents>,
  pub created_at: String,
  pub modified_at: Option<String>,
}

#[derive(Default, Debug, Serialize, Deserialize)]
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

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum Contents {
  Block { items: Vec<Contents>, tn: String, name: String },
  Text { text: String, tn: String },
  Link { url: String, tn: String },
}
