use scraper::{Html, Node};
use ego_tree::NodeRef;

use super::structs::{Contents};

// fn convert_node(node: &Rc<Node>) -> Contents {
//   match node.data {
//     NodeData::Element { ref name, ref attrs, .. } => {
//       let name_str: String = name.local.to_string();
//       println!("{:?}", name_str);
//       match name_str.as_ref() {
//         "div" => Contents::Block {
//           name: name_str,
//           items: node.children.borrow().iter().map(convert_node).collect(),
//         },
//         "p" => {
//           let block_items: Vec<Contents> = node.children.borrow().iter().map(convert_node).collect();
//           let mut json_items = vec![];
//           for item in block_items {
//             match item {
//               Contents::Text { text, .. } if text.trim().is_empty() => (),
//               Contents::Block { items, .. } if items.len() == 0 => (),
//               Contents::Image { url, .. } => json_items.push(Contents::Image { url, alt: None }),
//               _ => json_items.push(item),
//             }
//           }
//           Contents::Block { name: name_str, items: json_items }
//         }
//         "a" => {
//           let children = node.children.borrow();
//           let items = children.iter().map(convert_node).collect();
//           Contents::Block { name: name_str, items }
//         },
//         "b" | "i" | "u" | "strong" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "li" | "ol" | "ul" => {
//           let items = node.children.borrow().iter().map(convert_node).collect();
//           Contents::Block { name: name_str, items }
//         }
//         "img" => {
//           let mut url = "".to_string();
//           for attr in attrs.borrow().iter() {
//             if attr.name.local.to_string() == "src" {
//               url = attr.value.to_string();
//               break;
//             }
//           }
//           Contents::Image { url, alt: Some(name_str) }
//         }
//         _ => Contents::Text { name: Some(name_str), text: "".to_string() },
//       }
//     }
//     _ => Contents::Text { name: None, text: "".to_string() },
//   }
// }

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
              Contents::Text { text, .. } if text.trim().is_empty() => (),
              Contents::Block { items, .. } if items.len() == 0 => (),
              Contents::Text { text, .. } if size == 1 => {
                return Some(Contents::Text { text, name: Some(tag_name.to_owned()) });
              },
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
        "img" => {
          let href = node.attr("src");
          let alt = node.attr("alt");
          Some(Contents::Image {
            url: href.unwrap().to_string(),
            alt: if alt.is_some() { Some(alt.unwrap().to_owned()) } else { None },
          })
        }
        "video" => {
          let href = node.attr("src");
          Some(Contents::Video {
            url: href.unwrap().to_string(),
          })
        }
        "br" | "hr" | "input" | "button" => None,
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
      let trimed_txt = txt.trim();
      if trimed_txt.len() > 0 {
        Some(Contents::Text { name: None, text: trimed_txt.to_owned() })
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
