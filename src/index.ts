import axios from "axios";
import { parseString } from "xml2js";
import cheerio from "cheerio";

// let TOTAL_POSTS: number = 0;

interface IDataFound {
    Account: string;
    size: number;
    data: string[];
}

interface IError {
    error: string
}

let _NUMBER_OF_DATA_PER_CYCLE: number = 50

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
        // TOTAL_POSTS = Number(data.tumblr.posts[0]["$"].total);
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
 * @returns '{ Account: string; size: number; data: string[]; } | { error: "Page not found!" }'
 */
export const getMediaLinks = async (
  site: string,
  type: string,
  size: number,
  start: number,
): Promise<IDataFound | IError> => {
  let mediaLinks: string[] = [];
  let data = await getData(site, type, size < _NUMBER_OF_DATA_PER_CYCLE ? size : _NUMBER_OF_DATA_PER_CYCLE, start).then((res) => res);
  if (data["error"]) return data;
  for (start; start < size; start += _NUMBER_OF_DATA_PER_CYCLE) {
    data.tumblr.posts[0].post.map((post: any) => {
      switch (type.toLocaleLowerCase()) {
        case "video":
          let htmlData;
          try {
            htmlData = post["regular-body"][0];
          } catch (err) {
            htmlData = post["video-player"][0];
          }
          let $ = cheerio.load(htmlData);
          if (
            ($("source").attr("src") as string) &&
            !mediaLinks.includes($("source").attr("src") as string)
          )
            mediaLinks.push($("source").attr("src") as string);

          break;

        case "photo":
          try {
            mediaLinks.push(post["photo-url"][0]["_"]);
          } catch (err) {
            let htmlData: string = post["regular-body"][0];
            let $ = cheerio.load(htmlData);
            $("img").each(function () {
              if (
                ($(this).attr("src") as string) &&
                !mediaLinks.includes($(this).attr("src") as string)
              )
                mediaLinks.push($(this).attr("src") as string);
            });
          }

          break;
      }
    });

    data = await getData(site, type, _NUMBER_OF_DATA_PER_CYCLE, start + _NUMBER_OF_DATA_PER_CYCLE).then((res) => res);
  }

  let dataFound: IDataFound = {
    "Account": site,
    "size": mediaLinks.length,
    "data": mediaLinks
  }

  return dataFound;
};
