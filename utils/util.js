const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join('-')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const handleDate = (dateTimeStamp) => {
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  
  var result = '';
  var now = new Date().getTime();
  dateTimeStamp = dateTimeStamp.getTime()
  var diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    console.log("时间不对劲,服务器创建时间与当前时间不同步");
    return result = "刚刚";
  }
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  if (parseInt(dayC) > 30) {
    result = "" + formatTime(dateTimeStamp);
  }else if(parseInt(dayC) > 1) {
    result = "" + parseInt(dayC) + "天前";
  }else if (parseInt(dayC) == 1) {
    result = "昨天";
  } else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  } else if (minC >= 5) {
    result = "" + parseInt(minC) + "分钟前";
  } else
    result = "刚刚";
  return result;
}

module.exports = {
  formatTime,
  handleDate
}
