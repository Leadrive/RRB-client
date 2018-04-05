import React from 'react';
import { connect, } from 'react-redux';

export function UsersList(props) {
  const { userList, createOffer, } = props;
  const list = userList
    .filter(user =>
      user.user !== props.username
    )
    .map(user =>
      <li onClick={() => createOffer(user.id)} key={user.id}> Share your screen with {user.user} </li>
    );
  console.log(list);

  return (<ul>{list}</ul>);
}

const mapStateToProps = (state) => {
  return {
    username: state.auth.currentUser.username,
    name: `${state.auth.currentUser.firstName} ${state.auth.currentUser.lastName}`,
    userList: state.applicationReducer.listOfUsers,
  };
};

export default connect(mapStateToProps)(UsersList);
