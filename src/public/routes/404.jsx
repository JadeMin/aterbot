import React, {
	useState, useEffect
} from 'react';
import {
	useNavigate
} from 'react-router-dom';
import {
	Result,
	Space, Row, Col,
	Button,

	message, notification
} from 'antd';

export default () => {
	const navigate = useNavigate();

	return (
		<Result
			status="404"
			title="404 - Not Found"
			subTitle="Sorry, the page you visited does not exist."
			extra={<Button type="primary" onClick={()=> navigate(-1)}>Go back</Button>}
		/>
	)
};