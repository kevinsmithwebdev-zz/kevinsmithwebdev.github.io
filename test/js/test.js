$(document).ready(function() {
  console.log('in doc ready')

  $.getJSON('../data/test.json', function(data) {
    console.log('in json callback')
    console.log(data)
  })

  $.getJSON('../data/test.txt', function(data) {
    console.log('in txt callback')
    console.log(data)
  })

})
