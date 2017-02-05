import React from 'react';


export default function Announcement(props) {
	return (
		<div className={`alert alert-${props.type}`} >
			<strong>{props.title}</strong>
			{props.body}
		</div>
	)
}