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
import { inject, observer  } from 'mobx-react';

@inject('store')
@observer
export default class CharacterRow extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            showStatus: props.showStatus,
        };
        this.key = 'character' + props.character.id;
        this.favouriteCharacters = props.store.favouriteCharacters;
    }

    componentDidMount() {

        AsyncStorage.getItem(this.key).then( isFavourite => {
            this.props.store.addCharacter(this.props.character.id, isFavourite == 'true');
        });
    }
    
    render() {

        character = this.props.character;

        return (
            <TouchableHighlight onPress={this.props.onPress} underlayColor='lightgray'>
                <View style={styles.mainContainer}>
                    <View>
                        <Image
                            style={styles.image}
                            resizeMode="contain"
                            source={{ uri: character.image }}
                        />
                        {this.getFavouriteImage()}
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={{fontWeight: 'bold'}}>{character.name}</Text>
                        <Text>{character.species}</Text>
                    </View>
                    {this.getStatusElement()}
                </View>
            </TouchableHighlight>
        );
    }

    getFavouriteImage() {

        const isFavourite = this.favouriteCharacters.has(this.props.character.id) && this.favouriteCharacters.get(this.props.character.id);

        if (isFavourite) {
            return (
                <View style={styles.overlay}>
                     <Icon name='heart' style={{color: 'red'}} />
                </View>
            );
        } else {
            return null
        }
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
            return (<Text style={[styles.statusContainer, {color: '#00FF00'}]}>{this.props.character.status}</Text>);
        } else if (this.props.character.status == 'Dead') {
            return (<Text style={[styles.statusContainer, {color: '#FF0000'}]}>{this.props.character.status}</Text>);
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
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
    },
    overlay: {
        position: 'absolute',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
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
});