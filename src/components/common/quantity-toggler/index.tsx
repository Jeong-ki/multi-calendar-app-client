import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type {IQuantityTogglerProps} from './types';

const QuantityToggler = ({
  quantity,
  onDecreaseQuantityPress,
  onIncreaseQuantityPress,
  style,
  uniqueID,
}: IQuantityTogglerProps) => {
  return (
    <View style={[styles.root, style]}>
      <TouchableOpacity
        testID={
          uniqueID
            ? `decrease-quantity-btn-${uniqueID}`
            : 'decrease-quantity-btn'
        }
        activeOpacity={0.6}
        disabled={quantity === 0}
        onPress={onDecreaseQuantityPress}
        style={quantity === 0 ? styles.disabledActionBtn : styles.actionBtn}>
        <MaterialCommunityIcons name="minus" size={24} color="#fff" />
      </TouchableOpacity>

      <Text
        testID={
          uniqueID
            ? `quantity-toggler-value-${uniqueID}`
            : 'quantity-toggler-value'
        }
        style={styles.quantityText}>
        {quantity.toString()}
      </Text>

      <TouchableOpacity
        testID={
          uniqueID
            ? `increase-quantity-btn-${uniqueID}`
            : 'increase-quantity-btn'
        }
        activeOpacity={0.6}
        onPress={onIncreaseQuantityPress}
        style={styles.actionBtn}>
        <MaterialCommunityIcons name="plus" size={24} color="#ffff" />
      </TouchableOpacity>
    </View>
  );
};

export default QuantityToggler;

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  actionBtn: {
    backgroundColor: 'darkslateblue',
    borderRadius: 8,
    padding: 2,
  },
  disabledActionBtn: {
    backgroundColor: '#e1e1e1',
    borderRadius: 8,
    padding: 2,
  },
  quantityText: {
    width: 50,
    textAlign: 'center',
  },
});
