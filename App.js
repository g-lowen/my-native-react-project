import * as React from "react";
// import { StatusBar } from 'expo-status-bar'
import {
  StyleSheet,
  // Text,
  View,
  Button,
  TextInput,
  Image,
  ImageBackground,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DataTable } from "react-native-paper";
import backgroundImg from "./assets/background-dice.jpg";
import logoImg from "./assets/dice-logo-sm.png";
import PropTypes from "prop-types";

const Stack = createNativeStackNavigator();

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
FetchScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

function HomeScreen({ navigation }) {
  const [name, setName] = React.useState(null),
    [players, setPlayers] = React.useState([]);

  const playerTable = players.map((player, index) => (
    <DataTable style={styles.table} key={index}>
      <DataTable.Header style={styles.tableHeaderContainer}>
        <DataTable.Title style={styles.tableHeader}>
          {player.name}
        </DataTable.Title>
      </DataTable.Header>
      {player.values.map((value, index) => (
        <DataTable.Row key={index}>
          <DataTable.Cell style={styles.indexCell}>{index + 1}</DataTable.Cell>
          <DataTable.Cell style={styles.indexCell2}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.valueInput}
                keyboardType="numeric"
                maxLength={5}
                onBlur={(event) => {
                  player.values[index] = event.target.value;
                  console.log("Players före: ", players);
                  setPlayers(players);
                  // setPlayers([...players, player]);
                  console.log("Players efter: ", players);
                }}
              />
            </View>
          </DataTable.Cell>
        </DataTable.Row>
      ))}
      <DataTable.Row>
        <DataTable.Cell style={styles.indexCell}>Sum</DataTable.Cell>
        <DataTable.Cell style={styles.indexCell2}>{player.sum}</DataTable.Cell>
      </DataTable.Row>
    </DataTable>
  ));

  function onPressHandler() {
    const player = {
      name: name,
      values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      sum: 0,
    };
    setPlayers([...players, player]);
    // console.log("onPressHandler players: ", players);
  }

  React.useEffect(() => {
    // console.log('useEffect körs!')
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.input}
            placeholder="Player name"
            onChangeText={(newName) => setName(newName)}
          />
          <Button onPress={onPressHandler} title="Add player" color="#20232a" />
        </View>
      ),
    });
    players.forEach((player) => {
      const strToNum = player.values.map((str) => Number(str));
      const initialValue = 0;
      const sum = strToNum.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        initialValue
      );
      player.sum = sum;
      setPlayers(JSON.parse(JSON.stringify(players)));
      console.log(players);
    });
    console.log("useEffect players: ", players);
  }, [navigation, name]);

  React.useEffect(() => {
    console.log("useEffect körs!");
    players.forEach((player) => {
      const strToNum = player.values.map((str) => Number(str));
      const initialValue = 0;
      const sum = strToNum.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        initialValue
      );
      player.sum = sum;
      setPlayers(JSON.parse(JSON.stringify(players)));
      console.log(players);
    });
    console.log("useEffect players: ", players);
  }, [players.values]);

  return (
    <ImageBackground
      source={backgroundImg}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={["rgba(247, 253, 254, 0.756)", "rgba(242, 255, 255, 0.688)"]}
        style={styles.container}
      >
        <ScrollView>{playerTable}</ScrollView>
        <Button
          color="#20232a"
          title="Go fetch"
          onPress={() => navigation.navigate("Fetch")}
        />
      </LinearGradient>
    </ImageBackground>
  );
}

function FetchScreen({ navigation }) {
  const [dog, setDog] = React.useState(null);
  const [dogCycle, setDogCycle] = React.useState("");
  function fetchData() {
    fetch("https://dog.ceo/api/breeds/image/random")
      .then((response) => response.json())
      .then((result) => {
        setDog(result.message);
      });
  }

  React.useEffect(fetchData, [dogCycle]);

  return (
    <ImageBackground
      source={{ uri: dog }}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={["rgba(247, 253, 254, 0.756)", "rgba(242, 255, 255, 0.688)"]}
        style={styles.container}
      >
        <Button
          color="#282c34"
          title="Fetch another dog"
          onPress={() => {
            if (dogCycle === "cycle") {
              setDogCycle("cycle again");
            } else {
              setDogCycle("cycle");
            }
          }}
        />
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
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
  );
}

function LogoTitle() {
  return <Image style={{ width: 50, height: 50 }} source={logoImg} />;
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "My home",
            headerStyle: {
              backgroundColor: "#20232a",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerTitle: (props) => <LogoTitle {...props} />,
          }}
          style={styles.test}
        />
        <Stack.Screen
          name="Fetch"
          component={FetchScreen}
          options={{
            title: "Go fetch!",
            headerStyle: {
              backgroundColor: "#20232a",
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerTitle: (props) => <LogoTitle {...props} />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  test: {
    borderBottomColor: "red",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
    flex: 1,
  },
  table: {
    margin: 15,
    padding: 15,
    backgroundColor: "rgba(1, 1, 1, 0)",
    width: "90%",
  },
  tableHeaderContainer: {
    backgroundColor: "#DCDCDC",
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  tableHeader: {
    // backgroundColor: "green",
    flex: 1,
    alignItems: "center",
    color: "#fff",
  },
  input: {
    color: "#fff",
    // borderColor: '#fff',
    // borderWidth: 1
  },
  valueInput: {
    // paddingLeft: 35,
    // paddingTop: 15,
    // paddingRight: 70,
    // paddingBottom: 15,
    alignItems: "stretch",
    flex: 1,
    backgroundColor: "red",
    width: 100,
  },
  indexCell: {
    backgroundColor: "green",
    flex: 0.2,
  },
  indexCell2: {
    backgroundColor: "blue",
  },
});

export default App;
