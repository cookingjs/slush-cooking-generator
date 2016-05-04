var gulp = require('gulp')
var install = require('gulp-install')
var conflict = require('gulp-conflict')
var template = require('gulp-template')
var rename = require('gulp-rename')
var inquirer = require('inquirer')
var cookingConfig = require('cooking-config')

gulp.task('default', function (done) {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Give your generator a name',
      default: getNameProposal()
    },
    {
      type: 'input',
      name: 'description',
      message: 'Give your generator a description',
      default: 'A cooking generator.'
    },
    {
      type: 'input',
      name: 'github',
      message: 'git repository',
      default: cookingConfig.github
    },
    {
      type: 'input',
      name: 'author',
      message: 'author',
      default: cookingConfig.author
    },
    {
      type: 'input',
      name: 'license',
      message: 'license',
      default: 'ISC'
    },
    {
      type: 'confirm',
      name: 'moveon',
      message: 'Continue?'
    }
  ],
  function (answers) {
    if (answers.github) {
      answers.github = answers.github.replace(/\/$/, '') + '/' + answers.name
    }
    answers.generator = answers.name

    if (!answers.moveon) {
      return done()
    }

    gulp.src(__dirname + '/template/*', { dot: true })
      .pipe(template(answers))
      .pipe(rename(function (file) {
        if (file.basename[0] === '_') {
          file.basename = '.' + file.basename.slice(1)
        }
      }))
      .pipe(conflict('./'))
      .pipe(gulp.dest('./'))
      .pipe(install())

    gulp.src(__dirname + '/template/template/**')
      .pipe(gulp.dest('./template'))
      .on('end', function () {
        done()
      })
      .resume()
  })
})

function getNameProposal () {
  var path = require('path')
  try {
    return require(path.join(process.cwd(), 'package.json')).name
  } catch (e) {
    return path.basename(process.cwd())
  }
}

function getGeneratorName (name) {
  return name.replace(/^slush-cooking-/g, '')
}
