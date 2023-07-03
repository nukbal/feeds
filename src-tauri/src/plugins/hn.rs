use serde::{Deserialize, Serialize};
use scraper::{Html, Selector, Element};

use super::structs::{LoadFeeds, FeedItem, FeedDetail, FeedComment};
use super::utils::parse_html;

pub async fn load_feed(page: Option<i32>) -> Result<LoadFeeds, String> {
  let target_path = format!("https://news.ycombinator.com/news?p={:?}", page.or(Some(0)).unwrap());
  let txt = reqwest::get(target_path.clone())
    .await.expect(format!("failed to request {}", target_path.clone()).as_str().into())
    .text()
    .await.expect("failed to parse response".into());

  let mut list = Vec::new();
  let mut size = 0;

  let start_idx = txt.find("<table id=\"container").unwrap_or(0);
  let end_idx = txt.rfind("</center").unwrap_or(txt.len());
  let html = Html::parse_fragment(&txt[start_idx..end_idx]);

  let row_sel = Selector::parse("tr.athing").unwrap();
  let title_sel = Selector::parse("td.title a").unwrap();
  let author_sel = Selector::parse("td.subtext a.hnuser").unwrap();
  let date_sel = Selector::parse("td.subtext span.age").unwrap();
  let cmt_sel = Selector::parse("td.subtext span.subline a:last-child").unwrap();

  html.select(&row_sel).into_iter().for_each(|item| {
    let title_node = item.select(&title_sel).next().unwrap();
    let next_node = item.next_sibling_element().unwrap();
    let link_href = title_node.value().attr("href").unwrap();

    size += 1;
    list.push(FeedItem {
      id: item.value().attr("id").unwrap().to_owned(),
      title: title_node.text().collect::<String>(),
      text: match link_href {
        href if href.contains("news.ycombinator.com") => None,
        href => Some(href.to_owned()),
      },
      author: match next_node.select(&author_sel).next() {
        Some(node) => node.text().collect::<String>(),
        _ => "".to_owned(),
      },
      created_at: match next_node.select(&date_sel).next() {
        Some(node) => node.value().attr("title").unwrap_or("").to_owned(),
        _ => "".to_owned(),
      },
      comments: match next_node.select(&cmt_sel).next() {
        Some(node) => {
          let mut cmt_txt = node.text().collect::<String>();
          cmt_txt = cmt_txt.replace("comments", "").trim().to_owned();
          if let Ok(num) = cmt_txt.parse::<i32>() {
            Some(num)
          } else {
            None
          }
        },
        _ => None,
      },
      ..Default::default()
    });
  });

  Ok(LoadFeeds {
    items: list,
    page: match page {
      Some(page_num) => page_num,
      _ => 0,
    },
    items_per_page: size,
    ..Default::default()
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
