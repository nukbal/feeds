use serde::{Deserialize, Serialize};

mod structs;
mod hn;

#[derive(Debug, Serialize, Deserialize)]
pub struct LoadFeedsInput {
  pub name: String,
  pub page: Option<i32>,
}

#[tauri::command]
pub async fn load_feeds(input: LoadFeedsInput) -> Result<structs::LoadFeeds, String> {
  match input.name.as_str() {
    "hacker_news" => hn::load_feed(input.page).await,
    _ => Err("invalid input name".into())
  }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoadDetailInput {
  pub name: String,
  pub id: String,
}

#[tauri::command]
pub async fn load_detail(input: LoadDetailInput) -> Result<structs::FeedDetail, String> {
  match input.name.as_str() {
    "hacker_news" => hn::load_detail(input.id).await,
    _ => Err("invalid input name".into())
  }
}
