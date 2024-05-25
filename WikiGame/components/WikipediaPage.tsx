import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { WebView, WebViewMessageEvent } from 'react-native-webview';

interface WikipediaPageProps {
  htmlContent: string;
  onLinkPress: (title: string) => void;
}

const Header: React.FC<{ onBackPress: () => void }> = ({ onBackPress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => alert("Settings pressed")}>
        <Text style={styles.link}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => alert("Hints pressed")}>
        <Text style={styles.link}>Hints</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onBackPress}>
        <Text style={styles.link}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const WikipediaPage: React.FC<WikipediaPageProps> = ({
  htmlContent,
  onLinkPress,
}) => {
  const [linkCount, setLinkCount] = useState(0);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
//   const []
//   const extractAPIContents = json => {
//     const { pages } = json.query;
//     return Object.keys(pages).map(id => pages[id].extract);
//   };

//   const getContents = async () => {
//     let resp;
//     let contents = [];
//     setLoading(true);
//     try {
//       resp = await fetch(url);
//       const json = await resp.json();
//       contents = extractAPIContents(json);
//     } catch (err) {
//       setError(err);
//     } finally {
//       setLoading(false);
//     }
//     setContents(contents);
//   };
//   useEffect(() => {
//     getContents();
//   }, []);

  const handleNavigationStateChange = (event: WebViewMessageEvent) => {
    // console.log(navState);
    setLinkCount((prevCount) => prevCount + 1);
    const currentUrl = event.nativeEvent.data;
    // const title = decodeURIComponent(currentUrl.split('/').pop()!);
    console.log(currentUrl);
    // const { data } = event.nativeEvent;
    // const title = decodeURIComponent(data.split('/').pop()!);

    // const title = decodeURIComponent(navState.url.split("/").pop()!);
    // onLinkPress(title);
    return true;

    const url =
    "https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&format=json&exintro=&titles=Berlin";


    // if (navState.url.startsWith("https://en.wikipedia.org/wiki/")) {
    //   return true;
    // }
    // console.log("here");

    // return true;
  };

  // const injectedJavaScript = `
  //     document.querySelectorAll('a').forEach(link => {
  //     link.style.color = 'red';
  //     });
  //     true;
  // `;

  const injectedJavaScript = `
    (function() {
      document.querySelectorAll('a').forEach(link => {
        link.style.color = 'red';
        link.addEventListener('click', function(event) {
          event.preventDefault();
          window.ReactNativeWebView.postMessage(this.href);
        });
      });
    })();
    true;
  `;
// const injectedJavaScript = `
// (function() {
//   document.querySelectorAll('a').forEach(link => {
//     link.style.color = 'red';
//     link.addEventListener('click', function(event) {
//       event.preventDefault();
//       let href = this.href;
//       if (!href.startsWith('http')) {
//         href = new URL(href, window.location.href).href;
//       }
//       window.ReactNativeWebView.postMessage(href);
//     });
//   });
// })();
// true;
// `;

if (loading) return "Loading ...";
if (error) return "An error occurred";

  return (
    <View style={styles.container}>
      <WebView
        // originWhitelist={["*"]}
        // source={{ html: htmlContent }}
        // onNavigationStateChange={handleNavigationStateChange}
        // injectedJavaScript={injectedJavaScript}

        originWhitelist={['*']}
        source={{ html: htmlContent }}
        injectedJavaScript={injectedJavaScript}
        onMessage={handleNavigationStateChange}

      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  link: {
    color: "#007aff",
    fontSize: 18,
  },
  counter: {
    padding: 10,
    fontSize: 16,
  },
});

export default WikipediaPage;
