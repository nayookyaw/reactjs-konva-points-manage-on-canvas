import React, { Component } from "react";
import Pagination from "react-js-pagination";

import { Table } from 'reactstrap';

class Home extends Component {

  state = {
    data: [],
    activePage: 1
  };

  componentDidMount() {
    //
  }

  handlePageChange = pageNumber => {
    console.log(`active page is ${pageNumber}`);
    this.setState({ activePage: pageNumber });
  };
  
  render() {
    return (
      <div>
        <Table striped bordered hover>
            <thead>
                <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                </tr>
                <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                </tr>
                <tr>
                <td>3</td>
                <td colSpan={2}>Larry the Bird</td>
                <td>@twitter</td>
                </tr>
            </tbody>
        </Table>
        <Pagination
          totalItemsCount={450}
          onChange={this.handlePageChange}
          activePage={this.state.activePage}
          itemsCountPerPage={10}
          pageRangeDisplayed={5}
        />
      </div>
    );
  }
}

export default Home;
