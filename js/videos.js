// javascript



var categories = []
var parser = new DOMParser()
function fdata() {
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
fdata()


function relUrl(urlstr) {
    var url = new URL(urlstr)
    if (url.search === '') {
        return url.pathname
    }
    return url.pathname + url.search
}


var nextUrl = '/videos/amateur'
var videos = { lists: [], pageCur: 0, pageNextUrl: null, pageDes: null }
var parser = new DOMParser()
function fdata() {
    fetch(nextUrl)
        .then(response => response.text())
        .then(body => {
            nextUrl = null
            var htmlDom = parser.parseFromString(body, 'text/html')
            videos.pageDes = htmlDom.querySelector('.col-md-9.col-sm-8 > .well.well-sm').innerText.trim()

            var pdiv = htmlDom.querySelector('.pagination')
            if (pdiv) {
                videos.pageCur = parseInt(pdiv.querySelector('.active').innerText.trim())
                videos.pageNextUrl = nextUrl = pdiv.querySelector('.prevnext')?.href ?? null
                videos.pageNextUrl2 = relUrl(nextUrl)
            }

            htmlDom.querySelectorAll('.col-sm-6.col-md-4.col-lg-4').forEach(item => {
                var hd = item.querySelector('.hd-text-icon').innerText.trim()
                if (hd === "AD") {
                    return
                }

                var url = item.querySelector('a').href
                var url2 = relUrl(url)
                var id = url2.split('/')[2]
                var eimg = item.querySelector('.img-responsive')
                var img =eimg.dataset.original
                var iid=eimg.id
                var imgurl2 = relUrl(img)
                var duration = item.querySelector('.duration').innerText.trim()
                var title = item.querySelector('.video-title').innerText.trim()
                var added = item.querySelector('.video-added').innerText.trim()
                var views = item.querySelector('.video-views').innerText.trim()
                var rating = item.querySelector('.video-rating').innerText.trim()
                videos.lists.push({ id,iid, url, img, hd, duration, title, added, views, rating })
            })
            console.log(videos.lists.length)

            if (nextUrl) {
                console.log(nextUrl)
                setTimeout(fdata, 5000)
            } else {
                console.log('end')
            }
        })
}
fdata()


function renderHtml(lists) {
    var html = ''
    lists.forEach(item => {
        var tmp = `
<div class="col-sm-6 col-md-3 col-lg-3">
<div class="well well-sm m-b-0 m-t-20">
<a href="${item.url}">
<div class="thumb-overlay">
<img src="${item.img}" title="${item.title}" alt="${item.title}" id="rotate_${item.id}_20_1" class="img-responsive" />
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
    return html
}





var videoUrl = '/video/4748/'
var video = { title: null, des: null, img: null, player: null, tags: [] }
var parser = new DOMParser()
function fdata() {
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
fdata()





document.querySelectorAll('.well.ad-body').forEach((item) => item.remove())

if (location.pathname.indexOf('/videos') === 0) {
    var divs = document.querySelectorAll('.col-sm-6.col-md-4.col-lg-4')
    if (divs.length >= 4) {
        divs[0].remove()
        divs[1].remove()
        divs[divs.length - 2].remove()
        divs[divs.length - 1].remove()
    }
}




var sty = document.createElement('style')
var css = '.well.ad-body { display: none }'

if (location.pathname.indexOf('/videos') === 0) {
    css+=`.col-sm-6.col-md-4.col-lg-4:nth-child(n+1):nth-child(-n+2),
          .col-sm-6.col-md-4.col-lg-4:nth-last-child(n+1):nth-last-child(-n+2) { display: none }`
}

sty.innerHTML = css
document.querySelector('head').appendChild(sty)

