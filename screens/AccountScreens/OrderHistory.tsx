import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, Modal } from 'react-native';
import { useOrder } from "../../context/OrderContext";
import { ClothesCardProps } from '../../types/ClothesCardProps';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";

interface CartProps extends ClothesCardProps {
  imageNo: number;
  size: string;
}

interface OrderProps {
    orderNo?: string,
    items: CartProps[];
    itemNo: number;
    orderTotal: string;
}

export default function OrderHistory() {
    const { orderItems } = useOrder();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderProps | null>(null);
    
    const renderOrderList = ({item}: {item: OrderProps}) => {
        const images = item.items.slice(0, 5).map((i) => i.image[i.imageNo].url);
        const firstImage = images[0];
        const otherImages = images.slice(1,5);
        
        const handlePress = (item: OrderProps) => {
            setSelectedOrder(item);
            setModalVisible(true);
        }

        return (
            <GestureHandlerRootView>
            <TouchableOpacity onPress={() => handlePress(item)}>
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
            
            <Text style={styles.title}>{item.orderNo}</Text>
            <Text>{item.itemNo} items</Text>
            
            </View>
            </View>
            </TouchableOpacity>
            </GestureHandlerRootView>
        )
    };

    const renderOrder = ({ item }: { item: CartProps }) => {
        return (
        <View style={styles.collectionItem}>
            <Image source={{ uri: item.image[item.imageNo].url }} style={styles.collectionItemImage} />
            <View style={styles.collectionItemDetails}>
            <Text style={styles.collectionItemName}>{item.name}</Text>
            <Text style={styles.collectionItemPrice}>{item.price[0] + parseFloat(item.price[1]).toFixed(2)}</Text>
            <Text style={styles.collectionItemPrice}>
                {item.image[item.imageNo].colorString}
            </Text>
            </View>
        </View>
        )
    };

    useEffect(() => {
        console.log(selectedOrder?.orderTotal);
    }, [selectedOrder]);

    return (
        <View style={{flex:1}}>
        <FlatList
            data={orderItems}
            renderItem={renderOrderList}
            keyExtractor={(item, index) => item.orderNo?.toString() || index.toString()}
            contentContainerStyle={{ padding: 5 }}
        />
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setSelectedOrder(null)
                setModalVisible(false);
            }}
        >
        {selectedOrder && (
        <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => {
                        setSelectedOrder(null)
                        setModalVisible(false);
                    }}>
                    <Ionicons name='arrow-back' size={30} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{selectedOrder.orderNo}</Text>
            </View>
            
            <FlatList
                data={selectedOrder.items}
                renderItem={renderOrder}
                keyExtractor={(item) => item.name}
                contentContainerStyle={styles.collectionList}
                showsVerticalScrollIndicator={false}
            />
            <Text style={styles.orderTotal}>
                Total: {selectedOrder.orderTotal}
            </Text>
        </View>
        )}
        </Modal>
    </View>
    );
}

const styles = StyleSheet.create({
    collection: {
        marginBottom: 20, 
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
    collectionItem: {
        flexDirection: 'row',
        marginBottom: 2,
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
        top: -30,
        left: 0,
        right: 0,
        zIndex: 1,
        marginTop: 30,
        backgroundColor: 'white',
        height: 100,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        alignSelf: 'flex-end',
        paddingBottom: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'flex-end',
        paddingBottom: 10,
    },
    collectionList: {
        padding: 5,
        marginTop: 120,
        marginBottom: 200,
        paddingBottom: 150,
    },
    orderTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 50,
        marginTop: 20,
    },
});

