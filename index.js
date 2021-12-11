var isPart = true
var cdn_url = "https://cdn-img.9118bao.com";
var base_url = 'http://www.111avs.net'
var tmb_url = "https://img.cache010.com";

function relativeURL(urlstr) {
    var url = new URL(urlstr)
    if (url.search === '') {
        return url.pathname
    }
    return url.pathname + url.search
}

var parser = new DOMParser()

var categories = []
function getCategories() {
    fetch('/categories')
        .then(response => response.text())
        .then(body => {
            var htmlDom = parser.parseFromString(body, 'text/html')
            htmlDom.querySelectorAll('.col-sm-6.col-md-4.col-lg-4.m-b-20').forEach(item => {
                var url = item.querySelector('a').href
                var imgurl = item.querySelector('.img-responsive').src
                var val1 = item.querySelector('.title-truncate').innerText.trim()
                var val2 = parseInt(item.querySelector('.badge').innerText.trim())
                categories.push([url, imgurl, val1, val2])
            })
            console.log('end')
        })
}


var nextPageURL = 'http://www.111avs.net/videos/amateur'
var videos = []
function getVideos(callback) {
    fetch(nextPageURL)
        .then(response => response.text())
        .then(body => {
            var page = { lists: [], page: 1, nextPageURL: null, description: null }
            nextPageURL = null
            var htmlDom = parser.parseFromString(body, 'text/html')
            page.description = htmlDom.querySelector('.col-md-9.col-sm-8 > .well.well-sm').innerText.trim()
            page.descriptionHTML = htmlDom.querySelector('.col-md-9.col-sm-8 > .well.well-sm').innerHTML

            var pdiv = htmlDom.querySelector('.pagination')
            if (pdiv) {
                page.page = parseInt(pdiv.querySelector('.active').innerText.trim())
                page.nextPageURL = nextPageURL = pdiv.querySelector('.prevnext')?.href ?? null
            }

            htmlDom.querySelectorAll('.col-sm-6.col-md-4.col-lg-4').forEach(item => {
                var hd = item.querySelector('.hd-text-icon').innerText.trim()
                if (hd === "AD") {
                    return
                }

                var url = item.querySelector('a').href
                var url2 = relativeURL(url)
                url = base_url + url2
                var id = url2.split('/')[2]
                var img = item.querySelector('.img-responsive').dataset.original
                var imgurl2 = relativeURL(img)
                var duration = item.querySelector('.duration').innerText.trim()
                var title = item.querySelector('.video-title').innerText.trim()
                var added = item.querySelector('.video-added').innerText.trim()
                var views = item.querySelector('.video-views').innerText.trim()
                var rating = item.querySelector('.video-rating').innerText.trim()
                var obj = { id, url, img, hd, duration, title, added, views, rating }
                page.lists.push(obj)
                videos.push(obj)
            })
            console.log(`av: ${videos.length} pv: ${page.lists.length}`)

            if (callback) {
                callback(page)
            }

            if (nextPageURL) {
                console.log(`nextPage: ${nextPageURL}`)
                // setTimeout(getVideos, 5000)
            } else {
                console.log('end')
            }
        })
}


var videoUrl = '/video/4748/'
var video = { title: null, des: null, img: null, player: null, tags: [] }
function getVideo() {
    fetch(videoUrl)
        .then(response => response.text())
        .then(body => {
            var htmlDom = parser.parseFromString(body, 'text/html')
            video.title = htmlDom.querySelector('.visible-xs.big-title-truncate.m-t-0').innerText.trim()
            video.des = htmlDom.querySelector('.m-t-10.overflow-hidden').innerText.trim()
            video.img = htmlDom.querySelector('video').poster

            var p = document.createElement('p')
            p.innerHTML = document.querySelector('#video_embed_code').innerText
            video.player = p.querySelector('iframe').src

            htmlDom.querySelectorAll('.m-t-10.overflow-hidden > a').forEach(item => {
                video.tags.push(item.innerText.trim())
            })
            console.log('end')
        })
}


function renderPageHTML(page) {
    var html = ''
    page.lists.forEach(item => {
        var tmp = `
<div class="col-sm-4 col-md-3 col-lg-3">
<div class="well well-sm">
<a href="${item.url}" target="_blank">
<div class="thumb-overlay">
<img data-src="${item.img}" src="res/loading...png" title="${item.title}" alt="${item.title}" class="lazyload img-responsive" />
<div class="hd-text-icon">${item.hd}</div>
<div class="duration">
${item.duration}
</div>
</div>
<span class="video-title title-truncate m-t-5">${item.title}</span>
</a>
<div class="video-added">
${item.added}
</div>
<div class="video-views pull-left">
${item.views}
</div>
<div class="video-rating pull-right ">
<i class="fa fa-heart video-rating-heart"></i> <b>${item.rating}</b>
</div>
<div class="clearfix"></div>
</div>
</div>`
        html += tmp
    })

    if (isPart) {
        var tmp = `
<div class="well well-sm">
${page.descriptionHTML}
</div>
<div class="row">
${html}
</div>`
        return tmp
    }
    return html
}


function autoFooterSize() {
    document.querySelector('#wrapper').style.paddingBottom = document.querySelector('.footer-container').clientHeight + 'px'
}

function loadPage() {
    document.querySelector('.center_related').style.display = ''
    getVideos(page => {
        var p = document.createElement('p')
        if (isPart) {
            document.querySelector('#video_lists2').appendChild(p)
        } else {
            document.querySelector('#video_lists1').appendChild(p)
        }

        p.outerHTML = renderPageHTML(page)
        document.querySelector('.center_related').style.display = 'none'

        if (!nextPageURL) {
            document.querySelector('.pager').style.display = 'none'
        }
    })
}

function toggleView() {
    document.querySelector('#video_lists1').innerHTML = ''
    document.querySelector('#video_lists2').innerHTML = ''
    isPart = !isPart
    loadPage()
}

autoFooterSize()
window.addEventListener('resize', () => {
    autoFooterSize()
})

document.querySelector('#load_videos').addEventListener('click', e => {
    e.preventDefault()
    loadPage()
})

var timer
$('body').on('mouseover', '.img-responsive', function (event) {
    if (timer) {
        return
    }

    var data_src = this.dataset.src
    var path = data_src.substring(0, data_src.lastIndexOf('/'))
    var image_urls = []
    for (let i = 1; i < 21; i++) {
        var image_url = `${path}/${i}.jpg`
        image_urls.push(image_url)
        new Image().src = image_url
    }

    var idx = 0
    var othis = this
    timer = setInterval(() => {
        if (idx > 19) {
            clearInterval(timer)
            timer = 0
            return
        }
        othis.src = image_urls[idx]
        idx++
    }, 500)
}).on('mouseout', '.img-responsive', function (event) {
    clearInterval(timer)
    timer = 0
    this.src = this.dataset.src
})

