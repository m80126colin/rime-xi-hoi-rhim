const _         = require('lodash')

const Promise   = require('bluebird')
const path      = require('path')
const util      = require('util')
const fs_origin = require('fs')

const normal_path = (...xs) => path.normalize(path.join.apply(null, xs))

const fs = {
  read:  util.promisify(fs_origin.readFile),
  write: util.promisify(fs_origin.writeFile)
}

const outfile = normal_path(__dirname, '..', 'xi_hoi_rhim.dict.yaml')
const title   = [
  '---',
  'name: xi_hoi_rhim',
  'version: "2018.10.09"',
  'sort: by_weight',
  'use_preset_vocabulary: false',
  '---'
]

const promises = [
  normal_path(__dirname, '.', 'comment.yaml'),
  normal_path(__dirname, '.', 'character.yaml')
]

Promise.all(_.map(promises, p => fs.read(p, 'utf-8')))
  .then(([comment, dict]) => _([comment, '', title.join('\n'), '', dict]).join('\n'))
  .then(result => fs.write(outfile, result, 'utf-8'))