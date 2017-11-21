import React from 'react';
import web3 from '../web3';
import { printNumber, wdiv } from '../helpers';

const settings = require('../settings');

const renderCupActions = (feedValue, account, off, lock, cupId, cup, handleOpenModal) => {
  const actions = {
    lock: feedValue.gt(0) && account && off === false && cup.lad === account && lock,
    free: feedValue.gt(0) && account && cup.lad === account && cup.ink.gt(0) && cup.safe,
    draw: feedValue.gt(0) && account && off === false && cup.lad === account && cup.ink.gt(0) && cup.safe,
    wipe: feedValue.gt(0) && account && off === false && cup.lad === account && cup.art.gt(0),
    shut: feedValue.gt(0) && account && off === false && cup.lad === account,
    give: feedValue.gt(0) && account && off === false && cup.lad === account,
    bite: feedValue.gt(0) && account && ((off === true && cup.art.gt(0)) || cup.safe === false),
  };

  const helpers = {
    lock: 'Add collateral to a CDP',
    free: 'Remove collateral from a CDP',
    draw: 'Create Dai against a CDP',
    wipe: 'Use Dai to cancel CDP debt',
    shut: 'Close a CDP - Wipe all debt, Free all collateral, and delete the CDP',
    give: 'Transfer CDP ownership',
    bite: 'Initiate liquidation of an undercollateralized CDP',
  };

  return (
    <span>
      {
        Object.keys(actions).map(key =>
          <span key={ key } style={ {textTransform: 'capitalize'} }>
            { actions[key] ? <a href="#action" data-method={ key } data-cup={ cupId } onClick={ handleOpenModal } title={ helpers[key] }>{ key }</a> : <span title={ helpers[key] }>{ key }</span> }
            { Object.keys(actions).pop() !== key ? <span> / </span> : '' }
          </span>
        )
      }
    </span>
  )
}

const Cups = (props) => {
  return (
    <div className="box">
      <div className="box-header with-border">
        <h3 className="box-title">{ props.all ? 'All' : 'My' } CDPs - <a href={ props.all ? '#mine' : '#all' }>Show { props.all ? 'only my' : 'all' } CDPs</a></h3>
      </div>
      <div className="box-body" id="cups">
        <div className="row">
          <div className="col-md-12">
            <table className="text-right">
              <thead>
                <tr>
                  <th className="text-right">CDP Id</th>
                  <th className="text-right" title="Amount of outstanding DAI debt in a CDP">Stability Debt (DAI)</th>
                  <th className="text-right" title="">Governance Debt (MKR)</th>
                  <th className="text-right" title="Amount of SKR collateral in a CDP">Locked (SKR)</th>
                  <th className="text-right" title="Ratio of collateral SKR to total outstanding SKR">% Tot (SKR)</th>
                  <th className="text-right" title="Collateral ratio of the CDP">% Ratio</th>
                  <th className="text-right" title="Maximum DAI that can currently be drawn from a CDP">Avail. DAI (to draw)</th>
                  <th className="text-right" title="Maximum SKR that can currently be released from a CDP">Avail. SKR (to free)</th>
                  <th className="text-right" title="ETH price at which a CDP will become unsafe and at risk of liquidation">Liquidation Price</th>
                  <th className="text-right" title="Whether the CDP is safe, unsafe (vulnerable to liquidation), or closed">Status</th>
                  {
                    settings.chain[props.network].service
                    ?<th>History</th>
                    :<th></th>
                  }
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  Object.keys(props.dai.tub.cups).map(key =>
                    <tr key={ key }>
                      <td>
                        { key }
                      </td>
                      <td>
                        { printNumber(props.tab(props.dai.tub.cups[key])) }
                      </td>
                      <td>
                        {
                          props.dai.pep.val.gte(0)
                          ? printNumber(wdiv(props.rap(props.dai.tub.cups[key]), props.dai.pep.val))
                          : 'Loading...'
                        }
                      </td>
                      <td>
                        { printNumber(props.dai.tub.cups[key].ink) }
                      </td>
                      <td>
                        {
                          props.dai.skr.totalSupply.gte(0)
                            ? props.dai.skr.totalSupply.gt(0)
                              ? <span>{ printNumber(wdiv(props.dai.tub.cups[key].ink, props.dai.skr.totalSupply).times(100)) }%</span>
                              : <span title="0">0.000%</span>
                            : 'Loading...'
                        }
                      </td>
                      <td className={ props.dai.tub.off === false && props.dai.tub.cups[key].ratio && props.dai.tub.cups[key].art.gt(web3.toBigNumber(0))
                                      ? (web3.toWei(props.dai.tub.cups[key].ratio).lte(props.dai.tub.mat.times(1.1))
                                        ? 'error-color'
                                        : (web3.toWei(props.dai.tub.cups[key].ratio).lte(props.dai.tub.mat.times(1.5)) ? 'warning-color' : 'success-color'))
                                      : '' }>
                        {
                          props.dai.tub.off === false
                            ? props.dai.tub.cups[key].art.gt(web3.toBigNumber(0)) && props.dai.tub.cups[key].pro
                              ? <span>
                                  { printNumber(web3.toWei(props.dai.tub.cups[key].ratio).times(100)) }%
                                </span>
                              : '-'
                            : '-'
                        }
                      </td>
                      <td>
                        { props.dai.tub.off === false ? printNumber(props.dai.tub.cups[key].avail_dai) : '-' }
                      </td>
                      <td>
                        { props.dai.tub.off === false ? printNumber(props.dai.tub.cups[key].avail_skr) : '-' }
                      </td>
                      <td>
                        { props.dai.tub.off === false && props.dai.tub.cups[key].liq_price && props.dai.tub.cups[key].liq_price.gt(0) ? printNumber(props.dai.tub.cups[key].liq_price) : '-' }
                      </td>
                      <td className={ `text-center ${ props.dai.tub.off === false ? (props.dai.tub.cups[key].lad !== '0x0000000000000000000000000000000000000000' ? (props.dai.tub.cups[key].safe ? 'success-color' : 'error-color') : 'warning-color') : '' }` }>
                        {
                          props.dai.tub.off === false
                          ?
                            props.dai.tub.cups[key].lad === '0x0000000000000000000000000000000000000000'
                            ?
                              'Closed'
                            :
                              props.dai.tub.cups[key].safe === 'N/A' || props.dai.pip.val.lt(0)
                              ?
                                'N/A'
                              :
                                props.dai.tub.cups[key].safe
                                ?
                                  'Safe'
                                :
                                  'Unsafe'
                          :
                            '-'
                        }
                      </td>
                      {
                        settings.chain[props.network].service
                        ?<td><a href="#action" data-id={ key } onClick={ props.handleOpenCupHistoryModal }>Show</a></td>
                        :<td></td>
                      }
                      <td className="text-left">
                        { renderCupActions(props.dai.pip.val, props.profile, props.dai.tub.off, props.dai.skr.myBalance && props.dai.skr.myBalance.gt(0), key, props.dai.tub.cups[key], props.handleOpenModal) }
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cups;
