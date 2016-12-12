// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html";
import React from "react";
import ReactDOM from 'react-dom';
import moment from 'moment';

/**
 * @function Functional Component that renders an InfoRow
 * @param props {Object} properties passed to component
 * @returns {React Component}
 */
function InfoRow (props) {

	// If status of train is late or delayed, add the lateness time in minutes
	var status;

	if (props.info[7] === "Delayed" || props.info[7] === "Late") {
		status = <td>{props.info[7]}<span className="float-right">{props.info[5]/60} mins</span></td>
	} else {
		status = <td>{props.info[7]}</td>;
	}

	return(
		<tr>
			<td>{props.info[1]}</td>
			<td>{props.info[2]}</td>
			<td>{props.info[3]}</td>
			<td>{moment.unix(props.info[4]).format('h:mm A')}</td>
			<td>{props.info[6] || "TBD"}</td>
			{status}
		</tr>
	)
}

/**
 * @function Functional Component to render the Title Row of the Table
 * @param props {Object} properties passed to component
 * @returns {React Component}
 */
function TitleRow (props) {
	return(
		<thead>
			<tr>
				<th>{props.headers[1]}</th>
				<th>Train #</th>
				<th>{props.headers[3]}</th>
				<th>Scheduled Time</th>
				<th>{props.headers[6]}</th>
				<th>{props.headers[7]}</th>
			</tr>
		</thead>
	)
}

/**
 * @function Functional Component to render the Rows of the Table Body
 * @param props {Object} properties passed to component
 * @returns {React Component}
 */
function BodyRows (props) {

	var tableRows = []; // create tableRows array

	// for each row in rows that matches the Table station state (Origin of the trains), render an InfoRow and add it to the tableRows array
	props.rows.forEach(function(row, i) {
		if (props.stations === "all" || row[1] === props.stations) {
			tableRows.push(<InfoRow info={row} key={i}/>);
		}
	});

	return <tbody>{tableRows}</tbody>
}

/**
 * React Component Table Class
 */
class Table extends React.Component {

	// Table constructor, initial state is to show all trains
	constructor(props) {
		super(props);
		this.state = {stations: "all"};

		// This binding is necessary to make `this` work in the callback
		this.filterStations = this.filterStations.bind(this);
	}

	// Mount timer to this to update table every minute
	componentDidMount() {
		this.timerID = setInterval(
			() => this.updateTable(),
			60000
		);
	}

	// Unmount timerID to when Table is removed from DOM to free up resources
	componentWillUnmount() {
		clearInterval(this.timerID);
	}

	// updateTable function called every minute that calls renderTable function
	// This is to check if the train info from http://developer.mbta.com/lib/gtrtfs/Departures.csv has changed
	updateTable() {
		renderTable();
	}

	// when stations dropdown is changed, set state to the new value in order to update table
	filterStations() {
		this.setState({stations: $('#stations-dropdown').val()});
	}

	// function to render the Table Component
	render() {
		return(
			<div className="schedule_body">
				<select id="stations-dropdown" className="float-right" onChange={this.filterStations}>
					<option value="all">All Stations</option>
					<option value="North Station">North Station</option>
					<option value="South Station">South Station</option>
				</select>

				<h3>{moment().format('MM/DD/YYYY')}</h3>
				<h4>{moment().format('h:mm A')}</h4>

				<table className="table table-striped">
					<TitleRow headers={this.props.data.titleRow} />
					<BodyRows rows={this.props.data.bodyRows} stations={this.state.stations}/>
				</table>
			</div>
		)}
}

/**
 * @function to call Phoenix api route and get the train JSON data
 *  Then render a Table component with that info and put it in the DOM
 */
function renderTable() {
	$.getJSON('/api/schedule', function(data) {
		ReactDOM.render(<Table data={data}/>, document.getElementById("train-table"));
	});
}

(function() {
   'use strict';
   $().ready(function () {

	   // render the table on page load
	   renderTable();

   });
})();