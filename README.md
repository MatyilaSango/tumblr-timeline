# tumblr-timeline

Get medias in a user's timeline.

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
 * @param type video or photo
 * @param size Number of posts you want to get
 * @param start Initial start
 * @returns '{ account: string; total_nmber_of_posts: number; size: number; data: string[]; } | { error: "Page not found!" }'
 */
```

## Usage example:

```
import { getMediaLinks } from "@sango-dev/tumblr-timeline"

getMediaLinks("Programming", "photo", 10, 0).then(results => {
    let data = results
})
```

or

```
import { getMediaLinks } from "@sango-dev/tumblr-timeline"

let data = await getMediaLinks("Programming", "photo", 10, 0)
```

If you `using` require for import:

```
let tumblrTimeline = require("@sango-dev/tumblr-timeline")

tumblrTimeline.getMediaLinks("Programming", "photo", 10, 0).then(results => {
    let data = results
})
```

or

```
let tumblrTimeline = require("@sango-dev/tumblr-timeline")

let data = await tumblrTimeline.getMediaLinks("Programming", "photo", 10, 0)
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
