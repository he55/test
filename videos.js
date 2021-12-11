// javascript

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
    css += `.col-sm-6.col-md-4.col-lg-4:nth-child(n+1):nth-child(-n+2),
          .col-sm-6.col-md-4.col-lg-4:nth-last-child(n+1):nth-last-child(-n+2) { display: none }`
}

sty.innerHTML = css
document.querySelector('head').appendChild(sty)
