import React from 'react';
import { Link } from "react-router-dom";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { CometChat } from "@cometchat-pro/chat";
import { Global } from "@emotion/core";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth, db, storage, signInWithEmailAndPassword } from "../../firebase";

import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { CometChatAvatar } from '../../cometchat-pro-react-ui-kit/CometChatWorkspace/src';
import { COMETCHAT_CONSTANTS } from '../../consts';

import {
  wrapperStyle,
  errorStyle,
  titleStyle,
  subtitleStyle,
  userContainerStyle,
  userWrapperStyle,
  thumbnailWrapperStyle,
  uidWrapperStyle,
  inputWrapperStyle,
  loginBtn,
} from "./style";

import { loaderStyle } from "./loader";

import * as actions from '../../store/action';

class KitchenSinkApp extends React.PureComponent {

  constructor(props) {
    super(props);

    this.myRef = React.createRef();
  }

  login = (uid) => {

    if (!uid) {
      uid = this.myRef.current.value;
    }

    this.uid = uid;
    this.props.onLogin(this.uid, COMETCHAT_CONSTANTS.AUTH_KEY);
  }

  render() {

    let loader = null;
    if (this.props.loading) {
      loader = (<div className="loading">Loading...</div>);
    }

    let errorMessage = null;
    if (this.props.error) {
      errorMessage = (<p css={errorStyle()}>{this.props.error.message}</p>);
    }

    let authRedirect = null;
    if (this.props.isLoggedIn) {
      authRedirect = <Redirect to="/" />
    }

    const handleLogin = async (e) => {
      e.preventDefault();
      const email = e.target[0].value;
      const password = e.target[1].value;

      const authKey = '53fd76a0831f56595117d4d71645a6c451e13bba';
      signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const firebaseUid = userCredential.user.uid;
        CometChat.login(firebaseUid, authKey).then(
          user => {
            this.login(firebaseUid)
          },
          error => {
            console.log("Error")
          }
        )
      }).catch((error) => {
        alert(`Your user's name or password is not correct`);
      })
    }

    return (
      <React.Fragment>
        <Global styles={loaderStyle} />
        <div css={wrapperStyle()}>
          {authRedirect}
          {loader}
          {errorMessage}
          <p css={titleStyle()}>Do Chat App</p>
          {/* <p css={subtitleStyle()}>Login with one of our sample users</p>
          <div css={userContainerStyle()}>
            <div css={userWrapperStyle()} onClick={()=>this.login('superhero1')}>
              <div css={thumbnailWrapperStyle()}>
                <CometChatAvatar image='https://data-us.cometchat.io/assets/images/avatars/ironman.png' />
              </div>
              <p>superhero1</p>
            </div>
            <div css={userWrapperStyle()} onClick={()=>this.login('superhero2')}>
              <div css={thumbnailWrapperStyle()}>
                <CometChatAvatar image='https://data-us.cometchat.io/assets/images/avatars/captainamerica.png' />
              </div>
              <p>superhero2</p>
            </div>
            <div css={userWrapperStyle()} onClick={()=>this.login('superhero3')}>
              <div css={thumbnailWrapperStyle()}>
                <CometChatAvatar image='https://data-us.cometchat.io/assets/images/avatars/spiderman.png' />
              </div>
              <p>superhero3</p>
            </div>
            <div css={userWrapperStyle()} onClick={()=>this.login('superhero4')}>
              <div css={thumbnailWrapperStyle()}>
                <CometChatAvatar image='https://data-us.cometchat.io/assets/images/avatars/wolverine.png' />
              </div>
              <p>superhero4</p>
            </div>
            <div css={userWrapperStyle()} onClick={()=>this.login('superhero5')}>
              <div css={thumbnailWrapperStyle()}>
                <CometChatAvatar image='https://data-us.cometchat.io/assets/images/avatars/cyclops.png' />
              </div>
              <p>superhero5</p>
            </div>
          </div><br/> */}
          {/* <div css={uidWrapperStyle()}>
            <div>
              <p css={subtitleStyle()}>Login with UID</p>
            </div>
            <div css={inputWrapperStyle()}>
              <input ref={this.myRef} type="text" placeholder="Enter your UID here" />
            </div>
            <div css={loginBtn()}><button type="button" onClick={() => this.login()}>Login</button></div>
          </div> */}

          <div>
            <form onSubmit={handleLogin}>
              <label>Email: <input required type="email" placeholder="Email" style={{ outline: "none", margin: "10px 56px", padding: "8px 10px", borderRadius: "5px", border: "1px solid #bbb" }} /> </label>
              <br></br>
              <label>Password: <input required type="password" placeholder="Password" style={{ outline: "none", margin: "10px 30px", padding: "8px 10px", borderRadius: "5px", border: "1px solid #bbb", }} /> </label>
              {/* <input required style={{ display: "none" }} type="file" id="file" /> */}
              {/* <label htmlFor="file">
                        <img src={Add} alt="" />
                        <span>Add an avatar</span>
                    </label> */}
              <br></br>
              <button disabled="" style={{ outline: "none", backgroundColor: "#333", borderRadius: "10px", color: "white", padding: "10px 25px", marginLeft: "100px" }}>Login</button>
            </form>
          </div>
          <p>You don't have an account? <Link style={{ color: '#3E9BEC', backgroundColor: 'white' }} to="/register">Register</Link></p>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.loading,
    error: state.error,
    isLoggedIn: state.isLoggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (uid, authKey) => dispatch(actions.auth(uid, authKey))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KitchenSinkApp);
