// components/ImagePicker.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ImageService } from "../services/imageService";

interface ImagePickerProps {
  value?: string;
  onChange: (uri: string | undefined) => void;
  placeholder?: string;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  value,
  onChange,
  placeholder = "Add Image",
}) => {
  const [loading, setLoading] = useState(false);

  const handlePickImage = () => {
    Alert.alert(
      "Select Image",
      "Choose an option to add an image",
      [
        {
          text: "Camera",
          onPress: async () => {
            setLoading(true);
            try {
              const uri = await ImageService.takePhoto();
              if (uri) {
                onChange(uri);
              }
            } catch (error) {
              console.error("Camera error:", error);
              Alert.alert("Error", "Failed to take photo");
            } finally {
              setLoading(false);
            }
          },
        },
        {
          text: "Gallery",
          onPress: async () => {
            setLoading(true);
            try {
              const uri = await ImageService.pickImage();
              if (uri) {
                onChange(uri);
              }
            } catch (error) {
              console.error("Gallery error:", error);
              Alert.alert("Error", "Failed to pick image");
            } finally {
              setLoading(false);
            }
          },
        },
        ...(value
          ? [
              {
                text: "Remove",
                style: "destructive" as const,
                onPress: () => onChange(undefined),
              },
            ]
          : []),
        {
          text: "Cancel",
          style: "cancel" as const,
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#05ad03" />
        <Text style={styles.loadingText}>Processing...</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePickImage}
      activeOpacity={0.7}
    >
      {value ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: value }} style={styles.image} />
          <View style={styles.overlay}>
            <Ionicons name="camera" size={32} color="#fff" />
            <Text style={styles.overlayText}>Change Image</Text>
          </View>
        </View>
      ) : (
        <View style={styles.placeholder}>
          <View style={styles.iconContainer}>
            <Ionicons name="images-outline" size={48} color="#9ca3af" />
          </View>
          <Text style={styles.placeholderText}>{placeholder}</Text>
          <Text style={styles.placeholderSubtext}>
            Tap to add from camera or gallery
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 16,
  },
  loadingContainer: {
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
  },
  imageContainer: {
    width: "100%",
    height: 250,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0,
  },
  overlayText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  placeholder: {
    width: "100%",
    height: 250,
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
});
