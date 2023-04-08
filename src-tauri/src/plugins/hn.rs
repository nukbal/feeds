use serde::{Deserialize, Serialize};

use super::structs::{LoadFeeds, FeedItem, FeedDetail, Contents, FeedComment};

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
      url: self.url.clone(),
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

  let comments = res.children.iter().flat_map(|s| flat_comments(s)).collect::<Vec<FeedComment>>();

  Ok(FeedDetail {
    id: res.id.to_string(),
    title: res.title,
    url: res.url,
    author: res.author,
    up: Some(res.points),
    comment_num: Some(comments.len() as i32),
    comments,
    contents: (
      if res.text.is_some() {
        vec![Contents::Text { text: parse_text(res.text), tn: "text".to_string() }]
      } else {
        vec![]
      }
    ),
    created_at: res.created_at,
    ..Default::default()
  })
}

fn parse_text(text: Option<String>) -> String {
  if text.is_none() {
    return "".to_string();
  }
  let html = scraper::Html::parse_fragment(text.unwrap().as_str());
  // let selector = scraper::Selector::parse("*").unwrap();
  // let root = html.root_element().select(&selector).next().unwrap();
  let mut root = html.root_element().first_child();

  let mut txt_arr = vec![""];

  while root.is_some() {
    let elem = root.unwrap();

    if elem.has_children() {
      let parent = elem.value().as_element().unwrap();
      println!("{}", parent.name());
      if elem.children().count() == 1 {
        // txt_arr.push(elem.first_child().unwrap().value().as_text().unwrap().to_string().clone().as_str());
      } else {
        elem.children().for_each(|c| {
          println!("{:?}", c.value());
        });
      }
    }

    root = elem.next_sibling();
  }
  
  return txt_arr.join("\n");
}

fn flat_comments(item: &HNComment) -> Vec<FeedComment> {
  if item.author.is_none() || item.text.is_none() {
    return vec![];
  }
  if item.children.len() == 0 {
    return vec![FeedComment {
      id: item.id.to_string(),
      author: item.author.clone().unwrap(),
      parent_id: if item.parent_id.is_some() { Some(item.parent_id.unwrap().to_string()) } else { None },
      // contents: vec![Contents::Text { text: parse_text(item.text.clone()), tn: "text".to_string() }],
      contents: vec![Contents::Text { text: "".to_string(), tn: "text".to_string() }],
      created_at: item.created_at.clone(),
      ..Default::default()
    }];
  }
  item.children.iter().flat_map(|s| flat_comments(s)).collect()
}
