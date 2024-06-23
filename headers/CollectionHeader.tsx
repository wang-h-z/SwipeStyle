import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Modal, Dimensions, TouchableWithoutFeedback, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCollections } from '../context/CollectionsContext';

const { width, height } = Dimensions.get('window');

interface HeaderProps {
    title: string;
    leftButton?: boolean;
    rightButton?: boolean;

}

const CollectionHeader = (props: HeaderProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { newCollection, removeCollection } = useCollections();

    const [name, setName] = useState('');

    const handleAddCollection = (name: string) => {
        newCollection(name);
        setModalVisible(false);
        setName('');
    }
    const remove = () => {
        removeCollection("Test Collection");
    }

    return (
        <View style={styles.headerContainer}>
            {props.leftButton &&
                <TouchableOpacity style={styles.leftButton} onPress={() => console.log('Left button pressed')}>
                    <Ionicons name='arrow-back' size={24} color='black' />
                </TouchableOpacity>
            }

            <Text style={styles.headerTitle}>{props.title}</Text>

            {props.rightButton &&
                <TouchableOpacity style={styles.rightButton} onPress={() => setModalVisible(true)}>
                    <Ionicons name='add' size={24} color='black' />
                </TouchableOpacity>
            }

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                 <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>What would you like to call {'\n'} your mood board?</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Name"
                                    value={name}
                                    onChangeText={setName}
                                />
                                <Button title="Submit" onPress={() => handleAddCollection(name)} />
                                <Button title="Close" onPress={() => setModalVisible(false)} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: 95,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        width: '100%',
    },
    headerTitle: {
        fontSize: 16,
        position: 'absolute',
        alignSelf: 'flex-end',
        paddingBottom: 10,
    },
    leftButton: {
        position: 'absolute',
        left: 10,
        alignSelf: 'flex-end',
        paddingBottom: 10,
    },
    rightButton: {
        position: 'absolute',
        right: 10,
        alignSelf: 'flex-end',
        paddingBottom: 10,
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    centeredView: {
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalView: {
        width: width,
        height: height / 2,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        width: '100%',
    },
});

export default CollectionHeader;
