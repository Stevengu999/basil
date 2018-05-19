import React from 'react'
import Store from '../store'
import { connect } from 'react-redux'
import DonationsActions from '../actions/donations'
import _ from 'lodash'

class DonationsList extends React.Component {

  componentWillMount() {
    Store.dispatch(DonationsActions.findAll())
  }

  render() {
    const donations = this.props.donations.list
    return (
      <div>
        {this._buildTitle(donations.length)}
        <a href='http://www.twitter.com/zeppelinbasil' target='_blank'><h4 className='subtitleList'>twitter.com/zeppelinbasil</h4></a>
        { donations.length > 0 &&
          <div className="donations-list">
            { donations.length === 0 ? <em>Loading...</em> : <div>{this._buildDonationsList(donations)}</div>}
          </div>
        }
      </div>
    )
  }

  _buildDonationsList(donations) {
    
    donations = _.uniqBy(donations, 'tx')
    const len = donations.length
    const rows = [];
    for(let r = 0; r < len; r += 3) {
      rows.push(
        <div className="row no-margin" key={r}>
          {this._buildDonationItem(donations[r])}
          {this._buildDonationItem(donations[r + 1])}
          {this._buildDonationItem(donations[r + 2])}
        </div>
      );
    }
    return rows;
    // TODO: delete chip css object
  }

  _buildTitle(numDonations) {
    if(numDonations === 0) {
      return <h3 className="titleList"></h3>
    } 
    else if(numDonations === 1) {
      return <h3 className="titleList">Someone has thought about our Basil</h3>
    }
    else {
      return <h3 className="titleList">Many have thought about our Basil</h3>
    }
  }

  _buildDonationItem(donation) {
    if(!donation) return <div className="col s4"></div>
    const style = { backgroundColor: `rgb(${[donation.r, donation.g, donation.b]})` }
    return (
      <div className="col l4 m12">
        <div className="donationCard">
          <div className="row no-margin donationColor" style={style}>
            <label>
            <div className="donationRgb">
            {`${donation.r} - ${donation.g} - ${donation.b}`}
            </div>
            </label>
          </div>
          <div className="row no-margin donationAddress">
            {donation.donor}
            <div className="secondary-content donationValue">ETH {donation.value}</div>
          </div>
        </div>  
      </div>
    );
  }
}

function mapStateToProps({ donations }) {
  return { donations }
}

export default connect(mapStateToProps)(DonationsList)
