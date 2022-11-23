import React, { useState, useContext } from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { CometChat } from "@cometchat-pro/chat";

import { Link, Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../store/action";
import Context from "../../context"
import { auth, db, storage, createUserWithEmailAndPassword } from "../../firebase";
import { COMETCHAT_CONSTANTS } from '../../consts';

const appID = "225224d025f5be33";
const region = "us";
const appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build();

CometChat.init(appID, appSetting).then(
    () => {
        console.log("Initialization completed successfully");
        // You can now call login function.
    },
    error => {
        console.log("Initialization failed with error:", error);
        // Check the reason for error and take appropriate action.
    }
);

const generateAvatar = () => {
    // hardcode list of user's avatars for the demo purpose.
    const avatars = [
        'https://data-us.cometchat.io/assets/images/avatars/captainamerica.png',
        'https://data-us.cometchat.io/assets/images/avatars/cyclops.png',
        'https://data-us.cometchat.io/assets/images/avatars/ironman.png',
        'https://data-us.cometchat.io/assets/images/avatars/spiderman.png',
        'https://data-us.cometchat.io/assets/images/avatars/wolverine.png'
    ];
    const avatarPosition = Math.floor(Math.random() * avatars.length);
    return avatars[avatarPosition];
}

const handleRegister = async (e) => {
    // const { cometChat } = useContext(Context);
    e.preventDefault();

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    // generate user's avatar.
    const userAvatar = generateAvatar();
    // call firebase to to register a new account.
    // createUserWithEmailAndPassword(auth, email, password).then((userCrendentials) => {
    //   if (userCrendentials) {
    //     const firebaseUid = userCrendentials._tokenResponse.localId;
    //     // cometchat auth key
    //     // const authKey = `${COMETCHAT_CONSTANTS.AUTH_KEY}`;
    //     const authKey = '53fd76a0831f56595117d4d71645a6c451e13bba';
    //     // call cometchat service to register a new account.
    //     const user = new CometChat.User("idtest1");
    //     user.setName(displayName);
    //     user.setAvatar(userAvatar);

    //     CometChat.createUser(user, authKey).then(
    //       user => {
    //         // showMessage('Info', `${userCrendentials.user.email} was created successfully! Please sign in with your created account`);
    //         // setIsLoading(false);
    //         console.log("user created", user);
    //       }, error => {
    //         console.log(error);
    //         // setIsLoading(false);
    //       }
    //     )
    //   }
    // }).catch((error) => {
    //   console.log(error);
    // //   setIsLoading(false);
    // //   showMessage('Error', 'Fail to create you account. Your account might be existed.');
    // });

    createUserWithEmailAndPassword(auth, email, password).then((userCrendentials) => {
        const firebaseUid = userCrendentials._tokenResponse.localId;
        const appID = "225224d025f5be33";
        const region = "us";
        const appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build();
        const history = useHistory();
        CometChat.init(appID, appSetting).then(
            () => {
                console.log("Initialization completed successfully");
                // You can now call login function.
                const authKey = '53fd76a0831f56595117d4d71645a6c451e13bba';
                // call cometchat service to register a new account.
                var user = new CometChat.User(firebaseUid);
                user.setName(displayName);
                user.setAvatar(userAvatar);

                CometChat.createUser(user, authKey).then(
                    user => {
                        // showMessage('Info', `${userCrendentials.user.email} was created successfully! Please sign in with your created account`);
                        // setIsLoading(false);
                        console.log("user created", user);
                        CometChat.login(firebaseUid, authKey).then(
                            user => {
                                console.log("Login Successful:", { user });
                                //   <Redirect to="/" />
                                this.props.history.push('/')
                            }, error => {
                              console.log("Login failed with exception:", { error });
                            }
                        );
                    }, error => {
                        console.log(error);
                        // setIsLoading(false);
                    }
                )
            },
            error => {
                console.log("Initialization failed with error:", error);
                // Check the reason for error and take appropriate action.
            }
        );
    }).catch((error) => {
        console.log(error);
        //   setIsLoading(false);
        //   showMessage('Error', 'Fail to create you account. Your account might be existed.');
    });

    //   const firebaseUid = userCrendentials._tokenResponse.localId;
    // cometchat auth key
    // const authKey = `${COMETCHAT_CONSTANTS.AUTH_KEY}`;
};


class Register extends React.Component {
    constructor(props) {
        super(props);
    
        this.myRef = React.createRef();
      }
    
      login = (uid) => {
        
        if(!uid) {
          uid = this.myRef.current.value;
        }
    
        this.uid = uid;
        this.props.onLogin(this.uid, COMETCHAT_CONSTANTS.AUTH_KEY);
      }

    render() {
        return (
            <div>
                <form onSubmit={handleRegister}>
                    <input required type="text" placeholder="display name" />
                    <input required type="email" placeholder="email" />
                    <input required type="password" placeholder="password" />
                    {/* <input required style={{ display: "none" }} type="file" id="file" /> */}
                    {/* <label htmlFor="file">
                        <img src={Add} alt="" />
                        <span>Add an avatar</span>
                    </label> */}
                    <button disabled="" >Sign up</button>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.loading,
        error: state.error,
        isLoggedIn: state.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
