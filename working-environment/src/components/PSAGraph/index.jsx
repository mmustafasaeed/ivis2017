import React, { Component } from 'react';
import d3 from 'd3';
class PSAGraph extends Component {

    constructor() {
        super();
        this.state = {
            rawData: []
          }; }
    componentWillMount() {
        this.loadRawData();
      }
    loadRawData() {

      //let dateFormat = d3.time.format("%m/%d/%Y");

      d3.csv(this.props.url)

      //  .row((d) => {
      //         if (!d['psa_sample_id_new']) {
      //             return null;
      //         }
      //         return {psa_total: d.psa_total,
      //                 psadate: dateFormat.parse(d['psadate']),
      //                 lopnr_new: d['lopnr_new'],
      //                 psa_fot: d['psa_fot'],
      //                 lkf_psa: d['lkf_psa'],
      //                 psa_sample_id_new:d['psa_sample_id_new']};
      //               })

          .get((error, rows) => {
              if (error) {
                  console.error(error);
                  console.error(error.stack);
              }else{
                  this.setState({rawData: rows});
} });
    }

    render() {
      if (!this.state.rawData.length) {
            return (
              <h2>Loading data about 90,000 psa values
              </h2>
            );
          }

        return (
            <div>
<svg>
                </svg>
            </div>
); }
}

export default PSAGraph;
