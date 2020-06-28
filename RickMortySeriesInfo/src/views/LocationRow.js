import React, { Component } from 'react';
import {
    Text,
    TouchableHighlight,
    View,
    StyleSheet,
} from 'react-native';

export default class LocationRow extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            location: props.location,
        };
    }
    
    render() {

        location = this.props.location;

        return (
            <TouchableHighlight onPress={this.props.onPress} underlayColor='lightgray'>
                <View style={styles.mainContainer}>
                    <Text style={{alignSelf: 'center'}}> - </Text>
                    <View style={styles.titleContainer}>
                        <Text style={{fontWeight: 'bold'}}>{location.name}</Text>
                        <Text>{location.type}</Text>
                    </View>
                </View>
            </TouchableHighlight>
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
});