import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import * as actions from '../actions';

class FileSearch extends Component {

	constructor(props) {
		super(props)
		this.state = {
			searchType: 'all',
			all: true,
			images: false,
			videos: false,
			snippets: false,
			gdocs: false,
			zips: false,
			pdfs: false,
			page: 1,
			fileList: 0
		}
	}

	getFiles() {
		let token = this.props.authData.token;
		let page = this.state.page;
		let fileString, userID;
		if (this.props.profile.user.is_admin === false) {
			userID = this.props.authData.profile.id
		} else {
			userID = this.state.searchType;
		}
		if (this.state.all !== true) {
			let fileTypes = [];
			if(this.state.images)
				fileTypes.push('images')
			if(this.state.videos)
				fileTypes.push('videos')
			if(this.state.gdocs)
				fileTypes.push('gdocs')
			if(this.state.pdfs)
				fileTypes.push('pdfs')
			if(this.state.snippets)
				fileTypes.push('snippets')
			if(this.state.zips)
				fileTypes.push('zips')
			fileString = fileTypes.join();
		} else {
			fileString = 'all'
		}
		this.props.fetchFiles(token, fileString, userID, page);
	}

	handleSearchClick() {
		this.state.page = 1;
		this.getFiles();
	}

	handlePageClick(data) {
		this.state.page = data.selected + 1;
		this.getFiles();
	}

	handleWhoChange(e) { 
		this.setState({searchType: e.target.value})
	}


	handleClick(e) {
		let type = e.target.value
		if (type !== 'all') {
			this.setState({
				all: false,
				[type]: this.state[type] ? false : true
			})
		} else  {
			this.setState({
				images: false,
				snippets: false,
				gdocs: false,
				zips: false,
				pdfs: false,
				all: true
			})
		}
  }

	render() {
		let whoFiles = null,
				profileData = this.props.profile;
		if (typeof profileData !== 'undefined') {
			if (profileData.user.is_admin) {
				whoFiles = (
					<div className="field">
						<label>Whose files should we be looking for?</label>
						<select className="dropdown" value={this.state.searchType} onChange={this.handleWhoChange.bind(this)}>
							<option value='all'>All public team files</option>
							<option value={profileData.user.id}>Just your files</option>
						</select>
					</div>
				)
			}
		}
		let fileDisplay = null;
		let pagination = null;
		if (typeof this.props.files.fileList !== 'undefined' && this.props.files.fileList.length > 0) {
			if (this.props.files.paging.total > this.props.files.fileList.length) {
				fileDisplay = <p className="fileNum">You've got {this.props.files.paging.total} files, showing {this.props.files.fileList.length}</p>
				pagination = <div className="pagination">
						<ReactPaginate
							pageCount={this.props.files.paging.pages}
							forcePage={this.state.page-1}
							pageRangeDisplayed={3}
							marginPagesDisplayed={2}
							onPageChange={this.handlePageClick.bind(this)}
							disableInitialCallback
							previousLabel="←"
							nextLabel="→"
							breakLabel="…"
						/>
					</div>
			} else {
				fileDisplay = <p className="fileNum">You've got {this.props.files.paging.total} files</p>
			}
		} else if (typeof this.props.files.fileList !== 'undefined' && this.props.files.fileList.length === 0) {
			fileDisplay = <p>No files! Search again for some more!</p>
		}
		return (
			<aside className="fileControl">
				<h2>What kind of files?</h2>
				<form>
					{whoFiles}
					<div className="fileTypeList">
						<p>What kind of files?</p>
						<div className="check-row">
							<label htmlFor="all">All</label>
							<input
								name="all"
								id="all"
								type="checkbox"
								value="all"
								checked={this.state.all}
								onChange={this.handleClick.bind(this)} />
						</div>
						<div className="check-row">
							<label htmlFor="images">Images</label>
							<input
								id="images"
								name="images"
								type="checkbox"
								value="images"
								checked={this.state.images}
								onChange={this.handleClick.bind(this)} />
						</div>
						<div className="check-row">
							<label htmlFor="images">Videos</label>
							<input
								id="videos"
								name="videos"
								type="checkbox"
								value="videos"
								checked={this.state.videos}
								onChange={this.handleClick.bind(this)} />
						</div>
						<div className="check-row">
							<label htmlFor="pdf">PDF's</label>
							<input
								id="pdf"
								name="pdf"
								type="checkbox"
								value="pdfs"
								checked={this.state.pdfs}
								onChange={this.handleClick.bind(this)} />
						</div>
						<div className="check-row">
							<label htmlFor="gdocs">Google Docs</label>
							<input
								name="gdocs"
								id="gdocs"
								type="checkbox"
								value="gdocs"
								checked={this.state.gdocs}
								onChange={this.handleClick.bind(this)} />
						</div>
						<div className="check-row">
							<label htmlFor="snippets">Snippets</label>
							<input
								name="snippets"
								id="snippets"
								type="checkbox"
								value="snippets"
								checked={this.state.snippets}
								onChange={this.handleClick.bind(this)} />
						</div>
						<div className="check-row">
							<label htmlFor="zips">Zip Files</label>
							<input
								name="zips"
								id="zips"
								type="checkbox"
								value="zips"
								checked={this.state.zips}
								onChange={this.handleClick.bind(this)} />
						</div>
					</div>
				</form>
				<button className="search" onClick={this.handleSearchClick.bind(this)}>Get Files</button>
				{fileDisplay}
				{pagination}
				<footer className="footerdetails">
					<p><a href="http://drewminns.com">drew minns</a> built this</p>
					<p>Help improve it <a href="https://github.com/drewminns/slack">here</a></p>
					<p><a href="https://twitter.com/share" className="twitter-share-button" data-url="http://www.slackdeletron.com" data-text="Delete unwanted files from your Slack Team" data-via="drewisthe">Tweet</a></p>
				</footer>
			</aside>
		)
	}

}

function mapStateToProps(state) {
	return {
		authData: state.auth.profile,
		profile: state.profileInfo.data,
		files: state.files
	}
}

export default connect(mapStateToProps, actions)(FileSearch);
