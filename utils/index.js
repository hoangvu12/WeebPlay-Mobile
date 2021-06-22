import { AlertIOS, Platform, ToastAndroid } from "react-native";

const entities = {
  amp: "&",
  apos: "'",
  "#x27": "'",
  "#x2F": "/",
  "#39": "'",
  "#47": "/",
  lt: "<",
  gt: ">",
  nbsp: " ",
  quot: '"',
};

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

export function decodeHTMLEntities(text) {
  return text.replace(/&([^;]+);/gm, function (match, entity) {
    return entities[entity] || match;
  });
}
