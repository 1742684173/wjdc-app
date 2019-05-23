// @flow
import {Dimensions, Platform} from 'react-native';

const {
  height: DEVICE_HEIGHT,
  width: DEVICE_WIDTH,
} = Dimensions.get('window');

const IPHONE8_SIZE = {
  width: 375,
  height: 667,
};

const IPHONE8_PLUS_SIZE = {
  width: 414,
  height: 736,
};

const HEIGHT_SCALE = (
  Math.min(DEVICE_HEIGHT, IPHONE8_PLUS_SIZE.height) / IPHONE8_SIZE.height
);

const WIDTH_SCALE = (
  Math.min(DEVICE_WIDTH, IPHONE8_PLUS_SIZE.width) / IPHONE8_SIZE.width
);

const normalize = (size: number, scale: number, exceed: boolean = true): number => {
  const normalizedSize = Math.round(scale * size);
  return exceed ? normalizedSize : Math.min(normalizedSize, size);
};

export const normalizeHeight = (height: number, exceed?: boolean) => (
  normalize(height, HEIGHT_SCALE, exceed)
);

export const normalizeWidth = (width: number, exceed?: boolean) => (
  normalize(width, WIDTH_SCALE, exceed)
);

export const heightScale = (height: number, exceed?: boolean) => (
    normalizeHeight(height/2,exceed)
)
export const widthScale = (width: number, exceed?: boolean) => (
    normalizeWidth(width/2,exceed)
)

export const iosX = ()=>{
    return Platform.OS==='ios'?(ScreenHeight>=812 ? true:false) : false;
}
export{DEVICE_WIDTH,DEVICE_HEIGHT};
