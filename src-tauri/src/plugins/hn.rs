use serde::{Deserialize, Serialize};

use super::structs::{LoadFeeds, FeedItem, FeedDetail, FeedComment};
use super::utils::parse_html;

#[derive(Debug, Serialize, Deserialize)]
struct HNSearch {
  hits: Vec<HNFeed>,
  #[serde(rename = "nbHits")]
  nb_hits: i32,
  page: i32,
  #[serde(rename = "hitsPerPage")]
  hits_per_page: i32,
  #[serde(rename = "nbPages")]
  nb_pages: i32,
}

#[derive(Debug, Serialize, Deserialize)]
struct HNFeed {
  #[serde(rename = "objectID")]
  id: String,
  author: String,
  points: i32,
  num_comments: Option<i32>,
  created_at: String,
  title: String,
  url: Option<String>,
  story_text: Option<String>,
}

impl HNFeed {
  fn into_item(&self) -> FeedItem {
    FeedItem {
      id: self.id.clone(),
      title: self.title.clone(),
      text: self.url.clone(),
      author: self.author.clone(),
      points: Some(self.points),
      comments: self.num_comments,
      created_at: self.created_at.clone(),
      ..Default::default()
    }
  }
}

pub async fn load_feed(page: Option<i32>) -> Result<LoadFeeds, String> {
  let target_path = format!("https://hn.algolia.com/api/v1/search?tags=front_page&page={:?}", page.or(Some(0)).unwrap());
  let res = reqwest::get(target_path.clone())
    .await.expect(format!("failed to request {}", target_path.clone()).as_str().into())
    .json::<HNSearch>()
    .await.expect("failed to parse response".into());

  Ok(LoadFeeds {
    items: res.hits.into_iter().map(|item| item.into_item()).collect(),
    page: res.page,
    total: Some(res.nb_hits),
    total_pages: Some(res.nb_pages),
    items_per_page: res.hits_per_page,
  })
}

#[derive(Debug, Serialize, Deserialize)]
struct HNComment {
  id: i32,
  created_at: String,
  author: Option<String>,
  text: Option<String>,
  parent_id: Option<i32>,
  children: Vec<HNComment>,
}

#[derive(Debug, Serialize, Deserialize)]
struct HNDetail {
  id: i32,
  created_at: String,
  author: String,
  title: String,
  url: Option<String>,
  text: Option<String>,
  points: i32,
  children: Vec<HNComment>
}

pub async fn load_detail(id: String) -> Result<FeedDetail, String> {
  let target_path = format!("https://hn.algolia.com/api/v1/items/{}", id);

  let res = reqwest::get(target_path.clone())
    .await.expect(format!("failed to request {}", target_path.clone()).as_str().into())
    .json::<HNDetail>()
    .await.expect("failed to parse response".into());

  // let mut comments = Vec::new();

  // for c in res.children {

  // }

  let comments = res.children.iter().flat_map(|s| flat_comments(s, 0, None)).collect::<Vec<FeedComment>>();

  Ok(FeedDetail {
    id: res.id.to_string(),
    title: res.title,
    url: res.url,
    author: res.author,
    up: Some(res.points),
    comment_num: Some(comments.len() as i32),
    comments,
    contents: parse_html(res.text),
    created_at: res.created_at,
    ..Default::default()
  })
}

fn flat_comments(item: &HNComment, depth: i32, reply: Option<String>) -> Vec<FeedComment> {
  if item.author.is_none() || item.text.is_none() {
    return vec![];
  }

  let mut arr = vec![FeedComment {
    id: item.id.to_string(),
    author: item.author.clone().unwrap(),
    parent_id: if item.parent_id.is_some() { Some(item.parent_id.unwrap().to_string()) } else { None },
    contents: parse_html(item.text.clone()),
    created_at: item.created_at.clone(),
    reply_to: reply,
    depth: depth,
    ..Default::default()
  }];
  if item.children.len() == 0 {
    return arr;
  }

  item.children.iter().for_each(|s| {
    let mut children = flat_comments(s, depth + 1, item.author.clone());
    arr.append(&mut children);
  });

  arr
}
