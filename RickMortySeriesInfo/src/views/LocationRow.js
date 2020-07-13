import React, { Component } from 'react';
import {
    Text,
    TouchableHighlight,
    View,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import { inject, observer  } from 'mobx-react';

@inject('store')
@observer
export default class LocationRow extends Component {
    
    constructor(props) {
        super(props);
        this.key = 'location' + props.location.id;
        this.favouriteLocations = props.store.favouriteLocations;
    }

    componentDidMount() {

        AsyncStorage.getItem(this.key).then( isFavourite => {
            this.props.store.addLocation(this.props.location.id, isFavourite == 'true');
        });
    }
    
    render() {

        location = this.props.location;

        return (
            <TouchableHighlight onPress={this.props.onPress} underlayColor='lightgray'>
                <View style={styles.mainContainer}>
                    <Text style={{alignSelf: 'center'}}>{this.getFavouriteImage()}</Text>
                    <View style={styles.titleContainer}>
                        <Text style={{fontWeight: 'bold'}}>{location.name}</Text>
                        <Text>{location.type}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    getFavouriteImage() {

        const isFavourite = this.favouriteLocations.has(this.props.location.id) && this.favouriteLocations.get(this.props.location.id);
        return (
            isFavourite ? <Icon name='heart' style={styles.favouriteIcon}/> : <Text> - </Text>
        );
    }
}

const styles = StyleSheet.create({
    
    mainContainer: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
    },
    titleContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    favouriteIcon: {
        alignSelf: 'center',
        color: 'red',
    },
});