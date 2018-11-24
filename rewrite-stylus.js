let glob = require(`glob`)
let fs = require(`fs`)
let stylus = require(`stylus`)
let beautify_css = require(`js-beautify`).css

glob(`**/*.vue`, function(err, files) {
  if (err) {
    console.log(err)
  } else {
    // a list of paths to javaScript files in the current working directory

    files.forEach(async file => {
      let templateRegExp = /.*<style lang="stylus">([\s\S\n]*)<\/style>.*/
      let content = fs.readFileSync(file, `utf8`)
      //   console.log(content)
      content = content.replace(`@require '~variables'`, ``)
      content = content.replace(`@import '~variables'`, ``)
      let match = templateRegExp.exec(content)
      if (!match) return
      const template = match[1]
      try {
        let css = stylus.render(template)
        let replaced = content.replace(
          templateRegExp,
          `<style>\n` +
            beautify_css(css, {
              wrap_line_length: 80,
              wrap_attributes: true
            }) +
            `\n</style>`
        )
        fs.writeFileSync(file, replaced, `utf8`)
      } catch (err) {
        console.log(file, `failed`, err)
      }
    })
  }
})
