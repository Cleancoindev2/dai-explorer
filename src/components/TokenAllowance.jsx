import React, { Component } from 'react';

class TokenAllowance extends Component {
  state = {
    error: ''
  };

  change = (e) => {
    const token = e.target.getAttribute('data-token');
    const dst = e.target.getAttribute('data-dst');
    const val = e.target.getAttribute('data-val') === 'true';

    if (token === 'all') {
      this.props.trustAll(val);
    } else {
      this.props.trust(token, dst, val);
    }
  }

  onOff = (token, dstAux = null) => {
    const check = token === 'all'
                  ? this.props.system.skr.tubTrusted && this.props.system.skr.tapTrusted && this.props.system.dai.tubTrusted && this.props.system.dai.tapTrusted
                  : this.props.system[token][`${dstAux}Trusted`]
    const dst = token === 'all' ? 'all' : dstAux;
    return (
      <div className="onoffswitch">
        <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id={`myonoffswitchp${token}${dst}`} checked={ check } data-token={ token } data-dst={ dst } data-val={ !check } onChange={ this.change } />
        <label className="onoffswitch-label" htmlFor={`myonoffswitchp${token}${dst}`}>
            <span className="onoffswitch-inner"></span>
            <span className="onoffswitch-switch"></span>
        </label>
      </div>
    )
  }

  render = () => {
    return (
      <div className="box">
        <div className="box-header with-border">
          <h3 className="box-title">Token Allowance</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-md-12">
              <div className="trust">
                {
                  this.props.mode === 'proxy'
                  ?
                    <div>
                      <span><strong>All</strong></span>
                      <span>&nbsp;</span>
                      <span>
                        {
                          this.props.system.skr.tubTrusted === -1 || this.props.system.skr.tapTrusted === -1 || this.props.system.gov.tubTrusted === -1 || this.props.system.dai.tubTrusted === -1 || this.props.system.dai.tapTrusted === -1
                          ? 'Loading...'
                          : this.onOff('all')
                        }
                      </span>
                    </div>
                  : ''
                }
                <div>
                  <span>SKR</span>
                  <span>Exit/Lock</span>
                  <span>
                    {
                      this.props.system.skr.tubTrusted === -1
                      ? 'Loading...'
                      : this.onOff('skr', 'tub')
                    }
                  </span>
                </div>
                <div>
                  <span>SKR</span>
                  <span>Boom</span>
                  <span>
                    {
                      this.props.system.skr.tapTrusted === -1
                      ? 'Loading...'
                      : this.onOff('skr', 'tap')
                    }
                  </span>
                </div>
                <div>
                  <span>MKR</span>
                  <span>Wipe/Shut</span>
                  <span>
                    {
                      this.props.system.gov.tubTrusted === -1
                      ? 'Loading...'
                      : this.onOff('gov', 'tub')
                    }
                  </span>
                </div>
                <div>
                  <span>DAI</span>
                  <span>Wipe/Shut</span>
                  <span>
                    {
                      this.props.system.dai.tubTrusted === -1
                      ? 'Loading...'
                      : this.onOff('dai', 'tub')
                    }
                  </span>
                </div>
                <div>
                  <span>DAI</span>
                  <span>Bust/Cash</span>
                  <span>
                    {
                      this.props.system.dai.tapTrusted === -1
                      ? 'Loading...'
                      : this.onOff('dai', 'tap')
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default TokenAllowance;