import React, { Component } from 'react';
import {
    Image,
    Text,
    TouchableHighlight,
    View,
    StyleSheet,
    Button
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';

export default class CharacterRow extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            character: props.character,
            isFavourite: false,
            showStatus: props.showStatus,
        };
        this.key = 'character' + props.character.id;
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

        character = this.props.character;

        return (
            <TouchableHighlight onPress={this.props.onPress} underlayColor='lightgray'>
                <View style={styles.mainContainer}>
                    <Image
                        style={styles.image}
                        resizeMode="contain"
                        source={{ uri: character.image }}
                    />
                    <View style={styles.titleContainer}>
                        {this.getFavouriteImage()}
                        <Text style={{fontWeight: 'bold'}}>{character.name}</Text>
                        <Text>{character.species}</Text>
                    </View>
                    {this.getStatusElement()}
                </View>
            </TouchableHighlight>
        );
    }

    getFavouriteImage() {
        return (
            this.state.isFavourite ? <Icon name='heart'/> : null
        );
    }
    
    getStatusElement() {
        
        if (this.state.showStatus) {
            return this.getStatusValue();
        } else {
            return (<Button style={styles.statusContainer} color="#00afc7" title="Show status" accessibilityLabel="Show status" onPress={() => this.showOrHideStatus()}/>);
        }
    }
    
    getStatusValue() {
        
        if (this.props.character.status == 'Alive') {
            return (<Text style={styles.alive}>{this.props.character.status}</Text>);
        } else if (this.props.character.status == 'Dead') {
            return (<Text style={styles.dead}>{this.props.character.status}</Text>);
        } else {
            return (<Text style={styles.statusContainer}>{this.props.character.status}</Text>);
        }
    }
    
    showOrHideStatus() {
        this.setState({ showStatus: !this.state.showStatus });
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
    statusContainer: {
        marginLeft: 10,
        alignSelf: 'center',
        textAlignVertical: 'center',
        maxHeight: '50%',
    },
    alive: {
        marginLeft: 10,
        alignSelf: 'center',
        textAlignVertical: 'center',
        maxHeight: '50%',
        color: '#00FF00',
    },
    dead: {
        marginLeft: 10,
        alignSelf: 'center',
        textAlignVertical: 'center',
        maxHeight: '50%',
        color: '#FF0000',
    },
    image: {
        width: 50,
        height: 50,
    }
});