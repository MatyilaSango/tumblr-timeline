"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMediaLinks = void 0;
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
const cheerio_1 = __importDefault(require("cheerio"));
let TOTAL_POSTS = 0;
let _NUMBER_OF_DATA_PER_CYCLE = 50;
const getData = (site, type, size, start) => __awaiter(void 0, void 0, void 0, function* () {
    let _endPoint = `https://${site}.tumblr.com/api/read?type=${type}&num=${size}&start=${start}`;
    return axios_1.default
        .get(_endPoint)
        .then((res) => res.data)
        .then((res) => {
        let data;
        (0, xml2js_1.parseString)(res, function (_err, results) {
            data = JSON.parse(JSON.stringify(results));
            TOTAL_POSTS = Number(data.tumblr.posts[0]["$"].total);
        });
        return data;
    })
        .catch((_err) => {
        return { error: "Page not found!" };
    });
});
/**
 * Get all media links from a tumblr account.
 *
 * @param site Account name
 * @param type video/photo
 * @param size Number of posts
 * @param start Initial start
 * @returns '{ account: string; total_nmber_of_posts: number; size: number; data: string[]; } | { error: "Page not found!" }'
 */
const getMediaLinks = (site, type, size, start) => __awaiter(void 0, void 0, void 0, function* () {
    let _posts = [];
    let data = yield getData(site, type, size < _NUMBER_OF_DATA_PER_CYCLE ? size : _NUMBER_OF_DATA_PER_CYCLE, start).then((res) => res);
    if (data["error"])
        return data;
    for (start; start < size; start += _NUMBER_OF_DATA_PER_CYCLE) {
        data.tumblr.posts[0].post.map((post) => {
            let _post = {
                id: data.tumblr.posts[0].post[0]["$"].id,
                url: data.tumblr.posts[0].post[0]["$"].url,
                "url-with-slug": data.tumblr.posts[0].post[0]["$"]["url-with-slug"],
                type: data.tumblr.posts[0].post[0]["$"].type,
                date_gmt: data.tumblr.posts[0].post[0]["$"]["date-gmt"],
                date: data.tumblr.posts[0].post[0]["$"].date,
                unix_timestamp: data.tumblr.posts[0].post[0]["$"]["unix-timestamp"],
                format: data.tumblr.posts[0].post[0]["$"].format,
                reblog_key: data.tumblr.posts[0].post[0]["$"]["reblog-key"],
                slug: data.tumblr.posts[0].post[0]["$"].slug,
                note_count: data.tumblr.posts[0].post[0]["$"]["note-count"],
                name: data.tumblr.posts[0].post[0]["$"]["reblogged-from-name"],
                title: data.tumblr.posts[0].post[0]["$"]["reblogged-from-title"],
                media_url: [],
            };
            switch (type.toLocaleLowerCase()) {
                case "video":
                    let htmlData;
                    try {
                        htmlData = post["regular-body"][0];
                    }
                    catch (err) {
                        htmlData = post["video-player"][0];
                    }
                    let $ = cheerio_1.default.load(htmlData);
                    _post.media_url.push($("source").attr("src"));
                    break;
                case "photo":
                    try {
                        _post.media_url.push(post["photo-url"][0]["_"]);
                    }
                    catch (err) {
                        let htmlData = post["regular-body"][0];
                        let $ = cheerio_1.default.load(htmlData);
                        $("img").each(function () {
                            _post.media_url.push($(this).attr("src"));
                        });
                    }
                    break;
            }
            _posts.push(_post);
        });
        data = yield getData(site, type, _NUMBER_OF_DATA_PER_CYCLE, start + _NUMBER_OF_DATA_PER_CYCLE).then((res) => res);
    }
    return {
        account: site,
        total_nmber_of_posts: TOTAL_POSTS,
        size: _posts.length,
        data: _posts,
    };
});
exports.getMediaLinks = getMediaLinks;
