# tumblr-timeline

Get media in a user's timeline.

## Installing

Using npm:

```
$ npm install @sango-dev/tumblr-timeline
```

## Parameters and Returns

```
/**
 * Get all media links from a tumblr account.
 *
 * @param site Account name
 * @param type video or photo or all
 * @param size Number of posts you want to get
 * @param start Initial start
 * @returns '{ account: string; total_nmber_of_posts: number; size: number; data: string[]; } | { error: "Page not found!" }'
 */
 getMediaLinks(site: string, type: string, size: number, start: number): Promise<IDataFound | IError>;
```
```
/**
* Get total number of posts for media type video, photo, or all.
* @param site Account name
* @param type video/photo/all 
* @returns Total number of posts
*/
getTotalNumberOfPosts(site: string, type: string): Promise<number | IError>;
```

## Usage example:

```
import {TumblrTimelime} from "@sango-dev/tumblr-timeline"
let tumblrTimelimeObj = new TumblrTimelime()

// Get photos
tumblrTimelimeObj.getMediaLinks("Programming", "photo", 10, 0).then(results => {
    let data = results
})

// Get videos
tumblrTimelimeObj.getMediaLinks("Programming", "video", 10, 0).then(results => {
    let data = results
})

// Get all
tumblrTimelimeObj.getMediaLinks("Programming", "all", 10, 0).then(results => {
    let data = results
})
```

or

```
import { getMediaLinks } from "@sango-dev/tumblr-timeline"
let tumblrTimelimeObj = new TumblrTimelime()

let data = await tumblrTimelimeObj.getMediaLinks("Programming", "photo", 10, 0) // Get photos

let data = await tumblrTimelimeObj.getMediaLinks("Programming", "video", 10, 0) // Get videos

let data = await tumblrTimelimeObj.getMediaLinks("Programming", "all", 10, 0) // Get all
```

If you `using` require to import:

```
let {TumblrTimelime} = require("@sango-dev/tumblr-timeline")
let tumblrTimelimeObj = new TumblrTimelime()

// Get photos
tumblrTimelimeObj.getMediaLinks("Programming", "photo", 10, 0).then(results => {
    let data = results
})

// Get videos
tumblrTimelimeObj.getMediaLinks("Programming", "video", 10, 0).then(results => {
    let data = results
})

// Get all
tumblrTimelimeObj.getMediaLinks("Programming", "all", 10, 0).then(results => {
    let data = results
})
```

or

```
let {TumblrTimelime} = require("@sango-dev/tumblr-timeline")
let tumblrTimelimeObj = new TumblrTimelime()

let data = await tumblrTimelimeObj.getMediaLinks("Programming", "photo", 10, 0) // Get photos

let data = await tumblrTimelimeObj.getMediaLinks("Programming", "videos", 10, 0) // Get videos

let data = await tumblrTimelimeObj.getMediaLinks("Programming", "all", 10, 0) // Get all media
```

## Response format:

Success:

```
{
    account: string;
    total_nmber_of_posts: number;
    size: number;
    data: [
        {
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
    ];
}
```

Failure:

```
{
  error: string;
}
```

## License

[MIT](https://github.com/MatyilaSango/tumblr-timeline/blob/main/LICENSE)
