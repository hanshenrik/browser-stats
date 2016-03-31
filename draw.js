var currentYear = new Date().getFullYear().toString()
var width = 50
var currentX = width
var base = 130

var previousMonthCanvas = document.getElementById("prev-month-canvas")
var previousMonthContext = previousMonthCanvas.getContext("2d")
previousMonthContext.fillStyle = '#1e1d1c'
previousMonthContext.textAlign = "center"

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

  for (year in stats) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute("id", "canvas-"+year);
    canvas.setAttribute("width", "800");
    canvas.setAttribute("height", "150");
    var canvasContainer = document.getElementById("canvas-container");
    canvasContainer.insertBefore(canvas, canvasContainer.childNodes[0]);

    var context = canvas.getContext("2d")
    context.fillStyle = '#1e1d1c'
    context.textAlign = "center"
    // draw title
    context.font = "bold 16px sans-serif"
    context.fillText(year, canvas.width/2, 20)
    context.font = "normal 11px sans-serif"

    // draw axis
    context.beginPath()
    context.moveTo(width - 10, 0)
    context.lineTo(width - 10, canvas.height)
    context.moveTo(width - 26, canvas.height - 16)
    context.lineTo(canvas.width, canvas.height - 16)
    context.stroke()

    // fill canvas with values
    var currentY
    currentX = width

    for (month in stats[year]){
      // reset currentY
      currentY = undefined
      for (browser in stats[year][month]) {
        // set bar color based on browser
        setFillStyle(context, browser)

        percentage = stats[year][month][browser]
        if (percentage === undefined || percentage === null || percentage === "") {
          continue;
        }

        if (currentY === undefined) {
          currentY = base - parseFloat(percentage)
        }
        else {
          currentY = parseFloat(currentY) - parseFloat(percentage)
        }

        // create bar
        context.fillRect(currentX, currentY, width, percentage)
      }
      
      // set color for the label text
      context.fillStyle = '#1e1d1c'

      // add month label below bar
      context.textBaseline = "top"
      context.fillText(month, currentX + width/2, base + 6)

      // increase current x position (+10px between each bar)
      currentX += width + 10
    }
  }
})

function setFillStyle(context, browser) {
  switch (browser) {
    case 'Chrome':    context.fillStyle = 'limegreen'; break
    case 'Firefox':
    case 'Mozilla':   context.fillStyle = 'darkorange'; break
    case 'IE':        context.fillStyle = 'skyblue'; break
    case 'Safari':    context.fillStyle = 'royalblue'; break
    case 'Opera':     context.fillStyle = 'tomato'; break
    case 'Netscape':  context.fillStyle = '#007C85'; break
    case 'AOL':       context.fillStyle = '#005CA5'; break
  }
}
