import React from 'react';
import AnimatedNumber from '../AnimatedNumber';
import { formatNumber, copyToClipboard, etherscanToken } from '../helpers';

const Token = (props) => {
  const token = props.dai[props.token];
  // const totalSupply = props.token === 'dai' || props.token === 'sin' ? token.totalSupply.add(props.dai.sin.issuerFee) : token.totalSupply;
  // const tapBalance = props.token === 'dai' ? token.tapBalance.add(props.dai.sin.issuerFee) : token.tapBalance;
  // const tubBalance = props.token === 'sin' ? token.tubBalance.add(props.dai.sin.issuerFee) : token.tubBalance;
  const name = props.token === 'gem' ? 'WETH' : (props.token === 'gov' ? 'MKR' : props.token);
  const totalSupply = token.totalSupply;
  const tapBalance = token.tapBalance;
  const tubBalance = token.tubBalance;
  const tubBalanceLabel = props.token === 'gem' ? 'Total Pooled' : 'Total Locked';
  const tubBalanceDesc = props.token === 'gem' ? 'Amount of ETH in the SKR collateral pool' : 'Amount of SKR locked as collateral in CDPs';
  const tapBalanceLabel = props.token === 'gem' ? 'Redeemable' : (props.token === 'skr' ? 'Pending Sale' : (props.token === 'dai' ? 'Pending Sale' : 'Tap Balance'));
  const tapBalanceDesc = props.token === 'gem'
                          ? 'Amount of ETH available to cash for DAI'
                          : (props.token === 'skr'
                            ? 'Amount of SKR collateral pending liquidation via bust'
                            : (props.token === 'dai'
                              ? 'Amount of surplus DAI pending sale via boom'
                              : ''));
  return (
    <div className="col-md-6 col-sm-6 col-xs-12">
      <div className="info-box">
        <span className={`info-box-icon ${props.color}`}>
          { etherscanToken(props.network, name, token.address) }
        </span>
        <div className="info-box-content">
          {
            token.myBalance
            ?
              <span className="info-box-number">
                <span style={ { textDecoration: 'underline' } }>{ etherscanToken(props.network, 'Your Balance', token.address, props.account) }</span>
                <AnimatedNumber
                  value={ token.myBalance }
                  title={ formatNumber(token.myBalance, 18) }
                  formatValue={ n => formatNumber(n, 3) }
                  className="printedNumber"
                  onClick = { copyToClipboard } />
              </span>
            :
              ''
          }
          <span className="info-box-number">
            <span>{ etherscanToken(props.network, 'Total Supply', token.address) }</span>
            <AnimatedNumber
              value={ totalSupply }
              title={ formatNumber(totalSupply, 18) }
              formatValue={ n => formatNumber(n, 3) }
              className="printedNumber"
              onClick = { copyToClipboard } />
          </span>
          {
            token.tubBalance
            ?
              <span className="info-box-number">
                <span title={ tubBalanceDesc }>{ etherscanToken(props.network, tubBalanceLabel, token.address, props.dai.tub.address) }</span>
                <AnimatedNumber
                  value={ tubBalance }
                  title={ formatNumber(tubBalance, 18) }
                  formatValue={ n => formatNumber(n, 3) }
                  className="printedNumber"
                  onClick = { copyToClipboard } />
              </span>
            :
              ''
          }
          {
            token.tapBalance && (props.token !== 'gem' || props.off === true)
            ?
              <span className="info-box-number">
                <span title={ tapBalanceDesc }>{ etherscanToken(props.network, tapBalanceLabel, token.address, props.dai.tap.address) }</span>
                <AnimatedNumber
                  value={ tapBalance }
                  title={ formatNumber(tapBalance, 18) }
                  formatValue={ n => formatNumber(n, 3) }
                  className="printedNumber"
                  onClick = { copyToClipboard } />
              </span>
            :
              ''
          }
          {
            token.pitBalance
            ?
              <span className="info-box-number">
                <span title="Burner">{ etherscanToken(props.network, "Burner", token.address, props.dai.pit.address) }</span>
                <AnimatedNumber
                  value={ token.pitBalance }
                  title={ formatNumber(token.pitBalance, 18) }
                  formatValue={ n => formatNumber(n, 3) }
                  className="printedNumber"
                  onClick = { copyToClipboard } />
              </span>
            :
              ''
          }
        </div>
      </div>
    </div>
  )
}

export default Token;
