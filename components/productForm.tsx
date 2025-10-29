// components/ProductForm.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ImageService } from "../services/imageService";
import { CreateProductInput } from "../types/product";

interface ProductFormProps {
  initialValues?: Partial<CreateProductInput>;
  onSubmit: (data: CreateProductInput) => void;
  submitLabel?: string;
  loading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  onSubmit,
  submitLabel = "Submit",
  loading = false,
}) => {
  const [name, setName] = useState(initialValues?.name || "");
  const [quantity, setQuantity] = useState(
    initialValues?.quantity ? String(initialValues.quantity) : ""
  );
  const [price, setPrice] = useState(
    initialValues?.price ? String(initialValues.price) : ""
  );
  const [imageUri, setImageUri] = useState<string | undefined>(
    initialValues?.image_uri
  );

  const [errors, setErrors] = useState<{
    name?: string;
    quantity?: string;
    price?: string;
  }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Product name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!quantity.trim()) {
      newErrors.quantity = "Quantity is required";
    } else if (isNaN(Number(quantity)) || Number(quantity) < 0) {
      newErrors.quantity = "Please enter a valid quantity";
    }

    if (!price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(price)) || Number(price) < 0) {
      newErrors.price = "Please enter a valid price";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImagePicker = () => {
    Alert.alert(
      "Product Photo",
      "Choose how to add a photo",
      [
        {
          text: "Take Photo",
          onPress: async () => {
            const uri = await ImageService.takePhoto();
            if (uri) setImageUri(uri);
          },
        },
        {
          text: "Choose from Gallery",
          onPress: async () => {
            const uri = await ImageService.pickImage();
            if (uri) setImageUri(uri);
          },
        },
        ...(imageUri
          ? [
              {
                text: "Remove Photo",
                onPress: () => setImageUri(undefined),
                style: "destructive" as const,
              },
            ]
          : []),
        { text: "Cancel", style: "cancel" as const },
      ],
      { cancelable: true }
    );
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      quantity: Number(quantity),
      price: Number(price),
      image_uri: imageUri,
    });
  };

  return (
    <View style={styles.container}>
      {/* Image Picker */}
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={handleImagePicker}
        activeOpacity={0.7}
      >
        {imageUri ? (
          <>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <View style={styles.imageOverlay}>
              <Ionicons name="camera" size={24} color="#fff" />
              <Text style={styles.imageOverlayText}>Change Photo</Text>
            </View>
          </>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="camera-outline" size={48} color="#9ca3af" />
            <Text style={styles.imagePlaceholderText}>Add Product Photo</Text>
            <Text style={styles.imagePlaceholderSubtext}>Optional</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Product Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Product Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          placeholder="e.g., iPhone 13 Pro"
          placeholderTextColor="#9ca3af"
          autoCapitalize="words"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      {/* Quantity */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Quantity <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.quantity && styles.inputError]}
          value={quantity}
          onChangeText={(text) => {
            setQuantity(text);
            if (errors.quantity) setErrors({ ...errors, quantity: undefined });
          }}
          placeholder="e.g., 10"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
        />
        {errors.quantity && (
          <Text style={styles.errorText}>{errors.quantity}</Text>
        )}
      </View>

      {/* Price */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Price (USD) <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.priceInputContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={[
              styles.input,
              styles.priceInput,
              errors.price && styles.inputError,
            ]}
            value={price}
            onChangeText={(text) => {
              setPrice(text);
              if (errors.price) setErrors({ ...errors, price: undefined });
            }}
            placeholder="0.00"
            placeholderTextColor="#9ca3af"
            keyboardType="decimal-pad"
          />
        </View>
        {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Processing..." : submitLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    alignSelf: "center",
    marginBottom: 32,
    position: "relative",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  imageOverlayText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
  },
  imagePlaceholderText: {
    marginTop: 12,
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "500",
  },
  imagePlaceholderSubtext: {
    marginTop: 4,
    color: "#9ca3af",
    fontSize: 12,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#ef4444",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#1f2937",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  currencySymbol: {
    position: "absolute",
    left: 14,
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    zIndex: 1,
  },
  priceInput: {
    paddingLeft: 32,
    flex: 1,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: "#05ad03",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#05ad03",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
