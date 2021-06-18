import AsyncStorage from "@react-native-async-storage/async-storage";

class Storage {
  static clear() {
    AsyncStorage.clear();
  }

  static async remove(storageKey, filter) {
    const rawList = await AsyncStorage.getItem(storageKey);

    if (!rawList) return;

    const list = JSON.parse(rawList);

    // Filter out the item we wanna remove
    AsyncStorage.setItem(
      storageKey,
      JSON.stringify(list.filter((item) => !compareTwoObject(item, filter)))
    );
  }

  static async create(storageKey, value) {
    const rawList = await AsyncStorage.getItem(storageKey);

    if (!rawList) {
      return await AsyncStorage.setItem(
        storageKey,
        JSON.stringify([value]) // Save value in array
      );
    }

    const list = JSON.parse(rawList);

    list.push(value);

    AsyncStorage.setItem(storageKey, JSON.stringify(list));
  }

  static async findOne(storageKey, filter = {}) {
    const rawList = await AsyncStorage.getItem(storageKey);

    if (!rawList) return {};

    const parsedList = JSON.parse(rawList);

    if (isObjectEmpty(filter)) {
      return parsedList[0];
    }

    return parsedList.find((item) => compareTwoObject(item, filter));
  }

  static async find(storageKey, filter = {}) {
    const rawList = await AsyncStorage.getItem(storageKey);

    if (!rawList) return [];

    const parsedList = JSON.parse(rawList);

    if (isObjectEmpty(filter)) {
      return parsedList;
    }

    return parsedList.map((item) => compareTwoObject(item, filter));
  }

  static async update(storageKey, filter, value) {
    await this.remove(storageKey, filter);

    const item = await this.findOne(storageKey, filter);

    const updatedItem = { ...item, ...value };

    return this.create(storageKey, updatedItem);
  }

  static async has(storageKey, filter) {
    const item = await this.findOne(storageKey, filter);

    return !isObjectEmpty(item);
  }
}

const isObjectEmpty = (obj) => JSON.stringify(obj) === "{}";

// check if object one contains all property and value of object two.
const compareTwoObject = (obj1, obj2) => {
  let isComparedCount = 0;

  const entries = Object.entries(obj2);

  for (const [key, value] of entries) {
    if (obj1[key] === value) {
      isComparedCount++;
    }
  }

  return isComparedCount === entries.length;
};

export default Storage;
