use serde::{Deserialize, Serialize};

mod structs;
mod utils;
mod hn;
mod ruli;
mod fmk;

#[derive(Debug, Serialize, Deserialize)]
pub struct LoadFeedsInput {
  pub name: String,
  pub feed: String,
  pub page: Option<i32>,
}

#[tauri::command]
pub async fn load_feeds(input: LoadFeedsInput) -> Result<structs::LoadFeeds, String> {
  let list = match input.name.as_str() {
    "hacker_news" => hn::load_feed(input.page).await,
    "ruliweb" => ruli::load_list(input.feed, input.page).await,
    "fmk" => fmk::load_list(input.feed, input.page).await,
    _ => Err("invalid input name".into())
  };

  list
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoadDetailInput {
  pub name: String,
  pub feed: String,
  pub id: String,
  pub sub: Option<String>,
}

#[tauri::command]
pub async fn load_detail(input: LoadDetailInput) -> Result<structs::FeedDetail, String> {
  let data = match input.name.as_str() {
    "hacker_news" => hn::load_detail(input.id).await,
    "ruliweb" => match input.feed.as_str() {
      "best" | "all_best" | "humor" => {
        ruli::load_detail("best".to_owned(), input.sub.unwrap_or("300143".to_owned()), input.id).await
      },
      "hit_history" => {
        ruli::load_detail("hobby".to_owned(), input.sub.unwrap_or("300095".to_owned()), input.id).await
      },
      feed if feed.contains(":") => {
        let feed_name = feed.split(":").next().unwrap_or("news");
        let feed_id = feed.split(":").last().unwrap_or("1001");
        ruli::load_detail(feed_name.to_owned(), feed_id.to_owned(), input.id).await
      },
      feed => ruli::load_detail(feed.to_owned(), input.sub.unwrap_or("300143".to_owned()), input.id).await
    },

    "fmk" => fmk::load_detail(input.id).await,
    _ => Err("invalid input name".into())
  };

  data
}
