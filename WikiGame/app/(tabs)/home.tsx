import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios"; // library for making HTTP requests
// import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";

const HomePage: React.FC = () => {
  const navigation = useNavigation();
  const [fromRandomTitle, setFromRandomTitle] = useState("");
  const [toRandomTitle, setToRandomTitle] = useState("");
  const [fromDropdownVisible, setFromDropdownVisible] = useState(false);
  const [toDropdownVisible, setToDropdownVisible] = useState(false);
  const [fromSearchQuery, setFromSearchQuery] = useState("");
  const [fromSearchResults, setFromSearchResults] = useState([]);
  const [toSearchQuery, setToSearchQuery] = useState("");
  const [toSearchResults, setToSearchResults] = useState([]);

  const [genericTitles] = useState([
    "Python (programming language)",
    "React (web framework)",
    "Machine learning",
  ]);

  useEffect(() => {
    fetchRandomPage();
  }, []);

  const fetchRandomPage = async () => {
    try {
      const from_response = await axios.get(
        "https://en.wikipedia.org/api/rest_v1/page/random/summary"
      );
      setFromRandomTitle(from_response.data.title);
      const to_response = await axios.get(
        "https://en.wikipedia.org/api/rest_v1/page/random/summary"
      );
      setToRandomTitle(to_response.data.title);
    } catch (error) {
      console.error("Error fetching random page:", error);
    }
  };

  const searchWikipedia = async (query: string, direction: string) => {
    try {
      const response = await axios.get(`https://en.wikipedia.org/w/api.php`, {
        params: {
          action: "query",
          list: "search",
          srsearch: query,
          format: "json",
          origin: "*",
        },
      });
      const results = response.data.query.search.map(
        (result: any) => result.title
      );
      if(direction == "from"){
        setFromSearchResults(results.slice(0, 5)); // Limit to 5 results
      } else {
        setToSearchResults(results.slice(0, 5)); // Limit to 5 results
      }
      
    } catch (error) {
      console.error("Error searching Wikipedia:", error);
    }
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to WikiPagia!</Text>
      <Text style={styles.dropdownText}>From: </Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setFromDropdownVisible(!fromDropdownVisible)}
      >
        <Text style={styles.dropdownText}>{fromRandomTitle}</Text>
        <Text style={styles.dropdownIcon}>{fromDropdownVisible ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      {fromDropdownVisible && (
        <View style={styles.dropdownMenu}>
          {genericTitles.map((title) => (
            <TouchableOpacity key={title} onPress={() => setFromRandomTitle(title)}>
              <Text style={styles.dropdownItem}>{title}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Search for a page"
              value={fromSearchQuery}
              onChangeText={(text) => {
                setFromSearchQuery(text);
                searchWikipedia(text, "from");
              }}
            />
            {fromSearchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setFromSearchQuery("")}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {fromSearchResults.length > 0 && (
            <FlatList
              data={fromSearchResults}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setFromRandomTitle(item)}>
                  <Text style={styles.searchResult}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}
      <Text style={styles.dropdownText}>To: </Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setToDropdownVisible(!toDropdownVisible)}
      >
        <Text style={styles.dropdownText}>{toRandomTitle}</Text>
        <Text style={styles.dropdownIcon}>{toDropdownVisible ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      {toDropdownVisible && (
        <View style={styles.dropdownMenu}>
          {genericTitles.map((title) => (
            <TouchableOpacity key={title} onPress={() => setToRandomTitle(title)}>
              <Text style={styles.dropdownItem}>{title}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Search for a page"
              value={toSearchQuery}
              onChangeText={(text) => {
                setToSearchQuery(text);
                searchWikipedia(text, "to");
              }}
            />
            {toSearchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setToSearchQuery("")}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {toSearchResults.length > 0 && (
            <FlatList
              data={toSearchResults}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setToRandomTitle(item)}>
                  <Text style={styles.searchResult}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        // onPress={() => navigation.navigate('Game', { startPage: randomTitle })}
      >
        <Text style={styles.buttonText}>Play Game</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 18,
    // justifyContent: "left",
  },
  dropdownIcon: {
    marginLeft: 10,
    fontSize: 18,
  },
  dropdownMenu: {
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dropdownItem: {
    paddingVertical: 5,
  },
  //   input: {
  //     borderWidth: 1,
  //     borderColor: "#ccc",
  //     borderRadius: 5,
  //     padding: 10,
  //     // width: '100%',
  //     marginBottom: 10,
  //   },
  input: {
    flex: 1,
    paddingVertical: 10,
  },

  searchResult: {
    paddingVertical: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 10,
  },

  button: {
    padding: 10,
    backgroundColor: "#007aff",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  clearButtonText: {
    fontSize: 18,
    color: "#999",
  },
  clearButton: {
    marginLeft: 10,
  },
});

export default HomePage;
