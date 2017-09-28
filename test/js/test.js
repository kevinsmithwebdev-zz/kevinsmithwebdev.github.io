$(document).ready(function() {
  console.log('in doc ready')

  $.getJSON('./test/data/test.json', function(data) {
    console.log('in json callback')
    console.log(data)
  })

  $.getJSON('./test/data/test.txt', function(data) {
    console.log('in txt callback')
    console.log(data)
  })

})
