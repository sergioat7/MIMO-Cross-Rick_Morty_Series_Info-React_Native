import React, { Component } from 'react';
import {
    Text,
    TouchableHighlight,
    View,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';

export default class LocationRow extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            location: props.location,
            isFavourite: false,
        };
        this.key = 'location' + props.location.id;
    }

    componentDidMount() {

        AsyncStorage.getItem(this.key).then( isFavourite => {
            this.setState({
                isFavourite: isFavourite == 'true'
            });
        });
    }

    componentDidUpdate() {

        AsyncStorage.getItem(this.key).then( isFavourite => {
            this.setState({
                isFavourite: isFavourite == 'true'
            });
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
        return (
            this.state.isFavourite ? <Icon name='heart' style={styles.favouriteIcon}/> : <Text> - </Text>
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