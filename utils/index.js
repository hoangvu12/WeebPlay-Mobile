import { AlertIOS, Platform, ToastAndroid } from "react-native";

export function notifyMessage(msg) {
  if (Platform.OS === "android") {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    AlertIOS.alert(msg);
  }
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
