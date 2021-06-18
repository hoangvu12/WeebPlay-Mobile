/* eslint-disable react/prop-types */
import {
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Video as ExpoVideo } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import { Parser } from "m3u8-parser/src/index";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Dialog, Portal, RadioButton } from "react-native-paper";
import useOrientation from "../../hooks/useOrientation";
import { LoadingLoader } from "../../shared/Loader";
import { moderateScale } from "../../utils/scale";
import OverlayButton from "./OverlayButton";

const qualities = [
  {
    width: 640,
    height: 480,
    name: "480p",
  },
  {
    width: 1280,
    height: 720,
    name: "720p",
  },
  {
    width: 1920,
    height: 1080,
    name: "1080p",
  },
];

export default function Video({
  source,
  topOverlayTitle,
  topOverlayDescription,
  onPreviousPress,
  onNextPress,
  previousButtonDisable,
  nextButtonDisable,
  isTopOverlayEnabled = false,
  initialQuality = "720p",
}) {
  const video = useRef(null);
  const DOMAIN = useRef(null);

  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState({});
  const [videoSource, setVideoSource] = useState("");
  const [status, setStatus] = useState({});
  const [dialogVisible, setDialogVisible] = React.useState(false);

  const [showOverlay, setShowOverlay] = useState(true);
  const [showControls] = useState(true);
  const timeoutLeave = useRef(null);

  const orientation = useOrientation();

  useEffect(() => {
    const { uri = "" } = currentPlaylist;

    if (!uri) return;

    const videoSource = `https://${DOMAIN.current}${uri}`;

    setVideoSource(videoSource);
  }, [currentPlaylist]);

  // Parse the playlist
  useEffect(() => {
    DOMAIN.current = source.split("/")[2];
    const { width: initialWidth, height: initialHeight } = qualities.find(
      (quality) => quality.name === initialQuality
    );

    parsePlaylist(source).then((playlists) => {
      const chosenPlaylist = playlists.find((playlist) => {
        const { width: playlistWidth, height: playlistHeight } =
          playlist.attributes.RESOLUTION;

        return (
          initialWidth === playlistWidth && initialHeight === playlistHeight
        );
      });

      setCurrentPlaylist(chosenPlaylist);
      setPlaylists(playlists);
    });
  }, []);

  // Update video status every second
  // because expo video somehow doesn't update status itself
  // when change videoSource
  useEffect(() => {
    let interval = setInterval(async () => {
      try {
        const status = await video.current.getStatusAsync();

        setStatus(status);
      } catch (err) {
        // console.log("ERROR");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [videoSource]);

  const showDialog = () => setDialogVisible(true);

  const hideDialog = () => setDialogVisible(false);

  const handleScreenTouch = useCallback(() => {
    setShowOverlay(!showOverlay);

    // If there is timeout, clear it
    if (timeoutLeave.current) {
      clearTimeout(timeoutLeave.current);
    }

    // If user don't click the screen ever again, then hide controls
    timeoutLeave.current = setTimeout(() => {
      setShowOverlay(false);
    }, 3000);
  }, [showOverlay]);

  const handleSlideDrag = useCallback(async (value) => {
    await video.current.setPositionAsync(value);
    video.current.playAsync();
  }, []);

  const handlePreviousPress = useCallback(() => {
    onPreviousPress(video);
  }, []);

  const handleSeekLeftPress = useCallback(async () => {
    video.current.setPositionAsync(status.positionMillis - 10000);
  }, [status.positionMillis]);

  const handlePlayPress = () =>
    status.isPlaying ? video.current.pauseAsync() : video.current.playAsync();

  const handleSeekRightPress = useCallback(async () => {
    video.current.setPositionAsync(status.positionMillis + 10000);
  }, [status.positionMillis]);

  const handleNextPress = useCallback(() => {
    onNextPress(video);
  }, []);

  const handleFullscreenPress = useCallback(() => {
    ScreenOrientation.lockAsync(
      orientation === "LANDSCAPE"
        ? ScreenOrientation.OrientationLock.PORTRAIT
        : ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
    );
  }, [orientation]);

  const navigation = useNavigation();

  if (!videoSource) return <LoadingLoader />;

  return (
    <>
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={hideDialog}
          style={{
            backgroundColor: "#202020",
            borderRadius: 10,
          }}
        >
          <Dialog.Title style={{ color: "white" }}>
            Chọn chất lượng
          </Dialog.Title>
          <Dialog.Content>
            {playlists.map((playlist) => {
              const { width: playlistWidth, height: playlistHeight } =
                playlist.attributes.RESOLUTION;

              const quality = qualities.find(
                (quality) =>
                  quality.width === playlistWidth &&
                  quality.height === playlistHeight
              );

              return (
                <View
                  style={{ flexDirection: "row", alignItems: "center" }}
                  key={playlist.uri}
                >
                  <RadioButton
                    value={playlist.uri}
                    status={
                      currentPlaylist.uri === playlist.uri
                        ? "checked"
                        : "unchecked"
                    }
                    color="#FF6500"
                    uncheckedColor="gray"
                    onPress={() => setCurrentPlaylist(playlist)}
                  />

                  <Text style={{ color: "white", fontSize: moderateScale(15) }}>
                    {quality.name}
                  </Text>
                </View>
              );
            })}
          </Dialog.Content>
        </Dialog>
      </Portal>
      <TouchableWithoutFeedback onPressIn={handleScreenTouch}>
        <View style={styles.container}>
          <ExpoVideo
            key={currentPlaylist.uri}
            shouldPlay
            ref={video}
            style={styles.video}
            usePoster
            source={{
              uri: videoSource,
              overrideFileExtensionAndroid: "m3u8",
            }}
            resizeMode={
              orientation === "LANDSCAPE"
                ? ExpoVideo.RESIZE_MODE_CONTAIN
                : ExpoVideo.RESIZE_MODE_COVER
            }
            onPlaybackStatusUpdate={(status) => setStatus(status)}
          />
          {showOverlay && (
            <View style={styles.overlayContainer}>
              {/* Top */}
              <View style={styles.topOverlayContainer}>
                <View
                  style={{
                    flex: 3,
                    flexDirection: "row",
                    alignItems: "baseline",
                  }}
                >
                  <OverlayButton
                    icon={
                      <AntDesign
                        name={orientation === "LANDSCAPE" ? "down" : "left"}
                        size={moderateScale(23)}
                        color="white"
                        style={{ marginRight: moderateScale(12) }}
                      />
                    }
                    onPress={() => {
                      if (orientation !== "LANDSCAPE") {
                        if (navigation.canGoBack()) {
                          navigation.goBack();
                        } else {
                          navigation.reset({
                            index: 0,
                            routes: [{ name: "Tabs" }], // Home screen
                          });
                        }
                      } else {
                        ScreenOrientation.lockAsync(
                          ScreenOrientation.OrientationLock.PORTRAIT
                        );
                      }
                    }}
                  />

                  {isTopOverlayEnabled && (
                    <>
                      <Text
                        numberOfLines={1}
                        style={{
                          color: "white",
                          fontSize: moderateScale(14),
                          marginRight: moderateScale(7),
                        }}
                      >
                        {topOverlayTitle}
                      </Text>

                      <Text
                        numberOfLines={1}
                        style={{ color: "gray", fontSize: moderateScale(12) }}
                      >
                        {topOverlayDescription}
                      </Text>
                    </>
                  )}
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "baseline",
                    justifyContent: "flex-end",
                  }}
                >
                  <OverlayButton
                    icon={
                      <Entypo
                        name="dots-three-vertical"
                        size={moderateScale(23)}
                        color="white"
                      />
                    }
                    onPress={showDialog}
                  />
                </View>
              </View>

              {/* Middle */}
              <View style={styles.middleOverlayContainer}>
                {showControls && (
                  <>
                    {/* Previous button */}

                    <OverlayButton
                      icon={
                        <MaterialCommunityIcons
                          name="rewind"
                          size={moderateScale(30)}
                          color={previousButtonDisable ? "gray" : "white"}
                        />
                      }
                      disabled={previousButtonDisable}
                      onPress={handlePreviousPress}
                    />

                    {/* Seek left button */}
                    <OverlayButton
                      icon={
                        <MaterialIcons
                          name="replay"
                          size={moderateScale(30)}
                          color="white"
                        />
                      }
                      onPress={handleSeekLeftPress}
                    />

                    {/* Play button */}
                    <OverlayButton
                      icon={
                        status.isBuffering && !status.isPlaying ? (
                          <ActivityIndicator
                            size={moderateScale(80)}
                            color="rgba(250,250,250,0.8)"
                          />
                        ) : (
                          <MaterialIcons
                            name={status.isPlaying ? "pause" : "play-arrow"}
                            size={moderateScale(80)}
                            color="white"
                            iconStyle={{
                              borderWidth: 10,
                              borderColor: "black",
                            }}
                          />
                        )
                      }
                      onPress={handlePlayPress}
                    />

                    {/* Seek right */}
                    <OverlayButton
                      icon={
                        <MaterialIcons
                          name="replay"
                          size={moderateScale(30)}
                          color="white"
                          style={{ transform: [{ rotateY: "180deg" }] }}
                        />
                      }
                      onPress={handleSeekRightPress}
                    />

                    {/* Next button */}
                    <OverlayButton
                      icon={
                        <Entypo
                          name="controller-fast-forward"
                          size={moderateScale(30)}
                          color={nextButtonDisable ? "gray" : "white"}
                        />
                      }
                      disabled={nextButtonDisable}
                      onPress={handleNextPress}
                    />
                  </>
                )}
              </View>

              {/* Bottom */}
              <View style={styles.bottomOverlayContainer}>
                {showControls && (
                  <>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          color: "white",
                          marginLeft: moderateScale(5),
                          fontSize: moderateScale(14),
                        }}
                      >
                        {parseTime(status.positionMillis)}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{ color: "white", fontSize: moderateScale(14) }}
                      >
                        {parseTime(status.durationMillis)}
                      </Text>

                      <OverlayButton
                        icon={
                          <MaterialCommunityIcons
                            name="fullscreen"
                            size={moderateScale(25)}
                            color="white"
                            style={{ marginLeft: moderateScale(5) }}
                          />
                        }
                        onPress={handleFullscreenPress}
                      />
                    </View>
                  </>
                )}
              </View>

              {/* Progress bar */}
              <View style={styles.sliderContainer}>
                {showControls && (
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={status.durationMillis}
                    value={status.positionMillis}
                    minimumTrackTintColor="#FF6400"
                    maximumTrackTintColor="#fff"
                    thumbTintColor="#fff"
                    onValueChange={handleSlideDrag}
                  />
                )}
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

async function parsePlaylist(source) {
  const { data: manifest } = await axios.get(source);

  const parser = new Parser();

  parser.push(manifest);
  parser.end();

  const parsedManifest = parser.manifest;

  return parsedManifest.playlists;
}

function parseTime(millisec) {
  var seconds = (millisec / 1000).toFixed(0);
  var minutes = Math.floor(seconds / 60);
  var hours = "";
  if (minutes > 59) {
    hours = Math.floor(minutes / 60);
    hours = hours >= 10 ? hours : "0" + hours;
    minutes = minutes - hours * 60;
    minutes = minutes >= 10 ? minutes : "0" + minutes;
  }

  seconds = Math.floor(seconds % 60);
  seconds = seconds >= 10 ? seconds : "0" + seconds;
  if (hours != "") {
    return hours + ":" + minutes + ":" + seconds;
  }
  return minutes + ":" + seconds;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    height: "100%",
    width: "100%",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  overlayContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.75)",
    ...StyleSheet.absoluteFill,
  },
  topOverlayContainer: {
    width: "100%",
    position: "absolute",
    top: 0,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    padding: 12,
  },
  middleOverlayContainer: {
    width: "65%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  bottomOverlayContainer: {
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 35,
  },
  sliderContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
});
