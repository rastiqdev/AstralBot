const french = require("../languages/french.json")

module.exports = (location, options={}) => {
  let string = eval(`french.${location}`)
  string = string[Math.floor(Math.random()*string.length)]

  for(let key of Object.keys(options)) {
    string = string.replace(new RegExp(`{{${key}}}`, "g"), options[key])
  }

  return string;
}