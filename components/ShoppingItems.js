import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { db, doc, updateDoc, deleteDoc } from '../firebase';

const ShoppingItems = (props) => {
  const [isChecked, setIsChecked] = useState(props.isChecked);

  const updateIsChecked = async () => {
    try {
      const shopRef = doc(db, 'shop', props.shopId)
      await updateDoc(shopRef, {
        isChecked: isChecked
      });
    } catch (e) {
      console.log(`Error occured during PUT request: ${e}`)
    }
  }
  const deleteItem = async () => {
    try {
      await deleteDoc(doc(db, 'shop', props.shopId));
      props.setItemList(prev => prev.filter(e => e.id !== props.shopId))
    } catch (e) {
      console.log(`Error occured during DELETE request: ${e}`)
    }
  }
  useEffect(() => {
    if (isChecked !== props.isChecked) {
      updateIsChecked();
    }
  }, [isChecked])
  return (
    <View style={style.container}>
      <Pressable onPress={() => setIsChecked(prev => !prev)}>
        {isChecked ? (
          <Feather
            name='check-circle'
            size={24}
            color='black'
          />
        ) : (
          <Feather
            name='circle'
            size={24}
            color='black'
          />
        )}
      </Pressable>
      <Text style={style.title}>{props.shopItem}</Text>
      <Pressable onPress={deleteItem}>
        <MaterialIcons name="delete" size={24} color="black" />
      </Pressable>
    </View>
  );
};

export { ShoppingItems };

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'lightgray',
    height: 50,
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 10
  },
  title: {
    fontSize: 17,
    fontWeight: '500'
  }
});