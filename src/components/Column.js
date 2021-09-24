import React from "react";
import Form from 'react-bootstrap/Form';

class Column extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isChecked: this.props.defaultChecked,
    };
  }

  toggleChange = () => {
    this.setState({
      isChecked: !this.state.isChecked,
    });

    this.props.onChange(this.props.columnName, !this.state.isChecked);
  }

  render() {
  	return (
      <Form.Check type='checkbox' id={this.props.columnName} label={this.props.columnName} defaultChecked={this.state.isChecked} onChange={this.toggleChange} />
		);
  }
}

export default Column;
