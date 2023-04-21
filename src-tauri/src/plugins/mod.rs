use serde::{Deserialize, Serialize};

mod structs;
mod utils;
mod hn;
mod ruli;

#[derive(Debug, Serialize, Deserialize)]
pub struct LoadFeedsInput {
  pub name: String,
  pub page: Option<i32>,
}

#[tauri::command]
pub async fn load_feeds(input: LoadFeedsInput) -> Result<structs::LoadFeeds, String> {
  let list = match input.name.as_str() {
    "hacker_news" => hn::load_feed(input.page).await,
    "ruliweb" => ruli::load_list("best".to_string(), input.page).await,
    "ruli_best" => ruli::load_list("best_all".to_string(), input.page).await,
    "ruli_humor" => ruli::load_list("humor".to_string(), input.page).await,
    "ruli_news_console" => ruli::load_list("news:1001".to_string(), input.page).await,
    "ruli_news_mobile" => ruli::load_list("news:1004".to_string(), input.page).await,
    "ruli_news_pc" => ruli::load_list("news:1003".to_string(), input.page).await,
    _ => Err("invalid input name".into())
  };

  list
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoadDetailInput {
  pub name: String,
  pub id: String,
  pub sub: Option<String>,
}

#[tauri::command]
pub async fn load_detail(input: LoadDetailInput) -> Result<structs::FeedDetail, String> {
  let data = match input.name.as_str() {
    "hacker_news" => hn::load_detail(input.id).await,
    "ruliweb" | "ruli_humor" | "ruli_best" => {
      ruli::load_detail("best".to_string(), input.sub.unwrap_or("300143".to_owned()), input.id).await
    },
    "ruli_news_console" => ruli::load_detail("news".to_string(), "1001".to_string(), input.id).await,
    "ruli_news_mobile" => ruli::load_detail("news".to_string(), "1004".to_string(), input.id).await,
    "ruli_news_pc" => ruli::load_detail("news".to_string(), "1003".to_string(), input.id).await,
    _ => Err("invalid input name".into())
  };

  data
}
