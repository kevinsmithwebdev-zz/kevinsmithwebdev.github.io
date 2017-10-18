// const URL_STEM = 'http://localhost:3001/C:/Users/Rox%20and%20Kevin/Documents/Programming/portfolio/test2'
// const URL_STEM = 'http://192.168.1.1:8080'
const URL_STEM = ''

const GALLERY_HEIGHT = 320
var isGalleryExpanded = false

let $intro = $('#intro')
let $gallery = $('#gallery')
let $techs = $('#techs')
let $about = $('#about')
let $contact = $('#contact')

var $galleryBtn = $('#gallery-btn')
var $galleryModal = $('#gallery-modal')
var $galleryModalHeader = $('#modal-header')
var $galleryModalBody = $('#modal-body')
var $galleryModalFooter = $('#modal-footer')
var $galleryModalLink = $('#modal-link')
var $galleryModalCode = $('#modal-code')
var $galleryItem = $('.gallery-img')

var galleryArr = []

$(document).ready(function() {

  // load data from local files and populate sections

  $.get(URL_STEM + '/data/intro.txt', function(data) {
    $intro.append(makeParas(data))
  })

  $.getJSON(URL_STEM + '/data/gallery.json', function(data) {
    $gallery.append(makeGallery(data))
    galleryArr = data.slice();
  })

  $.getJSON(URL_STEM + '/data/techs.json', function(data) {

    $techs.append(makeTech(data.frontend.text, data.frontend.list))
    $techs.append(makeTech(data.backend.text, data.backend.list))
    $techs.append(makeTech(data.other.text, data.other.list))
    $.get(URL_STEM + '/data/techs.txt', function(data) {
      $techs.append(makeParas(data))
    })
  })

  $.get(URL_STEM + '/data/about.txt', function(data) {
    $about.append(makeParas(data))
  })

  $.getJSON(URL_STEM + '/data/contacts.json', function(data) {
    $contact.append(makeContacts(data.main, 'main'))
    $contact.append(makeContacts(data.other, 'other'))
  })

  // click handlers

  $galleryBtn.click(function() {
    if (isGalleryExpanded) {
      galleryHeight(GALLERY_HEIGHT)
      $galleryBtn.html('Expand Gallery').removeClass('btn-danger').addClass('btn-success')
    } else {
      galleryHeight('auto')
      $galleryBtn.html('Collapse Gallery').removeClass('btn-success').addClass('btn-danger')
    }
    isGalleryExpanded = !isGalleryExpanded
  })

  $(document).on("click", '.gallery-item', function(event) {

    var gal = galleryArr[+this.id.replace(/^\D+/g, '')]

    $galleryModalHeader.html('<h2>' + gal.name + '</h2>')

    var html = ''
    html += '<div class="container-fluid">' +
              '<div class="row">' +
                '<div class="col-md-6">' +
                  '<img src="' + imgUrl(gal.imgStem) + '" class="gal-img" alt="img for ' + gal.name + '">' +
                '</div>' +
                '<div class="col-md-6">' +
                  makeParas(gal.text) +
                  '<hr/>' +
                  horizTechList(gal.techs) +
                '</div>' +
              '</div>' + // row
            '</div>' // container

    $galleryModalBody.html(html)

    $galleryModalLink.attr('href', gal.url)
    $galleryModalCode.attr('href', gal.code)
    $galleryModal.modal('show').css({ 'margin': 0 })
  })


//*************

  // gallery adjusments
  function galleryHeight(height) {
    var transition = 100
    if (height==='auto') {
      var curHeight = $gallery.height()
      var autoHeight = $gallery.css('height', 'auto').height()
      $gallery.height(curHeight)
      $gallery.stop().animate({ height: autoHeight }, transition)
    } else {
      $gallery.height(height)
      $gallery.stop().animate({ height: height }, transition)
    }
  }
})

// functions to build div content

function makeParas(text) {
  var newArr = []
  text.split('\n').forEach(function(para) {
    para = para.trim()
    if (para)
      newArr.push('<p>' + para + '</p>')
  })
  return newArr.join('\n')
}

function makeTech(title, list) {
  var html = ''
  html += '<h3>' + title + '</h3>'
  html += horizTechList(list)


  return html
}

const techElement = (tech) => {
  return  '<h4>' +
            '<img class="tech-logo" src="./img/logos/' + techFileName(tech) + '" alt="logo for ' + tech + '">' +
            tech +
          '</h4>'
}
const techFileName = (tech) => tech.replace(/ /g, '').toLowerCase() + '.png'



function horizTechList(techs) {
  var html = '<ul id="gal-ul">'
  techs.forEach(function(tech) {
    html += '<li class="gal-li">' +
              techElement(tech) +
            '</li>'
  })
  html += '</ul>'

  return html
}

function makeContacts(contacts, category) {
  var html = ''
  html += '<h3>' + contacts.text + '</h3>'
  html += '<ul id="contact-ul">'

  contacts.list.forEach(function(contact) {

    html += '<li class="contact-li">' +
              '<h4>' +
                '<i class="fa fa-2x ' + contact.icon + '" aria-hidden="true"></i>&nbsp;' +
                (contact.action?('<a href="' + contact.action + '">'):'') +
                  contact.name +
                (contact.action?('</a>'):'') +
              '</h4>' +
            '</li>'
  })

  html += '</ul>'

  return html
}



function makeGallery(sites) {
  var html = ''

  sites.forEach(function(site, index) {

    html += '<figure id="gallery-' + index + '" class="gallery-item">' +
              '<img class="gallery-img" src="' + imgTnUrl(site.imgStem) + '" />' +
              '<figcaption class="gallery-caption">' +
                site.name +
              '</figcaption>' +
            '</figure>'

  })
  return html
}

const imgUrl = (stem) => {
  return URL_STEM + '/img/gallery/' +  stem + '.png'
}

const imgTnUrl = (stem) => {
  return URL_STEM + '/img/gallery/' +  stem + '-tn.png'
}
