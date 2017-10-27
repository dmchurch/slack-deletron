import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import formatBytes from '../helpers/index';
import moment from 'moment';
import decode from 'unescape';
import emoji from 'node-emoji';

class File extends Component {

	constructor(props) {
		super(props)
	}

	destroyFile() {
		this.props.destroyFile(this.props.authData.token, this.props.details.id);
	}

	render() {
		let previewImage;
		if (this.props.details.mimetype.includes('image')) {
			previewImage = <div className="previewImg"><a href={this.props.details.url_private} target="_blank"><img src={this.props.details.thumb_360}/></a></div>;
		} else if (this.props.details.mimetype.includes('video') && this.props.details.url_private) {
			if (this.props.details.thumb_video) {
				previewImage = <video preload="none" poster={this.props.details.thumb_video} controls><source src={this.props.details.url_private} type={this.props.details.mimetype}/></video>
			} else {
				previewImage = <video controls><source src={this.props.details.url_private} type={this.props.details.mimetype}/></video>
			}
		} else {
			previewImage = null
		}
		let previewCode;
		if(this.props.details.preview) {
			previewCode = <pre className="fileCode"><code>{this.props.details.preview}</code></pre>
		} else {
			previewCode = null
		}
		let fileName;
		if (this.props.details.name && this.props.details.name != this.props.details.title) {
			fileName = <h4>{this.props.details.name}</h4>
		}
		let fileSize = formatBytes(this.props.details.size);
		if (this.props.details.is_external) {
			fileSize = `externally hosted (${fileSize})`;
		}
		return (
			<div className="fileDetails">
				<div className="fileContent">
					{previewImage}
					{previewCode}
					<h3><a href={this.props.details.permalink} target="_blank">{this.props.details.title ? emoji.emojify(decode(this.props.details.title)) : 'No title'}</a></h3>
					{fileName}
					<p className="fileMeta"><span className="fileType">{this.props.details.filetype}</span> / {fileSize}</p>
					<p className="fileDate" title={moment.unix(this.props.details.created).format("LL LTS")}>{moment.unix(this.props.details.created).fromNow()}</p>
				</div>
				<button className="deleteFile" onClick={this.destroyFile.bind(this)}>delete</button>
			</div>
		)
	}
	
}

function mapStateToProps(state) {
	return {
		authData: state.auth.profile,
		profile: state.profileInfo.data
	}
}

export default connect(mapStateToProps, actions)(File);

