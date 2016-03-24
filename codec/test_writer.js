var pull = require('pull-stream')
var psc = require('packet-stream-codec')
var toPull = require('stream-to-pull-stream')
var split = require('pull-randomly-split')

function flat (err) {
  return {
    message: err.message,
    name: err.name,
    stack: err.stack
  }
}

var examples = [
  {req: 0, stream: false, end: false, value: ['event', {okay: true}]}, // an event

  {req: 1, stream: false, end: false, value: 'whatever'}, // a request
  {req: 2, stream: true, end: false, value: new Buffer('hello')}, // a stream packet
  {req: -2, stream: true, end: false, value: new Buffer('goodbye')}, // a stream response
  {req: -3, stream: false, end: true, value: flat(new Error('intentional'))},
  {req: 2, stream: true, end: true, value: true}, // a stream packet
  {req: -2, stream: true, end: true, value: true}, // a stream response
  'GOODBYE'
]
pull(
  pull.values(examples),
  psc.encode(),
  split(),
  toPull.sink(process.stdout)
)


