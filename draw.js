var currentYear = new Date().getFullYear().toString()
var width = 50
var currentX = width
var base = 130

var previousMonthCanvas = document.getElementById("prev-month-canvas")
var previousMonthContext = previousMonthCanvas.getContext("2d")
previousMonthContext.fillStyle = '#1e1d1c'
previousMonthContext.textAlign = "center"

var lastYearCanvas = document.getElementById("last-year-canvas")
var lastYearContext = lastYearCanvas.getContext("2d")
lastYearContext.fillStyle = '#1e1d1c'
lastYearContext.textAlign = "center"
// draw title
lastYearContext.font = "bold 16px sans-serif"
lastYearContext.fillText(currentYear - 1, lastYearCanvas.width/2, 20)
lastYearContext.font = "normal 11px sans-serif"

// draw axis
lastYearContext.beginPath()
lastYearContext.moveTo(width - 10, 0)
lastYearContext.lineTo(width - 10, lastYearCanvas.height)
lastYearContext.moveTo(width - 26, lastYearCanvas.height - 16)
lastYearContext.lineTo(lastYearCanvas.width, lastYearCanvas.height - 16)
lastYearContext.stroke()

$.getJSON("data.json", function(stats) {
  var percentage

  // fill previousMonthCanvas with values
  for (prevMonth in stats[currentYear]) {
    // draw title
    previousMonthContext.font = "bold 16px sans-serif";
    previousMonthContext.fillText(prevMonth + ', ' + currentYear, previousMonthCanvas.width/2, 20);
    previousMonthContext.font = "normal 11px sans-serif";
    for (browser in stats[currentYear][prevMonth]) {
      // set bar color based on browser
      setFillStyle(previousMonthContext, browser)

      percentage = stats[currentYear][prevMonth][browser]
      
      // create bar
      previousMonthContext.fillRect(currentX, base - percentage, width, percentage)
      
      // set color for the label text
      previousMonthContext.fillStyle = '#1e1d1c'

      // add percentage label above bar
      previousMonthContext.textBaseline = "bottom"
      previousMonthContext.fillText(percentage, currentX + width/2, base - percentage - 2)

      // add browser label below bar
      previousMonthContext.textBaseline = "top"
      previousMonthContext.fillText(browser, currentX + width/2, base + 2)

      // increase current x position (10px between each bar)
      currentX += width + 10
    }

    // break after first iteration since we're only interested in the previous month,
    // a workaround to get the first element of a JavaScript object.
    break
  }

  // fill lastYearCanvas with values
  var currentY
  currentX = width
  for (month in stats[currentYear - 1]){
    // reset currentY
    currentY = undefined
    for (browser in stats[currentYear - 1][month]) {
      // set bar color based on browser
      setFillStyle(lastYearContext, browser)

      percentage = stats[currentYear - 1][month][browser]
      
      if (currentY === undefined) currentY = base - parseFloat(percentage)
      else currentY = parseFloat(currentY) - parseFloat(percentage)

      // create bar
      lastYearContext.fillRect(currentX, currentY, width, percentage)
    }
    
    // set color for the label text
    lastYearContext.fillStyle = '#1e1d1c'

    // add month label below bar
    lastYearContext.textBaseline = "top"
    lastYearContext.fillText(month, currentX + width/2, base + 6)

    // increase current x position (+10px between each bar)
    currentX += width + 10
  }
})

function setFillStyle(context, browser) {
  switch(browser) {
    case 'Chrome':  context.fillStyle = 'limegreen'; break
    case 'Firefox': context.fillStyle = 'darkorange'; break
    case 'IE':      context.fillStyle = 'skyblue'; break
    case 'Safari':  context.fillStyle = 'royalblue'; break
    case 'Opera':   context.fillStyle = 'tomato'; break
  }
}
