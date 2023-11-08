import axios from "axios";
import { parseString } from "xml2js";
import cheerio from "cheerio";

let TOTAL_POSTS: number = 0;

interface IPost {
  id: string;
  url: string;
  "url-with-slug": string;
  type: string;
  date_gmt: string;
  date: string;
  unix_timestamp: string;
  format: string;
  reblog_key: string;
  slug: string;
  note_count: string;
  name: string;
  title: string;
  media_url: string[];
}
interface IDataFound {
  account: string;
  total_nmber_of_posts: number;
  size: number;
  data: IPost[];
}

interface IError {
  error: string;
}

let _NUMBER_OF_DATA_PER_CYCLE: number = 50;

const getData = async (
  site: string,
  type: string,
  size: number,
  start: number
): Promise<any> => {
  let _endPoint: string = `https://${site}.tumblr.com/api/read?type=${type}&num=${size}&start=${start}`;
  return axios
    .get(_endPoint)
    .then((res) => res.data)
    .then((res) => {
      let data;
      parseString(res, function (_err, results) {
        data = JSON.parse(JSON.stringify(results));
        TOTAL_POSTS = Number(data.tumblr.posts[0]["$"].total);
      });
      return data;
    })
    .catch((_err) => {
      return { error: "Page not found!" };
    });
};

/**
 * Get all media links from a tumblr account.
 *
 * @param site Account name
 * @param type video/photo
 * @param size Number of posts
 * @param start Initial start
 * @returns '{ account: string; total_nmber_of_posts: number; size: number; data: string[]; } | { error: "Page not found!" }'
 */
export const getMediaLinks = async (
  site: string,
  type: string,
  size: number,
  start: number
): Promise<IDataFound | IError> => {
  let _posts: IPost[] = [];
  let data = await getData(
    site,
    type,
    size < _NUMBER_OF_DATA_PER_CYCLE ? size : _NUMBER_OF_DATA_PER_CYCLE,
    start
  ).then((res) => res);
  if (data["error"]) return data;
  for (start; start < size; start += _NUMBER_OF_DATA_PER_CYCLE) {
    data.tumblr.posts[0].post.map((post: any, indx: number) => {
      let _post: IPost = {
        id: data.tumblr.posts[0].post[indx]["$"].id,
        url: data.tumblr.posts[0].post[indx]["$"].url,
        "url-with-slug": data.tumblr.posts[0].post[indx]["$"]["url-with-slug"],
        type: data.tumblr.posts[0].post[indx]["$"].type,
        date_gmt: data.tumblr.posts[0].post[indx]["$"]["date-gmt"],
        date: data.tumblr.posts[0].post[indx]["$"].date,
        unix_timestamp: data.tumblr.posts[0].post[indx]["$"]["unix-timestamp"],
        format: data.tumblr.posts[0].post[indx]["$"].format,
        reblog_key: data.tumblr.posts[0].post[indx]["$"]["reblog-key"],
        slug: data.tumblr.posts[0].post[indx]["$"].slug,
        note_count: data.tumblr.posts[0].post[indx]["$"]["note-count"],
        name: data.tumblr.posts[0].post[indx]["$"]["reblogged-from-name"],
        title: data.tumblr.posts[0].post[indx]["$"]["reblogged-from-title"],
        media_url: [],
      };

      switch (type.toLocaleLowerCase()) {
        case "video":
          let htmlData;
          try {
            htmlData = post["regular-body"][0];
          } catch (err) {
            htmlData = post["video-player"][0];
          }

          let $ = cheerio.load(htmlData);
          _post.media_url.push($("source").attr("src") as string);
          break;

        case "photo":
          try {
            _post.media_url.push(post["photo-url"][0]["_"]);
          } catch (err) {
            let htmlData: string = post["regular-body"][0];
            let $ = cheerio.load(htmlData);
            $("img").each(function () {
              _post.media_url.push($(this).attr("src") as string);
            });
          }
          break;
      }
      _posts.push(_post);
    });

    data = await getData(
      site,
      type,
      _NUMBER_OF_DATA_PER_CYCLE,
      start + _NUMBER_OF_DATA_PER_CYCLE
    ).then((res) => res);
  }

  return {
    account: site,
    total_nmber_of_posts: TOTAL_POSTS,
    size: _posts.length,
    data: _posts,
  };
};
