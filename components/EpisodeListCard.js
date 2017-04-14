import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { actionCreators as mainActions } from '../actions';
import { actionCreators as swipeActions } from '../actions/Swipe';
import Swipeable from 'react-native-swipeable';

const mapStateToProps = (state) => ({
  inbox: state.main.inbox,
  leftToggle: state.swipe.isLeftToggled,
  rightActionActivated: state.swipe.isRightActionActivated,
  rightToggle: state.swipe.isRightToggled
});

hmsToSecondsOnly = (duration) => {
    var p = duration.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }
    return s;
}

class EpisodeListCard extends Component {

  state = {
    leftActionActivated: false,
    leftToggle: false,
  };

  renderClock = (duration) => {
    if (duration.length < 5) {
      duration = '00:' + duration;
    }
    duration = hmsToSecondsOnly(duration);
    if (duration <= 300) {
      return <Image source={require('../assets/clockIcons/clock5.png')} style={styles.clock} />
    }
    if (duration <= 900) {
      return <Image source={require('../assets/clockIcons/clock15.png')} style={styles.clock} />
    }
    if (duration <= 1800) {
      return <Image source={require('../assets/clockIcons/clock30.png')} style={styles.clock} />
    }
    if (duration <= 2700) {
      return <Image source={require('../assets/clockIcons/clock45.png')} style={styles.clock} />
    }
    if (duration > 2700) {
      return <Image source={require('../assets/clockIcons/clock60.png')} style={styles.clock} />
    }
  };

  toggleLike= (id) => {
    var inbox = this.props.inbox.slice();
    inbox[id].liked = !inbox[id].liked;
    this.props.dispatch(mainActions.toggleLike(inbox));
  };

  toggleBookmark = (id) => {
    var inbox = this.props.inbox.slice();
    inbox[id].bookmark = !inbox[id].bookmark;
    this.props.dispatch(mainActions.toggleBookmark(inbox));
  };

  render() {
    const {leftActionActivated} = this.state;
    const {leftToggle, rightActionActivated, rightToggle} = this.props;
    return (
      <Swipeable
        leftActionActivationDistance={200}
        leftContent={(
          <View style={[styles.leftSwipeItem, {backgroundColor: '#42f4c5'}]}>
            {leftActionActivated ?
              <Text>Toggle Playlist Selection Modal</Text> :
              <Text>Add to Playlist</Text>}
          </View>
        )}
        rightActionActivationDistance={200}
        rightContent={(
          <View style={[styles.rightSwipeItem, {backgroundColor: rightActionActivated ? '#42f4c5' : 'rgb(221, 95, 95)'}]}>
            {rightActionActivated ?
              <Text>Removed!</Text> :
              <Text>Remove Episode</Text>}
          </View>
        )}
        onLeftActionActivate={() => this.setState({leftActionActivated: true})}
        onLeftActionDeactivate={() => this.setState({leftActionActivated: false})}
        onLeftActionComplete={() => this.props.dispatch(swipeActions.updateLeftToggle(!leftToggle))}

        onRightActionActivate={() => this.props.dispatch(swipeActions.updateRightActivation(true))}
        onRightActionDeactivate={() => this.props.dispatch(swipeActions.updateRightActivation(false))}
        onRightActionComplete={() => this.props.dispatch(swipeActions.updateRightToggle(!rightToggle))}
      >
      <View style={styles.mainView}>
        <View style={styles.topView}>
          <View style={styles.leftView}>
            <TouchableOpacity onPress={this.props.handlePlay.bind(this, this.props.episode)}>
              <Image source={{uri: this.props.episode.image}} style={styles.image}/>
            </TouchableOpacity>
          </View>
          <View style={styles.rightView}>
            <Text style={styles.date}>{this.props.episode.feed.pubDate.substring(0,16)}</Text>
            <Text style={styles.episode} numberOfLines={1}>{this.props.episode.feed.title}</Text>
            <Text style={styles.subtitle} numberOfLines={2}>{this.props.episode.feed.subtitle}</Text>
          </View>
        </View>
        <View style={styles.bottomView}>
          <Text style={styles.tag} numberOfLines={1} ellipsizeMode='tail'> {this.props.episode.tag} </Text>
          <View style={styles.timeView}>
            {this.renderClock(this.props.episode.feed.duration)}
            <Text style={styles.time}>{this.props.episode.feed.duration}</Text>
          </View>
          {this.props.episode.bookmark === true ?
          <Ionicons style={styles.favorite} size={25} color='grey' name="ios-bookmark" onPress={()=>(this.toggleBookmark(this.props.id))}/> :
          <Ionicons style={styles.favorite} size={25} color='grey' name="ios-bookmark-outline" onPress={() =>(this.toggleBookmark(this.props.id))}/>
          }
          {this.props.episode.liked === true ?
          <Ionicons style={styles.favorite} size={25} color='grey' name="ios-heart" onPress={() =>(this.toggleLike(this.props.id))}/> :
          <Ionicons style={styles.favorite} size={25} color='grey' name="ios-heart-outline" onPress={() =>(this.toggleLike(this.props.id))}/>
          }
        </View>
      </View>
    </Swipeable>
    );
  }

}

const styles = StyleSheet.create({
  topView: {
    justifyContent: 'space-between',
    height: 80,
    alignItems: 'center',
    flexDirection: 'row',
    flex: .75,
    marginBottom: 8,
    marginTop: 10,
    paddingRight: 5,
  },
  leftView: {
    flex: .25,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  rightView: {
    paddingLeft: 3,
    flex: .75,
    justifyContent: 'space-around',
    alignItems: 'stretch',
    height: 80,
  },
  bottomView: {
    flex: .25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    paddingLeft: 5,
    paddingRight: 8,
  },
  mainView: {
    height: 140,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'lightgrey',
    borderTopWidth: 2,
    borderTopColor: 'lightgrey',
  },
  image: {
    height: 80,
    width: 80,
  },
  episode: {
    fontWeight: "500",
    fontSize: 16,
  },
  subtitle: {
  fontWeight: "400",
  fontSize: 12,
  },
  podcast: {
    fontWeight: "600",
    fontSize: 16,
  },
  tag: {
    backgroundColor: '#42f4c5',
    alignSelf: 'center',
    padding: 2,
    // width: '30%',
    width: 80,
    marginLeft: 1,
    fontSize: 12,
    textAlign: 'center',
  },
  date: {
    fontWeight: "400",
    fontSize: 12,
  },
  time: {
    fontWeight: "400",
    fontSize: 14,
    marginRight: 5,
    color: 'grey',
  },
  favorite: {
    alignSelf: 'center',
  },
  bookmark: {
    alignSelf: 'center',
  },
  clock: {
    marginRight: 7,
    height: 21,
    width: 21,
  },
  timeView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftSwipeItem: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20
  },
});

export default connect(mapStateToProps)(EpisodeListCard);
