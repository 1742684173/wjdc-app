import Toast from 'react-native-root-toast';

let toast;
/**
 * 冒一个时间比较短的Toast
 * @param content center
 */
let shortTime = 1000;
let longTime = 2000;
export const toastShort = (content) => {
  if (toast !== undefined) {
    Toast.hide(toast);
  }
  toast = Toast.show(content.toString(), {
    duration: shortTime,//Toast.durations.SHORT,
    position: Toast.positions.CENTER,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0
  });
};

/**
 * 冒一个时间比较短的Toast
 * @param content bottom
 */
export const toastShort_bottom = (content) => {
  if (toast !== undefined) {
    Toast.hide(toast);
  }
  toast = Toast.show(content.toString(), {
    duration: shortTime,//Toast.durations.SHORT,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0
  });
};

/**
 * 冒一个时间比较短的Toast
 * @param content top
 */
export const toastShort_top = (content) => {
  if (toast !== undefined) {
    Toast.hide(toast);
  }
  toast = Toast.show(content.toString(), {
    duration: shortTime,//Toast.durations.SHORT,
    position: Toast.positions.TOP,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0
  });
};


/**
 * 冒一个时间比较久的Toast
 * @param content center
 */
export const toastLong = (content) => {
  if (toast !== undefined) {
    Toast.hide(toast);
  }
  toast = Toast.show(content.toString(), {
    duration: longTime,//Toast.durations.LONG,
    position: Toast.positions.CENTER,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0
  });
};

/**
 * 冒一个时间比较久的Toast
 * @param content bottom
 */
export const toastLong_bottom = (content) => {
  if (toast !== undefined) {
    Toast.hide(toast);
  }
  toast = Toast.show(content.toString(), {
    duration: longTime,//Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0
  });
};

/**
 * 冒一个时间比较久的Toast
 * @param content top
 */
export const toastLong_top = (content) => {
  if (toast !== undefined) {
    Toast.hide(toast);
  }
  toast = Toast.show(content.toString(), {
    duration: longTime,//Toast.durations.LONG,
    position: Toast.positions.TOP,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0
  });
};