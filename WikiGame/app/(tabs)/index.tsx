// TODO: Add in timer for leaderboard, add in ability to change highlight colour and text color
// Add in ML to find shortest path to final page
// Add in hints functionality
// Add in homepage w/ choices for random start and end or pick via search or common ones (search box at top and common underneath?)

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { WebView } from "react-native-webview";

import WikipediaPage from "@/components/WikipediaPage";
// import { WebView, WebViewMessageEvent } from 'react-native-webview';

const GameScreen: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("Start_Page");
  const [targetPage] = useState("Target_Page");
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [linkCount, setLinkCount] = useState(0);
  const [startURL, setStartURL] = useState(
    "https://en.m.wikipedia.org/wiki/Ubuntu_Kylin"
  );
  const [currentURL, setCurrentURL] = useState(startURL);

  const [targetURL, setTargetURL] = useState(
    "https://en.m.wikipedia.org/wiki/Pinyin"
  );
  const [highlightColor, setHighlightColor] = useState("pink");
  const [textColor, setTextColor] = useState("black");
  const [timer, setTimer] = useState(0);
  const [hint, setHint] = useState("");

  //   if(link.href.startsWith("${currentURL}"){
  //     window.ReactNativeWebView.postMessage(false);
  // }

  const fetchAndUpdatePage = (title: string) => {
    setLoading(true);
    console.error(title);
    setLinkCount((prevCount) => prevCount + 1);
    fetch(`https://en.wikipedia.org/api/rest_v1/page/html/${title}`)
      .then((response) => response.text())
      .then((html) => {
        setHtmlContent(html);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching page:", error);
        setLoading(false);
      });
    setCurrentPage(title);
  };
  const Header: React.FC<{ onBackPress: () => void }> = ({ onBackPress }) => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => alert("Settings pressed")}>
          <Text style={styles.link}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setHint("Try looking at the sidebar links.")}
        >
          <Text style={styles.link}>Hints</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBackPress}>
          <Text style={styles.link}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // console.log("currentURL");
  // console.log(currentURL);
  const ignore_list = ["https://en.m.wikipedia.org/wiki/Main_Page"];
  const injectedJavaScript = `
  
document.querySelectorAll('a').forEach(link => {
  if (!(link.href.startsWith('https://en.m.wikipedia.org/wiki/')) || (link.href.startsWith('https://en.m.wikipedia.org/wiki/File:'))
    || (link.href.startsWith('https://en.m.wikipedia.org/wiki/Special:')) || (link.href.startsWith('https://en.m.wikipedia.org/wiki/Help:'))
    || (link.href.endsWith("#p-lang")) || (link.href.startsWith('https://en.m.wikipedia.org/wiki/Talk:'))
    || (link.href.startsWith("https://en.m.wikipedia.org/wiki/Portal:")) || (link.href.startsWith("https://en.m.wikipedia.org/wiki/Wikipedia:"))
    || ((link.href.startsWith("${currentURL}")) && !(link.href.startsWith('${currentURL}#cite_note')))

) {
    link.style.color = 'black';
    link.style.textDecoration = 'none';
    link.style.pointerEvents = 'none'; // Disable pointer events initially
    link.style.cursor = 'default';
    link.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        window.ReactNativeWebView.postMessage(false);
    });
  } else {
    if(link.href.startsWith('${currentURL}#cite_note')){
        link.style.color = 'black';
    } else {
        link.style.backgroundColor = '${highlightColor}';
    }

    link.addEventListener('click', event => {
      event.preventDefault();
      if(link.href.startsWith('${currentURL}#cite_note')){
        window.ReactNativeWebView.postMessage(false);
      } else {
        window.ReactNativeWebView.postMessage(link.href);
      }

    });
  }

});

document.querySelectorAll('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".gif"]').forEach(link => {
    link.style.pointerEvents = 'none';
    link.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
    });
  });
  
  document.querySelectorAll('img[src$=".jpg"], img[src$=".jpeg"], img[src$=".png"], img[src$=".gif"]').forEach(img => {
    img.style.pointerEvents = 'none';
  });
      document.getElementById('p-associated-pages').style.display='none';
    document.getElementsByClassName('page-actions-menu')[0].style.display='none';
    document.getElementsByClassName('header-container')[0].style.display='none';
    document.getElementsById('content-collapsible-block-8')[1].style.display='none';
    document.getElementsByClassName('header-container')[0].style.display='none';    
    true;
`;

  const handleWebViewMessage = (event: any) => {
    const url = event.nativeEvent.data;
    if (url) {
      console.log(url);
      if (url.slice(0, 32) == "https://en.m.wikipedia.org/wiki/") {
        setCurrentURL(url);
        setLinkCount(linkCount + 1);
        webViewRef.current?.injectJavaScript(`
        window.location.href = '${url}';
      `);
      } else {
        return false;
      }
    }

    // return false;
  };

  //   useEffect(() => {
  //     fetchAndUpdatePage(currentPage);
  //     console.log("here");
  //   }, [currentPage]);

  let webViewRef = React.createRef<WebView>();
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={() => alert("Back pressed")} />
      <Text style={styles.counter}>Links clicked: {linkCount}</Text>
      <Text style={styles.timer}>Time: {timer} seconds</Text>
      <Text style={styles.hint}>Hint: {hint}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter highlight color"
        onChangeText={setHighlightColor}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter text color"
        onChangeText={setTextColor}
      />
      <WebView
        ref={webViewRef}
        source={{ uri: startURL }} // https://en.wikipedia.org/wiki/Special:Random
        injectedJavaScript={injectedJavaScript}
        onMessage={handleWebViewMessage}
        javaScriptEnabled
      />
      {currentURL === targetURL && (
        <View style={styles.congrats}>
          <Text style={styles.congratsText}>
            Congratulations! You reached the target page.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );

  return (
    <View style={styles.container}>
      <Header onBackPress={() => alert("Back pressed")} />
      <Text style={styles.counter}>Links clicked: {linkCount}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <WikipediaPage
          htmlContent={htmlContent}
          onLinkPress={fetchAndUpdatePage}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  congrats: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0, 255, 0, 0.5)",
    padding: 10,
    alignItems: "center",
  },
  congratsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
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
  timer: {
    padding: 10,
    fontSize: 16,
  },
  input: {
    padding: 10,
    fontSize: 16,
  },
  hint: {
    padding: 10,
    fontSize: 16,
  },
});

export default GameScreen;
