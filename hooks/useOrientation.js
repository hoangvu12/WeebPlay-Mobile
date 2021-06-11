import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

export default function useOrientation() {
  const [orientation, setOrientation] = useState("PORTRAIT");

  const getOrientation = (width, height) => {
    if (width < height) {
      setOrientation("PORTRAIT");
    } else {
      setOrientation("LANDSCAPE");
    }
  };

  useEffect(() => {
    const { width, height } = Dimensions.get("window");

    getOrientation(width, height);
  }, []);

  Dimensions.addEventListener("change", ({ window: { width, height } }) => {
    getOrientation(width, height);
  });

  return orientation;
}
