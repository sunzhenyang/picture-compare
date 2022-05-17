const { babel } = require('@rollup/plugin-babel')
const changeCase = require('change-case')
const createBanner = require('create-banner')
const pkg = require('./package.json')

const postcss = require('rollup-plugin-postcss')
const sass = require('node-sass')

pkg.name = pkg.name.replace('js', '')

const name = changeCase.pascalCase(pkg.name)
const banner = createBanner({
  data: {
    name: `${name}.js`,
    year: '2022-present'
  }
})

const processSass = function (context, payload) {
  return new Promise((resolve, reject) => {
    sass.render(
      {
        file: context
      },
      function (err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      }
    )
  })
}

const babelOptions = {
  presets: ['@babel/preset-env']
}

module.exports = {
  input: 'src/index.js',
  output: [
    {
      banner,
      name,
      file: `dist/${pkg.name}.js`,
      format: 'umd'
    }
  ],
  plugins: [
    postcss({
      extract: true,
      extensions: ['css', 'scss'],
      process: processSass
    }),
    babel(babelOptions)
  ]
}
