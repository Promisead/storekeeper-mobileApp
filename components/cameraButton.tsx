// components/CameraButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CameraButtonProps {
  onPress: () => void;
  style?: ViewStyle;
  iconSize?: number;
  label?: string;
  variant?: "primary" | "secondary" | "outline";
}

export const CameraButton: React.FC<CameraButtonProps> = ({
  onPress,
  style,
  iconSize = 24,
  label = "Take Photo",
  variant = "primary",
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return styles.buttonPrimary;
      case "secondary":
        return styles.buttonSecondary;
      case "outline":
        return styles.buttonOutline;
      default:
        return styles.buttonPrimary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "primary":
        return styles.textPrimary;
      case "secondary":
        return styles.textSecondary;
      case "outline":
        return styles.textOutline;
      default:
        return styles.textPrimary;
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "primary":
        return "#fff";
      case "secondary":
        return "#fff";
      case "outline":
        return "#05ad03";
      default:
        return "#fff";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="camera" size={iconSize} color={getIconColor()} />
      {label && <Text style={[styles.text, getTextStyle()]}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  buttonPrimary: {
    backgroundColor: "#05ad03",
    shadowColor: "#05ad03",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonSecondary: {
    backgroundColor: "#10b981",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#05ad03",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  textPrimary: {
    color: "#fff",
  },
  textSecondary: {
    color: "#fff",
  },
  textOutline: {
    color: "#05ad03",
  },
});
