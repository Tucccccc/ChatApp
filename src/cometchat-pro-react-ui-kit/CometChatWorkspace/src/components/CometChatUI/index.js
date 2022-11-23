import React from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/core";
import PropTypes from "prop-types";
import { CometChat } from "@cometchat-pro/chat";

import { CometChatNavBar } from "./CometChatNavBar";
import { CometChatMessages } from "../Messages";
import { CometChatIncomingCall, CometChatIncomingDirectCall } from "../Calls";

import { connect } from "react-redux";
import { Link, Redirect, useHistory } from "react-router-dom";
import * as actions from "../../../../../store/action";

import { CometChatContextProvider } from "../../util/CometChatContext";
import * as enums from "../../util/enums.js";
import { theme } from "../../resources/theme";
import Translator from "../../resources/localization/translator";
import { withRouter } from "react-router-dom";

import {
	unifiedStyle,
	unifiedSidebarStyle,
	unifiedMainStyle,
} from "./style";
import HomePage from "../../../../../defaultPages/HomePage";

class CometChatUI extends React.Component {

	loggedInUser = null;

	constructor(props) {

		super(props);
		this.state = {
			sidebarview: false,
		}

		this.navBarRef = React.createRef();
		this.contextProviderRef = React.createRef();
	}

	componentDidMount() {

		if (this.props.chatWithUser.length === 0 && this.props.chatWithGroup.length === 0) {
			this.toggleSideBar();
		}
	}

	navBarAction = (action, type, item) => {

		switch (action) {
			case enums.ACTIONS["ITEM_CLICKED"]:
				this.itemClicked(item, type);
				break;
			case enums.ACTIONS["TOGGLE_SIDEBAR"]:
				this.toggleSideBar();
				break;
			default:
				break;
		}
	}

	itemClicked = (item, type) => {

		this.contextProviderRef.setTypeAndItem(type, item);
		this.toggleSideBar()
	}

	actionHandler = (action, item, count, ...otherProps) => {

		switch (action) {
			case enums.ACTIONS["TOGGLE_SIDEBAR"]:
				this.toggleSideBar();
				break;
			case enums.GROUP_MEMBER_SCOPE_CHANGED:
			case enums.GROUP_MEMBER_KICKED:
			case enums.GROUP_MEMBER_BANNED:
				this.groupUpdated(action, item, count, ...otherProps);
				break;
			default:
				break;
		}
	}

	toggleSideBar = () => {

		const sidebarview = this.state.sidebarview;
		this.setState({ sidebarview: !sidebarview });
	}

	/**
	 If the logged in user is banned, kicked or scope changed, update the chat window accordingly
	 */
	groupUpdated = (key, message, group, options) => {

		switch (key) {
			case enums.GROUP_MEMBER_BANNED:
			case enums.GROUP_MEMBER_KICKED: {

				if (this.contextProviderRef.state.type === CometChat.ACTION_TYPE.TYPE_GROUP
					&& this.contextProviderRef.state.item.guid === group.guid
					&& options.user.uid === this.loggedInUser.uid) {

					this.contextProviderRef.setItem({});
					this.contextProviderRef.setType("");
				}
				break;
			}
			case enums.GROUP_MEMBER_SCOPE_CHANGED: {

				if (this.contextProviderRef.state.type === CometChat.ACTION_TYPE.TYPE_GROUP
					&& this.contextProviderRef.state.item.guid === group.guid
					&& options.user.uid === this.loggedInUser.uid) {

					const newObject = Object.assign({}, this.contextProviderRef.state.item, { "scope": options["scope"] })
					this.contextProviderRef.setItem(newObject);
					this.contextProviderRef.setType(CometChat.ACTION_TYPE.TYPE_GROUP);
				}
				break;
			}
			default:
				break;
		}
	}

	// routingFunction = (param) => {
    //     this.props.history.push({
    //         pathname: `/login`,
    //         state: param
    //     });
    // }
	

	render() {

		let messageScreen = (
			<CometChatMessages
				theme={this.props.theme}
				lang={this.props.lang}
				_parent="unified"
				actionGenerated={this.actionHandler} />
		);

		const accountLogout = () => {
			// const history = useHistory();
		
			// let authRedirect = null;
			CometChat.logout().then(
				() => {
				  console.log("Logout completed successfully");
				  window.location.reload();
				//   routingFunction("")
		
				},error=>{
				  console.log("Logout failed with exception:",{error});
				}
			);
		  }

		// let authRedirect = null;
		// if (!this.props.isLoggedIn) {
		// 	authRedirect = <Redirect to="/login" />;
		// }

		return (
			<CometChatContextProvider ref={el => this.contextProviderRef = el} user={this.props.chatWithUser} group={this.props.chatWithGroup} language={this.props.lang}>
				<div css={unifiedStyle(this.props)} className="cometchat cometchat--unified" dir={Translator.getDirection(this.props.lang)}>
					<div css={unifiedSidebarStyle(this.state, this.props)} className="unified__sidebar">
						{/* Logout Button */}
						<div style={{ margin: "16px auto 0px 100px" }}>
							<button style={{ backgroundColor: "#333", borderRadius: "10px", color: "white", padding: "8px 24px" }} type="button" onClick={() => accountLogout()}>
								Logout
							</button>
						</div>
						{/* Logout Button */}
						<CometChatNavBar
							ref={el => this.navBarRef = el}
							theme={this.props.theme}
							actionGenerated={this.navBarAction} />
					</div>
					<div css={unifiedMainStyle(this.state, this.props)} className="unified__main">
						{messageScreen}
					</div>
					<CometChatIncomingCall theme={this.props.theme} lang={this.props.lang} actionGenerated={this.actionHandler} />
					<CometChatIncomingDirectCall theme={this.props.theme} lang={this.props.lang} actionGenerated={this.actionHandler} />
				</div>
			</CometChatContextProvider>
		);
	}
}

// Specifies the default values for props:
CometChatUI.defaultProps = {
	lang: Translator.getDefaultLanguage(),
	theme: theme,
	chatWithUser: "",
	chatWithGroup: "",
};

CometChatUI.propTypes = {
	lang: PropTypes.string,
	theme: PropTypes.object,
	chatWithUser: PropTypes.string,
	chatWithGroup: PropTypes.string,
}

// const mapStateToProps = state => {
// 	return {
// 		loading: state.loading,
// 		error: state.error,
// 		isLoggedIn: state.isLoggedIn,
// 	};
// };

// const mapDispatchToProps = dispatch => {
// 	return {
// 		onLogout: () => dispatch(actions.logout()),
// 	};
// };

export { CometChatUI };
export default withRouter(CometChatUI);
// export default connect(mapStateToProps, mapDispatchToProps)(HomePage);