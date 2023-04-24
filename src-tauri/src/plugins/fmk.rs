use scraper::{Html, Selector, ElementRef};

use super::structs::{LoadFeeds, FeedItem, FeedDetail, FeedComment, Contents};
use super::utils::{parse_num_from_elem, parse_date_string};

fn parse_list(text: String) -> Vec<FeedItem> {
  if text.len() == 0 { return vec![]; }

  let txt = text.clone();
  let mut list = Vec::new();
  let start_idx = txt.find("<div id=\"container").unwrap_or(0);
  let end_idx = txt.rfind("<footer id=\"footer").unwrap_or(txt.len());

  let target = (&txt[start_idx..end_idx]).to_string();
  let is_table = target.contains("<caption class=\"blind");

  let html = Html::parse_fragment(target.as_str());
  let row_sel = Selector::parse(if is_table { "tr:not([class])" } else { "div.fm_best_widget li" }).unwrap();

  let thumb_sel = Selector::parse("img.thumb").unwrap();
  let title_sel = Selector::parse("h3.title a").unwrap();
  let cmt_num_sel = Selector::parse("h3.title span.comment_count").unwrap();
  let date_sel = Selector::parse("span.regdate").unwrap();
  let author_sel = Selector::parse("span.author").unwrap();
  let point_sel = Selector::parse("span.count").unwrap();

  html.select(&row_sel).into_iter().for_each(|item| {
    let title_node = item.select(&title_sel).next().unwrap();

    list.push(FeedItem {
      id: match title_node.value().attr("href") {
        Some(id_node) => {
          let idx = if id_node.contains("document_srl") {
            id_node.rfind("document_srl=").unwrap_or(0) + 13
          } else {
            id_node.rfind("/").unwrap_or(0) + 1
          };
          (&id_node[idx..]).to_string()
        },
        _ => "-".to_owned(),
      },
      thumb: match item.select(&thumb_sel).next() {
        Some(thumb_node) => match thumb_node.value().attr("data-original") {
          Some(thumb_url) => Some(thumb_url.to_owned()),
          _ => Some("None".to_owned()),
        },
        _ => None,
      },
      title: title_node.text().into_iter().next().unwrap_or("").to_owned(),
      comments: match item.select(&cmt_num_sel).next() {
        Some(cmt_node) => {
          let cmt_txt = cmt_node.text().collect::<String>();
          let num_txt = if cmt_txt.starts_with("[") {
            (&cmt_txt[1..cmt_txt.len() - 1]).to_owned()
          } else { cmt_txt };

          match num_txt.parse::<i32>() {
            Ok(num_val) => Some(num_val),
            _ => None,
          }
        },
        _ => None,
      },
      author: match item.select(&author_sel).next() {
        Some(author_node) => {
          let author_txt = author_node.text().collect::<String>().trim().to_owned();

          if author_txt.starts_with("/") {
            (&author_txt[2..]).to_owned()
          } else {
            author_txt.to_owned()
          }
        },
        None => "-".to_owned(),
      },
      points: match item.select(&point_sel).next() {
        Some(point_node) => parse_num_from_elem(point_node),
        _ => None,
      },
      created_at: match item.select(&date_sel).next() {
        Some(date_node) => parse_date_string(date_node.text().collect()),
        _ => "".to_owned(),
      },
      ..Default::default()
    });
  });

  list
}

pub async fn load_list(category: String, page: Option<i32>) -> Result<LoadFeeds, String> {
  let page_num = page.unwrap_or_default() + 1;
  let target_path = format!("https://www.fmkorea.com/index.php?listStyle=webzine&mid={}&page={}", category, page_num).to_string();

  let html = match reqwest::get(target_path.clone()).await {
    Ok(res) => match res.text().await {
      Ok(txt) => txt,
      _ => {
        return Err("failed to get response text".to_owned());
      },
    },
    Err(err) => match err.status() {
      Some(reqwest::StatusCode::NOT_FOUND) => { return Err("404".to_owned()); },
      _ => { return Err(format!("failed to request {}", target_path.clone()).as_str().into()); },
    },
  };

  let items = parse_list(html);

  Ok(LoadFeeds {
    items_per_page: items.len() as i32,
    items: items,
    page: page_num,
    total: None,
    total_pages: None,
  })
}

pub async fn load_detail(id: String) -> Result<FeedDetail, String> {
  let target_path = format!("https://www.fmkorea.com/{}", id).to_owned();

  let html = match reqwest::get(target_path.clone()).await {
    Ok(res) => match res.text().await {
      Ok(txt) => txt,
      _ => {
        return Err("failed to get response text".to_owned());
      },
    },
    Err(err) => match err.status() {
      Some(reqwest::StatusCode::NOT_FOUND) => { return Err("404".to_owned()); },
      _ => { return Err(format!("failed to request {}", target_path.clone()).as_str().into()); },
    },
  };

  let content_idx_start = html.find("<article").unwrap_or(0);
  let content_idx_end = html.find("<!--AfterDocument").unwrap_or(html.len());

  let content_dom = Html::parse_fragment(&html[content_idx_start..content_idx_end]);
  let content_sel = Selector::parse("article > div").unwrap();
  let contents = match content_dom.select(&content_sel).next() {
    Some(content) => super::utils::parse_html(Some(content.html())),
    _ => vec![],
  };

  let header_idx_start = html.find("<div id=\"content").unwrap_or(0);
  let header_dom = Html::parse_fragment(&html[header_idx_start..content_idx_start]);
  let title_sel = Selector::parse("div.top_area h1 span:not(.STAR-BEST_T)").unwrap();
  let author_sel = Selector::parse("a.member_plate").unwrap();
  let date_sel = Selector::parse("div.top_area span.date").unwrap();

  let cmt_idx_start = html.rfind("<div id=\"cmtPosition").unwrap_or(0);
  let cmt_idx_end = html.rfind("<div class=\"cmt_editor").unwrap_or(html.len());
  let cmt_dom = Html::parse_fragment(&html[cmt_idx_start..cmt_idx_end]);
  let cmt_sel = Selector::parse("li").unwrap();

  Ok(FeedDetail {
    id,
    title: match header_dom.select(&title_sel).next() {
      Some(title_node) => title_node.text().collect(),
      _ => "-".to_owned(),
    },
    author: match header_dom.select(&author_sel).next() {
      Some(author_node) => author_node.text().collect(),
      _ => "-".to_owned(),
    },
    created_at: match header_dom.select(&date_sel).next() {
      Some(date_node) => {
        parse_date_string(date_node.text().collect())
      },
      _ => "".to_owned(),
    },
    contents,
    comments: cmt_dom.select(&cmt_sel).into_iter().map(parse_comment).collect::<Vec<FeedComment>>(),
    ..Default::default()
  })
}

fn parse_comment(elem: ElementRef) -> FeedComment {
  let author_sel = Selector::parse("a.member_plate").unwrap();
  let content_sel = Selector::parse("div.comment-content").unwrap();
  let content_link_sel = Selector::parse("div.comment-content a[onclick]").unwrap();
  let up_sel = Selector::parse("span.voted_count").unwrap();
  let down_sel = Selector::parse("span.blamed_count").unwrap();
  let best_sel = Selector::parse("a.icon-hit").unwrap();
  let date_sel = Selector::parse("span.date").unwrap();

  let mut contents = vec![];
  let mut reply: Option<String> = None;

  elem.select(&content_link_sel).for_each(|link| {
    let text = link.text().collect::<String>();
    if link.value().attr("onclick").is_some() {
      reply = Some(text);
    } else if text.len() > 0 {
      contents.push(Contents::Link { url: text, text: None });
    }
  });

  match elem.select(&content_sel).next() {
    Some(content_node) => {
      let mut text = "".to_owned();

      content_node.text().for_each(|txt| {
        if txt.trim().starts_with("http") {
          contents.push(Contents::Link { url: txt.trim().to_owned(), text: None });
        } else if reply == None || txt != reply.clone().unwrap() {
          text.push_str(txt);
        }
      });

      contents.push(Contents::Text {
        text,
        name: Some("p".to_owned()),
      });
    },
    _ => (),
  }


  FeedComment {
    author: match elem.select(&author_sel).next() {
      Some(author_node) => author_node.text().collect(),
      _ => "".to_owned(),
    },
    contents,
    depth: if reply != None { 1 } else { 0 },
    reply_to: reply,
    is_best: elem.select(&best_sel).next().is_some(),
    up: parse_num_from_elem(elem.select(&up_sel).next().unwrap()),
    down: parse_num_from_elem(elem.select(&down_sel).next().unwrap()),
    created_at: match elem.select(&date_sel).next() {
      Some(date_node) => parse_date_string(date_node.text().collect()),
      _ => "".to_owned(),
    },
    ..Default::default()
  }
}
