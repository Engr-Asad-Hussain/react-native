import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, FlatList } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ShoppingItems } from './components/ShoppingItems';
import { MaterialIcons } from '@expo/vector-icons';
import { db, collection, doc, addDoc, getDocs, deleteDoc } from './firebase';

export default function App() {
  const [newShopItem, setNewShopItem] = useState('');
  const [itemList, setItemList] = useState([]);

  const addShopItem = async () => {
    try {
      const docRef = await addDoc(collection(db, 'shop'), {
        item: newShopItem,
        isChecked: false,
      });
      setItemList(prev => [
        ...prev,
        { id: docRef.id, item: newShopItem, isChecked: false }
      ]);
      setNewShopItem('');
    } catch (e) {
      console.error(`Error occured during POST request: ${e}`);
    }
  }
  const getShoppingList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'shop'));
      const temp = [];
      querySnapshot.forEach((doc) => {
        temp.push({
          id: doc.id,
          ...doc.data(),
        })
      });
      setItemList(temp);
    } catch (e) {
      console.log(`Error occured during GET request: ${e}`)
    }
  }
  const deleteAllItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'shop'));
      querySnapshot.forEach((ele) => deleteDoc(doc(db, 'shop', ele.id)));
      setItemList([]);
    } catch (e) {
      console.log(`Error occured during DELETE request: ${e}`)
    }
  }

  useEffect(() => {
    getShoppingList()
  }, []);

  return (
    <SafeAreaProvider style={style.container}>
      <View style={style.header}>
        <Text style={style.heading}>Shopping Items</Text>
        <View style={style.headerAction}>
          <Text style={style.noOfItems}>{itemList.length}</Text>
          <Pressable onPress={deleteAllItems}>
            <MaterialIcons name="delete" size={30} color="black" />
          </Pressable>
        </View>
      </View>
      <FlatList
        data={itemList}
        renderItem={({ item }) => (
          <ShoppingItems
            shopId={item.id}
            shopItem={item.item}
            isChecked={item.isChecked}
            setItemList={setItemList}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <TextInput
        placeholder='Enter shopping item'
        style={style.inputItem}
        value={newShopItem}
        onChangeText={(text) => setNewShopItem(text)}
        onSubmitEditing={addShopItem}
      />
    </SafeAreaProvider>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  headerAction: {
    flexDirection: 'row',
  },
  heading: {
    fontSize: 30,
  },
  noOfItems: {
    fontSize: 20,
    marginLeft: 25,
    marginRight: 25,
  },
  inputItem: {
    backgroundColor: 'lightgray',
    fontSize: 17,
    padding: 10,
    borderRadius: 10,
    marginTop: 'auto',
  }
});
