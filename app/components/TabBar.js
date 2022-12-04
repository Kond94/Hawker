import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useRef } from "react";

import AppText from "./Text";
import Icon from "./Icon";
import colors from "../config/colors";

const DEVICE_HEIGHT = Dimensions.get("window").height;
const DEVICE_WIDTH = Dimensions.get("window").height;
const TAB_BAR_WIDTH = DEVICE_WIDTH / 5;
const ANIMATED_PART_HEIGHT = 5;

export default function TabBar({ state, descriptors, navigation }) {
  const animationHorizontalValue = useRef(new Animated.Value(0)).current;

  const animate = (index) => {
    Animated.spring(animationHorizontalValue, {
      toValue: index * TAB_BAR_WIDTH,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animate(state.index);
  }, [state.index]);

  return (
    <View style={styles.container}>
      <Animated.View style={styles.animatedWrapper}>
        <Animated.View
          style={[
            styles.animatedView,
            {
              transform: [{ translateX: animationHorizontalValue }],
            },
          ]}
        />
      </Animated.View>

      <View style={{ flexDirection: "row" }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableWithoutFeedback
              accessibilityRole='button'
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
              key={`${index}--${route.key}`}
            >
              <View style={styles.innerView}>
                <Icon
                  name={label}
                  color={isFocused ? colors.primary : colors.black}
                />
                <AppText
                  numberOfLines={1}
                  type='heavy'
                  style={[
                    styles.iconText,
                    { color: isFocused ? colors.primary : colors.black },
                  ]}
                >
                  {label}
                </AppText>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    borderTopColor: colors.medium,
    borderTopWidth: 0.5,
    backgroundColor: colors.white,
  },
  tabButton: {
    flex: 1,
  },
  innerView: {
    paddingVertical: DEVICE_HEIGHT * 0.01,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    width: TAB_BAR_WIDTH,
    textAlign: "center",
  },
  animatedView: {
    width: TAB_BAR_WIDTH,
    height: ANIMATED_PART_HEIGHT,
    backgroundColor: colors.primary,
  },
  animatedWrapper: {
    width: TAB_BAR_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
});
