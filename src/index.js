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
            // TOTAL_POSTS = Number(data.tumblr.posts[0]["$"].total);
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
 * @returns '{ Account: string; size: number; data: string[]; } | { error: "Page not found!" }'
 */
const getMediaLinks = (site, type, size, start) => __awaiter(void 0, void 0, void 0, function* () {
    let mediaLinks = [];
    let data = yield getData(site, type, size < _NUMBER_OF_DATA_PER_CYCLE ? size : _NUMBER_OF_DATA_PER_CYCLE, start).then((res) => res);
    if (data["error"])
        return data;
    for (start; start < size; start += _NUMBER_OF_DATA_PER_CYCLE) {
        data.tumblr.posts[0].post.map((post) => {
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
                    if ($("source").attr("src") &&
                        !mediaLinks.includes($("source").attr("src")))
                        mediaLinks.push($("source").attr("src"));
                    break;
                case "photo":
                    try {
                        mediaLinks.push(post["photo-url"][0]["_"]);
                    }
                    catch (err) {
                        let htmlData = post["regular-body"][0];
                        let $ = cheerio_1.default.load(htmlData);
                        $("img").each(function () {
                            if ($(this).attr("src") &&
                                !mediaLinks.includes($(this).attr("src")))
                                mediaLinks.push($(this).attr("src"));
                        });
                    }
                    break;
            }
        });
        data = yield getData(site, type, _NUMBER_OF_DATA_PER_CYCLE, start + _NUMBER_OF_DATA_PER_CYCLE).then((res) => res);
    }
    let dataFound = {
        "Account": site,
        "size": mediaLinks.length,
        "data": mediaLinks
    };
    return dataFound;
});
exports.getMediaLinks = getMediaLinks;
