import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  Dimensions
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Speech from "expo-speech";

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from "firebase";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class PostScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme: true,
      isLiked: false,
      likes: this.props.route.params.post.post.likes
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

  fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", snapshot => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === "light" });
      });
  };

  likeAction = () => {
    if(this.state.isLiked) {
      firebase.database()
      .ref("/posts/")
      .child(this.props.route.params.post_id)
      .child("likes")
      .set(firebase.database.ServerValue.increment(-1))
      this.setState({
        likes: this.state.likes -=1,
        isLiked: false
      })
    }
    else {
      firebase.database()
      .ref("/posts/")
      .child(this.props.route.params.post_id)
      .child("likes")
      .set(firebase.database.ServerValue.increment(1))
      this.setState({
        likes: this.state.likes +=1,
        isLiked: true
      })
    }
  }

  render() {
    if (!this.props.route.params) {
      this.props.navigation.navigate("Home");
    } else if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={this.state.light_theme ? styles.containerLight : styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />

          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>

            <View style={styles.appTitleTextContainer}>
              <Text style={this.state.light_theme
                    ? styles.appTitleTextLight
                    : styles.appTitleText}> Spectagram </Text>
            </View>
          </View>

          <View style={styles.postContainer}>
            <ScrollView style={this.state.light_theme
                  ? styles.postCardLight
                  : styles.postCard}>
              <Image
                source={require("../assets/post.jpeg")}
                style={styles.image}
              ></Image>

              <View style={styles.actionContainer}>
                <View style={styles.likeButton}>
                <TouchableOpacity onPress={() => this.likeAction()}>
                    <View style = {this.state.isLiked ? styles.likeButtonLiked : styles.likeButtonDisliked}>
                      <View style = {styles.likeIcon}>
                        <Ionicons 
                          name = {"heart"}
                          size = {30}
                          color = {this.state.light_theme ? "black" : "white"} 
                          style = {{width: 30, marginLeft: 20, marginTop: 5}}
                        />
                      </View>

                      <Text
                        style={
                          this.state.light_theme
                          ? styles.likeTextLight
                          : styles.likeText
                        }>
                        {this.state.likes}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.dataContainer}>
                <View style={styles.captionTextContainer}>
                  <Text style={this.state.light_theme
                        ? styles.postCaptionTextLight
                        : styles.postCaptionText}>
                    {this.props.route.params.post.caption}
                  </Text>

                  <Text style={this.state.light_theme
                        ? styles.postAuthorTextLight
                        : styles.postAuthorText}>
                    {this.props.route.params.post.author}
                  </Text>

                  <Text style={this.state.light_theme
                        ? styles.postAuthorTextLight
                        : styles.postAuthorText}>
                    {this.props.route.params.post.created_on}
                  </Text>
                </View>
              </View>

              <View style={styles.postTextContainer}>
                <Text style={this.state.light_theme
                      ? styles.postTextLight
                      : styles.postText}>
                  {this.props.route.params.post.post}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c"
  },

  containerLight: {
    flex: 1,
    backgroundColor: "white"
  },

  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },

  appTitle: {
    flex: 0.07,
    flexDirection: "row",
    marginLeft: -15
  },

  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },

  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },

  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center",
    marginLeft: -35
  },

  appTitleText: {
    color: "white",
    fontSize: RFValue(17.87),
    fontFamily: "Bubblegum-Sans"
  },

  appTitleTextLight: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },

  postContainer: {
    flex: 1
  },

  postCard: {
    margin: RFValue(20),
    backgroundColor: "#2f345d",
    borderRadius: RFValue(20)
  },

  postCardLight: {
    margin: RFValue(20),
    backgroundColor: "white",
    borderRadius: RFValue(20),
    shadowColor: "rgb(0, 0, 0)",
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2
  },

  image: {
    width: "100%",
    alignSelf: "center",
    height: RFValue(200),
    borderTopLeftRadius: RFValue(20),
    borderTopRightRadius: RFValue(20),
    resizeMode: "contain"
  },

  dataContainer: {
    flexDirection: "row",
    padding: RFValue(20)
  },

  captionTextContainer: {
    flex: 0.8
  },

  postCaptionText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    color: "white"
  },

  postCaptionTextLight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    color: "black"
  },

  postAuthorText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(18),
    color: "white"
  },

  postAuthorTextLight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(18),
    color: "black"
  },

  postTextContainer: {
    padding: RFValue(20)
  },

  postText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(15),
    color: "white"
  },

  postTextLight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(15),
    color: "black"
  },

  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFValue(19)
  },

  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    flexDirection: "row",
    backgroundColor: "#eb3948",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(30)
  },

  likeText: {
    color: "white",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    marginLeft: RFValue(5)
  },

  likeTextLight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    marginLeft: RFValue(5)
  },

  likeButtonLiked: {
    backgroundColor: "#eb3948",
    borderRadius: 30,
    width: 160,
    height: 40,
    flexDirection: "row"
  },

  likeButtonDisliked: {
    backgroundColor: "#eb3948",
    borderRadius: 30,
    borderWidth: 2,
    width: 160,
    height: 40,
    flexDirection: "row"
  }
});
