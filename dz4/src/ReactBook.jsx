import React from 'react';

class ReactBook extends React.Component {
  render() {
    return (
    <div className="Book">
      <img src={this.props.cover_name} alt="CoverBoor"></img>
      <div className="NameBook">{this.props.name_book}</div>
      <div className="AuthorusBook">{this.props.name_author}</div>
    </div>
    )
  }
}

export default ReactBook;