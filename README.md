## Enhanced GraphiQL client with the ability to set your Graphql API URL from the UI

Based on the example from [OneGraph](https://github.com/OneGraph/graphiql-explorer) but adds a field to manually enter your url. Useful to get the advanced OneGraph explorer for GraphiQL without needing to manually bake it into you project.

![screenshot](https://raw.githubusercontent.com/zacherkkila/simple-graphiql-explorer/master/screenshots/screenshot.png)

### Install

`git clone https://github.com/zacherkkila/simple-graphiql-explorer`

`yarn`

### Run Dev

`yarn start`

### Build

`yarn build`

### Running Built Package

`cd dist`

`yarn start` - Starts GraphiQL

or

`yarn start-open-browser` - Starts GraphiQL and opens a new browser tab at that location

### Example: Include in your package to start automatically when running your project

package.json
```
"scripts": {
        ...
        "start-graphiql": "npm explore graphiql-explorer -- npm run start-open-browser",
        "start":"node index.js"
        "dev":"npm-run-all --parallel start-graphiql start"
},
"devDependencies": {
        ...
        "graphiql-explorer": "../../simple-graphiql-explorer/dist"
},
```

`npm run dev`

