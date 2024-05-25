import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";

import WikipediaPage from "@/components/WikipediaPage";
// import { WebView, WebViewMessageEvent } from 'react-native-webview';

const MainScreen: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("Start_Page");
  const [targetPage] = useState("Target_Page");
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [linkCount, setLinkCount] = useState(0);
  const [currentURL, setCurrentURL] = useState(
    "https://en.m.wikipedia.org/wiki/Ubuntu_Kylin"
  );
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
        <TouchableOpacity onPress={() => alert("Hints pressed")}>
          <Text style={styles.link}>Hints</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBackPress}>
          <Text style={styles.link}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  };

  //   const injectedJavaScript = `
  //     (function() {
  //       document.querySelectorAll('a').forEach(link => {
  //         link.style.color = 'red';
  //         link.addEventListener('click', function(event) {
  //           event.preventDefault();
  //           window.ReactNativeWebView.postMessage(this.href);
  //         });
  //       });
  //     })();
  //     true;
  //   `;
  //   const currentURL = window.location.href; // Get the current page URL
  console.log("currentURL");

  console.log(currentURL);
  const ignore_list = ["https://en.m.wikipedia.org/wiki/Main_Page"];
  const injectedJavaScript = `
  
document.querySelectorAll('a').forEach(link => {
  if (!(link.href.startsWith('https://en.m.wikipedia.org/wiki/')) || (link.href.startsWith('https://en.m.wikipedia.org/wiki/File:'))
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
        link.style.backgroundColor = 'pink';
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
// document.querySelectorAll("
//   a:([href^='https://en.m.wikipedia.org/wiki/']),
//   a:([href^='https://en.m.wikipedia.org/wiki/File:']),
//   a:([href$='#p-lang']),
//   a:([href^='https://en.m.wikipedia.org/wiki/Talk:']),
//   a:([href^='https://en.m.wikipedia.org/wiki/Portal:']),
//   a:([href^='https://en.m.wikipedia.org/wiki/Wikipedia:']),
//   a:([href^='${currentURL}']),
//   a[href^='${currentURL}']:not([href^='${currentURL}#cite_note'])
// ").forEach(link => {
//     link.style.pointerEvents = 'none';
//     link.addEventListener('click', event => {
//       event.preventDefault();
//       event.stopPropagation();
//     });
// });

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
  true;
`;

  const handleWebViewMessage = (event: any) => {
    const url = event.nativeEvent.data;
    console.log(url);
    if (url) {
      setCurrentURL(url);
      setLinkCount(linkCount + 1);
      console.log(url);
      // console.log(url.slice(0, 32));
      if (url.slice(0, 32) == "https://en.m.wikipedia.org/wiki/") {
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

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={() => alert("Back pressed")} />
      <Text style={styles.counter}>Links clicked: {linkCount}</Text>
      <WebView
        ref={webViewRef}
        source={{ uri: "https://en.m.wikipedia.org/wiki/Ubuntu_Kylin" }} // https://en.wikipedia.org/wiki/Special:Random
        injectedJavaScript={injectedJavaScript}
        onMessage={handleWebViewMessage}
        javaScriptEnabled
      />
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

      {currentPage === targetPage && (
        <View style={styles.congrats}>
          <Text style={styles.congratsText}>
            Congratulations! You reached the target page.
          </Text>
        </View>
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
});

export default MainScreen;
