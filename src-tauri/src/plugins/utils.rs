use chrono::{TimeZone, Datelike};
use scraper::{Html, Node};
use ego_tree::NodeRef;

use super::structs::{Contents};

pub fn parse_num_from_elem(node: scraper::ElementRef) -> Option<i32> {
  let mut text = node.text().collect::<String>();
  text = text.trim().to_string();

  if text.is_empty() {
    None
  } else {
    match text.parse::<i32>() {
      Ok(num) => Some(num),
      _ => None,
    }
  }
}

fn convert_node(elem: NodeRef<Node>) -> Option<Contents> {
  match elem.value() {
    scraper::Node::Element(node) => {
      let tag_name = node.name();
      match tag_name {
        "p" | "div" | "blockquote" => {
          let block_items: Vec<Contents> = elem.children().map(convert_node).flatten().collect();

          let mut json_items = vec![];
          let size = block_items.len();

          if block_items.len() == 0 { return None; }

          for item in block_items {
            match item {
              // Contents::Text { text, .. } if text.trim().is_empty() => (),
              Contents::Block { items, .. } if items.len() == 0 => (),
              Contents::Text { text, .. } if size == 1 => {
                return Some(Contents::Text { text, name: Some(tag_name.to_owned()) });
              },
              Contents::Link { .. } if size == 1 => json_items.push(item),
              _ if size == 1 => {
                return Some(item.to_owned());
              },
              _ => json_items.push(item),
            }
          }
          Some(Contents::Block { items: json_items, name: tag_name.to_owned() })
        }
        "a" => {
          let href = node.attr("href");
          let items: Vec<Contents> = elem.children().map(convert_node).flatten().collect();
          let first_item = items.first();

          if first_item.is_none() && href.is_some() {
            return Some(Contents::Link {
              url: href.unwrap().to_string(),
              text: None,
            });
          }

          if first_item.is_none() && href.is_none() {
            return None;
          }

          match first_item.unwrap() {
            Contents::Text { text, .. } if href.is_some() => Some(Contents::Link {
              url: href.unwrap().to_string(),
              text: Some(text.to_owned()),
            }),
            item => Some(item.to_owned()),
          }
        }
        "img" => match node.attr("data-original") {
          Some(lazy_node) => {
            let alt = node.attr("alt");
            Some(Contents::Image {
              url: lazy_node.to_owned(),
              alt: if alt.is_some() { Some(alt.unwrap().to_owned()) } else { None },
            })
          },
          _ => {
            let href = node.attr("src");
            let alt = node.attr("alt");
            Some(Contents::Image {
              url: href.unwrap().to_owned(),
              alt: if alt.is_some() { Some(alt.unwrap().to_owned()) } else { None },
            })
          },
        }
        "video" => {
          let href = node.attr("src");
          let poster = node.attr("poster");
          let url = match href {
            Some(url) => Some(url.to_owned()),
            _ => match elem.first_child() {
              Some(source_node) => match source_node.value() {
                scraper::Node::Element(sn) => match sn.attr("data-src") {
                  Some(source_url) => Some(source_url.to_owned()),
                  _ => None,
                }
                _ => None,
              },
              _ => None,
            },
          };

          if url.is_none() {
            return None;
          }

          let url_text = url.unwrap();
          // 루리웹 한정으로, video로 표시하지만, 사실 파일은 webp밖에 존재하지 않으므로 fallback을 미리 해둠
          if url_text.ends_with(".mp4?webp") {
            return Some(Contents::Image {
              url: url_text.replace(".mp4?webp", "webp"),
              alt: None,
            });
          }

          Some(Contents::Video {
            url: url_text,
            thumb: match poster {
              Some(thumb) => Some(thumb.to_owned()),
              _ => None,
            },
          })
        }
        // "br" => Some(Contents::Text { text: "\n".to_owned(), name: None }),
        "br" | "hr" | "input" | "button" | "meta" => None,
        "iframe" => {
          let url = node.attr("src").unwrap_or("");
          if url.contains("https://youtu.be") || url.contains("https://www.youtube.com/embed") {
            return Some(Contents::Youtube { url: url.to_owned() });
          }

          None
        },
        _ => {
          let items: Vec<Contents> = elem.children().map(convert_node).flatten().collect();
          let first_item = items.first();

          if items.len() == 1 && first_item.is_some() {
            match first_item.unwrap() {
              Contents::Text { text, .. } => {
                let trimed_txt = text.trim();
                if trimed_txt.len() == 0 { return None; }
                return Some(Contents::Text { text: trimed_txt.to_owned(), name: Some(tag_name.to_owned()) });
              },
              _ => {
                return None;
              },
            };
          }

          None
        },
      }
    },
    scraper::Node::Text(txt) => {
      let mut trimed_txt = txt.trim().to_owned();
      if let Some(next_node) = elem.next_sibling() {
        if let Some(next_elem) = next_node.value().as_element() {
          if next_elem.name() == "br" {
            trimed_txt.push_str("\n");
          }
        }
      }
      if trimed_txt.len() > 0 {
        Some(Contents::Text { name: None, text: trimed_txt })
      } else {
        None
      }
    },
    _ => None,
  }
}

pub fn parse_html(text: Option<String>) -> Vec<Contents> {
  if text.is_none() { return vec![]; }

  let html = text.unwrap();
  let mut results: Vec<Contents> = Vec::new();

  let document = Html::parse_fragment(&html);
  let root = document.root_element();

  root.children().for_each(|item| {
    let items = convert_node(item);
    if items.is_some() {
      results.push(items.unwrap());
    }
  });

  if results.len() == 1 {
    match results.first().unwrap() {
      Contents::Block { items, .. } => {
        results = items.to_vec();
      },
      _ => (),
    }
  }

  results
}


pub fn parse_date_string(str: String) -> String {
  let mut text = str.clone();
  let now = chrono::Local::now();

  if text.contains("날짜") {
    text = text.replace("날짜", " ").trim().to_string();
  }

  if text.contains("초") {
    let idx = text.rfind("초").unwrap_or(text.len());
    let unit = (&text[..idx]).trim().parse::<i64>().unwrap_or(0);
    let target_date = now - chrono::Duration::seconds(unit);
    return target_date.to_rfc3339();
  }

  if text.contains("분") {
    let idx = text.rfind("분").unwrap_or(text.len());
    let unit = (&text[..idx]).trim().parse::<i64>().unwrap_or(0);
    let target_date = now - chrono::Duration::minutes(unit);
    return target_date.to_rfc3339();
  }

  if text.contains("시간") {
    let idx = text.rfind("시간").unwrap_or(text.len());
    let unit = (&text[..idx]).trim().parse::<i64>().unwrap_or(0);
    let target_date = now - chrono::Duration::hours(unit);
    return target_date.to_rfc3339();
  }

  // yyyy.mm.dd (hh:mm:ss)
  if text.contains(".") && text.contains(":") && text.contains("(") {
    let naive = chrono::NaiveDateTime::parse_from_str(&text, "%Y.%m.%d (%H:%M:%S)").unwrap();
    return chrono::Local.from_local_datetime(&naive).unwrap().to_rfc3339();
  }

  // yyyy.mm.dd hh:mm or yy.mm.dd hh:mm
  if text.contains(".") && text.contains(":") {
    if text.find(".") == Some(2) {
      text = format!("20{}", text).trim().to_owned();
    }
    let naive = chrono::NaiveDateTime::parse_from_str(&text, "%Y.%m.%d %H:%M").unwrap();
    return chrono::Local.from_local_datetime(&naive).unwrap().to_rfc3339();
  }

  // yyyy.mm.dd
  if text.contains(".") {
    return chrono::NaiveDate::parse_from_str(&text, "%Y.%m.%d").unwrap().to_string();
  }

  // hh:mm
  if text.contains(":") {
    let added_text = format!("{}-{}-{} {}", now.year(), now.month(), now.day(), text);
    let naive = chrono::NaiveDateTime::parse_from_str(&added_text, "%Y-%m-%d %H:%M").unwrap();
    return chrono::Local.from_local_datetime(&naive).unwrap().to_rfc3339();
  }

  text
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn parse_html_test_hn() {
    let res = parse_html(Some("
      <p>paragraph 1</p>
      <p>
        <pre><code>code quote</code></pre>
        paragraph 2
      </p>
      <p>
        paragraph 3
        <a href=\"sample-url\">sample-url</a>
        <a href=\"single-url\" />
        <a href=\"sample-url\"><i><svg></svg></i>sample-url</a>
      </p>
    ".to_string()));

    // res.iter().for_each(|item| { println!("{:?}", item); });

    // assert_eq!(res.len(), 3, "3 paragraph founds");

    // println!("{:?}", serde_json::to_string(&res));
    // assert_eq!(res.get(1).unwrap(), 4);
  }

  #[test]
  fn parse_html_content() {
    let res = parse_html(Some("
      <div>
        <p><br /></p>
        <p><a class=\"img_load\"><img src=\"http://image-path\" alt=\"test-alt\" /></a></p>
        <p><br /></p>
        <p><a href=\"http://link-here\">some link!</a></p>
        <p><br /></p>
        <p>paragraph 1</p>
        <p>paragraph 2</p>
        <p><br /></p>
        <p>paragraph <b>bold</b> 3</p>
      </div>
    ".to_string()));

    // println!("{:?}", res);
    res.iter().for_each(|row| {
      match row {
        Contents::Block { items, name } => items.iter().for_each(|c| { println!("{} => {:?}", name, c); }),
        _ => { println!("{:?}", row); },
      }
    });

    // assert_eq!(res.len(), 5, "5 blocks founds");
  }
}
