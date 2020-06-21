import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import CharacterList from './src/components/CharacterList'
import LocationList from './src/components/LocationList'
import EpisodeList from './src/components/EpisodeList'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    this.createMainNavigation();
  }

  createMainNavigation() {

    this.caractersStack = () => {
      return (
        <Stack.Navigator>
          <Stack.Screen name="Characters" component={CharacterList} />
        </Stack.Navigator>
      );
    };
    
    this.locationsStack = () => {
      return (
        <Stack.Navigator>
          <Stack.Screen name="Location" component={LocationList} />
        </Stack.Navigator>
      );
    };
    
    this.episodesStack = () => {
      return (
        <Stack.Navigator>
          <Stack.Screen name="Episodes" component={EpisodeList} />
        </Stack.Navigator>
      );
    };
    
    this.mainTab = () => {
      return (
        <Tab.Navigator>
          <Tab.Screen
            name="characters"
            component={this.caractersStack}
            options={{
              tabBarLabel: 'Characters',
              tabBarIcon: ({ color, size }) => (
                <Icon name='ios-heart' size={size} color={color} />
              ),
            }} />
          <Tab.Screen
            name="locations"
            component={this.locationsStack}
            options={{
              tabBarLabel: 'Locations',
              tabBarIcon: ({ color, size }) => (
                <Icon name='ios-heart' size={size} color={color} />
              ),
            }} />
          <Tab.Screen
            name="episodes"
            component={this.episodesStack}
            options={{
              tabBarLabel: 'Episodes',
              tabBarIcon: ({ color, size }) => (
                <Icon name='ios-heart' size={size} color={color} />
              ),
            }} />
        </Tab.Navigator>
      );
    }

    this.navigationContainer = () => {
      return (<NavigationContainer><this.mainTab /></NavigationContainer>);
    };

    this.setState({
      ready: true,
    });
  }

  render() {
    return (this.state.ready ? <this.navigationContainer /> : <View />);
  }
}
