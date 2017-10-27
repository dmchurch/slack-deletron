import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Masonry from 'react-masonry-component';
import File from './file';

var masonryOptions = {
    transitionDuration: '0.2s'
};

class FileDisplay extends Component {

	constructor(props) {
		super(props)
		this.state = {
			sort: "created",
			sortAscending: false
		}
	}

	destroyAll() {
		this.props.fileGroup.fileList.map(val => {
			this.props.destroyFile(this.props.authData.token, val.id)
		});
		// this.props.destroyFile(this.props.authData.token, this.props.details.id);
	}

	handleSortChange(e) {
		let [sort, ascending] = e.target.value.split(':');
		this.setState({
			sort: sort,
			sortAscending: (ascending == '+')
		});
	}

	sortCompare(a, b) {
		a = a[this.state.sort]
		b = b[this.state.sort]
		let compare = 0;
		if (a < b) {
			compare = -1;
		} else if (a > b) {
			compare = 1;
		}
		if (!this.state.sortAscending) {
			compare = -compare;
		}
		return compare;
	}

	displayFiles() {
		return (
			<div>
			<div className="sortPage">
				<label>Sort this page by:</label>
				<select className="dropdown" value={this.state.sort+":"+(this.state.sortAscending?'+':'-')} onChange={this.handleSortChange.bind(this)}>
					<option value='created:-'>Date Created (new to old)</option>
					<option value='created:+'>Date Created (old to new)</option>
					<option value='size:-'>Size (large to small)</option>
					<option value='size:+'>Size (small to large)</option>
				</select>
			</div>
			<div className="removeAll">
				<h3>Remove all files?</h3>
				<button onClick={this.destroyAll.bind(this)} className="deleteFile">Delete all files below</button>
			</div>
			<Masonry
	      className={'my-gallery-class'} // default ''
	      options={masonryOptions} // default {}
	      disableImagesLoaded={false} // default false
      >
				{this.props.fileGroup.fileList.sort(this.sortCompare.bind(this)).map((obj, i) => {
					return (
						<article key={obj.id} className="fileCard">
							<File details={obj} />
						</article>
					)
				})}
			</Masonry>
			</div>
		)
	}

	render() {
		let dataDisplay;
		if (typeof this.props.fileGroup.fileList !== 'undefined' && this.props.fileGroup.fileList.length > 0) {
			dataDisplay = this.displayFiles();
		} else if (typeof this.props.fileGroup.fileList !== 'undefined' && this.props.fileGroup.fileList.length === 0) {
			dataDisplay = (
				<div className="noFiles">
					<div className="noFiles-display">
						<img src='images/fileintro.svg' />
						<h2>High Five!</h2>
						<h3>Looks like there's no files!</h3>
						<p>Slack has nothing for you! Try a new search with a different file type to see if there's anything else!</p>
					</div>
				</div>
			)
		} else {
			dataDisplay = (
				<div className="noFiles">
					<div className="noFiles-display">
						<img src='images/filehappy.svg' />
						<h2>Welcome to the Slack Deletron!</h2>
						<h3>Let's get started!</h3>
						<ol>
							<li>Use the form to select which file types to search for</li>
							<li>Click the 'Get Files' button to search</li>
							<li>Start deleting some files!</li>
						</ol>
					</div>
				</div>
			)
		}
		return (
			<section className="fileList">
				{dataDisplay}
			</section>
		)
	}

}

function mapStateToProps(state) {
	return {
		authData: state.auth.profile,
		fileGroup: state.files
	}
}

export default connect(mapStateToProps, actions)(FileDisplay);
