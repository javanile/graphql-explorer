const express = require('express');
const path = require('path');
const app = express();
const chalk = require('chalk');
const open = require('open');

const port = process.env.PORT || 5677

console.log(chalk.blue("Starting GraphiQL Explorer..."))

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    var url = "http://localhost:"+port
    console.log(`${chalk.green("success: ")} GraphiQL explorer running at ${chalk.cyan(url)}`)
    if(process.argv.indexOf('--open') > 0)
    {
        console.log(chalk.magenta("--open specified, starting browser..."))
        open(url)
    }
});