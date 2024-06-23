import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { useCollections } from '../context/CollectionsContext';
import { useCart } from '../context/CartContext';
import { ClothesCardProps } from '../types/ClothesCardProps';
import { GestureHandlerRootView, Swipeable, TapGestureHandler } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface CartProps extends ClothesCardProps {
    imageNo: number;
}

interface CollectionProps {
    title: string;
    items: CartProps[];
    itemNo: number;
}

const Collections = () => {
    const { collections, removeCollection, removeItem } = useCollections();
    const { addToCart } = useCart();

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<CollectionProps | null>(null);

    const renderRightActions = (item: string) => {
        return (
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
                <Ionicons name='trash-outline' color='white' size={30}/>
            </TouchableOpacity>
        );
    };

    const handleDelete = (title: string) => {
        removeCollection(title);
    };

    const handleTap = (item: CollectionProps) => {       
        if (!item) {
            Alert.alert('Error', 'Add items to the collection');
        };
        
        setSelectedItem(item);
        setModalVisible(true);
    };

    const handleItemRemove = (item: CartProps) => {
        if (selectedItem) {
            removeItem(selectedItem.title, item);
            // Update the selectedItem state to reflect the changes
            const updatedItems = selectedItem.items.filter(i => i.name !== item.name);
            setSelectedItem({ ...selectedItem, items: updatedItems });
        }
    };

    const renderCollectionList = ({ item }: { item: CollectionProps }) => {
        const images = item.items.slice(0, 5).map((i) => i.image[i.imageNo].url);
        
        const placeholderImage = 'https://placehold.co/300x400.png';
        while (images.length < 5) {
            images.push(placeholderImage);
        }

        const firstImage  = images[0];
        const otherImages = images.slice(1, 5)

        return (
            <GestureHandlerRootView>
            <Swipeable renderRightActions={() => renderRightActions(item.title)}>
                <TapGestureHandler onActivated={() => handleTap(item)}>
                    <View style={styles.collection}>
                        <View style={styles.imagesContainer}>
                            <View style={styles.bigImageContainer}>
                                <Image
                                    source={{ uri: firstImage }}
                                    style={styles.bigImage}
                                />
                            </View>
                            <View style={styles.smallImagesContainer}>
                                {otherImages.map((imageUrl, index) => (
                                    <Image
                                        key={index}
                                        source={{ uri: imageUrl }}
                                        style={styles.smallImage}
                                    />
                                ))}
                            </View>
                        </View>
                        
                        <View style={styles.separator} />

                        <View style={{
                          flexDirection: 'row', 
                          justifyContent: 'space-between', width: '100%'
                        }}>
                        
                        <Text style={styles.title}>{item.title}</Text>
                        <Text>{item.itemNo} items</Text>
                        
                        </View>
                    </View>
                </TapGestureHandler>
            </Swipeable>
            </GestureHandlerRootView>
        );
    };

    const renderCollection= ({ item }: { item: CartProps }) => (
        <View style={styles.collectionItem}>
          <Image source={{ uri: item.image[item.imageNo].url }} style={styles.collectionItemImage} />
          
          <View style={styles.collectionItemDetails}>
            <Text style={styles.collectionItemName}>{item.name}</Text>
            <Text style={styles.collectionItemPrice}>{item.price[0] + parseFloat(item.price[1]).toFixed(2)}</Text>
            <Text style={styles.collectionItemPrice}>
              {item.image[item.imageNo].colorString}
            </Text>
          </View>
    
          <TouchableOpacity
              style={{    
                position: 'absolute',
                bottom: 15,
                right: 10,
              }}
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              onPress={() => addToCart(item, item.imageNo, 'L')}>
              <MaterialIcons name='add-shopping-cart' size={20} color='black'/>
          </TouchableOpacity>
          {selectedItem && 
          <TouchableOpacity
          style={{    
            position: 'absolute',
            top: 15,
            right: 10,
          }}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          onPress={() => handleItemRemove(item)}>
          <Ionicons name='remove' size={20} color='red'/>
        </TouchableOpacity>
        }

    
        </View>
      );

    return (
        <View style={styles.container}>
            <FlatList
                data={collections}
                renderItem={renderCollectionList}
                keyExtractor={(item) => item.title}
                contentContainerStyle={{ padding: 5 }}
            />
            
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setSelectedItem(null)
                    setModalVisible(false);
                    
                }}
            >
                {selectedItem && (
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity 
                            style={styles.backButton} 
                            onPress={() => {
                                setSelectedItem(null)
                                setModalVisible(false);
                            }}>
                            <Ionicons name='arrow-back' size={30} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                    </View>
                    
                    <FlatList
                        data={selectedItem.items}
                        renderItem={renderCollection}
                        keyExtractor={(item) => item.name}
                        contentContainerStyle={styles.collectionList}
                    />
                </View>
                )}
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    collection: {
        marginBottom: 20, // Spacing between items
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        height: 240,
        position: 'relative',
    },
    imagesContainer: {
        flexDirection: 'row',
        flex: 1,
    },
    bigImageContainer: {
        flex: 1,
    },
    bigImage: {
        width: '100%',
        height: '100%',
        borderRadius: 3,
    },
    smallImagesContainer: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 10,
    },
    smallImage: {
        width: '48%',
        height: '48%',
        borderRadius: 3,
        marginBottom: 5,
    },
    separator: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 240,
        borderRadius: 5,
    },
    modalContent: {
        backgroundColor: 'white',        
        width: '100%',
        height: '100%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        zIndex: 1,
        marginTop: 30,
    },
    backButton: {
        position: 'absolute',
        left: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    collectionList: {
        padding: 5,
        marginTop: 120,
        marginBottom: 200,
    },
    collectionItem: {
        flexDirection: 'row',
        marginBottom: 2, //Spacing between items
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        height: 120,
    },
    collectionItemImage: {
        width: 100,
        height: 100,
    },
    collectionItemDetails: {
        marginLeft: 10,
        flex: 1,
        justifyContent: 'center',
    },
    collectionItemName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 30,
    },
    collectionItemPrice: {
        fontSize: 16,
        color: 'gray',
    },
});

export default Collections;
