/* eslint-disable react/prop-types */
import { Entypo } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Share, Text, View } from "react-native";
import { windowWidth } from "../../constants";
import { numberWithCommas } from "../../utils";
import { moderateScale } from "../../utils/scale";
import Column from "./Column";
import InfoButton from "./InfoButton";

const InfoColumn = ({ info }) => {
  const shareUrl = `https://weebplay.glitch.me/anime/linking?slug=${info.slug}`;

  const onShare = () => {
    try {
      Share.share({
        message: `Nhấn vào đường dẫn để xem ${info.name}\n\n${shareUrl}`,
        title: shareUrl,
        url: shareUrl,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Column
      as={ScrollView}
      style={{
        width: windowWidth - moderateScale(50),
      }}
    >
      <View style={{ marginBottom: moderateScale(20) }}>
        <Text
          style={{
            fontSize: moderateScale(16),
            fontWeight: "bold",
            color: "#E2610E",
          }}
          numberOfLines={1}
        >
          {info.name}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <Text
          style={{
            fontSize: moderateScale(14),
            fontWeight: "bold",
            color: "white",
            marginRight: moderateScale(20),
          }}
          numberOfLines={1}
        >
          Thời lượng
        </Text>
        <Text
          style={{
            fontSize: moderateScale(12),
            color: "gray",
          }}
          numberOfLines={1}
        >
          {info.time}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <Text
          style={{
            fontSize: moderateScale(14),
            fontWeight: "bold",
            color: "white",
            marginRight: moderateScale(20),
          }}
          numberOfLines={1}
        >
          Lượt xem
        </Text>
        <Text
          style={{
            fontSize: moderateScale(12),
            color: "gray",
          }}
          numberOfLines={1}
        >
          {numberWithCommas(info.views)} lượt xem
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          marginTop: 20,
        }}
      >
        <InfoButton
          title="Chia sẻ"
          titleStyle={{ color: "rgba(255,255,255,0.75)" }}
          icon={
            <Entypo name="share" size={24} color="rgba(255,255,255,0.75)" />
          }
          onPress={onShare}
        />
      </View>
    </Column>
  );
};

export default InfoColumn;
