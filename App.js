import * as React from 'react'
import { StatusBar } from 'expo-status-bar'
import {
  StyleSheet,
  // Text,
  View,
  Button,
  TextInput,
  Image,
  ImageBackground,
  ScrollView
} from 'react-native'
import { useWindowDimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { DataTable } from 'react-native-paper'
import backgroundImg from './assets/background-dice.jpg'
import logoImg from './assets/dice-logo-sm.png'
import PropTypes from 'prop-types'

const Stack = createNativeStackNavigator()

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired
}
FetchScreen.propTypes = {
  navigation: PropTypes.object.isRequired
}

function HomeScreen({ navigation }) {
  const window = useWindowDimensions()
  const [name, setName] = React.useState(''),
    [players, setPlayers] = React.useState([]),
    [updateSum, setUpdateSum] = React.useState('')

  const playerTable = players.map((player, index) => (
    <DataTable style={styles.table} key={index}>
      <DataTable.Header style={styles.tableHeaderContainer}>
        <DataTable.Title style={styles.tableHeader}>
          {player.name}
        </DataTable.Title>
      </DataTable.Header>
      {player.values.map((value, index) => (
        <DataTable.Row key={index} style={styles.tableRow}>
          <DataTable.Cell style={styles.cellLeft}>{index + 1}</DataTable.Cell>
          <DataTable.Cell style={styles.cellRight}>
            <View
              style={[styles.valueContainer, { minWidth: window.width * 0.6 }]}
            >
              <TextInput
                style={styles.valueInput}
                keyboardType="numeric"
                maxLength={5}
                onEndEditing={(event) => {
                  player.values[index] = event.nativeEvent.text
                  setPlayers(players)
                  if (updateSum === 'update') {
                    setUpdateSum('update again')
                  } else {
                    setUpdateSum('update')
                  }
                }}
              />
            </View>
          </DataTable.Cell>
        </DataTable.Row>
      ))}
      <DataTable.Row style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
        <DataTable.Cell style={styles.cellLeft}>Sum</DataTable.Cell>
        <DataTable.Cell style={styles.cellRight}>{player.sum}</DataTable.Cell>
      </DataTable.Row>
    </DataTable>
  ))

  function onPressHandler() {
    const player = {
      name: name,
      values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      sum: 0
    }
    if (name === '' || null) {
      alert('Enter player name first')
    } else {
      setPlayers([...players, player])
    }
  }

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row'
          }}
        >
          <TextInput
            style={styles.input}
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            placeholder="Player name"
            onChangeText={(newName) => setName(newName)}
          />
          <Button onPress={onPressHandler} title="Add player" color="#20232a" />
        </View>
      )
    })
  }, [navigation, name])

  React.useEffect(() => {
    players.forEach((player) => {
      const strToNum = player.values.map((str) => Number(str))
      const initialValue = 0
      const sum = strToNum.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        initialValue
      )
      player.sum = sum
      setPlayers(JSON.parse(JSON.stringify(players)))
    })
  }, [updateSum])

  return (
    <ImageBackground
      source={backgroundImg}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(247, 253, 254, 0.756)', 'rgba(242, 255, 255, 0.688)']}
        style={styles.container}
      >
        <ScrollView>{playerTable}</ScrollView>
        <Button
          color="#20232a"
          title="Go fetch"
          onPress={() => navigation.navigate('Fetch')}
        />
        <StatusBar style="light" />
      </LinearGradient>
    </ImageBackground>
  )
}

function FetchScreen({ navigation }) {
  const [dog, setDog] = React.useState(null)
  const [dogCycle, setDogCycle] = React.useState('')
  function fetchData() {
    fetch('https://dog.ceo/api/breeds/image/random')
      .then((response) => response.json())
      .then((result) => {
        setDog(result.message)
      })
  }

  React.useEffect(fetchData, [dogCycle])

  return (
    <ImageBackground
      source={{ uri: dog }}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(247, 253, 254, 0.756)', 'rgba(242, 255, 255, 0.688)']}
        style={styles.container}
      >
        <Button
          color="#282c34"
          title="Fetch another dog"
          onPress={() => {
            if (dogCycle === 'cycle') {
              setDogCycle('cycle again')
            } else {
              setDogCycle('cycle')
            }
          }}
        />
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Image style={{ width: 100, height: 100 }} source={{ uri: dog }} />
        </View>
        <Button
          color="#20232a"
          title="Go back"
          onPress={() => navigation.goBack()}
        />
      </LinearGradient>
    </ImageBackground>
  )
}

function LogoTitle() {
  return <Image style={{ width: 50, height: 50 }} source={logoImg} />
}

function App() {
  return (
    <NavigationContainer style={{ primaryColor: '#fff' }}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'My home',
            headerStyle: {
              backgroundColor: '#20232a'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold'
            },
            headerTitle: (props) => <LogoTitle {...props} />
          }}
        />
        <Stack.Screen
          name="Fetch"
          component={FetchScreen}
          options={{
            title: 'Go fetch!',
            headerStyle: {
              backgroundColor: '#20232a',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold'
            },
            headerTitle: (props) => <LogoTitle {...props} />
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#282c34',
    borderRadius: 5,
    color: '#fff',
    padding: 5
  },
  backgroundImage: {
    flex: 1,
    height: '100%',
    width: '100%'
  },
  container: {
    flex: 1
  },
  table: {
    backgroundColor: 'rgba(1, 1, 1, 0)',
    padding: 40,
    paddingBottom: 100
  },
  tableHeaderContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    flex: 1
  },
  tableHeader: {
    color: '#fff'
  },
  tableRow: {
    alignItems: 'stretch',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    flex: 1,
    height: 40
  },

  cellLeft: {
    flex: 1
  },
  cellRight: {
    alignContent: 'stretch',
    alignItems: 'center',
    // backgroundColor: 'blue',
    flex: 6,
    flexDirection: 'row',
    // justifyContent: 'center',
    width: '100%'
  },
  valueContainer: {
    alignContent: 'stretch',
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(1, 1, 1, 0.2)',
    // backgroundColor: 'steelblue',
    display: 'flex',
    flex: 1,
    height: 40,
    flexDirection: 'row',
    minWidth: 100,
    width: '100%'
  },
  valueInput: {
    // backgroundColor: 'green',
    flex: 1,
    width: '100%'
  }
})

export default App
