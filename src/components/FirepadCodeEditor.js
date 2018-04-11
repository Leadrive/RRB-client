import React from 'react';
import { connect, } from 'react-redux';

export class FirepadCodeEditor extends React.Component {
  componentDidMount() {
    const firepadRef = window.firebase.database().ref(`rooms/code/${this.props.roomName}`);
    const codeMirror = window.CodeMirror(document.getElementById('firepad'), { 
      lineWrapping: true,
      lineNumbers: true,
      mode: 'javascript',
    });
    const firepad = window.Firepad.fromCodeMirror(firepadRef, codeMirror, {
      defaultText: 'Hello World',
    });
    firepad.on('ready', () => console.log('ready and working!'));
  }

  render() {
    return (
      <div>
        <div id="firepad"></div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  roomName: state.applicationReducer.roomName,
});

export default connect(mapStateToProps)(FirepadCodeEditor);
