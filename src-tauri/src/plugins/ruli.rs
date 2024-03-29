use scraper::{Html, Selector, ElementRef};

use super::structs::{LoadFeeds, FeedItem, FeedDetail, FeedComment, Contents};
use super::utils::parse_num_from_elem;

fn parse_list(text: String) -> Vec<FeedItem> {
  if text.len() == 0 { return vec![]; }

  let txt = text.clone();
  let start_idx = txt.find("<table class=\"board_list_table").unwrap_or(0);
  let end_idx = txt.match_indices("</table>").find_map(|(i, _)| (i > start_idx.clone()).then(|| i)).unwrap_or(0);

  let target = (&txt[start_idx..end_idx]).to_string();

  let html = Html::parse_fragment(target.as_str());

  if target.contains("<colgroup>") {
    let items_sel = Selector::parse("div.article").unwrap();
    let items = html.select(&items_sel);
  
    let cat_sel = Selector::parse("div.article_info a[title]").unwrap();
    let title_sel = Selector::parse("a.title_wrapper").unwrap();
    let comment_sel = Selector::parse("a.title_wrapper span.num").unwrap();
    let id_sel = Selector::parse("input[name=article_id]").unwrap();
    let auther_sel = Selector::parse("a.nick").unwrap();
    let recom_sel = Selector::parse("span.recomd strong").unwrap();
    let view_sel = Selector::parse("span.hit strong").unwrap();
    let thumb_sel = Selector::parse("a.thumbnail").unwrap();
    let date_sel = Selector::parse("span.time").unwrap();
  
    items.map(|itm| {
      FeedItem {
        id: itm.select(&id_sel).next().unwrap().value().attr("value").unwrap().to_string(),
        title: itm.select(&title_sel).next().unwrap().first_child().unwrap().value().as_text().unwrap().trim().to_string(),
        comments: match itm.select(&comment_sel).next() {
          Some(elem) => parse_num_from_elem(elem),
          _ => None,
        },
        category: match itm.select(&cat_sel).next() {
          Some(elem) => Some(get_text_from_elem(Some(elem))),
          _ => None,
        },
        sub_id: match itm.select(&cat_sel).next() {
          Some(elem) => {
            match elem.value().attr("href") {
              Some(target_url) => {
                let url_start_idx = target_url.rfind("/").unwrap_or(0) + 1;
                let url_end_idx = target_url.rfind("?").unwrap_or(target_url.len());
                Some((&target_url[url_start_idx..url_end_idx]).to_string())
              },
              _ => None,
            }
          },
          _ => None,
        },
        author: get_text_from_elem(itm.select(&auther_sel).next()),
        points: match itm.select(&recom_sel).next() {
          Some(elem) => super::utils::parse_num_from_elem(elem),
          _ => None,
        },
        views: match itm.select(&view_sel).next() {
          Some(elem) => super::utils::parse_num_from_elem(elem),
          _ => None,
        },
        thumb: match itm.select(&thumb_sel).next() {
          Some(elem) => {
            let style_txt = elem.value().attr("style").unwrap_or("");
            let style_idx_start = style_txt.find("url(").unwrap_or(0) + 4;
            let style_idx_end = style_txt.find(");").unwrap_or(0);
            let thumb_url = style_txt.chars().skip(style_idx_start).take(style_idx_end - style_idx_start).collect::<String>();
            if thumb_url.contains("ruliweb_thumbnail_empty") {
              Some("None".to_owned())
            } else {
              Some(thumb_url)
            }
          },
          _ => None,
        },
        created_at: parse_date_from_elem(itm.select(&date_sel).next()),
        ..Default::default()
      }
    }).collect::<Vec<FeedItem>>()
  } else {
    let items_sel = Selector::parse("tr.blocktarget").unwrap();
    let items = html.select(&items_sel);
  
    let id_sel = Selector::parse("td.id").unwrap();
    let title_sel = Selector::parse("td.subject a").unwrap();
    let cat_sel = Selector::parse("td.divsn").unwrap();
    let comment_sel = Selector::parse("a.num_reply span.num").unwrap();
    let auther_sel = Selector::parse("td.writer").unwrap();
    let recom_sel = Selector::parse("td.recomd").unwrap();
    let view_sel = Selector::parse("td.hit").unwrap();
    let date_sel = Selector::parse("td.time").unwrap();

    items.map(|itm| {
      FeedItem {
        id: get_text_from_elem(itm.select(&id_sel).next()),
        title: get_text_from_elem(itm.select(&title_sel).next()),
        category: match itm.select(&cat_sel).next() {
          Some(elem) => Some(get_text_from_elem(Some(elem))),
          _ => None,
        },
        comments: match itm.select(&comment_sel).next() {
          Some(elem) => parse_num_from_elem(elem),
          _ => None,
        },
        author: get_text_from_elem(itm.select(&auther_sel).next()),
        points: match itm.select(&recom_sel).next() {
          Some(elem) => parse_num_from_elem(elem),
          _ => None,
        },
        views: match itm.select(&view_sel).next() {
          Some(elem) => parse_num_from_elem(elem),
          _ => None,
        },
        created_at: parse_date_from_elem(itm.select(&date_sel).next()),
        ..Default::default()
      }
    }).collect::<Vec<FeedItem>>()
  }
}

fn get_text_from_elem(node: Option<scraper::ElementRef>) -> String {
  if node.is_none() { return "".to_string(); }
  node.unwrap().text().collect::<String>().trim().to_string()
}

fn parse_date_from_elem(node: Option<scraper::ElementRef>) -> String {
  let text = get_text_from_elem(node);
  super::utils::parse_date_string(text)
}

pub async fn load_list(category: String, page: Option<i32>) -> Result<LoadFeeds, String> {
  if category.len() == 0 { return Err("invalid category".to_string()); }

  let base_path = "https://bbs.ruliweb.com";
  let page_num = page.unwrap_or_default() + 1;

  let target_path = match category.as_str() {
    "best" => {
      format!("{}/best/selection?m=all&t=now&page={}", base_path, page_num).to_string()
    },
    "all_best" => {
      format!("{}/best/all?m=all&t=now&page={}", base_path, page_num).to_string()
    },
    "humor" => {
      format!("{}/best/humor?m=all&t=now&page={}", base_path, page_num).to_string()
    },
    "hit_history" => {
      format!("{}/best/hit_history?m=all&t=now&page={}", base_path, page_num).to_string()
    },
    board_id if board_id.contains(":") => {
      let feed_name = board_id.split(":").next().unwrap_or("news");
      let feed_id = board_id.split(":").last().unwrap_or("1001");
      format!("{}/{}/board/{}?view=default&page={}", base_path, feed_name, feed_id, page_num).to_string()
    },
    _ => {
      return Err("invalid board info".to_string());
    },
  };

  let res = reqwest::get(target_path.clone())
    .await.expect(format!("failed to request {}", target_path.clone()).as_str().into())
    .text()
    .await.expect("failed to get response text".into());

  let items = parse_list(res);

  Ok(LoadFeeds {
    items_per_page: items.len() as i32,
    items: items,
    page: page_num,
    total: None,
    total_pages: None,
    is_last: false,
  })
}


/** 댓글 parse */
fn parse_comment(node: ElementRef) -> FeedComment {
  let cmt_name_sel = Selector::parse("a.nick_link").unwrap();
  let cmt_text_sel = Selector::parse("div.text_wrapper span.text").unwrap();
  let cmt_reply_sel = Selector::parse("div.text_wrapper span.p_nick").unwrap();
  let cmt_img_sel = Selector::parse("div.text_wrapper .comment_img").unwrap();
  let cmt_best_sel = Selector::parse("div.text_wrapper span.icon_best").unwrap();
  let cmt_like_sel = Selector::parse("button.btn_like span.num").unwrap();
  let cmt_dislike_sel = Selector::parse("button.btn_dislike span.num").unwrap();
  let avatar_sel = Selector::parse("img.profile_image_m").unwrap();
  let date_sel = Selector::parse("span.time").unwrap();

  let mut contents = vec![];

  if let Some(img_node) = node.select(&cmt_img_sel).next() {
    let tag_name = img_node.value().name();
    if tag_name == "img" {
      contents.push(Contents::Image {
        url: img_node.value().attr("src").unwrap().to_owned(),
        alt: None,
      });
    }
    if tag_name == "video" {
      let url = img_node.value().attr("src").unwrap().to_owned();
      if url.ends_with(".mp4?webp") {
        contents.push(Contents::Image { url: url.replace(".mp4?webp", ".webp"), alt: None });
      } else {
        contents.push(Contents::Video { url, thumb: None });
      }
    }
  }

  if let Some(text_node) = node.select(&cmt_text_sel).next() {
    let mut text = "".to_owned();

    text_node.text().for_each(|txt| {
      if txt.contains("https://") {
        if txt.contains("https://www.youtube.com/") {
          let idx = txt.rfind("v=").unwrap_or(0) + 2;
          let id = &txt[idx ..];
          contents.push(Contents::Youtube {
            url: format!("https://www.youtube.com/embed/{}", id),
          });
        } else if txt.contains("https://youtu.be/") {
          let idx = txt.rfind("/").unwrap_or(0) + 1;
          let id = &txt[idx ..];
          contents.push(Contents::Youtube {
            url: format!("https://www.youtube.com/embed/{}", id),
          });
        } else {
          contents.push(Contents::Link { url: txt.to_owned(), text: None });
        }
      } else {
        text.push_str(txt);
      }
    });

    contents.push(Contents::Text { text, name: Some("p".to_owned()) });
  }

  let class = node.value().attr("class").unwrap_or("");
  let author = node.select(&cmt_name_sel).next();
  if author.is_none() {
    return FeedComment {
      id: "removed".to_owned(),
      removed: true,
      ..Default::default()
    };
  }

  FeedComment {
    id: node.value().attr("id").unwrap_or("id").to_owned(),
    author: author.unwrap().text().collect(),
    avatar: match node.select(&avatar_sel).next() {
      Some(avatar_node) => match avatar_node.value().attr("src") {
        Some(avatar_url) => Some(avatar_url.to_owned()),
        _ => None,
      },
      _ => None,
    },
    contents,
    is_best: node.select(&cmt_best_sel).next().is_some(),
    up: match node.select(&cmt_like_sel).next() {
      Some(up_node) => parse_num_from_elem(up_node),
      _ => None,
    },
    down: match node.select(&cmt_dislike_sel).next() {
      Some(down_node) => parse_num_from_elem(down_node),
      _ => None,
    },
    depth: if class.contains("child") { 1 } else { 0 },
    reply_to: match node.select(&cmt_reply_sel).next() {
      Some(reply_node) => Some(reply_node.text().collect()),
      _ => None,
    },
    created_at: match node.select(&date_sel).next() {
      Some(date_node) => super::utils::parse_date_string(date_node.text().collect()),
      _ => "".to_owned(),
    },
    ..Default::default()
  }
}

/** 게시글 불러오기 */
pub async fn load_detail(board_type: String, board_id: String, id: String) -> Result<FeedDetail, String> {
  let target_path = format!("https://bbs.ruliweb.com/{}/board/{}/read/{}", board_type, board_id, &id);

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

  let content_idx_start = html.find("<!-- board_main start -->").unwrap_or(0);
  let content_idx_end = html.find("<!-- board_main end -->").unwrap_or(0);
  let content = (&html[content_idx_start..content_idx_end]).to_string();

  let content_dom = Html::parse_fragment(&content);

  let content_sel = Selector::parse("article > div").unwrap();
  let contents = match content_dom.select(&content_sel).next() {
    Some(content) => super::utils::parse_html(Some(content.html())),
    _ => vec![],
  };

  let title_sel = Selector::parse("span.subject_inner_text").unwrap();
  let author_sel = Selector::parse("div.user_info a.nick").unwrap();
  let date_sel = Selector::parse("span[itemprop=datePublished]").unwrap();
  let source_sel = Selector::parse("div.source_url a").unwrap();

  let cmt_idx_start = html.find("<!-- board_bottom start -->").unwrap_or(0);
  let cmt_idx_end = html.find("<!-- board_bottom end -->").unwrap_or(0);
  let cmt_html = (&html[cmt_idx_start..cmt_idx_end]).to_string();
  let comment_dom = Html::parse_fragment(&cmt_html);

  let cmt_sel = Selector::parse("tr.comment_element.normal").unwrap();
  let comments = comment_dom.select(&cmt_sel).map(parse_comment).collect();

  Ok(FeedDetail {
    id: id,
    title: get_text_from_elem(content_dom.select(&title_sel).next()),
    author: get_text_from_elem(content_dom.select(&author_sel).next()),
    url: match content_dom.select(&source_sel).next() {
      Some(source_node) => Some(get_text_from_elem(Some(source_node))),
      _ => None,
    },
    contents,
    comments,
    created_at: parse_date_from_elem(content_dom.select(&date_sel).next()),
    ..Default::default()
  })
}


#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn parse_list_ruli() {
    let list = parse_list("
      <html><head><title>Test list</title></head><body><div id=\"main\"><div id=\"best_list\"><div id=\"best_body\"><table class=\"board_list_table\"><colgroup></colgroup><tbody>
        <tr class=\"table_body normal blocktarget\">
          <td><div class=\"article_wrapper\"><div class=\"article\">
            <input class=\"member_srl\" value=\"12345\" />
            <input class=\"info_article_id\" name=\"article_id\" value=\"11111\" />
            <div class=\"thumbnail_wrapper\"><a class=\"thumbnail\" style=\"background-image: url(https://image-path.png);\" /></div>
            <div class=\"text_wrapper\">
              <a class=\"title_wrapper\" href=\"https://article-path-here\">
                title here
                <span class=\"num_reply\">(<span class=\"num\">10</span>)</span>
              </a>
            </div>
            <div class=\"article_info\">
              <a href=\"https://article-category-path/999999?\" title=\"유머 게시판\">유머 게시판</a>
              <a class=\"nick\">작성자123</a>
              <span class=\"recomd\">추천<strong>20</strong></span>
              <span class=\"hit\">조회<strong>123456</strong></span>
              <span class=\"time\"> 날짜 02:38</span>
            </div>
          </div></div></td>
          <td><div class=\"article_wrapper\"><div class=\"article\">
            <input class=\"member_srl\" value=\"00000\" />
            <input class=\"info_article_id\" name=\"article_id\" value=\"22222\" />
            <div class=\"thumbnail_wrapper\"><a class=\"thumbnail\" style=\"background-image: url(https://image-path2.png);\" /></div>
            <div class=\"text_wrapper\">
              <a class=\"title_wrapper\" href=\"https://article-path-here2\">
                title here222
                <span class=\"num_reply\">(<span class=\"num\">23</span>)</span>
              </a>
            </div>
            <div class=\"article_info\">
              <a title=\"유머 게시판\">유머 게시판</a>
              <a class=\"nick\">며소개123</a>
              <span class=\"recomd\">추천<strong>1</strong></span>
              <span class=\"hit\">조회<strong>567</strong></span>
              <span class=\"time\"> 날짜 2023.04.14</span>
            </div>
          </div></div></td>
        </tr>
      </tbody></table></div><div id=\"best_bottom\">footer</div></div></div></body></html>
    ".to_string());

    assert_eq!(list.len(), 2, "list length");
    assert_eq!(list.get(0).unwrap().id, "11111", "article id on first item");
    assert_eq!(list.get(0).unwrap().sub_id, Some("999999".to_owned()), "sub id is provided when category is exists");
    assert_eq!(list.get(0).unwrap().title, "title here", "article title on first item");
    assert_eq!(list.get(1).unwrap().created_at, "2023-04-14T00:00:00+09:00", "read date string");
  }

  #[test]
  fn parse_list_ruli_news() {
    let list = parse_list("
      <table class=\"board_list_table\"><thead></thead><tbody>
        <tr class=\"table_body notice\"></tr>
        <tr class=\"table_body list_inner\"></tr>
        <tr class=\"table_body blocktarget\">
          <td class=\"id\"> 111111 </td>
          <td class=\"divsn text_over\">
            <a href=\"https://cat-path-ios\">iOS</a>
          </td>
          <td class=\"subject\"><div class=\"relative\">
            <a class=\"deco\" href=\"https://path-to-article-1\">list title</a>
          </div></td>
          <td class=\"board_name text_over\">
            <a href=\"https://path-to-article-1\">모바일 게임 정보</a>
          </td>
          <td class=\"writer text_over\">
            <a href=\"https://path-to-article-1\">작성자123</a>
          </td>
          <td class=\"recomd\">123</td>
          <td class=\"hit\"> 8762 </td>
          <td class=\"time\"> 2023.04.15 </td>
        </tr>
      </tbody></table>
    ".to_string());

    list.into_iter().for_each(|c| { println!("{:?}", c); });

    // assert_eq!(list.len(), 1, "list length");
  }
}
