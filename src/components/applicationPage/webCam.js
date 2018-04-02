/* eslint-disable */
import React from "react";
import socketIOClient from "socket.io-client";
import adapter from "webrtc-adapter";
import { socket } from "./Room";
import { connect } from 'react-redux';

import * as ApplicationActions from "../../actions/application";

import UsersList from "./UsersList";

import './webCam.css'
export class WebCam extends React.Component {
  constructor(props) {
    super(props);
    this.addedPersonId = '';
  }

  componentWillMount () {
    
    this._init();

  }

  trace(text){
    text = text.trim();
    const now = (window.performance.now() / 1000).toFixed(3);
    console.log(now, text);
  };

  _init() {

//#region Helpers
    /**
     * Helper functions to get this to work
     **/

    const trace = text => {
      text = text.trim();
      const now = (window.performance.now() / 1000).toFixed(3);
      console.log(now, text);
    };

//#endregion
    let answersFrom = {}, offer;

    const peerConnection = window.RTCPeerConnection ||
    window.mozRTCPeerConnection ||
    window.webKitRTCPeerConnection ||
    window.msRTCPeerConnection;

    const sessionDescription = window.RTCSessionDescription ||
    window.mozRTCSessionDescription ||
    window.webkitRTCSessionDescription ||
    window.msRTCSessionDescription

    navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUSerMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetuserMedia;

    const pc = new peerConnection({'iceServers': [{url: 'stun:stun1.l.google.com:19302'}]});

    pc.onaddstream = (obj) =>{
      trace('added a stream'); 
      const vid = document.createElement('video');
      vid.setAttribute('class', 'video-small');
      vid.setAttribute('autoplay', 'autoplay');
      vid.setAttribute('id', `video-${this.addedPersonId}`);
      if (this.addedPersonId) 
        vid.setAttribute("key", `${this.addedPersonId}`);
      
      document.getElementById('video-box').appendChild(vid);
      vid.src = window.URL.createObjectURL(obj.stream);
    }

    navigator.getUserMedia({video: true}, (stream) => {
      trace('get webcam FROM INIT')
      const videoBox = document.getElementById('video-box');
      const video = document.querySelector('video');
      video.src = window.URL.createObjectURL(stream);
      videoBox.appendChild(video);
      video.load();
      pc.addStream(stream);
    }, error);

    function error(err){
      trace('some shit happened');
      console.error('Error', err);
    }

    const createOffer = (id) =>{
      trace('creating an offer')
      pc.createOffer((offer) => {
        pc.setLocalDescription(new sessionDescription(offer), () => {
          trace('making an offer locally')
          socket.emit('make-offer', {
            offer: offer,
            to: id,
            room: this.props.roomName
          })
        }, error);
      }, error);
    }

    socket.on('answer-made', (data) => {
      console.log(data);
      trace('an answer was made FROM INIT');

      console.log('setting addedPersonId?');
      this.addedPersonId = data.socket;
      
      pc.setRemoteDescription(new sessionDescription(data.answer), () => {
        document.getElementById(data.socket).setAttribute('class', 'active');
        if(!answersFrom[data.socket]){
          createOffer(data.socket);
          answersFrom[data.socket] = true;
        }
      }, error);
    });

    socket.on('offer-made', (data) => {
      trace('an offer was made FROM INIT')
      offer = data.offer;

      pc.setRemoteDescription(new sessionDescription(data.offer), () =>{
        pc.createAnswer((answer) => {
          pc.setLocalDescription(new sessionDescription(answer), () =>{
            trace('making an answer')
            socket.emit("make-answer", {
              answer: answer,
              to: data.socket,
              room: this.props.roomName,
              user: this.props.username
            });
          }, error)
        }, error);
      }, error);
    });

    socket.emit('add-users',{
      room: this.props.roomName, 
      user: this.props.username
    }, trace('announcing a user FROM INIT'))

    socket.on('add-users', (data) =>{
      this.props.dispatch(ApplicationActions.setUserList(data.users));
    });

    socket.on("remove-user", id => {
      trace("removing a user FROM WILLUNMOUNT");
      this.props.dispatch(ApplicationActions.deleteUserFromList(id));

      let video = document.getElementById(`video-${id}`);
      if (video) document.getElementById("video-box").removeChild(video);
    });

}

  render() {
    console.log('I rendered again!')
    return (
      <div className="webCam-container">
      <div className="video-box" id="video-box">
        <video className="video-large" id="webCam-localVideo" autoPlay></video>
      </div>
      <div className="users-container" id="users-container">
        <h4>Room: {this.props.roomName}</h4>
        <UsersList />
      </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  username: state.auth.currentUser.username,
  roomName: state.applicationReducer.roomName,
});

export default connect(mapStateToProps)(WebCam);
