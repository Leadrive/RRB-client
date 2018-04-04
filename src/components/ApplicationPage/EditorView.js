import React from 'react';
import { connect, } from 'react-redux';
import CodeEditor from './Editors/CodeEditor';
import WordEditor from './Editors/WordEditor';
import WhiteBoardEditor from './Editors/WhiteBoardEditor';
import { setEditorView, } from '../../actions/Editor';
import './EditorView.css';

export function EditorView (props) {

  const editorViewToggle = (
    <div>
      <ul className="nav-bar-ul">
        <li className="editor-mode-text" href="#" onClick={() => props.dispatch(setEditorView('CodeEditor'))}>
            Code View
        </li>
        <li className="editor-mode-text" href="#" onClick={() => props.dispatch(setEditorView('WordEditor'))}>
            Doc View
        </li>
        <li className="editor-mode-text" href="#" onClick={() => props.dispatch(setEditorView('WhiteBoardEditor'))}>
            Whiteboard View
        </li>
      </ul>
    </div>
  );
    // Refactor into switch statement
  if (props.editorMode === 'WordEditor') {
    return (
      <section>
        {editorViewToggle}
        <WordEditor />
      </section>
    );
  }
  else if (props.editorMode === 'WhiteBoardEditor')
    return (
      <section>
        {editorViewToggle}
        <WhiteBoardEditor />
      </section>
    );
  else return (
    <section>
      {editorViewToggle}
      <CodeEditor />
    </section>
  );

}

const mapStateToProps = (state) => {
  return {
    username: state.auth.currentUser.username,
    name: `${state.auth.currentUser.firstName} ${state.auth.currentUser.lastName}`,
    protectedData: state.protectedData.data,
    editorMode: state.applicationReducer.editorMode,
  };
};

export default connect(mapStateToProps)(EditorView);
