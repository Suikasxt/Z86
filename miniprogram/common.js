export function getStageFromTime(time) {
  var now = new Date()
  var timeStamp = [time.registerStart, time.registerEnd, time.contestStart, time.contestEnd]

  for (var i = 0; i < timeStamp.length; i++) {
    if (now <= new Date(timeStamp[i])) {
      return i
    }
  }
  return timeStamp.length
}

export function dataFormat(time) {
  var res = ""
  res += time.getFullYear()
  res += "-"
  res += time.getMonth() + 1
  res += "-"
  res += time.getDate()
  res += " "
  res += time.getHours()
  res += ":"
  res += time.getMinutes()
  res += ":"
  res += time.getSeconds()
  return res
}

export function regionFormat(region) {
  var res = ""
  if (region[0]) {
    res += region[0]
  }
  if (region[1] && region[0] != region[1]) {
    res += region[1]
  }
  if (region[2]) {
    res += region[2]
  }
  return res
}

export function numberFormat(number, length) {
  var res = "" + number
  while (res.length < length) {
    res = "0" + res
  }
  return res
}

export function getDate(time) {
  var res = ""
  res += time.getFullYear()
  res += "-"
  res += numberFormat(time.getMonth() + 1, 2)
  res += "-"
  res += numberFormat(time.getDate(), 2)
  return res
}
export function getClock(time) {
  var res = ""
  res += numberFormat(time.getHours(), 2)
  res += ":"
  res += numberFormat(time.getMinutes(), 2)
  return res
}
export function getTimeString(time) {
  return getDate(time) + " " + getClock(time)
}
export function tagSearchMatch(text, tag) {
  var weight = -abs(text.length - tag.length)

  for (var i = 0; i < text.length; i++) {
    for (var j = 0; j < tag.length; j++) {
      if (text[i] == tag[j]) {
        weight += 1
        break
      }
    }
  }
  for (var i = 0; i < text.length - 1; i++) {
    for (var j = 0; j < tag.length - 1; j++) {
      if (text[i] == tag[j] && text[i + 1] == tag[j + 1]) {
        weight += 1
        break
      }
    }
  }
  return weight
}
export function abs(x) {
  if (x > 0) {
    return x
  } else {
    return -x
  }
}