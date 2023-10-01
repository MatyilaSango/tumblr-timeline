# tumblr-timeline
Get medias in a user's timeline.

## Installing

Using npm:

`$ npm install @sango-dev/tumblr-timeline`

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
let exampleVariable = require("@sango-dev/tumblr-timeline")

exampleVariable.getMediaLinks("Programming", "photo", 10, 0).then(results => {
    let data = results

})
```
or

```
let exampleVariable = require("@sango-dev/tumblr-timeline")

let data = await exampleVariable.getMediaLinks("Programming", "photo", 10, 0)
```

## License

(MIT)[https://github.com/MatyilaSango/tumblr-timeline/blob/main/LICENSE]
