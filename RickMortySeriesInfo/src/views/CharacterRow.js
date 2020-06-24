import React, { Component } from 'react';
import {
    Image,
    Text,
    TouchableHighlight,
    View,
    StyleSheet,
    Button
} from 'react-native';

export default class CharacterRow extends Component {

  constructor(props) {
      super(props);
      this.state = {
        character: props.character,
        showStatus: props.showStatus,
      };
    }

    render() {
        return (
            <TouchableHighlight onPress={this.props.onPress} underlayColor='lightgray'>
                <View style={styles.mainContainer}>
                    <Image style={styles.image} resizeMode="contain" source={{ uri: this.props.character.image }} />
                    <View style={styles.titleContainer}>
                        <Text>{this.props.character.name}</Text>
                        <Text>{this.props.character.species}/{this.props.character.gender}</Text>
                    </View>
                    {this.getStatusElement()}
                </View>
            </TouchableHighlight>
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
    height: 75,
  }
});