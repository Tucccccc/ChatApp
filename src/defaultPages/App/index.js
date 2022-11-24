import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { createBrowserHistory } from 'history';
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/core';

import PrivateRoute from '../../PrivateRoute';

import KitchenSinkApp from '../../defaultPages/KitchenSinkApp';
import HomePage from '../../defaultPages/HomePage';
import Register from '../../defaultPages/Register';

import * as actions from '../../store/action';

import {
    CometChatUI,
    CometChatConversationList,
    CometChatConversationListWithMessages,
    CometChatUserList,
    CometChatUserListWithMessages,
    CometChatGroupList,
    CometChatGroupListWithMessages,
    CometChatMessages
} from '../../cometchat-pro-react-ui-kit/CometChatWorkspace/src';

import {
    wrapperStyle
} from "./style";

const history = createBrowserHistory();

class App extends React.Component {
    state = {
        isLoggedin: false
    }

    componentDidMount() {
        this.props.getLoggedinUser();
    }

    render() {

        return (
            <div css={wrapperStyle()}>
                <Router history={history}>
                    <Switch>
                        {/* <PrivateRoute path="/embedded-app" component={CometChatUI} />
                        <PrivateRoute path="/conversations" component={CometChatConversationListWithMessages} />
                        <PrivateRoute path="/groups" component={CometChatGroupListWithMessages} />
                        <PrivateRoute path="/users" component={CometChatUserListWithMessages} />
                        <PrivateRoute path="/conversation-list" component={CometChatConversationList} />
                        <PrivateRoute path="/group-list" component={CometChatGroupList} />
                        <PrivateRoute path="/user-list" component={CometChatUserList} />
                        <PrivateRoute path="/messages" component={CometChatMessages} chatWithGroup="supergroup" />
                        <PrivateRoute exact path="/" component={HomePage} />
                        <Route path="/login" component={KitchenSinkApp} />
                        <Route path="/register" component={Register} /> */}

                        <PrivateRoute path="/embedded-app" component={HomePage} />
                        <PrivateRoute path="/conversations" component={CometChatConversationListWithMessages} />
                        <PrivateRoute path="/groups" component={CometChatGroupListWithMessages} />
                        <PrivateRoute path="/users" component={CometChatUserListWithMessages} />
                        <PrivateRoute path="/conversation-list" component={CometChatConversationList} />
                        <PrivateRoute path="/group-list" component={CometChatGroupList} />
                        <PrivateRoute path="/user-list" component={CometChatUserList} />
                        <PrivateRoute path="/messages" component={CometChatMessages} chatWithGroup="supergroup" />
                        <PrivateRoute exact path="/" component={CometChatUI} />
                        <Route path="/login" component={KitchenSinkApp} />
                        <Route path="/register" component={Register} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getLoggedinUser: () => dispatch(actions.authCheckState())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
