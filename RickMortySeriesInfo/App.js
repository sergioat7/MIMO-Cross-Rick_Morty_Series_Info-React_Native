import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import CharacterList from './src/components/CharacterList'
import LocationList from './src/components/LocationList'
import EpisodeList from './src/components/EpisodeList'
import CharacterDetails from './src/components/CharacterDetails'

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
    AsyncStorage.getItem('lastSelectedTab').then((lastSelectedTab) => {
      this.createMainNavigation(lastSelectedTab);
    });
  }

  createMainNavigation(initialTab) {

    this.caractersStack = () => {
      return (
        <Stack.Navigator>
          <Stack.Screen name="Characters" component={CharacterList} />
          <Stack.Screen name="CharacterDetails" component={CharacterDetails} />
        </Stack.Navigator>
      );
    };
    
    this.locationsStack = () => {
      return (
        <Stack.Navigator>
          <Stack.Screen name="Locations" component={LocationList} />
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

      function tabBarOnPress(tabName) {
        return (event) => {
          AsyncStorage.setItem('lastSelectedTab', tabName);
        };
      };

      return (
        <Tab.Navigator
          initialRouteName={initialTab}
          backBehavior="none"
          tabBarOptions={{
            activeTintColor: '#00afc7',
          }}>
          <Tab.Screen
            name="characters"
            component={this.caractersStack}
            listeners={{ tabPress: tabBarOnPress("characters") }}
            options={{
              tabBarLabel: 'Characters',
              tabBarIcon: () => (
                <Image source={require('./src/assets/characters.png')} />
              ),
            }} />
          <Tab.Screen
            name="locations"
            component={this.locationsStack}
            listeners={{ tabPress: tabBarOnPress("locations") }}
            options={{
              tabBarLabel: 'Locations',
              tabBarIcon: () => (
                <Image source={require('./src/assets/locations.png')} />
              ),
            }} />
          <Tab.Screen
            name="episodes"
            component={this.episodesStack}
            listeners={{ tabPress: tabBarOnPress("episodes") }}
            options={{
              tabBarLabel: 'Episodes',
              tabBarIcon: () => (
                <Image source={require('./src/assets/episodes.png')} />
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
